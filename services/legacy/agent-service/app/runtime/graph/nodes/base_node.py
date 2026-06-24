from abc import ABC, abstractmethod
from typing import Dict, Any
from app.runtime.graph.models.state_models import DynamicAgentState

class BaseNodeStrategy(ABC):
    """
    Abstract Strategy Interface for all dynamic LangGraph nodes.
    Enforces that every node adheres to strict telemetry, cost estimation,
    and state validation rules.
    """
    def __init__(self, node_name: str):
        self.node_name = node_name

    @abstractmethod
    def estimate_token_cost(self, state: DynamicAgentState) -> float:
        """Calculate the exact USD cost before execution to trip circuit breakers."""
        pass

    @abstractmethod
    def execute(self, state: DynamicAgentState) -> Dict[str, Any]:
        """
        The core execution loop of the node.
        Must return a dictionary to update the DynamicAgentState.
        """
        pass

    def __call__(self, state: DynamicAgentState) -> Dict[str, Any]:
        """Wrapper to automatically inject telemetry and DLQ state management."""
        meta = state.log_node_start(self.node_name)
        
        # Circuit Breaker Check
        if state.is_paused:
            print(f"[NODE {self.node_name}] Execution skipped due to DLQ Pause: {state.dlq_reason}")
            return {}

        cost = self.estimate_token_cost(state)
        meta.estimated_cost = cost
        
        try:
            result = self.execute(state)
            state.log_node_finish(meta, status="SUCCESS")
            return result
        except Exception as e:
            print(f"[NODE ERROR] {self.node_name} failed: {e}")
            state.log_node_finish(meta, status="FAILED", error=str(e))
            # Escalate to router for backoff
            return {}
