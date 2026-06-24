from agents.marketplace_intelligence import marketplace_agent
from agents.workforce_scoring import workforce_scoring_agent
from agents.reputation_analysis import reputation_agent
from agents.workforce_planning import workforce_planning_agent
from agents.profession_health import profession_health_agent
from engine.graph import agent_executor

# The V1 Agent Registry Maps Kafka Tasks to specific LangGraph Executors
AGENT_REGISTRY = {
    # Intelligence Agents
    "MARKETPLACE_ANALYSIS": marketplace_agent,
    "WORKFORCE_SCORING": workforce_scoring_agent,
    "REPUTATION_CALCULATION": reputation_agent,
    "WORKFORCE_PLANNING": workforce_planning_agent,
    "PROFESSION_HEALTH": profession_health_agent,
    
    # Standard Digital Professional (Task Execution)
    "PROFESSIONAL_TASK": agent_executor
}

def get_agent_for_task(task_type: str):
    return AGENT_REGISTRY.get(task_type, agent_executor) # Default to generic execution
