"""AI concierge endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Query

from app.models.base import ConciergeAnswer
from app.services.concierge import answer_query


router = APIRouter(prefix="/concierge", tags=["concierge"])


@router.get("/ask", response_model=ConciergeAnswer)
def ask_concierge(
    query: str,
    language: str = Query(
        "en",
        min_length=2,
        max_length=8,
        alias="lang",
        deprecated_aliases=["language"],
        description="ISO 639-1 language code for the concierge response.",
    ),
) -> ConciergeAnswer:
    """Return a concierge answer for the provided query."""
    return answer_query(query=query, language=language)
