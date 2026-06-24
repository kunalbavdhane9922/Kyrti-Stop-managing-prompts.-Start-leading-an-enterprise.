from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry import trace
from app.core.config import settings

class JaegerConfig:
    """Configures exporting of spans to the central Jaeger tracing backend."""
    @staticmethod
    def setup_exporter(tracer_provider):
        jaeger_exporter = JaegerExporter(
            agent_host_name=settings.JAEGER_HOST,
            agent_port=settings.JAEGER_PORT,
        )
        
        span_processor = BatchSpanProcessor(jaeger_exporter)
        tracer_provider.add_span_processor(span_processor)
        return tracer_provider
