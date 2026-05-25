import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./airocx.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "airocx-super-secret-key-2025")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AIROCXIP06")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

settings = Settings()
