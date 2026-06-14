import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./airocx.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "8"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    FRONTEND_URLS: list[str] = [
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "FRONTEND_URLS",
            os.getenv("FRONTEND_URL", "http://localhost:5173"),
        ).split(",")
        if origin.strip()
    ]
    MAX_IMAGE_BYTES: int = int(os.getenv("MAX_IMAGE_BYTES", str(2 * 1024 * 1024)))

    def validate(self) -> None:
        if self.ENVIRONMENT == "production":
            if len(self.JWT_SECRET) < 32:
                raise RuntimeError("JWT_SECRET must be at least 32 characters in production")
            if len(self.ADMIN_PASSWORD) < 12:
                raise RuntimeError("ADMIN_PASSWORD must be at least 12 characters in production")
        else:
            if not self.JWT_SECRET:
                self.JWT_SECRET = secrets.token_urlsafe(32)
            if not self.ADMIN_PASSWORD:
                self.ADMIN_PASSWORD = "change-me-before-production"

settings = Settings()
settings.validate()
