"""
Profession Health Activity Service.

Bridges Temporal Activity → LangGraph Agent execution with proper
context variable propagation and event emission.
"""

import logging
import uuid
from temporal.dto import ProfessionHealthRequest, ProfessionHealthResult
from agents.profession_health import profession_health_agent
from kafka.publisher import event_publisher

logger = logging.getLogger(__name__)


class ProfessionHealthService:
    async def evaluate(self, req: ProfessionHealthRequest) -> ProfessionHealthResult:
        # Set context variables for this Temporal Activity execution thread
        from context import correlation_id_ctx, tenant_id_ctx, worker_id_ctx, task_id_ctx

        task_id = str(uuid.uuid4())
        worker_id = req.worker_id or "system"

        correlation_id_ctx.set(req.correlation_id)
        tenant_id_ctx.set(req.tenant_id)
        worker_id_ctx.set(worker_id)
        task_id_ctx.set(task_id)

        logger.info(
            f"Evaluating profession health for {req.profession_id}",
            extra={"correlation_id": req.correlation_id},
        )

        # Build initial LangGraph state
        initial_state = {
            "tenant_id": req.tenant_id,
            "profession_id": req.profession_id,
            "demand_health_score": 0.0,
            "supply_health_score": 0.0,
            "growth_health_score": 0.0,
            "overall_health_score": 0.0,
            "risk_assessment": "",
            "recommendation_event": {},
        }

        # Emit AgentTaskStarted
        event_publisher.emit_task_started(req.tenant_id, worker_id, task_id)

        try:
            result_state = await profession_health_agent.ainvoke(initial_state)

            health_score = result_state.get("overall_health_score", 0.0)
            risk_level = result_state.get("risk_assessment", "UNKNOWN")

            recommendations = []
            if result_state.get("recommendation_event"):
                rec_event = result_state["recommendation_event"]
                recommendations.append(rec_event)
                event_publisher.emit_recommendation_generated(req.tenant_id, worker_id, rec_event)

            event_publisher.emit_task_completed(req.tenant_id, worker_id, task_id)

            return ProfessionHealthResult(
                health_score=health_score,
                demand_health=result_state.get("demand_health_score", 0.0),
                supply_health=result_state.get("supply_health_score", 0.0),
                growth_health=result_state.get("growth_health_score", 0.0),
                risk_level=risk_level,
                recommendations=recommendations,
            )
        except Exception as e:
            event_publisher.emit_task_failed(req.tenant_id, worker_id, task_id, str(e))
            raise


profession_health_service = ProfessionHealthService()
