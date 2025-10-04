"""Utility helpers for loading static JSON datasets."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _city_dir(city: str | None) -> Path:
    """Return the data directory, optionally namespaced by city.

    For multi-city support, datasets can live under data/<city>/name.json.
    Falls back to root data/ if city path does not exist.
    """
    if city:
        city_path = DATA_DIR / city
        if city_path.exists() and city_path.is_dir():
            return city_path
    return DATA_DIR


@lru_cache()
def load_dataset(name: str, city: str | None = None) -> Any:
    """Load a dataset by name from the data directory (optional city prefix)."""
    path = _city_dir(city) / f"{name}.json"
    if not path.exists():
        raise FileNotFoundError(f"Dataset '{name}' not found at {path}")
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)
