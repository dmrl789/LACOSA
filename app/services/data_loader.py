"""Utility helpers for loading static JSON datasets."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@lru_cache()
def load_dataset(name: str) -> Any:
    """Load a dataset by name from the data directory."""
    path = DATA_DIR / f"{name}.json"
    if not path.exists():
        raise FileNotFoundError(f"Dataset '{name}' not found at {path}")
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)
