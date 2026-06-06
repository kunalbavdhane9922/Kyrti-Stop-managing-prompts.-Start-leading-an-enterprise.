import asyncio
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from qdrant_client import QdrantClient
import httpx
import os

QDRANT_URL = os.getenv("QDRANT_URL", "http://qdrant:6333")
AI_GATEWAY_URL = os.getenv("AI_GATEWAY_URL", "http://ai-gateway:8000")

# Note: The name 'ExecuteTask' matches the Java @ActivityMethod(name = "ExecuteTask")
@activity.defn(name="ExecuteTask")
async def execute_task(task_id: str, prompt: str) -> str:
    print(f"Received task {task_id} with prompt: {prompt}")
    
    # 1. RAG Memory retrieval using Qdrant (saep-memory)
    # qdrant = QdrantClient(url=QDRANT_URL)
    # search_result = qdrant.search(...)
    
    # 2. Call the AI Gateway to generate the response via Ollama
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{AI_GATEWAY_URL}/api/v1/chat",
                json={
                    "model": "llama3",
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=300.0
            )
            response.raise_for_status()
            result_text = response.json().get("response", "No response generated")
            print(f"Task {task_id} completed successfully.")
            return result_text
        except Exception as e:
            print(f"Failed to execute task {task_id}: {str(e)}")
            return f"Error executing task: {str(e)}"

async def main():
    print("Starting Temporal Worker...")
    client = await Client.connect("temporal:7233")
    worker = Worker(
        client,
        task_queue="AGENT_TASK_QUEUE",
        activities=[execute_task],
    )
    print("Worker is listening on AGENT_TASK_QUEUE")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
