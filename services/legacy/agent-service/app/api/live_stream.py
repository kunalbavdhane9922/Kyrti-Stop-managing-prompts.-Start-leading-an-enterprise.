from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import asyncio

router = APIRouter()

class LiveStreamManager:
    """
    Massive Real-Time Broadcast Matrix.
    Connects the Next.js Mission Control directly to the Temporal/LangGraph Engine.
    Streams what the agents are thinking, their execution times, and Docker logs live.
    """
    def __init__(self):
        # Maps tenant_id to a list of active websocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, tenant_id: str):
        await websocket.accept()
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = []
        self.active_connections[tenant_id].append(websocket)
        print(f"[LIVE STREAM] Next.js Dashboard connected for Tenant: {tenant_id}")

    def disconnect(self, websocket: WebSocket, tenant_id: str):
        if tenant_id in self.active_connections:
            self.active_connections[tenant_id].remove(websocket)
            if not self.active_connections[tenant_id]:
                del self.active_connections[tenant_id]
        print(f"[LIVE STREAM] Next.js Dashboard disconnected for Tenant: {tenant_id}")

    async def broadcast_brainwave(self, tenant_id: str, agent_role: str, message: str, node: str):
        """Streams a live thought from an LLM node directly to the UI."""
        if tenant_id in self.active_connections:
            payload = {
                "type": "BRAINWAVE",
                "role": agent_role,
                "node": node,
                "message": message
            }
            json_payload = json.dumps(payload)
            for connection in self.active_connections[tenant_id]:
                try:
                    await connection.send_text(json_payload)
                except Exception:
                    pass

stream_manager = LiveStreamManager()

@router.websocket("/ws/telemetry/{tenant_id}")
async def telemetry_websocket(websocket: WebSocket, tenant_id: str):
    await stream_manager.connect(websocket, tenant_id)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        stream_manager.disconnect(websocket, tenant_id)
