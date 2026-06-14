from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import os
from app import migrations, models, database, seed
from app.config import settings
from app.database import engine, SessionLocal
from app.routers import auth, characters, showcase, merch, contact

# Lifespan context (replaces deprecated on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables + seed data
    models.Base.metadata.create_all(bind=engine)
    migrations.run_additive_migrations()
    db = SessionLocal()
    try:
        seed.seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown: cleanup if needed

app = FastAPI(
    title="AIROCX API",
    version="1.0.0",
    description="Backend API for AIROCX Animation Studio",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

allowed_hosts = [host.strip() for host in os.getenv("ALLOWED_HOSTS", "*").split(",") if host.strip()]
app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > settings.MAX_IMAGE_BYTES * 2:
                return JSONResponse(status_code=413, content={"detail": "Request body too large"})
        except ValueError:
            return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length header"})
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# ─── Include Routers ─────────────────────────────────────────
app.include_router(auth.router)
app.include_router(characters.router)
app.include_router(showcase.router)
app.include_router(merch.router)
app.include_router(contact.router)

# ─── Root & Health Endpoints ─────────────────────────────────
@app.get("/", tags=["root"])
def api_root():
    return {
        "message": "🎬 Welcome to the AIROCX Studio REST API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "characters": "/api/characters",
            "showcase": "/api/showcase",
            "merch": "/api/merch",
            "contact": "/api/contact",
        }
    }

@app.get("/api/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "service": "AIROCX API",
        "version": "1.0.0",
    }
