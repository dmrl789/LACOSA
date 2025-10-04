"""Localization helpers for concierge responses."""
from __future__ import annotations

from typing import Tuple


DEFAULT_LANGUAGE = "en"
SUPPORTED_LANGUAGES = {"en", "es", "it", "fr"}

FALLBACK_MESSAGES = {
    "en": "I don't have an exact match, but Palermo's city guide covers safety, schools, housing, and more in the app. Try a more specific neighborhood or keyword.",
    "es": "No tengo una coincidencia exacta, pero la guía de Palermo en la app cubre seguridad, escuelas, vivienda y mucho más. Prueba con un barrio o una palabra clave más específica.",
    "it": "Non ho una corrispondenza esatta, ma la guida di Palermo nell'app copre sicurezza, scuole, casa e altro ancora. Prova con un quartiere o una parola chiave più specifici.",
    "fr": "Je n'ai pas de correspondance exacte, mais le guide de Palerme dans l'application couvre la sécurité, les écoles, le logement et plus encore. Essaie avec un quartier ou un mot-clé plus précis.",
}

TRANSLATION_PREFIXES = {
    "es": "Traducción automática (beta):",
    "it": "Risposta tradotta (beta):",
    "fr": "Réponse traduite (bêta) :",
}

UNSUPPORTED_LANGUAGE_TEMPLATE = (
    "Language '{language}' is not yet supported; showing the English response while we expand coverage."
)


def normalize_language(language: str | None) -> Tuple[str, str]:
    """Return the active and requested language codes."""
    if not language:
        return DEFAULT_LANGUAGE, DEFAULT_LANGUAGE

    normalized = language.lower()
    if normalized in SUPPORTED_LANGUAGES:
        return normalized, normalized
    return DEFAULT_LANGUAGE, normalized


def localize_fallback(language: str) -> str:
    """Return a fallback response in the requested language when no matches are found."""
    return FALLBACK_MESSAGES.get(language, FALLBACK_MESSAGES[DEFAULT_LANGUAGE])


def annotate_translation(answer: str, active_language: str, requested_language: str, has_matches: bool) -> str:
    """Add translation notes when the response language differs from the requested language."""

    if requested_language != active_language:
        return f"{UNSUPPORTED_LANGUAGE_TEMPLATE.format(language=requested_language)}\n{answer}"

    if active_language == DEFAULT_LANGUAGE or not has_matches:
        return answer

    prefix = TRANSLATION_PREFIXES.get(active_language)
    if not prefix:
        return answer
    return f"{prefix}\n{answer}"
