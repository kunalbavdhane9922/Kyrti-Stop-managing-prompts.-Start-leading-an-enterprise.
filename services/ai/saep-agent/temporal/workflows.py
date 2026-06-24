"""
Temporal Workflow Definitions for SAEP Intelligence Workflows.

These workflows coordinate AI agent activities through Temporal's durable
execution engine. Each workflow delegates to LangGraph-powered activities
for the actual intelligence computation.

Architecture (from Temporal.md):
    Temporal Orchestrates. LangGraph Executes.

V1 Workflows (from Temporal.md Intelligence Workflow Examples):
    - Demand Forecasting
    - Profession Analysis
    - Workforce Analysis
    - Worker Evaluation (scoring + reputation)

Rules enforced:
    - All Long Running Processes Must Use Temporal (Rule 1)
    - Workflows Must Be Recoverable (Rule 2)
    - Workflows Must Be Auditable (Rule 3)
    - Workflow State Must Survive Failures (Rule 4)
"""

from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from temporal.dto import (
        ProfessionHealthRequest, ProfessionHealthResult,
        MarketplaceIntelligenceRequest, MarketplaceIntelligenceResult,
        WorkforceScoringRequest, WorkforceScoringResult,
        ReputationAnalysisRequest, ReputationAnalysisResult,
        WorkforcePlanningRequest, WorkforcePlanningResult,
    )


# Standard retry policy for all intelligence activities
# Per Temporal.md Rule 2: "Workflows Must Be Recoverable"
_ACTIVITY_RETRY_POLICY = RetryPolicy(
    initial_interval=timedelta(seconds=1),
    backoff_coefficient=2.0,
    maximum_interval=timedelta(seconds=30),
    maximum_attempts=3,
)

# Standard activity timeout
_ACTIVITY_TIMEOUT = timedelta(minutes=5)


@workflow.defn
class DemandForecastingWorkflow:
    """
    Analyzes marketplace demand/supply gaps and generates population plans.
    Maps to Temporal.md: "Demand Forecasting" intelligence workflow.
    """

    @workflow.run
    async def run(self, request: MarketplaceIntelligenceRequest) -> MarketplaceIntelligenceResult:
        marketplace_result = await workflow.execute_activity(
            "run_marketplace_intelligence_agent",
            request,
            start_to_close_timeout=_ACTIVITY_TIMEOUT,
            retry_policy=_ACTIVITY_RETRY_POLICY,
        )
        return marketplace_result


@workflow.defn
class ProfessionAnalysisWorkflow:
    """
    Evaluates profession health (demand/supply/growth/risk).
    Maps to Temporal.md: "Profession Analysis" intelligence workflow.
    """

    @workflow.run
    async def run(self, request: ProfessionHealthRequest) -> ProfessionHealthResult:
        health_result = await workflow.execute_activity(
            "run_profession_health_agent",
            request,
            start_to_close_timeout=_ACTIVITY_TIMEOUT,
            retry_policy=_ACTIVITY_RETRY_POLICY,
        )
        return health_result


@workflow.defn
class WorkforceAnalysisWorkflow:
    """
    Analyzes workforce supply vs demand and generates planning recommendations.
    Maps to Temporal.md: "Workforce Analysis" intelligence workflow.
    """

    @workflow.run
    async def run(self, request: WorkforcePlanningRequest) -> WorkforcePlanningResult:
        planning_result = await workflow.execute_activity(
            "run_workforce_planning_agent",
            request,
            start_to_close_timeout=_ACTIVITY_TIMEOUT,
            retry_policy=_ACTIVITY_RETRY_POLICY,
        )
        return planning_result


@workflow.defn
class WorkerEvaluationWorkflow:
    """
    Evaluates a Digital Professional's capability score and reputation.
    Combines two sequential activities: scoring → reputation analysis.
    Maps to Temporal.md: "Recommendation Generation" intelligence workflow.
    """

    @workflow.run
    async def run(self, tenant_id: str, worker_id: str) -> dict:
        # 1. Score the workforce capability
        score_req = WorkforceScoringRequest(
            tenant_id=tenant_id,
            worker_id=worker_id,
        )
        score_result = await workflow.execute_activity(
            "run_workforce_scoring_agent",
            score_req,
            start_to_close_timeout=_ACTIVITY_TIMEOUT,
            retry_policy=_ACTIVITY_RETRY_POLICY,
        )

        # 2. Analyze the reputation
        rep_req = ReputationAnalysisRequest(
            tenant_id=tenant_id,
            worker_id=worker_id,
        )
        rep_result = await workflow.execute_activity(
            "run_reputation_analysis_agent",
            rep_req,
            start_to_close_timeout=_ACTIVITY_TIMEOUT,
            retry_policy=_ACTIVITY_RETRY_POLICY,
        )

        return {
            "worker_id": worker_id,
            "capability_score": score_result.capability_score,
            "skill_score": score_result.skill_score,
            "readiness_score": score_result.readiness_score,
            "reputation_score": rep_result.reputation_score,
            "team_reputation": rep_result.team_reputation,
            "company_reputation": rep_result.company_reputation,
            "reputation_trend": rep_result.trend,
        }
