import json
import asyncio
from aiokafka import AIOKafkaConsumer
from app.core.config import settings
from temporalio.client import Client

class WorkforceConsumer:
    """
    Listens to the 'workforce.events' topic.
    When the Java Marketplace Service emits a 'ProfessionalHired' or 'TaskAssigned' event,
    this consumer intercepts it and triggers the Temporal orchestration workflow.
    """
    def __init__(self):
        self.consumer = None

    async def start(self):
        self.consumer = AIOKafkaConsumer(
            "workforce.events",
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            group_id="agent-service-group",
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        await self.consumer.start()
        print("[KAFKA CONSUMER] Listening to workforce.events...")
        
        try:
            async for msg in self.consumer:
                await self.process_event(msg.value)
        finally:
            await self.consumer.stop()

    async def process_event(self, event: dict):
        event_type = event.get("event_type")
        
        if event_type == "TaskAssigned":
            print(f"[KAFKA] Received TaskAssigned: {event}")
            # Trigger Temporal Workflow
            client = await Client.connect(settings.TEMPORAL_HOST)
            await client.execute_workflow(
                "AgentExecutionWorkflow",
                args=[
                    event.get("tenant_id"),
                    event.get("professional_dna", {}),
                    event.get("task")
                ],
                id=f"workflow-{event.get('professional_id')}-{event.get('task_id')}",
                task_queue=settings.TEMPORAL_TASK_QUEUE,
            )
            print(f"[KAFKA] Temporal Workflow Triggered for {event.get('professional_id')}")

if __name__ == "__main__":
    consumer = WorkforceConsumer()
    asyncio.run(consumer.start())
