"""Extended tests for new features: auth, geojson, pagination, streaming."""
from __future__ import annotations

import json
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_auth_register_login_me() -> None:
    email = "user@example.com"
    password = "secret123"
    # Register (idempotent across runs not required; unique email used)
    r = client.post("/api/community/auth/register", params={"email": email, "password": password})
    assert r.status_code in (200, 400)
    # Login
    r = client.post("/api/community/auth/login", params={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    # Me
    r = client.get("/api/community/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == email


def test_safety_geojson_feature_collection() -> None:
    r = client.get("/api/safety/zones.geojson")
    assert r.status_code == 200
    fc = r.json()
    assert fc["type"] == "FeatureCollection"
    assert isinstance(fc.get("features"), list)
    if fc["features"]:
        f0 = fc["features"][0]
        assert f0["type"] == "Feature"
        assert f0["geometry"]["type"] == "Polygon"


def test_rentals_pagination_and_search() -> None:
    # Small page size
    r = client.get("/api/housing/rentals", params={"page": 1, "page_size": 1})
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert 0 <= len(data) <= 1
    # Query filter (best-effort; should not error even if no match)
    r = client.get("/api/housing/rentals", params={"q": "Kalsa", "page": 1, "page_size": 5})
    assert r.status_code == 200


def test_stream_websocket_connect_and_message() -> None:
    with client.websocket_connect("/api/stream/alerts.ws") as ws:
        msg = ws.receive_text()
        payload = json.loads(msg)
        assert payload.get("type") == "heartbeat"


def test_select_city_ack() -> None:
    r = client.get("/api/utilities/select-city", params={"city": "Palermo"})
    assert r.status_code == 200
    assert r.json().get("ok") in (True, False)


