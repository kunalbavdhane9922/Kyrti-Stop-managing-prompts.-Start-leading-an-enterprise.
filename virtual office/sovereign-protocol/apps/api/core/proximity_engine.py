import math
from typing import Dict, List, Tuple
from core.ws_gateway import gateway
import json

class ProximityEngine:
    def __init__(self, interaction_radius: float = 150.0):
        self.interaction_radius = interaction_radius
        self.active_rooms: Dict[str, set] = {}

    def calculate_distance(self, p1: Tuple[float, float], p2: Tuple[float, float]) -> float:
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

    async def evaluate_proximity(self, client_id: str, x: float, y: float, all_players: Dict[str, dict]):
        """
        Evaluates distances between the moving client and all other clients.
        If distance < radius, triggers a Jitsi WebRTC room connection via WebSocket.
        """
        nearby_clients = []
        for other_id, other_pos in all_players.items():
            if other_id == client_id:
                continue
            
            dist = self.calculate_distance((x, y), (other_pos["x"], other_pos["y"]))
            if dist <= self.interaction_radius:
                nearby_clients.append(other_id)
        
        if nearby_clients:
            # Generate a deterministic room name based on sorted IDs to ensure both clients join the same room
            sorted_group = sorted([client_id] + nearby_clients)
            room_id = f"spatial_room_{'_'.join(sorted_group[:2])}" # Simplify for MVP: pair nearest 2
            
            # Notify clients to mount the Jitsi Iframe
            await gateway.broadcast(json.dumps({
                "type": "PROXIMITY_ENTER",
                "room_id": room_id,
                "participants": sorted_group
            }))
        else:
            # Notify client to unmount Jitsi if they walk away
            await gateway.broadcast(json.dumps({
                "type": "PROXIMITY_LEAVE",
                "client_id": client_id
            }))

proximity_engine = ProximityEngine()
