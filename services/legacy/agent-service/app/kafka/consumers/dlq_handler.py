import json
from aiokafka import AIOKafkaProducer
from app.core.config import settings

class DLQHandler:
    """
    Quarantines 'Poison Pills' (malformed JSON or invalid schema events)
    into a dedicated DLQ topic so they do not crash the consumer group.
    """
    def __init__(self):
        self.dlq_topic = "workforce.dlq"
        self.producer = None

    async def start(self):
        self.producer = AIOKafkaProducer(
            bootstrap_servers=f"{settings.KAFKA_HOST}:{settings.KAFKA_PORT}",
            acks="all"
        )
        await self.producer.start()

    async def push_to_dlq(self, raw_message: bytes, error_reason: str):
        """Pushes the raw bytes directly to DLQ to preserve the exact corruption state."""
        if not self.producer:
            await self.start()
            
        print(f"[DLQ HANDLER] Quarantining message to {self.dlq_topic}. Reason: {error_reason}")
        
        # We attach the error reason as a Kafka header for debugging
        headers = [
            ("error_reason", error_reason.encode('utf-8'))
        ]
        
        await self.producer.send_and_wait(
            topic=self.dlq_topic,
            value=raw_message,
            headers=headers
        )

    async def stop(self):
        if self.producer:
            await self.producer.stop()
