"""Centralised exception handling for the API."""
from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.services.data_loader import DatasetNotFoundError, UnsupportedCityError


logger = logging.getLogger(__name__)


def _error_payload(code: str, message: str, details: Dict[str, Any] | None = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"error": {"code": code, "message": message}}
    if details:
        payload["error"].update({"details": details})
    return payload


def register_exception_handlers(app: FastAPI) -> None:
    """Register shared exception handlers on the FastAPI application."""

    @app.exception_handler(DatasetNotFoundError)
    async def dataset_not_found_handler(request: Request, exc: DatasetNotFoundError) -> JSONResponse:  # type: ignore[override]
        logger.warning("Dataset not found", extra={"path": request.url.path, "dataset": exc.dataset, "city": exc.city})
        return JSONResponse(status_code=404, content=_error_payload("dataset_not_found", str(exc)))

    @app.exception_handler(UnsupportedCityError)
    async def unsupported_city_handler(request: Request, exc: UnsupportedCityError) -> JSONResponse:  # type: ignore[override]
        logger.info("Unsupported city requested", extra={"path": request.url.path, "city": exc.city})
        return JSONResponse(status_code=400, content=_error_payload("unsupported_city", str(exc)))

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:  # type: ignore[override]
        logger.exception("Unhandled exception", extra={"path": request.url.path})
        return JSONResponse(
            status_code=500,
            content=_error_payload(
                "internal_server_error",
                "An unexpected error occurred. Please try again or contact support.",
            ),
        )
