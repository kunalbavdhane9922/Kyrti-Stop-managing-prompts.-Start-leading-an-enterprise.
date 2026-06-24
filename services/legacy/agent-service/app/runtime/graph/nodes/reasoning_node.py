import time
import asyncio
from typing import Dict, Any, List
from langchain_core.messages import AIMessage

from app.runtime.graph.nodes.base_node import BaseNodeStrategy
from app.runtime.graph.models.state_models import DynamicAgentState
from app.memory.caching.semantic_cache import SemanticCache
from app.gateway.router.gateway_controller import GatewayController
from app.gateway.security.rate_limiter import tenant_rate_limiter
from app.gateway.filters.hallucination_guard import HallucinationGuard

# Massive Telemetry Integration
from app.telemetry.core.tracer import tracer
from app.telemetry.metrics.exporter import PrometheusMetrics
from app.api.live_stream import stream_manager

class ReasoningNodeStrategy(BaseNodeStrategy):
    """
    Highly complex LLM reasoning node.
    Now fully instrumented. Every execution generates a distributed trace,
    updates the Prometheus cost dashboard, and streams live JSON to the Next.js UI.
    """
    def __init__(self, role_name: str, skills: List[str], traits: List[str]):
        super().__init__(node_name=f"Reasoning_{role_name.replace(' ', '')}")
        self.role_name = role_name
        self.skills = skills
        self.traits = traits
        
        self.cache = SemanticCache()
        self.gateway = GatewayController()

    def estimate_token_cost(self, state: DynamicAgentState) -> float:
        history_length = sum(len(m.content) for m in state.messages)
        estimated_tokens = (history_length / 4) + 500
        return estimated_tokens * 0.00002

    def execute(self, state: DynamicAgentState) -> Dict[str, Any]:
        # Wrap the entire execution in an OpenTelemetry Span
        with tracer.start_as_current_span(self.node_name) as span:
            span.set_attribute("tenant_id", state.tenant_id)
            span.set_attribute("agent_role", self.role_name)
            
            start_time = time.time()
            recent_context = state.messages[-1].content if state.messages else state.task
            estimated_cost = self.estimate_token_cost(state)
            
            tenant_rate_limiter.check_rate_limit(state.tenant_id)
            
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            # Broadcast starting status to UI
            loop.run_until_complete(
                stream_manager.broadcast_brainwave(state.tenant_id, self.role_name, "Initializing thought process...", self.node_name)
            )
            
            cached_answer = loop.run_until_complete(
                self.cache.check_cache(state.tenant_id, recent_context, estimated_cost)
            )
            
            if cached_answer:
                span.set_attribute("cache_hit", True)
                loop.run_until_complete(stream_manager.broadcast_brainwave(state.tenant_id, self.role_name, "Cache Hit. Bypassing GPU.", self.node_name))
                loop.close()
                return {"messages": [AIMessage(content=f"[CACHED] {cached_answer}")]}

            span.set_attribute("cache_hit", False)
            
            system_prompt = f"Role: {self.role_name}\nSkills: {', '.join(self.skills)}\nAnalyze task and execute tool."
            history = "\n".join([f"{m.type}: {m.content}" for m in state.messages[-10:]])
            full_prompt = f"{system_prompt}\n\nCurrent State:\n{history}\n\nAction:"

            response = ""
            for attempt in range(3):
                try:
                    # Export live Prometheus metrics before calling the API
                    PrometheusMetrics.record_cost(state.tenant_id, self.role_name, estimated_cost, int(estimated_cost / 0.00002))
                    
                    raw_response = self.gateway.invoke_llm(full_prompt)
                    response = HallucinationGuard.validate_and_sanitize(raw_response)
                    break
                except ValueError as ve:
                    span.record_exception(ve)
                    if attempt == 2:
                        response = f"CRITICAL HALLUCINATION ERROR: {ve}"
            
            if "FINAL_ANSWER" not in response and "CRITICAL" not in response:
                loop.run_until_complete(self.cache.store_cache(state.tenant_id, recent_context, response))
                
            # Broadcast the final thought to the UI
            loop.run_until_complete(
                stream_manager.broadcast_brainwave(state.tenant_id, self.role_name, response, self.node_name)
            )
            loop.close()
            
            execution_time = time.time() - start_time
            span.set_attribute("latency_seconds", execution_time)
            
            return {"messages": [AIMessage(content=response)]}
