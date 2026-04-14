from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/emf_fitness"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    SECRET_KEY: str = "emf-fitness-secret-key-change-in-production"
    WHATSAPP_NUMBER: str = "+919876543210"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
