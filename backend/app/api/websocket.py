"""
Module: websocket.py
"""

import json
import asyncio
from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Query,
    HTTPException,
    status,
)
from jose import jwt, JWTError
from app.config import settings
from app.dependencies import redis_client

router = APIRouter()


async def ws_auth(token: str):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )


@router.websocket("/{job_id}")
async def websocket_progress(
    websocket: WebSocket, job_id: str, token: str = Query(...)
):
    await websocket.accept()
    try:
        await ws_auth(token)
    except HTTPException:
        await websocket.close(code=1008)
        return

    pubsub = redis_client.pubsub()
    channel = f"progress:{job_id}"
    await pubsub.subscribe(channel)

    try:
        while True:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=1.0
            )
            if message:
                data = json.loads(message["data"])
                await websocket.send_json(data)

                if data.get("status") in ["COMPLETED", "FAILED", "PARTIAL"]:
                    break

            # Polling connection state
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        pass
    finally:
        await pubsub.unsubscribe(channel)
