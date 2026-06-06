from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx

app = FastAPI(title="SAEP Agent Service", description="LangGraph execution environment", version="1.0.0")

AI_GATEWAY_URL = "http://ai-gateway:8000" # Docker service name

class TaskRequest(BaseModel):
    task: str
    tenant_id: str
    profession_id: str

@app.get("/health")
async def health_check():
    return {"status": "up"}

@app.post("/api/v1/agents/execute")
async def execute_agent_task(request: TaskRequest):
    """
    Executes a LangGraph workflow. The agent must respect the tenant_id 
    and communicate with Ollama ONLY via the AI_GATEWAY_URL.
    """
    # Placeholder for actual LangGraph execution
    # In full implementation, this will initialize a LangGraph state machine,
    # bind the required tools based on profession_id, and execute the task.
    
    return {
        "status": "success",
        "result": f"Executed '{request.task}' for tenant {request.tenant_id} as profession {request.profession_id}",
        "gateway_used": AI_GATEWAY_URL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
