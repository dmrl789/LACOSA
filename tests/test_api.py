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


def test_housing_filter() -> None:
    response = client.get("/api/housing/rentals", params={"kid_friendly": True})
    assert response.status_code == 200
    rentals = response.json()
    assert all(rental["kid_friendly"] for rental in rentals)


def test_lifestyle_remote_work_filter() -> None:
    response = client.get(
        "/api/lifestyle/venues", params={"remote_work_friendly": True}
    )
    assert response.status_code == 200
    venues = response.json()
    assert venues
    for venue in venues:
        normalised_tags = {tag.lower().replace("-", " ") for tag in venue["tags"]}
        assert "remote work friendly" in normalised_tags


def test_relocation_pack_fields() -> None:
    response = client.get("/api/relocation/packs")
    assert response.status_code == 200
    packs = response.json()
    assert packs
    assert "visa_tips" in packs[0]
