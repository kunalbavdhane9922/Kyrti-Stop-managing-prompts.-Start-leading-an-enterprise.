import asyncio
from temporalio.client import Client
from temporalio.worker import Worker
from app.core.config import settings

from app.temporal.workflows import AgentExecutionWorkflow
from app.temporal.activities import execute_dynamic_agent_graph

async def run_worker():
    """
    Boots up the Temporal Worker node that listens for Agent Tasks.
    Multiple instances of this worker can be spun up across a Kubernetes cluster.
    """
    print(f"Connecting to Temporal Server at {settings.TEMPORAL_HOST}...")
    client = await Client.connect(settings.TEMPORAL_HOST)
    
    worker = Worker(
        client,
        task_queue=settings.TEMPORAL_TASK_QUEUE,
        workflows=[AgentExecutionWorkflow],
        activities=[execute_dynamic_agent_graph],
    )
    
    print(f"Worker started. Listening on queue: {settings.TEMPORAL_TASK_QUEUE}")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(run_worker())
