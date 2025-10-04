"""Community and social graph endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.base import Group, UserProfile
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/community", tags=["community"])


@router.get("/profiles", response_model=List[UserProfile])
def list_profiles(
    interest: Optional[str] = Query(None),
    has_kids: Optional[bool] = Query(None),
) -> List[UserProfile]:
    """Return community profiles with optional filters."""
    profiles = [UserProfile(**item) for item in load_dataset("profiles")]
    results: List[UserProfile] = []
    for profile in profiles:
        if interest and interest.lower() not in [i.lower() for i in profile.interests]:
            continue
        if has_kids is not None and profile.has_kids != has_kids:
            continue
        results.append(profile)
    return results


@router.get("/groups", response_model=List[Group])
def list_groups(interest: Optional[str] = Query(None)) -> List[Group]:
    """Return community groups that can be joined."""
    groups = [Group(**item) for item in load_dataset("groups")]
    if interest:
        return [group for group in groups if interest.lower() in [i.lower() for i in group.interests]]
    return groups
