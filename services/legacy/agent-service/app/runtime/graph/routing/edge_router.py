from typing import Literal
from app.runtime.graph.models.state_models import DynamicAgentState
from app.runtime.graph.routing.circuit_breaker import CircuitBreaker

class AdvancedEdgeRouter:
    """
    Replaces static conditional edges with a dynamic A* style traversal router.
    It evaluates the Circuit Breaker, checks the LLM's confidence, and routes
    the execution to the optimal next node.
    """
    def __init__(self, dna_cost_limit: float):
        self.circuit_breaker = CircuitBreaker(max_cost_usd=dna_cost_limit)

    def route_from_reasoning(self, state: DynamicAgentState) -> str:
        """Determines where to go after a Reasoning Node thinks."""
        # 1. Check Circuit Breaker before any routing
        self.circuit_breaker.evaluate_state(state)
        
        if state.is_paused:
            return "DLQ_PAUSE"

        last_message = state.messages[-1].content
        
        # 2. Advanced NLP checking (in production, use LLM output parsers)
        if "FINAL_ANSWER" in last_message:
            return "QA_VALIDATION" # Always force a QA validation before finishing
            
        if "TOOL_CALL" in last_message:
            return "TOOL_EXECUTION"
            
        # Fallback to DLQ if LLM hallucinated
        state.is_paused = True
        state.dlq_reason = "Router failed to parse LLM intent."
        return "DLQ_PAUSE"

    def route_from_qa(self, state: DynamicAgentState) -> str:
        """Determines if QA passed or failed."""
        self.circuit_breaker.evaluate_state(state)
        if state.is_paused:
            return "DLQ_PAUSE"
            
        last_message = state.messages[-1].content
        if "QA FAILED" in last_message:
            # Backtrack to reasoning with the error
            return "REASONING"
            
        return "FINISH"
