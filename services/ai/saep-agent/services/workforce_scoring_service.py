"""
Workforce Scoring Activity Service.

Bridges Temporal Activity → LangGraph Agent execution.
"""

import logging
import uuid
from temporal.dto import WorkforceScoringRequest, WorkforceScoringResult
from agents.workforce_scoring import workforce_scoring_agent
from kafka.publisher import event_publisher

logger = logging.getLogger(__name__)


class WorkforceScoringService:
    async def evaluate(self, request: WorkforceScoringRequest) -> WorkforceScoringResult:
        from context import correlation_id_ctx, tenant_id_ctx, worker_id_ctx, task_id_ctx

        task_id = str(uuid.uuid4())
        worker_id = request.worker_id

        correlation_id_ctx.set(request.correlation_id)
        tenant_id_ctx.set(request.tenant_id)
        worker_id_ctx.set(worker_id)
        task_id_ctx.set(task_id)

        logger.info(
            f"Evaluating workforce scoring for {request.worker_id}",
            extra={"correlation_id": request.correlation_id},
        )

        event_publisher.emit_task_started(request.tenant_id, worker_id, task_id)

        try:
            state = await workforce_scoring_agent.ainvoke({
                "tenant_id": request.tenant_id,
                "worker_id": request.worker_id,
                "completed_tasks": 0,
                "failed_tasks": 0,
                "skill_validations": 0,
                "knowledge_coverage": 0.0,
                "learning_progress": 0.0,
                "peer_validations": 0,
                "capability_score": 0.0,
                "skill_score": 0.0,
                "readiness_score": 0.0,
            })

            event_publisher.emit_task_completed(request.tenant_id, worker_id, task_id)

            return WorkforceScoringResult(
                capability_score=state.get("capability_score", 0.0),
                skill_score=state.get("skill_score", 0.0),
                readiness_score=state.get("readiness_score", 0.0),
                evidence={
                    "completed_tasks": state.get("completed_tasks", 0),
                    "failed_tasks": state.get("failed_tasks", 0),
                    "skill_validations": state.get("skill_validations", 0),
                    "knowledge_coverage": state.get("knowledge_coverage", 0.0),
                    "learning_progress": state.get("learning_progress", 0.0),
                    "peer_validations": state.get("peer_validations", 0),
                },
            )
        except Exception as e:
            event_publisher.emit_task_failed(request.tenant_id, worker_id, task_id, str(e))
            raise


workforce_scoring_service = WorkforceScoringService()
