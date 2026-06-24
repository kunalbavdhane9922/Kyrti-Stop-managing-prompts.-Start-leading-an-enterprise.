from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource
from app.telemetry.jaeger_exporter import JaegerConfig

def configure_telemetry(service_name: str = "saep-agent-service"):
    """
    Sets up global OpenTelemetry tracing so every LLM call, memory retrieval,
    and tool execution is logged and visible in the Mission Control dashboards.
    """
    resource = Resource.create({"service.name": service_name})
    tracer_provider = TracerProvider(resource=resource)
    
    # Attach Jaeger
    JaegerConfig.setup_exporter(tracer_provider)
    
    # Set as global
    trace.set_tracer_provider(tracer_provider)
    
    # Note: In a production startup script, we would also call:
    # LangChainInstrumentor().instrument()
    
    print(f"[TELEMETRY] OpenTelemetry configured for service: {service_name}")
    return trace.get_tracer(service_name)

# Expose a global tracer
tracer = configure_telemetry()
