from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import json
import uuid
import os

from MapExpander import MapExpander
import MapEngine

app = FastAPI(title="Virtual Office API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.agents = {} # Track AI agents

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        await self.broadcast(json.dumps({"type": "player_joined", "id": client_id}))
        
        # Send existing agents to new client
        for agent_id, agent_data in self.agents.items():
            await websocket.send_text(json.dumps({
                "type": "agent_spawned",
                "id": agent_id,
                **agent_data
            }))

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "Welcome to the Virtual Office Server"}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                msg_type = parsed.get("type")
                action = parsed.get("action")
                
                if action == "EXPAND_MAP":
                    try:
                        map_path = os.path.join(os.path.dirname(__file__), "..", "virtual-office-web", "public", "assets", "office-map.json")
                        expander = MapExpander(os.path.abspath(map_path))
                        result = expander.inject_desk_cluster(10, 10)
                        if result["success"]:
                            await manager.broadcast(json.dumps({
                                "type": "MAP_UPDATED",
                                "new_width": result["new_width"],
                                "new_height": result["new_height"]
                            }))
                    except Exception as e:
                        print("Map expansion failed:", str(e))
                elif msg_type == "purchase:request":
                    item_type = parsed.get("itemType")
                    config = parsed.get("itemConfig", {})
                    
                    res = MapEngine.build_infrastructure(item_type, config)
                    if res["success"]:
                        if res.get("fullReload", False):
                            # Broadcast full reload if the map bounds expanded
                            await manager.broadcast(json.dumps({
                                "type": "map_reload"
                            }))
                        else:
                            # Broadcast the diff
                            await manager.broadcast(json.dumps({
                                "type": "map_diff",
                                "changes": res["changes"],
                                "zones": res["zones"]
                            }))
                        
                        # Notify success
                        await websocket.send_text(json.dumps({
                            "type": "purchase_success",
                            "itemType": item_type
                        }))
                        
                        # If AI agent, spawn them
                        if item_type == "ai_agent" and len(res["deskPositions"]) > 0:
                            agent_id = "agent_" + str(uuid.uuid4())[:8]
                            pos = res["deskPositions"][0]
                            manager.agents[agent_id] = {
                                "x": pos["x"] * 32, # Assuming 32x32 tiles, approximate world coords
                                "y": pos["y"] * 32,
                                "name": "AI Assistant"
                            }
                            await manager.broadcast(json.dumps({
                                "type": "agent_spawned",
                                "id": agent_id,
                                **manager.agents[agent_id]
                            }))
                            
                    else:
                        await websocket.send_text(json.dumps({
                            "type": "chat_reply",
                            "message": f"Error: {res['reason']}"
                        }))
                        
                elif msg_type == "chat":
                    msg = parsed.get("message", "").lower()
                    target_id = parsed.get("targetId", None)
                    
                    await websocket.send_text(json.dumps({
                        "type": "chat_reply", 
                        "message": f"[AI]: Processing request '{msg}'..."
                    }))
                    
                else:
                    # Player movement
                    await manager.broadcast(json.dumps({
                        "type": "player_moved",
                        "id": client_id,
                        "x": parsed.get("x", 0),
                        "y": parsed.get("y", 0),
                        "anim": parsed.get("anim", "idle")
                    }))
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast(json.dumps({"type": "player_left", "id": client_id}))
