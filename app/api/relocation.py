"""Relocation pack endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import RelocationPack
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/relocation", tags=["relocation"])


@router.get("/packs", response_model=List[RelocationPack])
def list_relocation_packs(city: Optional[str] = Query(None)) -> List[RelocationPack]:
    """Return relocation starter packs for supported cities."""
    return [RelocationPack(**item) for item in load_dataset("relocation", city=city)]
