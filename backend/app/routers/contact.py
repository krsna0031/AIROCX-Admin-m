import time
from collections import defaultdict, deque
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app import models, schemas
from app.routers.auth import verify_token

router = APIRouter(prefix="/api", tags=["contact"])
submissions: dict[str, deque[float]] = defaultdict(deque)

@router.post("/contact", response_model=schemas.ContactMessageResponse)
def submit_contact(msg: schemas.ContactMessageCreate, request: Request, db: Session = Depends(get_db)):
    client = request.client.host if request.client else "unknown"
    now = time.monotonic()
    recent = submissions[client]
    while recent and now - recent[0] > 60 * 60:
        recent.popleft()
    if len(recent) >= 5:
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")
    recent.append(now)
    db_msg = models.ContactMessage(
        name=msg.name,
        email=msg.email,
        subject=msg.subject,
        message=msg.message,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.get("/contact", response_model=list[schemas.ContactMessageResponse])
def get_contacts(db: Session = Depends(get_db), auth=Depends(verify_token)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.id.desc()).all()
