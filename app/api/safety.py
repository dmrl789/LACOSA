"""Safety related endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import APIRouter

from app.models.base import SafetyZone
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/safety", tags=["safety"])


@router.get("/zones", response_model=List[SafetyZone])
def list_safety_zones() -> List[SafetyZone]:
    """Return safety zones for the active city."""
    zones = load_dataset("safety")
    converted = []
    for zone in zones:
        zone["updated_at"] = datetime.fromisoformat(zone["updated_at"])
        converted.append(SafetyZone(**zone))
    return converted
