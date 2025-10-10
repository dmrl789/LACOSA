"""Entry point for the LACOSA backend service."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import configure_logging


settings = get_settings()
configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Log startup and shutdown events."""

    logger.info("Starting LACOSA service", extra={"environment": settings.environment})
    try:
        yield
    finally:
        logger.info("Stopping LACOSA service")


app = FastAPI(
    title=settings.app_name,
    description="Local Companion for Expats & Nomads",
    version=settings.version,
    debug=settings.debug,
    lifespan=lifespan,
)
app.state.settings = settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)
app.include_router(api_router)


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Basic health check endpoint."""

    return {"status": "ok"}
