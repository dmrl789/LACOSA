"""Education related endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import MapMarker, School
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/schools", tags=["schools"])


SCHOOL_MARKERS: list[MapMarker] = [
    MapMarker(id=1, name="Bilingual Montessori", lat=38.131, lng=13.36),
    MapMarker(id=2, name="International School", lat=38.104, lng=13.354),
]


@router.get("", response_model=list[MapMarker])
def list_school_markers() -> list[MapMarker]:
    """Return map-friendly school markers."""

    return SCHOOL_MARKERS


@router.get("/directory", response_model=List[School])
def list_schools(
    curriculum: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
) -> List[School]:
    """Return the school directory filtered by curriculum and level."""
    schools = [School(**item) for item in load_dataset("schools", city=city)]
    results: List[School] = []
    for school in schools:
        if curriculum and school.curriculum.lower() != curriculum.lower():
            continue
        if level and school.level.lower() != level.lower():
            continue
        results.append(school)
    return results
