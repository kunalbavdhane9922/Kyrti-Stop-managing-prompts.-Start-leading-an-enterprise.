from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from temporalio.client import Client
from app.core.config import settings

from app.runtime.supervisor_graph import SAEPUniversalEngine

router = APIRouter()

class TaskRequest(BaseModel):
    tenant_id: str
    github_repo_url: str
    github_token: str
    task: str
    professional_dna: dict = {}

@router.post("/execute_task_sync")
def execute_task_sync(req: TaskRequest):
    """
    Synchronous endpoint for testing the Universal Engine Master network.
    """
    try:
        agent_graph = SAEPUniversalEngine(
            tenant_id=req.tenant_id,
            github_repo_url=req.github_repo_url,
            github_token=req.github_token,
            professional_dna=req.professional_dna
        )
        
        result = agent_graph.execute_task(req.task)
        
        final_message = "Execution finished, no final message."
        if result and "messages" in result and len(result["messages"]) > 0:
            final_message = result["messages"][-1].content
            
        return {"status": "success", "result": final_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute_task_temporal")
async def execute_task_temporal(req: TaskRequest):
    """
    Production endpoint. Triggers a Temporal workflow.
    """
    try:
        client = await Client.connect(settings.TEMPORAL_HOST)
        workflow_id = f"workflow-{req.tenant_id}-{uuid.uuid4().hex[:8]}"
        result = await client.execute_workflow(
            "SAEPWorkflow",
            {
                "tenant_id": req.tenant_id,
                "github_repo_url": req.github_repo_url,
                "github_token": req.github_token,
                "task": req.task,
                "professional_dna": req.professional_dna
            },
            id=workflow_id,
            task_queue=settings.TEMPORAL_TASK_QUEUE,
        )
        return {"status": "workflow_started", "workflow_id": workflow_id, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
