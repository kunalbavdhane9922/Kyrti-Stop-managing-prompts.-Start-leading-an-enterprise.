import json
import asyncio
from typing import Dict
from fastapi import WebSocket

# In production, this connects to aioredis. For MVP scaffolding, we use in-memory dict to simulate pub/sub.
class WSGatewayManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        
        # Subscribe to Redis channels here in prod
        await self.broadcast(json.dumps({
            "type": "PRESENCE_JOIN",
            "client_id": client_id
        }))

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def broadcast(self, message: str):
        """Simulates Redis publish by broadcasting to all local WS connections"""
        for connection in self.active_connections.values():
            try:
                await connection.send_text(message)
            except Exception:
                pass

    async def handle_message(self, client_id: str, data: dict):
        msg_type = data.get("type")
        if msg_type == "MOVE_INTENT":
            # Forward to spatial tick server via Redis. For MVP, just broadcast position.
            await self.broadcast(json.dumps({
                "type": "TICK_UPDATE",
                "updates": [
                    [client_id, data.get("x", 0), data.get("y", 0), 1]
                ]
            }))
        elif msg_type == "CHAT_MSG":
            await self.broadcast(json.dumps({
                "type": "CHAT_RECEIVE",
                "sender": client_id,
                "msg": data.get("msg", "")
            }))

gateway = WSGatewayManager()
