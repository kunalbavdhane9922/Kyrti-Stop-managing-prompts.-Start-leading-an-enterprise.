from opentelemetry import trace
from app.telemetry.opentelemetry_config import tracer
from app.runtime.graph.models.state_models import DynamicAgentState

class GraphTelemetryInjector:
    """
    Wraps LangGraph execution with deep OpenTelemetry spans.
    Allows the CTO to see exactly how much money each node cost, 
    and how long it took in Jaeger.
    """
    @staticmethod
    def trace_node_execution(node_name: str, state: DynamicAgentState):
        """This would be hooked into LangGraph's on_node_start callbacks."""
        with tracer.start_as_current_span(f"Execute Node: {node_name}") as span:
            span.set_attribute("tenant_id", state.tenant_id)
            span.set_attribute("professional_id", state.professional_id)
            span.set_attribute("task", state.task)
            
            # Find metadata
            meta = next((m for m in state.execution_history if m.node_name == node_name), None)
            if meta:
                span.set_attribute("estimated_cost_usd", meta.estimated_cost)
                if meta.error_trace:
                    span.set_attribute("error", True)
                    span.add_event("Exception", {"trace": meta.error_trace})
