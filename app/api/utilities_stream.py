"""Realtime alert streams using Server-Sent Events (SSE) and WebSocket."""
from __future__ import annotations

import asyncio
import json
from datetime import datetime
from typing import AsyncIterator

from fastapi import APIRouter, WebSocket
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/stream", tags=["stream"])


async def _sse_event_stream() -> AsyncIterator[bytes]:
    # Demo heartbeat/alert stream. Replace with real pub/sub in prod.
    i = 0
    while True:
        payload = {"type": "heartbeat", "index": i, "ts": datetime.utcnow().isoformat() + "Z"}
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
            payload = {"type": "heartbeat", "index": i, "ts": datetime.utcnow().isoformat() + "Z"}
            await ws.send_text(json.dumps(payload))
            await asyncio.sleep(3)
            i += 1
    except Exception:
        # Client disconnected or error; just close loop for MVP
        await ws.close()


