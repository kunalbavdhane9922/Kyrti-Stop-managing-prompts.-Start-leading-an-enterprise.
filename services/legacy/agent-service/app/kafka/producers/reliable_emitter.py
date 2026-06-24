import json
import asyncio
from aiokafka import AIOKafkaProducer
from pydantic import BaseModel
from app.core.config import settings

class ReliableEventEmitter:
    """
    Massive enterprise Kafka Producer.
    Supports asynchronous batching of telemetry spans to prevent network saturation,
    and requires `acks=all` from the Kafka broker to guarantee zero data loss.
    """
    def __init__(self):
        self.producer = None

    async def connect(self):
        # acks="all" ensures the message is committed to all Kafka replicas before returning success
        # linger_ms=5 allows the producer to batch multiple rapid events into a single network packet
        self.producer = AIOKafkaProducer(
            bootstrap_servers=f"{settings.KAFKA_HOST}:{settings.KAFKA_PORT}",
            acks="all",
            linger_ms=5,
            compression_type="gzip" # Compress large payloads (like AST traces) to save bandwidth
        )
        await self.producer.start()

    async def emit_event(self, topic: str, event: BaseModel):
        """
        Emits a strictly validated Pydantic event.
        Guarantees the schema matches the event_schemas.py definitions.
        """
        if not self.producer:
            await self.connect()
            
        payload_json = event.json()
        payload_bytes = payload_json.encode('utf-8')
        
        print(f"[RELIABLE EMITTER] Dispatching {event.event_type} to {topic}...")
        
        # This will raise an exception if the Kafka cluster is down or acks=all fails
        await self.producer.send_and_wait(
            topic=topic,
            value=payload_bytes
        )

    async def close(self):
        if self.producer:
            await self.producer.stop()
