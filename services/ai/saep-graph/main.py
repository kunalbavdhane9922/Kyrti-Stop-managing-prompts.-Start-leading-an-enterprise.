from fastapi import FastAPI, Response
from api.routes import router
from database.neo4j_client import neo4j_client
from config import settings
import uvicorn
import logging
from pythonjsonlogger import jsonlogger
from prometheus_client import make_asgi_app, Counter, Histogram
import time
import os
import contextvars

# Correlation ID Context
correlation_id_ctx = contextvars.ContextVar("correlation_id", default="system")

# Logging setup
logger = logging.getLogger("saep-graph")
logger.setLevel(logging.INFO)
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(name)s %(correlation_id)s %(message)s')
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

# Metrics setup
graph_queries_total = Counter("graph_queries_total", "Total graph queries executed")
graph_query_duration_seconds = Histogram("graph_query_duration_seconds", "Duration of graph queries")

app = FastAPI(title="SAEP Graph Service", description="Knowledge Graph operations for SAEP", version="1.0.0")

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
async def startup_event():
    logger.info("Initializing saep-graph", extra={"correlation_id": correlation_id_ctx.get()})
    from tenacity import retry, wait_exponential, stop_after_attempt
    
    @retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(5))
    def connect_neo4j():
        neo4j_client.connect()
        logger.info("Connected to Neo4j successfully", extra={"correlation_id": correlation_id_ctx.get()})
        
    connect_neo4j()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down saep-graph", extra={"correlation_id": correlation_id_ctx.get()})
    neo4j_client.close()

app.include_router(router, prefix="/api/v1/graph")

@app.get("/health/live")
def liveness_probe():
    return {"status": "UP"}

@app.get("/health/ready")
def readiness_probe(response: Response):
    deps = {"postgres": "UP"} # Placeholder for postgres if added later
    status = "UP"
    
    try:
        # Simple query to check Neo4j
        neo4j_client.run_query("RETURN 1", {})
        deps["neo4j"] = "UP"
    except Exception:
        deps["neo4j"] = "DOWN"
        status = "DOWN" # Critical
        response.status_code = 503
        
    # Example for optional dependency
    try:
        # OTEL check could go here
        deps["otel"] = "UP"
    except Exception:
        deps["otel"] = "DOWN"
        if status == "UP":
            status = "DEGRADED"
            
    return {"status": status, "dependencies": deps}

@app.get("/info")
def info_endpoint():
    import threading
    import psutil
    
    process = psutil.Process()
    mem_info = process.memory_info()
    
    return {
        "service": "saep-graph",
        "version": "1.0.0",
        "runtime": {
            "active_threads": threading.active_count(),
            "memory_usage_mb": round(mem_info.rss / (1024 * 1024), 2),
            "cpu_percent": process.cpu_percent(),
            "graphProvider": "neo4j"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
