"""Food, cafés, and nightlife endpoints."""
from __future__ import annotations

from typing import Iterable, List, Optional, Sequence

from fastapi import APIRouter, Query

from app.models.base import Venue
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/lifestyle", tags=["lifestyle"])


_TAG_LOOKUP: dict[str, Sequence[str]] = {
    "has_wifi": ("wifi", "wi-fi"),
    "remote_work_friendly": ("remote work friendly", "remote-work-friendly", "remote-friendly"),
    "vegetarian_friendly": ("vegetarian friendly", "vegetarian-friendly", "vegetarian options"),
    "family_friendly": ("family friendly", "family-friendly"),
}


def _normalise_tags(tags: Iterable[str]) -> set[str]:
    return {tag.lower().replace("-", " ") for tag in tags}


def _matches_flag(tags: set[str], flag: Optional[bool], lookup_key: str) -> bool:
    if flag is None:
        return True
    candidates = {item.replace("-", " ") for item in _TAG_LOOKUP[lookup_key]}
    has_tag = any(candidate in tags for candidate in candidates)
    return has_tag if flag else not has_tag


@router.get("/venues", response_model=List[Venue])
def list_lifestyle_venues(
    venue_type: Optional[str] = Query(None, description="Filter by venue type such as cafe or bar."),
    has_wifi: Optional[bool] = Query(
        None, description="Filter venues that advertise Wi-Fi availability."
    ),
    remote_work_friendly: Optional[bool] = Query(
        None, description="Filter venues suited for remote work setups."
    ),
    vegetarian_friendly: Optional[bool] = Query(
        None, description="Filter venues with vegetarian-friendly options."
    ),
    family_friendly: Optional[bool] = Query(
        None, description="Filter venues that welcome families with kids."
    ),
) -> List[Venue]:
    """Return curated food, café, and nightlife venues with optional filters."""
    venues = [Venue(**item) for item in load_dataset("venues")]
    results: List[Venue] = []
    for venue in venues:
        if venue_type and venue.type.lower() != venue_type.lower():
            continue
        normalised_tags = _normalise_tags(venue.tags)
        if not _matches_flag(normalised_tags, has_wifi, "has_wifi"):
            continue
        if not _matches_flag(normalised_tags, remote_work_friendly, "remote_work_friendly"):
            continue
        if not _matches_flag(normalised_tags, vegetarian_friendly, "vegetarian_friendly"):
            continue
        if not _matches_flag(normalised_tags, family_friendly, "family_friendly"):
            continue
        results.append(venue)
    return results
