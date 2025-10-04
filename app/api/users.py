"""Community, social graph, and auth endpoints."""
from __future__ import annotations

from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Query, HTTPException, Depends, Header

from app.models.base import Group, UserProfile
from app.services.data_loader import load_dataset
from app.services.auth import create_user, authenticate_user, create_access_token, decode_token, get_user


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


# --- Auth sub-routes ---
auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register")
def register(email: str, password: str) -> Dict[str, Any]:
    try:
        user = create_user(email, password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return {"email": user["email"]}


@auth_router.post("/login")
def login(email: str, password: str) -> Dict[str, Any]:
    user = authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=email)
    return {"access_token": token, "token_type": "bearer"}


def get_current_user(authorization: str | None = Header(default=None)) -> Dict[str, Any]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@auth_router.get("/me")
def me(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    return {"email": user["email"], "verified": user["verified"]}


# Include auth endpoints under the main router
router.include_router(auth_router)
