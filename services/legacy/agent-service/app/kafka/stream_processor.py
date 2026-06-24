import asyncio
import uuid
from temporalio.client import Client
from pydantic import ValidationError

from app.core.config import settings
from app.temporal.workflows.agent_workflow import MasterAgentWorkflow
from app.kafka.consumers.base_consumer import BaseExactlyOnceConsumer
from app.kafka.schemas.event_schemas import TaskAssignedEvent

class MainStreamProcessor(BaseExactlyOnceConsumer):
    """
    The Central Nervous System Daemon.
    Inherits massive enterprise functionality (Exactly-Once commits, DLQ quarantining).
    Validates incoming JSON against rigid Pydantic event schemas before triggering Temporal.
    """
    def __init__(self):
        super().__init__(
            group_id="saep-core-processor-group",
            topics=["workforce.events"]
        )
        self.temporal_client = None

    async def connect_temporal(self):
        self.temporal_client = await Client.connect(f"{settings.TEMPORAL_HOST}:{settings.TEMPORAL_PORT}")

    async def process(self, payload: dict):
        """
        This method is invoked by the BaseExactlyOnceConsumer ONLY if the payload is valid JSON.
        If this method raises a ValueError, the Base Consumer catches it and routes to DLQ.
        """
        event_type = payload.get("event_type")
        
        if event_type == "TaskAssigned":
            try:
                # 1. Rigid Schema Validation
                event = TaskAssignedEvent(**payload)
            except ValidationError as e:
                # 2. Poison Pill detected! Route to DLQ.
                raise ValueError(f"Schema Validation Failed for TaskAssigned: {e}")
                
            # 3. Safe Execution Phase
            await self._trigger_agent_workflow(event)
            
        elif event_type == "AgentPaused":
            print("[STREAM PROCESSOR] Agent Paused event detected. Handled via DLQ or Metrics.")
        else:
            raise ValueError(f"Unknown Event Type received: {event_type}")

    async def _trigger_agent_workflow(self, event: TaskAssignedEvent):
        if not self.temporal_client:
            await self.connect_temporal()
            
        workflow_id = f"agent-task-{event.tenant_id}-{event.event_id[:8]}"
        print(f"[STREAM PROCESSOR] Validated Event. Triggering Temporal Workflow: {workflow_id}")
        
        # Dispatch the fault-tolerant workflow
        await self.temporal_client.start_workflow(
            MasterAgentWorkflow.run,
            args=[event.tenant_id, event.professional_dna, event.task],
            id=workflow_id,
            task_queue="saep-agent-tasks"
        )
        print(f"[STREAM PROCESSOR] Workflow {workflow_id} dispatched successfully.")

async def start_processor():
    processor = MainStreamProcessor()
    await processor.start()

if __name__ == "__main__":
    asyncio.run(start_processor())
