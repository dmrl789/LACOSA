"""Utility helpers for loading static JSON datasets."""
from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any


logger = logging.getLogger(__name__)
DATA_DIR = Path(__file__).resolve().parent.parent / "data"


class DatasetNotFoundError(FileNotFoundError):
    """Raised when a dataset cannot be located on disk."""

    def __init__(self, dataset: str, city: str | None, path: Path) -> None:
        self.dataset = dataset
        self.city = city
        self.path = path
        message = f"Dataset '{dataset}' not found"
        if city:
            message += f" for city '{city}'"
        message += f" at {path}"
        super().__init__(message)


class UnsupportedCityError(ValueError):
    """Raised when a requested city is not supported by the catalogue."""

    def __init__(self, city: str) -> None:
        self.city = city
        super().__init__(f"City '{city}' is not supported")


@lru_cache()
def _supported_cities() -> set[str]:
    path = DATA_DIR / "cities.json"
    if not path.exists():
        return set()
    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)
    return {str(item) for item in data}


def _city_dir(city: str | None) -> Path:
    """Return the data directory, optionally namespaced by city."""

    if city:
        supported_cities = _supported_cities()
        if supported_cities and city not in supported_cities:
            raise UnsupportedCityError(city)
        city_path = DATA_DIR / city
        if city_path.exists() and city_path.is_dir():
            return city_path
    return DATA_DIR


@lru_cache()
def load_dataset(name: str, city: str | None = None) -> Any:
    """Load a dataset by name from the data directory (optional city prefix)."""

    path = _city_dir(city) / f"{name}.json"
    if not path.exists():
        logger.error("Dataset missing", extra={"dataset": name, "city": city, "path": str(path)})
        raise DatasetNotFoundError(name, city, path)
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)
