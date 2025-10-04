"""Arts and culture endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import Event, Venue
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/culture", tags=["culture"])


@router.get("/venues", response_model=List[Venue])
def list_cultural_venues(city: Optional[str] = Query(None)) -> List[Venue]:
    """Return arts and culture venues."""
    return [Venue(**item) for item in load_dataset("culture_venues", city=city)]


@router.get("/events", response_model=List[Event])
def list_events(city: Optional[str] = Query(None)) -> List[Event]:
    """Return upcoming cultural events."""
    events = []
    for item in load_dataset("events", city=city):
        start = item.get("start_time")
        end = item.get("end_time")
        start_dt = datetime.fromisoformat(start) if isinstance(start, str) else start
        end_dt = datetime.fromisoformat(end) if isinstance(end, str) else end
        events.append(Event(**{**item, "start_time": start_dt, "end_time": end_dt}))
    return events
