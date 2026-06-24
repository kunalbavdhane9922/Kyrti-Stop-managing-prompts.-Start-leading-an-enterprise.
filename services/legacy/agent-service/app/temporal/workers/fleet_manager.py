import asyncio
from temporalio.client import Client
from temporalio.worker import Worker
from app.core.config import settings

# Import the massive workflow and activity framework
from app.temporal.workflows.agent_workflow import MasterAgentWorkflow
from app.temporal.workflows.subagent_workflow import QA_SubAgentWorkflow
from app.temporal.activities.agent_activities import execute_dynamic_agent_graph, execute_sub_agent_graph
from app.temporal.activities.saga_compensations import execute_git_revert

class FleetManager:
    """
    Massively scales the Temporal execution nodes. 
    It assigns specific agent workflows to specific hardware clusters via 'Task Queues'.
    """
    def __init__(self):
        self.host = settings.TEMPORAL_HOST
        self.port = settings.TEMPORAL_PORT
        self.client = None

    async def connect(self):
        print(f"[FLEET MANAGER] Connecting to Temporal Cluster at {self.host}:{self.port}...")
        self.client = await Client.connect(f"{self.host}:{self.port}")

    async def boot_agent_fleet(self, task_queue: str, max_concurrent_activities: int = 100):
        """
        Spins up a heavy-duty worker designed for complex reasoning tasks.
        Can run up to `max_concurrent_activities` LangGraphs simultaneously.
        """
        if not self.client:
            await self.connect()
            
        print(f"[FLEET MANAGER] Booting Agent Fleet on Task Queue: {task_queue}")
        
        worker = Worker(
            self.client,
            task_queue=task_queue,
            workflows=[MasterAgentWorkflow, QA_SubAgentWorkflow],
            activities=[execute_dynamic_agent_graph, execute_sub_agent_graph, execute_git_revert],
            max_concurrent_activities=max_concurrent_activities,
            max_concurrent_workflow_tasks=max_concurrent_activities
        )
        
        # Start listening for tasks
        print(f"[FLEET MANAGER] Worker Fleet Online. Waiting for Kafka stream triggers...")
        await worker.run()

async def start_fleet():
    manager = FleetManager()
    
    # In a real environment, we would spin these up in parallel using asyncio.gather
    # One fleet for generic tasks, one for heavy QA parallel tasks
    await asyncio.gather(
        manager.boot_agent_fleet("saep-agent-tasks", max_concurrent_activities=50),
        manager.boot_agent_fleet("saep-qa-tasks", max_concurrent_activities=200)
    )

if __name__ == "__main__":
    asyncio.run(start_fleet())
