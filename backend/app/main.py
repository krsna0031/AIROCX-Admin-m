from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from app import models, database, seed
from app.database import engine, SessionLocal
from app.routers import auth, characters, showcase, merch, contact

# Lifespan context (replaces deprecated on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables + seed data
    models.Base.metadata.create_all(bind=engine)
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
)

# ─── CORS Setup (production-ready) ───────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

# Allow both the exact Vercel URL and common local dev origins
allowed_origins = []
if FRONTEND_URL == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [
        FRONTEND_URL,
        FRONTEND_URL.rstrip("/"),
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
