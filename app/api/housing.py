"""Housing and rental endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import RentalListing
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/housing", tags=["housing"])


@router.get("/rentals", response_model=List[RentalListing])
def list_rentals(
    furnished: Optional[bool] = Query(None),
    kid_friendly: Optional[bool] = Query(None),
    pet_friendly: Optional[bool] = Query(None),
    q: Optional[str] = Query(None, description="Free-text search in title/neighborhood"),
    city: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> List[RentalListing]:
    """Return rental listings filtered by attributes."""
    rentals = [RentalListing(**item) for item in load_dataset("rentals", city=city)]
    results = []
    for listing in rentals:
        if furnished is not None and listing.furnished != furnished:
            continue
        if kid_friendly is not None and listing.kid_friendly != kid_friendly:
            continue
        if pet_friendly is not None and listing.pet_friendly != pet_friendly:
            continue
        if q and (q.lower() not in listing.title.lower() and q.lower() not in listing.neighborhood.lower()):
            continue
        results.append(listing)
    start = (page - 1) * page_size
    end = start + page_size
    return results[start:end]
