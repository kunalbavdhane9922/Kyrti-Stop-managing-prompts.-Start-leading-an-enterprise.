from fastapi import FastAPI, Response
import uvicorn
import asyncio
from kafka.consumer import start_consumer, stop_consumer
from threading import Thread
import logging
from pythonjsonlogger import jsonlogger
from prometheus_client import make_asgi_app, Counter, Histogram
from config import settings
import contextvars

from context import correlation_id_ctx

# Logging setup
logger = logging.getLogger("saep-agent")
logger.setLevel(logging.INFO)
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(name)s %(correlation_id)s %(message)s')
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

app = FastAPI(title="SAEP Agent Service", description="Digital Professional Runtime", version="1.0.0")

# Mount Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# OpenTelemetry setup
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

resource = Resource(attributes={"service.name": settings.otel_service_name})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint=settings.otel_exporter_otlp_endpoint))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

FastAPIInstrumentor.instrument_app(app)

@app.on_event("startup")
def startup_event():
    logger.info("Initializing saep-agent", extra={"correlation_id": correlation_id_ctx.get()})
    # Start Kafka consumer in background thread
    global consumer_thread
    consumer_thread = Thread(target=start_consumer, daemon=True)
    consumer_thread.start()

@app.on_event("shutdown")
def shutdown_event():
    logger.info("Shutting down saep-agent", extra={"correlation_id": correlation_id_ctx.get()})
    stop_consumer()
    # Wait for graceful drain
    if consumer_thread and consumer_thread.is_alive():
        consumer_thread.join(timeout=10.0)

@app.get("/health/live")
def liveness_probe():
    return {"status": "UP"}

@app.get("/health/ready")
def readiness_probe(response: Response):
    deps = {}
    status = "UP"
    
    # Check DB
    try:
        from models.execution import engine
        with engine.connect() as conn:
            pass
        deps["postgres"] = "UP"
    except Exception:
        deps["postgres"] = "DOWN"
        status = "DOWN"
        
    # Check Memory Service
    try:
        from engine.memory import memory_client
        import httpx
        # Assuming there is a health or base endpoint to check
        httpx.get(f"{memory_client.memory_url}/actuator/health", timeout=2.0)
        deps["memory"] = "UP"
    except Exception:
        deps["memory"] = "DOWN"
        if status == "UP":
            status = "DEGRADED"

    # Check Graph Service
    try:
        from engine.memory import graph_client
        httpx.get(f"{graph_client.graph_url}/health/live", timeout=2.0)
        deps["graph"] = "UP"
    except Exception:
        deps["graph"] = "DOWN"
        if status == "UP":
            status = "DEGRADED"

    # Check Temporal
    # In an async endpoint we could ping, but in sync we check if the host is reachable or just assume based on a quick socket check
    try:
        import socket
        from config import settings
        host, port = settings.temporal_host.split(":")
        with socket.create_connection((host, int(port)), timeout=2.0):
            deps["temporal"] = "UP"
    except Exception:
        deps["temporal"] = "DOWN"
        if status == "UP":
            status = "DEGRADED"
            
    if status == "DOWN":
        response.status_code = 503
            
    return {"status": status, "dependencies": deps}

@app.get("/info")
def info_endpoint():
    import threading
    import psutil
    from kafka.registry import AGENT_REGISTRY
    import os
    
    process = psutil.Process()
    mem_info = process.memory_info()
    
    return {
        "service": "saep-agent",
        "version": "1.0.0",
        "runtime": {
            "active_threads": threading.active_count(),
            "memory_usage_mb": round(mem_info.rss / (1024 * 1024), 2),
            "cpu_percent": process.cpu_percent(),
            "loaded_agents": list(AGENT_REGISTRY.keys()),
            "llmProvider": os.getenv("LLM_PROVIDER", "ollama"),
            "activeModel": os.getenv("OLLAMA_MODEL", "llama3") if os.getenv("LLM_PROVIDER", "ollama") == "ollama" else os.getenv("OPENAI_MODEL", "gpt-4"),
            "embeddingModel": "local-embed"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
