"""Arts and culture endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import APIRouter

from app.models.base import Event, Venue
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/culture", tags=["culture"])


@router.get("/venues", response_model=List[Venue])
def list_cultural_venues() -> List[Venue]:
    """Return arts and culture venues."""
    return [Venue(**item) for item in load_dataset("culture_venues")]


@router.get("/events", response_model=List[Event])
def list_events() -> List[Event]:
    """Return upcoming cultural events."""
    items = load_dataset("events")
    for item in items:
        item["start_time"] = datetime.fromisoformat(item["start_time"])
        item["end_time"] = datetime.fromisoformat(item["end_time"])
    return [Event(**item) for item in items]
