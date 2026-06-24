"""
Reputation Analysis Activity Service.

Bridges Temporal Activity → LangGraph Agent execution.
"""

import logging
import uuid
from temporal.dto import ReputationAnalysisRequest, ReputationAnalysisResult
from agents.reputation_analysis import reputation_agent
from kafka.publisher import event_publisher

logger = logging.getLogger(__name__)


class ReputationAnalysisService:
    async def evaluate(self, request: ReputationAnalysisRequest) -> ReputationAnalysisResult:
        from context import correlation_id_ctx, tenant_id_ctx, worker_id_ctx, task_id_ctx

        task_id = str(uuid.uuid4())
        worker_id = request.worker_id

        correlation_id_ctx.set(request.correlation_id)
        tenant_id_ctx.set(request.tenant_id)
        worker_id_ctx.set(worker_id)
        task_id_ctx.set(task_id)

        logger.info(
            f"Evaluating reputation analysis for {request.worker_id}",
            extra={"correlation_id": request.correlation_id},
        )

        event_publisher.emit_task_started(request.tenant_id, worker_id, task_id)

        try:
            state = await reputation_agent.ainvoke({
                "tenant_id": request.tenant_id,
                "worker_id": request.worker_id,
                "team_id": "",
                "company_id": "",
                "historical_events": [],
                "reputation_score": 0,
                "team_reputation": 0,
                "company_reputation": 0,
                "reputation_trend": "UNKNOWN",
            })

            event_publisher.emit_task_completed(request.tenant_id, worker_id, task_id)

            return ReputationAnalysisResult(
                reputation_score=state.get("reputation_score", 0),
                team_reputation=state.get("team_reputation", 0),
                company_reputation=state.get("company_reputation", 0),
                trend=state.get("reputation_trend", "UNKNOWN"),
            )
        except Exception as e:
            event_publisher.emit_task_failed(request.tenant_id, worker_id, task_id, str(e))
            raise


reputation_analysis_service = ReputationAnalysisService()
