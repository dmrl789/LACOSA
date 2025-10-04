"""Education related endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import School
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/schools", tags=["schools"])


@router.get("/directory", response_model=List[School])
def list_schools(
    curriculum: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
) -> List[School]:
    """Return the school directory filtered by curriculum and level."""
    schools = [School(**item) for item in load_dataset("schools")]
    results: List[School] = []
    for school in schools:
        if curriculum and school.curriculum.lower() != curriculum.lower():
            continue
        if level and school.level.lower() != level.lower():
            continue
        results.append(school)
    return results
