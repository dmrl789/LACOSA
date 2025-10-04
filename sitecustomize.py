"""Compatibility patches applied automatically when Python starts.

This project currently depends on FastAPI versions that still rely on
Pydantic v1.  Pydantic v1 expects the private ``typing.ForwardRef._evaluate``
method to accept the ``recursive_guard`` argument as a positional parameter.

Python 3.12 changed the method signature so that ``recursive_guard`` became a
keyword-only argument.  Pydantic v1 (and therefore FastAPI) still calls the
method positionally which raises a ``TypeError`` during import, preventing the
test suite from even starting.

To keep the application compatible with Python 3.12 we monkey-patch the
``ForwardRef._evaluate`` method at interpreter start-up so that positional
arguments are forwarded as keyword arguments.

The ``sitecustomize`` module is loaded automatically by Python when available,
so adding this module fixes the incompatibility without requiring changes to
third-party dependencies.
"""

from __future__ import annotations

import inspect
import sys
from typing import ForwardRef


def _patch_forward_ref_evaluate() -> None:
    """Make ``ForwardRef._evaluate`` accept ``recursive_guard`` positionally."""

    if sys.version_info < (3, 12):
        # Older Python versions still support the positional signature.
        return

    # ``ForwardRef`` may not exist on very old Python versions, but that's not
    # relevant for our supported environments.  We still guard the attribute
    # access to make the patch safe.
    original = getattr(ForwardRef, "_evaluate", None)
    if original is None:
        return

    signature = inspect.signature(original)
    parameter = signature.parameters.get("recursive_guard")
    # If the signature is already positional-only (i.e. Python <3.12 or a
    # previously patched interpreter), there's nothing else to do.
    if parameter is None or parameter.kind is not inspect.Parameter.KEYWORD_ONLY:
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


_patch_forward_ref_evaluate()

