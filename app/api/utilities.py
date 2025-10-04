"""Utility endpoints such as city selection and alerts."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import Alert
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/utilities", tags=["utilities"])


@router.get("/cities", response_model=List[str])
def list_cities() -> List[str]:
    """Return the list of supported cities."""
    return load_dataset("cities")


@router.get("/alerts", response_model=List[Alert])
def list_alerts(city: Optional[str] = Query(None)) -> List[Alert]:
    """Return current safety/transport alerts."""
    items = load_dataset("alerts", city=city)
    for item in items:
        item["published_at"] = datetime.fromisoformat(item["published_at"])
    return [Alert(**item) for item in items]


@router.get("/select-city", response_model=dict)
def select_city(city: str = Query(...)) -> dict:
    """Acknowledge city switch on the client (stateless server for MVP)."""
    # For MVP the server is stateless; clients pass ?city=... to endpoints.
    # This endpoint exists so the frontend can treat selection as a flow.
    cities = set(load_dataset("cities"))
    if city not in cities:
        return {"ok": False, "message": "Unsupported city"}
    return {"ok": True, "city": city}
