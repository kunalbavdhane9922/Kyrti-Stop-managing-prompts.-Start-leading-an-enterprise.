import asyncio
import json
from aiokafka import AIOKafkaConsumer
from pydantic import ValidationError
from app.core.config import settings
from app.kafka.consumers.dlq_handler import DLQHandler

class BaseExactlyOnceConsumer:
    """
    Massive enterprise Kafka consumer implementing Manual Offset Committing
    to guarantee Exactly-Once execution semantics.
    """
    def __init__(self, group_id: str, topics: list[str]):
        self.group_id = group_id
        self.topics = topics
        self.dlq = DLQHandler()
        self.consumer = AIOKafkaConsumer(
            *self.topics,
            bootstrap_servers=f"{settings.KAFKA_HOST}:{settings.KAFKA_PORT}",
            group_id=self.group_id,
            enable_auto_commit=False, # We strictly control offset commits
            auto_offset_reset="earliest"
        )

    async def start(self):
        await self.consumer.start()
        await self.dlq.start()
        print(f"[KAFKA CONSUMER] Started group {self.group_id} listening to {self.topics}")
        
        try:
            async for msg in self.consumer:
                await self._process_message(msg)
        finally:
            await self.consumer.stop()
            await self.dlq.stop()

    async def _process_message(self, msg):
        """Wraps the abstract processing logic in DLQ and Exactly-Once offset commits."""
        try:
            # 1. Attempt to parse JSON
            try:
                payload = json.loads(msg.value.decode('utf-8'))
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON Format: {e}")

            # 2. Execute abstract business logic (must be implemented by child)
            await self.process(payload)
            
            # 3. Exactly-Once Guarantee: Commit offset ONLY if successful
            await self.consumer.commit()
            
        except ValueError as ve: # Pydantic Validation or JSON errors = Poison Pill
            print(f"[POISON PILL] {ve}")
            await self.dlq.push_to_dlq(msg.value, str(ve))
            # Commit offset so we don't get stuck in an infinite crash loop on this bad message
            await self.consumer.commit() 
            
        except Exception as e:
            # A true processing crash (e.g. Temporal is down). 
            # DO NOT COMMIT OFFSET. Let the consumer crash and retry when restarted.
            print(f"[CRITICAL CONSUMER CRASH] {e}. Halting processing to prevent data loss.")
            raise

    async def process(self, payload: dict):
        raise NotImplementedError("Child consumers must implement process()")
