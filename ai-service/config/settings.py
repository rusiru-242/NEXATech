"""
Application settings and environment variable configuration.
Uses pydantic-settings to validate and securely load environment variables.
"""

import json
from typing import List, Union
from pydantic import field_validator, model_validator
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings class.
    Reads values from environment variables or .env file.
    All API keys are strictly kept server-side.
    """
    # Server configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"

    # Frontend URL (e.g. Vite dev server or production client)
    FRONTEND_URL: str = "http://localhost:5173"

    # CORS configuration - optional list or JSON array of additional allowed origins
    CORS_ORIGINS: Union[List[str], str] = []

    # Google Gemini Dual-Key Configuration
    # Key 1 is the primary key; Key 2 is the fallback/recovery key.
    # NEVER expose these keys to the client or log them.
    GEMINI_API_KEY_1: str = ""
    GEMINI_API_KEY_2: str = ""
    GEMINI_MODEL: str = "gemini-3.6-flash"

    # Legacy/Generic AI API Key (optional fallback)
    AI_API_KEY: str = ""

    # Node.js / Express Backend API URL (for product catalog search)
    NODE_API_URL: str = "http://localhost:5000"
    EXPRESS_BACKEND_URL: str = "http://localhost:5000"

    # Machine Learning model configurations
    MODEL_PATH: str = ""
    MODEL_TYPE: str = "llm"  # 'llm', 'rule_based', or 'ml_model'

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Union[str, List[str], None]) -> List[str]:
        """
        Parses CORS_ORIGINS whether it is provided as a JSON array string
        e.g. '["http://localhost:5173"]' or comma-separated string or list.
        """
        if not value:
            return []
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("[") and value.endswith("]"):
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    pass
            # Fallback for comma-separated list
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        return []

    @model_validator(mode="after")
    def sync_service_urls_and_cors(self) -> "Settings":
        """
        Synchronizes NODE_API_URL and EXPRESS_BACKEND_URL, and ensures
        FRONTEND_URL is included in allowed CORS origins.
        """
        # Sync NODE_API_URL and EXPRESS_BACKEND_URL if one was customized
        if self.NODE_API_URL and self.NODE_API_URL != "http://localhost:5000":
            if not self.EXPRESS_BACKEND_URL or self.EXPRESS_BACKEND_URL == "http://localhost:5000":
                self.EXPRESS_BACKEND_URL = self.NODE_API_URL
        elif self.EXPRESS_BACKEND_URL and self.EXPRESS_BACKEND_URL != "http://localhost:5000":
            if not self.NODE_API_URL or self.NODE_API_URL == "http://localhost:5000":
                self.NODE_API_URL = self.EXPRESS_BACKEND_URL

        # Ensure FRONTEND_URL is present in CORS_ORIGINS
        frontend = (self.FRONTEND_URL or "").strip()
        if not self.CORS_ORIGINS:
            self.CORS_ORIGINS = [frontend] if frontend else []
        elif isinstance(self.CORS_ORIGINS, list):
            if frontend and frontend not in self.CORS_ORIGINS:
                self.CORS_ORIGINS.append(frontend)

        return self

    @property
    def cors_allowed_origins(self) -> List[str]:
        """
        Returns the resolved list of allowed CORS origins, prioritizing FRONTEND_URL.
        """
        origins: List[str] = []
        if isinstance(self.CORS_ORIGINS, list):
            origins.extend(self.CORS_ORIGINS)
        elif isinstance(self.CORS_ORIGINS, str) and self.CORS_ORIGINS:
            origins.append(self.CORS_ORIGINS)

        frontend = (self.FRONTEND_URL or "").strip()
        if frontend and frontend not in origins:
            origins.append(frontend)

        if not origins:
            origins = [self.FRONTEND_URL]

        return origins


# Singleton instance of settings to be imported across the application
settings = Settings()
