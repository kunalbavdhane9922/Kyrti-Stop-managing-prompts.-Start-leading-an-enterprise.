import time
from app.runtime.graph.models.state_models import DynamicAgentState

class CircuitBreaker:
    """
    Monitors execution state across the DAG to prevent infinite loops and budget overruns.
    If a circuit trips, the graph is gracefully paused (DLQ) rather than crashing.
    """
    def __init__(self, max_cost_usd: float = 10.0, max_retries: int = 3):
        self.max_cost_usd = max_cost_usd
        self.max_retries = max_retries

    def evaluate_state(self, state: DynamicAgentState):
        if state.is_paused:
            return

        # 1. Budget Circuit
        total_cost = sum(m.estimated_cost for m in state.execution_history)
        if total_cost > self.max_cost_usd:
            state.is_paused = True
            state.dlq_reason = f"BUDGET OVERRUN: Exceeded ${self.max_cost_usd}"
            print(f"[CIRCUIT BREAKER] {state.dlq_reason}")
            return

        # 2. Retry Circuit
        recent_errors = state.get_recent_errors()
        if len(recent_errors) >= self.max_retries:
            state.is_paused = True
            state.dlq_reason = f"RETRY LIMIT EXCEEDED: {recent_errors[-1]}"
            print(f"[CIRCUIT BREAKER] {state.dlq_reason}")
            return

        # 3. Time Circuit
        # Example logic for preventing an agent from running for 24+ hours
        # Not implemented for brevity
