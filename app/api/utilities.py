"""Utility endpoints such as city selection and alerts."""
from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import APIRouter

from app.models.base import Alert
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/utilities", tags=["utilities"])


@router.get("/cities", response_model=List[str])
def list_cities() -> List[str]:
    """Return the list of supported cities."""
    return load_dataset("cities")


@router.get("/alerts", response_model=List[Alert])
def list_alerts() -> List[Alert]:
    """Return current safety/transport alerts."""
    items = load_dataset("alerts")
    for item in items:
        item["published_at"] = datetime.fromisoformat(item["published_at"])
    return [Alert(**item) for item in items]
