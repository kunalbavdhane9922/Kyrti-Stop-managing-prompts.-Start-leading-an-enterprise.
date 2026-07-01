from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Sovereign Protocol Gateway is Online", "version": settings.VERSION}

from routers import auth, workspace, treasury
from core.ws_gateway import gateway
from fastapi import WebSocket, WebSocketDisconnect

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(workspace.router, prefix=f"{settings.API_V1_STR}/workspace", tags=["workspace"])
app.include_router(treasury.router, prefix=f"{settings.API_V1_STR}/treasury", tags=["treasury"])

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await gateway.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            await gateway.handle_message(client_id, data)
    except WebSocketDisconnect:
        gateway.disconnect(client_id)
        await gateway.broadcast(f'{{"type":"PRESENCE_LEAVE", "client_id":"{client_id}"}}')
