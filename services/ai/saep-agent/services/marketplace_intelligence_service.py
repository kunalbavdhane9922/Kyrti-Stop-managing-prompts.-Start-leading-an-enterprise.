"""
Marketplace Intelligence Activity Service.

Bridges Temporal Activity → LangGraph Agent execution.
"""

import logging
import uuid
from temporal.dto import MarketplaceIntelligenceRequest, MarketplaceIntelligenceResult
from agents.marketplace_intelligence import marketplace_agent
from kafka.publisher import event_publisher

logger = logging.getLogger(__name__)


class MarketplaceIntelligenceService:
    async def evaluate(self, request: MarketplaceIntelligenceRequest) -> MarketplaceIntelligenceResult:
        from context import correlation_id_ctx, tenant_id_ctx, worker_id_ctx, task_id_ctx

        task_id = str(uuid.uuid4())
        worker_id = request.worker_id or "system"

        correlation_id_ctx.set(request.correlation_id)
        tenant_id_ctx.set(request.tenant_id)
        worker_id_ctx.set(worker_id)
        task_id_ctx.set(task_id)

        logger.info(
            f"Evaluating marketplace intelligence for {request.profession_id}",
            extra={"correlation_id": request.correlation_id},
        )

        event_publisher.emit_task_started(request.tenant_id, worker_id, task_id)

        try:
            state = await marketplace_agent.ainvoke({
                "tenant_id": request.tenant_id,
                "profession_id": request.profession_id,
                "demand_metrics": {},
                "supply_metrics": {},
                "gap_analysis": {},
                "forecast": {},
                "population_plan": {},
                "recommendation_event": {},
            })

            recommendations = []
            if state.get("recommendation_event"):
                rec_event = state["recommendation_event"]
                recommendations.append(rec_event)
                event_publisher.emit_recommendation_generated(request.tenant_id, worker_id, rec_event)

            event_publisher.emit_task_completed(request.tenant_id, worker_id, task_id)

            return MarketplaceIntelligenceResult(
                demand_metrics=state.get("demand_metrics", {}),
                supply_metrics=state.get("supply_metrics", {}),
                gap_analysis=state.get("gap_analysis", {}),
                forecast=state.get("forecast", {}),
                population_plan=state.get("population_plan", {}),
                recommendations=recommendations,
            )
        except Exception as e:
            event_publisher.emit_task_failed(request.tenant_id, worker_id, task_id, str(e))
            raise


marketplace_intelligence_service = MarketplaceIntelligenceService()
