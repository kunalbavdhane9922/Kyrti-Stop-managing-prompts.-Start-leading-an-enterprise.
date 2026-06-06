from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx

app = FastAPI(title="SAEP AI Gateway", description="Proxy for self-hosted Ollama", version="1.0.0")

OLLAMA_URL = "http://ollama:11434" # Docker service name from docker-compose

@app.get("/health")
async def health_check():
    return {"status": "up"}

@app.post("/api/chat")
async def ollama_chat_proxy(request: Request):
    """
    Proxies requests securely to the isolated Ollama instance.
    Agents MUST call this endpoint, they are forbidden from calling Ollama directly.
    """
    body = await request.json()
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{OLLAMA_URL}/api/chat", json=body, timeout=60.0)
            return JSONResponse(content=response.json(), status_code=response.status_code)
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Error connecting to Ollama: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
