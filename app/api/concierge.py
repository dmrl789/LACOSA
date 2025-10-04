"""AI concierge endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from app.models.base import ConciergeAnswer
from app.services.concierge import answer_query


router = APIRouter(prefix="/concierge", tags=["concierge"])


@router.get("/ask", response_model=ConciergeAnswer)
def ask_concierge(query: str) -> ConciergeAnswer:
    """Return a concierge answer for the provided query."""
    return answer_query(query)
