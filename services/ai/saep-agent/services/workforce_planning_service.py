"""
Workforce Planning Activity Service.

Bridges Temporal Activity → LangGraph Agent execution.
"""

import logging
import uuid
from temporal.dto import WorkforcePlanningRequest, WorkforcePlanningResult
from agents.workforce_planning import workforce_planning_agent
from kafka.publisher import event_publisher

logger = logging.getLogger(__name__)


class WorkforcePlanningService:
    async def evaluate(self, request: WorkforcePlanningRequest) -> WorkforcePlanningResult:
        from context import correlation_id_ctx, tenant_id_ctx, worker_id_ctx, task_id_ctx

        task_id = str(uuid.uuid4())
        worker_id = request.worker_id or "system"

        correlation_id_ctx.set(request.correlation_id)
        tenant_id_ctx.set(request.tenant_id)
        worker_id_ctx.set(worker_id)
        task_id_ctx.set(task_id)

        logger.info(
            f"Evaluating workforce planning for {request.profession_id}",
            extra={"correlation_id": request.correlation_id},
        )

        event_publisher.emit_task_started(request.tenant_id, worker_id, task_id)

        try:
            state = await workforce_planning_agent.ainvoke({
                "tenant_id": request.tenant_id,
                "profession_id": request.profession_id,
                "current_workforce": 0,
                "marketplace_demand": 0,
                "capability_gap": 0.0,
                "reputation_trend": "",
                "recommendation_event": {},
            })

            if state.get("recommendation_event"):
                event_publisher.emit_recommendation_generated(
                    request.tenant_id, worker_id, state["recommendation_event"]
                )

            event_publisher.emit_task_completed(request.tenant_id, worker_id, task_id)

            return WorkforcePlanningResult(
                current_workforce=state.get("current_workforce", 0),
                marketplace_demand=state.get("marketplace_demand", 0),
                capability_gap=state.get("capability_gap", 0.0),
                recommendation=state.get("recommendation_event", {}),
            )
        except Exception as e:
            event_publisher.emit_task_failed(request.tenant_id, worker_id, task_id, str(e))
            raise


workforce_planning_service = WorkforcePlanningService()
