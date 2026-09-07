"""
Application settings and environment variable configuration.
Uses pydantic-settings to validate and securely load environment variables.
"""

import json
from typing import List, Union
from pydantic import field_validator
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

    # CORS configuration - default to React Vite dev server
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173"]

    # Google Gemini Dual-Key Configuration
    # Key 1 is the primary key; Key 2 is the fallback/recovery key.
    # NEVER expose these keys to the client or log them.
    GEMINI_API_KEY_1: str = ""
    GEMINI_API_KEY_2: str = ""
    GEMINI_MODEL: str = "gemini-3.6-flash"

    # Legacy/Generic AI API Key (optional fallback)
    AI_API_KEY: str = ""

    # Express Backend API URL (for product catalog search)
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
    def parse_cors_origins(cls, value: Union[str, List[str]]) -> List[str]:
        """
        Parses CORS_ORIGINS whether it is provided as a JSON array string
        e.g. '["http://localhost:5173"]' or comma-separated string or list.
        """
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("[") and value.endswith("]"):
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed]
                except Exception:
                    pass
            # Fallback for comma-separated list
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        if isinstance(value, list):
            return [str(item).strip() for item in value]
        return ["http://localhost:5173"]


# Singleton instance of settings to be imported across the application
settings = Settings()
