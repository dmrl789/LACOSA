"""Simple rule-based concierge to simulate AI responses."""
from __future__ import annotations

import textwrap
from typing import Iterable, List

from app.models.base import ConciergeAnswer
from app.services.data_loader import load_dataset


def _flatten_sources(keys: Iterable[str]) -> List[str]:
    return sorted(set(keys))


def _search_sections(query: str) -> tuple[str, List[str]]:
    query_lower = query.lower()
    responses: List[str] = []
    sources: List[str] = []

    # Safety data
    safety_data = load_dataset("safety")
    for zone in safety_data:
        if zone["neighborhood"].lower() in query_lower or zone["risk_level"] in query_lower:
            responses.append(
                f"{zone['neighborhood']}: Risk {zone['risk_level']} — {zone['description']} (Trend: {zone['trend']})."
            )
            sources.append(f"safety:{zone['id']}")

    # Schools
    for school in load_dataset("schools"):
        if school["name"].lower() in query_lower or any(lang.lower() in query_lower for lang in school["language"]):
            responses.append(
                f"{school['name']} ({school['curriculum']}, rating {school['rating']}/5). {school['application_tips']}"
            )
            sources.append(f"schools:{school['id']}")

    # Food venues
    for venue in load_dataset("venues"):
        tags = [tag.lower() for tag in venue["tags"]]
        normalised_tags = {tag.replace("-", " ") for tag in tags}
        if (
            venue["name"].lower() in query_lower
            or any(tag in query_lower for tag in normalised_tags)
        ):
            responses.append(
                f"{venue['name']} — {venue['description']} (Tags: {', '.join(venue['tags'])})."
            )
            sources.append(f"venues:{venue['id']}")

    # Transport options
    for transport in load_dataset("transport"):
        if transport["mode"].lower() in query_lower or transport["provider"].lower() in query_lower:
            responses.append(
                f"{transport['provider']} {transport['mode']} — {transport['description']} (Safety: {transport['safety_notes']})."
            )
            sources.append(f"transport:{transport['id']}")

    # Relocation pack general summary
    packs = load_dataset("relocation")
    city = packs[0]
    if any(keyword in query_lower for keyword in ["visa", "health", "emergency", "sim", "internet"]):
        responses.append(
            textwrap.shorten(
                " ".join(
                    [
                        f"Visa tip: {city['visa_tips']}",
                        f"Connectivity: {city['connectivity']}",
                        f"Healthcare: {city['healthcare']}",
                        f"Emergency contacts: {', '.join(city['emergency_contacts'])}",
                    ]
                ),
                width=280,
                placeholder="…",
            )
        )
        sources.append(f"relocation:{city['city']}")

    if not responses:
        responses.append(
            "I don't have an exact match, but Palermo's city guide covers safety, schools, housing, and more in the app. Try a more specific neighborhood or keyword."
        )
        sources.append("guide:general")

    return "\n".join(responses), _flatten_sources(sources)


def answer_query(query: str) -> ConciergeAnswer:
    """Generate a simple answer from curated datasets."""
    answer, sources = _search_sections(query)
    return ConciergeAnswer(query=query, answer=answer, sources=sources)
