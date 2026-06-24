import json
from aiokafka import AIOKafkaProducer
from app.core.config import settings

class EventEmitter:
    """
    Produces ecosystem events into Kafka topics.
    Used by the Python AI Service to broadcast cognitive lifecycle events.
    """
    def __init__(self):
        self.producer = None

    async def start(self):
        self.producer = AIOKafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        await self.producer.start()

    async def stop(self):
        if self.producer:
            await self.producer.stop()

    async def emit_agent_started(self, tenant_id: str, professional_id: str, task: str):
        payload = {
            "event_type": "AgentTaskStarted",
            "tenant_id": tenant_id,
            "professional_id": professional_id,
            "task": task
        }
        await self.producer.send_and_wait("workforce.events", payload)
        print(f"[KAFKA PRODUCER] Emitted AgentTaskStarted for {professional_id}")

    async def emit_agent_completed(self, tenant_id: str, professional_id: str, result: str):
        payload = {
            "event_type": "AgentTaskCompleted",
            "tenant_id": tenant_id,
            "professional_id": professional_id,
            "result": result
        }
        await self.producer.send_and_wait("workforce.events", payload)
        print(f"[KAFKA PRODUCER] Emitted AgentTaskCompleted for {professional_id}")

event_emitter = EventEmitter()
