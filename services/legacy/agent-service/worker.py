import asyncio
from temporalio.client import Client
from temporalio.worker import Worker
from app.core.config import settings
from app.runtime.workflows import SAEPWorkflow, execute_agent_task

async def main():
    print(f"Connecting to Temporal at {settings.TEMPORAL_HOST}...")
    try:
        client = await Client.connect(settings.TEMPORAL_HOST)
        
        worker = Worker(
            client,
            task_queue=settings.TEMPORAL_TASK_QUEUE,
            workflows=[SAEPWorkflow],
            activities=[execute_agent_task],
        )
        print(f"Starting Temporal Worker on queue: {settings.TEMPORAL_TASK_QUEUE}")
        await worker.run()
    except Exception as e:
        print(f"Failed to start worker: {e}")

if __name__ == "__main__":
    asyncio.run(main())
