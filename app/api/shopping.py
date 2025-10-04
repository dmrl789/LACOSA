"""Shopping and essentials endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import Market, Venue
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/shopping", tags=["shopping"])


@router.get("/markets", response_model=List[Market])
def list_markets(category: Optional[str] = Query(None)) -> List[Market]:
    """List markets, grocery stores and delivery options."""
    markets = [Market(**item) for item in load_dataset("markets")]
    if category:
        return [market for market in markets if market.category.lower() == category.lower()]
    return markets


@router.get("/essentials", response_model=List[Venue])
def list_essentials() -> List[Venue]:
    """Return curated essential venues such as pharmacies and electronics."""
    return [Venue(**item) for item in load_dataset("essentials")]
