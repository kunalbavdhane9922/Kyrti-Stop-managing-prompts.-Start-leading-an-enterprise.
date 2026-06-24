from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.resources import Resource

# In production, this points to a Jaeger or OTLP collector
# from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

class TelemetryTracer:
    """
    Massive Distributed Tracing Provider.
    Injects a Trace ID that physically follows a request from the Next.js Frontend
    -> FastAPI -> Kafka -> Temporal Worker -> LangGraph Node -> Docker Sandbox.
    """
    @staticmethod
    def setup_tracing(service_name: str = "saep-orchestrator"):
        resource = Resource.create({"service.name": service_name})
        provider = TracerProvider(resource=resource)
        
        # For development, we export to Console. In production, to Jaeger.
        processor = BatchSpanProcessor(ConsoleSpanExporter())
        provider.add_span_processor(processor)
        
        trace.set_tracer_provider(provider)
        print(f"[TELEMETRY] OpenTelemetry Tracing initialized for {service_name}.")
        return trace.get_tracer(service_name)

# Global tracer instance
tracer = TelemetryTracer.setup_tracing()
