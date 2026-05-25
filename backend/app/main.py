from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app import models, database, seed
from app.database import engine, SessionLocal
from app.routers import auth, characters, showcase, merch

app = FastAPI(title="AIROCX API", version="1.0.0")

# Automatically create all tables on launch
models.Base.metadata.create_all(bind=engine)

# CORS Setup
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to run smart seeding
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed.seed_database(db)
    finally:
        db.close()

# Include Routers
app.include_router(auth.router)
app.include_router(characters.router)
app.include_router(showcase.router)
app.include_router(merch.router)

@app.get("/", tags=["root"])
def api_root():
    return {
        "message": "🎬 Welcome to the AIROCX Studio REST API Universe",
        "version": "1.0.0",
        "status": "online",
        "engine": "FastAPI (M2 ARM64 Optimized)",
        "interactive_docs": "/docs",
        "endpoints": {
            "health_check": "/api/health",
            "characters": "/api/characters",
            "content_showcase": "/api/showcase",
            "merchandise_store": "/api/merch"
        }
    }

@app.get("/api/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "service": "AIROCX API (Refactored)",
        "engine": "FastAPI + SQLAlchemy/SQLite"
    }
