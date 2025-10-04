"""Runtime configuration for the LACOSA API."""
from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = Field("LACOSA API", env="LACOSA_APP_NAME")
    environment: str = Field("development", env="LACOSA_ENV")
    debug: bool = Field(False, env="LACOSA_DEBUG")
    version: str = Field("0.1.0", env="LACOSA_VERSION")
    api_prefix: str = Field("/api", env="LACOSA_API_PREFIX")
    cors_origins: List[str] = Field(["*"], env="LACOSA_CORS_ORIGINS")
    cors_allow_credentials: bool = Field(False, env="LACOSA_CORS_ALLOW_CREDENTIALS")
    log_level: str = Field("INFO", env="LACOSA_LOG_LEVEL")
    secret_key: str = Field("dev-secret-change-me", env="LACOSA_SECRET_KEY")
    access_token_expire_minutes: int = Field(60, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"
        case_sensitive = False

    @validator("cors_origins", pre=True)
    def split_origins(cls, value: str | List[str]) -> List[str]:  # type: ignore[override]
        """Allow comma-separated origins in environment variables."""
        if isinstance(value, str):
            if not value:
                return []
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""

    return Settings()
