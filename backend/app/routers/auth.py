import hmac
import time
from collections import defaultdict, deque
from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from app.config import settings
from app.schemas import AdminLogin, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

security = HTTPBearer(auto_error=False)
login_attempts: dict[str, deque[float]] = defaultdict(deque)

def enforce_login_limit(request: Request) -> None:
    client = request.client.host if request.client else "unknown"
    now = time.monotonic()
    attempts = login_attempts[client]
    while attempts and now - attempts[0] > 15 * 60:
        attempts.popleft()
    if len(attempts) >= 10:
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
    attempts.append(now)

def create_token(data: dict):
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({
        "sub": "admin",
        "admin": True,
        "iss": "airocx-api",
        "iat": now,
        "exp": expire,
    })
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            issuer="airocx-api",
        )
        if payload.get("sub") != "admin" or payload.get("admin") is not True:
            raise JWTError("Invalid admin claims")
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/login", response_model=TokenResponse)
def login(creds: AdminLogin, request: Request):
    enforce_login_limit(request)
    if hmac.compare_digest(creds.password.encode(), settings.ADMIN_PASSWORD.encode()):
        token = create_token({"admin": True})
        return {"token": token, "message": "Login successful"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid password"
    )

@router.get("/verify")
def verify_admin(auth=Depends(verify_token)):
    return {"authenticated": True}
