import asyncio
import json
import random
from typing import Dict
from core.ws_gateway import gateway

class AIOrchestrator:
    def __init__(self):
        # In production, this uses Celery/Redis tasks and an LLM provider (OpenAI)
        self.active_agents: Dict[str, dict] = {}
        self.is_running = False

    def spawn_agent(self, office_id: str, prompt: str):
        agent_id = f"ai_agent_{random.randint(1000, 9999)}"
        self.active_agents[agent_id] = {
            "id": agent_id,
            "office_id": office_id,
            "state": "IDLE",
            "x": 10.0,
            "y": 10.0,
            "prompt": prompt
        }
        return agent_id

    async def _worker_loop(self):
        while self.is_running:
            for agent_id, agent in self.active_agents.items():
                if agent["state"] == "IDLE":
                    # Simulate an LLM decision to move and work
                    agent["state"] = "WORKING"
                    agent["x"] += random.choice([-1.0, 0.0, 1.0])
                    agent["y"] += random.choice([-1.0, 0.0, 1.0])
                    
                    # Push movement into the standard WebSocket Gateway
                    # This guarantees human players and AI players share the exact same sync logic
                    await gateway.broadcast(json.dumps({
                        "type": "TICK_UPDATE",
                        "updates": [
                            [agent_id, agent["x"], agent["y"], 2] # 2 = working animation state
                        ]
                    }))
                elif agent["state"] == "WORKING":
                    if random.random() > 0.8:
                        agent["state"] = "IDLE"
            
            await asyncio.sleep(2.0) # Tick every 2 seconds for AI decisions

    def start(self):
        self.is_running = True
        asyncio.create_task(self._worker_loop())

    def stop(self):
        self.is_running = False

orchestrator = AIOrchestrator()
