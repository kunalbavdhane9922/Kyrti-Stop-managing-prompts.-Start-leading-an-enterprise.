import asyncio
import logging
from pythonjsonlogger import jsonlogger
from temporalio.client import Client
from temporalio.worker import Worker
from config import settings
from temporal.activities import activities
from temporal.workflows import (
    DemandForecastingWorkflow,
    ProfessionAnalysisWorkflow,
    WorkforceAnalysisWorkflow,
    WorkerEvaluationWorkflow
)

# Logging setup for worker
logger = logging.getLogger("saep-agent-worker")
logger.setLevel(logging.INFO)
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(name)s %(message)s')
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

# OpenTelemetry setup
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource

resource = Resource(attributes={"service.name": settings.otel_service_name})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint=settings.otel_exporter_otlp_endpoint))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

async def main():
    logger.info(f"Connecting to Temporal at {settings.temporal_host}")
    
    # Connect to the Temporal cluster
    client = await Client.connect(settings.temporal_host)
    
    # Run the worker
    logger.info(f"Starting Temporal Worker on queue '{settings.temporal_task_queue}'")
    worker = Worker(
        client,
        task_queue=settings.temporal_task_queue,
        workflows=[
            DemandForecastingWorkflow,
            ProfessionAnalysisWorkflow,
            WorkforceAnalysisWorkflow,
            WorkerEvaluationWorkflow
        ],
        activities=activities,
    )
    
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
