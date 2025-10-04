"""Simple rule-based concierge to simulate AI responses."""
from __future__ import annotations

import textwrap
from typing import Iterable, List, Tuple

from app.models.base import ConciergeAnswer
from app.services.data_loader import load_dataset
from app.services.localization import annotate_translation, localize_fallback, normalize_language


def _flatten_sources(keys: Iterable[str]) -> List[str]:
    return sorted(set(keys))


def _search_sections(query: str, language: str) -> Tuple[List[str], List[str], int]:
    query_lower = query.lower()
    responses: List[str] = []
    sources: List[str] = []
    matches = 0

    # Safety data
    safety_data = load_dataset("safety")
    for zone in safety_data:
        if zone["neighborhood"].lower() in query_lower or zone["risk_level"] in query_lower:
            responses.append(
                f"{zone['neighborhood']}: Risk {zone['risk_level']} — {zone['description']} (Trend: {zone['trend']})."
            )
            sources.append(f"safety:{zone['id']}")
            matches += 1

    # Schools
    for school in load_dataset("schools"):
        if school["name"].lower() in query_lower or any(lang.lower() in query_lower for lang in school["language"]):
            responses.append(
                f"{school['name']} ({school['curriculum']}, rating {school['rating']}/5). {school['application_tips']}"
            )
            sources.append(f"schools:{school['id']}")
            matches += 1

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
            matches += 1

    # Transport options
    for transport in load_dataset("transport"):
        if transport["mode"].lower() in query_lower or transport["provider"].lower() in query_lower:
            responses.append(
                f"{transport['provider']} {transport['mode']} — {transport['description']} (Safety: {transport['safety_notes']})."
            )
            sources.append(f"transport:{transport['id']}")
            matches += 1

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
        matches += 1

    if not responses:
        responses.append(localize_fallback(language))
        sources.append("guide:general")

    return responses, _flatten_sources(sources), matches


def _calculate_confidence(matches: int) -> float:
    if matches <= 0:
        return 0.2
    return min(0.95, 0.35 + 0.15 * matches)


def answer_query(query: str, language: str | None = None) -> ConciergeAnswer:
    """Generate a simple answer from curated datasets."""
    active_language, requested_language = normalize_language(language)
    responses, sources, matches = _search_sections(query, active_language)
    answer = "\n".join(responses)
    answer = annotate_translation(answer, active_language, requested_language, matches > 0)
    confidence = _calculate_confidence(matches)
    return ConciergeAnswer(
        query=query,
        answer=answer,
        sources=sources,
        confidence=confidence,
        language=active_language,
        requested_language=requested_language,
    )
