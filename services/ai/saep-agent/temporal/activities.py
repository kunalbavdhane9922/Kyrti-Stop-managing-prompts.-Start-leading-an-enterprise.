from temporalio import activity
from temporal.dto import (
    ProfessionHealthRequest, ProfessionHealthResult,
    MarketplaceIntelligenceRequest, MarketplaceIntelligenceResult,
    WorkforceScoringRequest, WorkforceScoringResult,
    ReputationAnalysisRequest, ReputationAnalysisResult,
    WorkforcePlanningRequest, WorkforcePlanningResult
)
from services.profession_health_service import profession_health_service
from services.marketplace_intelligence_service import marketplace_intelligence_service
from services.workforce_scoring_service import workforce_scoring_service
from services.reputation_analysis_service import reputation_analysis_service
from services.workforce_planning_service import workforce_planning_service

@activity.defn(name="run_profession_health_agent")
async def run_profession_health_agent(req: ProfessionHealthRequest) -> ProfessionHealthResult:
    """
    Temporal Activity that evaluates profession health.
    Delegates to the ProfessionHealthService to isolate the workflow
    engine from the LangGraph execution specifics.
    """
    return await profession_health_service.evaluate(req)

@activity.defn(name="run_marketplace_intelligence_agent")
async def run_marketplace_intelligence_agent(req: MarketplaceIntelligenceRequest) -> MarketplaceIntelligenceResult:
    return await marketplace_intelligence_service.evaluate(req)

@activity.defn(name="run_workforce_scoring_agent")
async def run_workforce_scoring_agent(req: WorkforceScoringRequest) -> WorkforceScoringResult:
    return await workforce_scoring_service.evaluate(req)

@activity.defn(name="run_reputation_analysis_agent")
async def run_reputation_analysis_agent(req: ReputationAnalysisRequest) -> ReputationAnalysisResult:
    return await reputation_analysis_service.evaluate(req)

@activity.defn(name="run_workforce_planning_agent")
async def run_workforce_planning_agent(req: WorkforcePlanningRequest) -> WorkforcePlanningResult:
    return await workforce_planning_service.evaluate(req)

# List of activities to register with the Temporal Worker
activities = [
    run_profession_health_agent,
    run_marketplace_intelligence_agent,
    run_workforce_scoring_agent,
    run_reputation_analysis_agent,
    run_workforce_planning_agent
]
