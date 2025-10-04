"""Realtime alert streams using Server-Sent Events (SSE) and WebSocket."""
from __future__ import annotations

import asyncio
import json
from datetime import UTC, datetime
from typing import AsyncIterator

from fastapi import APIRouter, WebSocket
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/stream", tags=["stream"])


async def _sse_event_stream() -> AsyncIterator[bytes]:
    # Demo heartbeat/alert stream. Replace with real pub/sub in prod.
    i = 0
    while True:
        payload = {"type": "heartbeat", "index": i, "ts": _utc_timestamp()}
        data = f"data: {json.dumps(payload)}\n\n".encode("utf-8")
        yield data
        await asyncio.sleep(3)
        i += 1


@router.get("/alerts.sse")
async def alerts_sse() -> StreamingResponse:
    return StreamingResponse(_sse_event_stream(), media_type="text/event-stream")


@router.websocket("/alerts.ws")
async def alerts_ws(ws: WebSocket) -> None:
    await ws.accept()
    i = 0
    try:
        while True:
            payload = {"type": "heartbeat", "index": i, "ts": _utc_timestamp()}
            await ws.send_text(json.dumps(payload))
            await asyncio.sleep(3)
            i += 1
    except Exception:
        # Client disconnected or error; just close loop for MVP
        await ws.close()


def _utc_timestamp() -> str:
    """Return an ISO-8601 timestamp in UTC with a trailing 'Z'."""

    # datetime.now(UTC) returns a timezone-aware datetime which avoids the
    # deprecation of ``datetime.utcnow`` and keeps the timestamp precise.
    # ``isoformat`` includes the timezone offset ``+00:00`` for UTC, which we
    # normalise to the ``Z`` suffix expected by clients of this stream.
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


