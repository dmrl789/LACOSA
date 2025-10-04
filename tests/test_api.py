"""Smoke tests for the LACOSA API."""
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_cities() -> None:
    response = client.get("/api/utilities/cities")
    assert response.status_code == 200
    data = response.json()
    assert "Palermo" in data


def test_safety_zones_structure() -> None:
    response = client.get("/api/safety/zones")
    assert response.status_code == 200
    zones = response.json()
    assert zones
    sample = zones[0]
    assert {"id", "neighborhood", "risk_level", "polygon"}.issubset(sample.keys())


def test_concierge_sources() -> None:
    response = client.get("/api/concierge/ask", params={"query": "Is Kalsa safe at night?"})
    assert response.status_code == 200
    body = response.json()
    assert body["query"] == "Is Kalsa safe at night?"
    assert any(source.startswith("safety:") for source in body["sources"])
    assert 0 <= body["confidence"] <= 1
    assert body["language"] == "en"
    assert body["requested_language"] == "en"


def test_concierge_language_localization() -> None:
    response = client.get(
        "/api/concierge/ask",
        params={"query": "Informazioni generali", "lang": "it"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["language"] == "it"
    assert body["requested_language"] == "it"
    assert "guida di Palermo" in body["answer"]


def test_concierge_language_fallback_to_english() -> None:
    response = client.get(
        "/api/concierge/ask",
        params={"query": "Safety in Politeama", "lang": "de"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["language"] == "en"
    assert body["requested_language"] == "de"
    assert "Language 'de' is not yet supported" in body["answer"]


def test_housing_filter() -> None:
    response = client.get("/api/housing/rentals", params={"kid_friendly": True})
    assert response.status_code == 200
    rentals = response.json()
    assert all(rental["kid_friendly"] for rental in rentals)


def test_relocation_pack_fields() -> None:
    response = client.get("/api/relocation/packs")
    assert response.status_code == 200
    packs = response.json()
    assert packs
    assert "visa_tips" in packs[0]
