"""Pytest configuration and compatibility patches."""

from __future__ import annotations

import inspect
import sys
from pathlib import Path
from typing import ForwardRef


# Ensure the project root is on ``sys.path`` so ``import app`` works even when
# pytest is executed from a different working directory.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


def _ensure_forward_ref_compatibility() -> None:
    """Patch ``ForwardRef._evaluate`` for Python 3.12 compatibility."""

    if sys.version_info < (3, 12):
        return

    original = getattr(ForwardRef, "_evaluate", None)
    if original is None:
        return

    recursive_guard = inspect.signature(original).parameters.get("recursive_guard")
    if recursive_guard is None or recursive_guard.kind is not inspect.Parameter.KEYWORD_ONLY:
        return

    def _patched(
        self,
        globalns,
        localns,
        type_params=None,
        recursive_guard=None,
    ):
        if recursive_guard is None:
            recursive_guard = set()

        return original(
            self,
            globalns,
            localns,
            type_params,
            recursive_guard=recursive_guard,
        )

    setattr(ForwardRef, "_evaluate", _patched)


_ensure_forward_ref_compatibility()

