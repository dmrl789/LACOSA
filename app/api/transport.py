"""Transport and mobility endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import TransportOption
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/transport", tags=["transport"])


@router.get("/options", response_model=List[TransportOption])
def list_transport_options(city: Optional[str] = Query(None)) -> List[TransportOption]:
    """Return transport providers and availability information."""
    return [TransportOption(**item) for item in load_dataset("transport", city=city)]
