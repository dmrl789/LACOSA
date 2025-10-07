"""Safety related endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Query

from app.models.base import SafetyMarker, SafetyZone
from app.services.data_loader import load_dataset


router = APIRouter(prefix="/safety", tags=["safety"])


@router.get("", response_model=List[SafetyMarker])
def safety_map_markers() -> List[SafetyMarker]:
    """Return simplified safety markers for the map view."""
    return [
        SafetyMarker(id=1, lat=38.118, lng=13.37, risk="high"),
        SafetyMarker(id=2, lat=38.125, lng=13.34, risk="medium"),
        SafetyMarker(id=3, lat=38.105, lng=13.37, risk="low"),
    ]


@router.get("/zones", response_model=List[SafetyZone])
def list_safety_zones(city: Optional[str] = Query(None)) -> List[SafetyZone]:
    """Return safety zones for the active city."""
    converted = []
    for zone in load_dataset("safety", city=city):
        updated = zone.get("updated_at")
        if isinstance(updated, str):
            updated_dt = datetime.fromisoformat(updated)
        else:
            updated_dt = updated
        converted.append(SafetyZone(**{**zone, "updated_at": updated_dt}))
    return converted


@router.get("/zones.geojson")
def list_safety_zones_geojson(city: Optional[str] = Query(None)) -> Dict[str, Any]:
    """Return safety zones as a GeoJSON FeatureCollection for map rendering."""
    zones = load_dataset("safety", city=city)
    features: List[Dict[str, Any]] = []
    for zone in zones:
        updated = zone.get("updated_at")
        updated_value = (
            updated.isoformat() if isinstance(updated, datetime) else str(updated)
        )
        properties = {
            "id": zone["id"],
            "neighborhood": zone["neighborhood"],
            "risk_level": zone["risk_level"],
            "trend": zone["trend"],
            "updated_at": updated_value,
            "description": zone["description"],
        }
        # Polygon is stored as list of objects {lat, lng} -> convert to [lng, lat]
        ring = [[pt["lng"], pt["lat"]] for pt in zone["polygon"]]
        if ring and ring[0] != ring[-1]:
            ring.append(ring[0])
        geometry = {"type": "Polygon", "coordinates": [ring]}
        features.append({"type": "Feature", "geometry": geometry, "properties": properties})
    return {"type": "FeatureCollection", "features": features}
