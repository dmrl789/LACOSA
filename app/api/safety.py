"""Safety related endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Query

from app.models.base import SafetyMarker, SafetyZone
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/safety", tags=["safety"])


SAFETY_MARKERS: list[SafetyMarker] = [
    SafetyMarker(id=1, lat=38.118, lng=13.37, risk="high"),
    SafetyMarker(id=2, lat=38.125, lng=13.34, risk="medium"),
    SafetyMarker(id=3, lat=38.105, lng=13.37, risk="low"),
]


@router.get("", response_model=list[SafetyMarker])
def list_safety_markers() -> list[SafetyMarker]:
    """Return categorized safety markers for the live map."""

    return SAFETY_MARKERS


@router.get("/zones", response_model=List[SafetyZone])
def list_safety_zones(city: Optional[str] = Query(None)) -> List[SafetyZone]:
    """Return safety zones for the active city."""
    zones = load_dataset("safety", city=city)
    converted = []
    for zone in zones:
        zone["updated_at"] = datetime.fromisoformat(zone["updated_at"])
        converted.append(SafetyZone(**zone))
    return converted


@router.get("/zones.geojson")
def list_safety_zones_geojson(city: Optional[str] = Query(None)) -> Dict[str, Any]:
    """Return safety zones as a GeoJSON FeatureCollection for map rendering."""
    zones = load_dataset("safety", city=city)
    features: List[Dict[str, Any]] = []
    for zone in zones:
        properties = {
            "id": zone["id"],
            "neighborhood": zone["neighborhood"],
            "risk_level": zone["risk_level"],
            "trend": zone["trend"],
            "updated_at": zone["updated_at"],
            "description": zone["description"],
        }
        # Polygon is stored as list of objects {lat, lng} -> convert to [lng, lat]
        ring = [[pt["lng"], pt["lat"]] for pt in zone["polygon"]]
        geometry = {"type": "Polygon", "coordinates": [ring]}
        features.append({"type": "Feature", "geometry": geometry, "properties": properties})
    return {"type": "FeatureCollection", "features": features}
