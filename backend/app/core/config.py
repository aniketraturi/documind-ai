import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)


class Settings:
    PROJECT_NAME: str = "DocuMind AI"
    API_VERSION: str = "0.1.0"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )


settings = Settings()