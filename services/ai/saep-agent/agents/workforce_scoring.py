"""
Workforce Scoring Intelligence Agent (LangGraph)

Evaluates the capability, skill, and readiness scores for a Digital Professional
by fetching real performance evidence from the SAEP workforce service.

V1 Spec (WorkforceScoring.md):
    - Capability Score (evidence-based)
    - Skill Score
    - Readiness Score
    Rules:
    - Scoring Must Be Evidence Based (Rule 1)
    - Scoring Must Be Explainable (Rule 2)
    - Scoring Must Be Auditable (Rule 3)

Architecture:
    Temporal → Activity → This Agent → saep-workforce API → Score
"""

import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from engine.api_client import fetch_worker_performance

logger = logging.getLogger(__name__)


class ScoringState(TypedDict):
    tenant_id: str
    worker_id: str
    completed_tasks: int
    failed_tasks: int
    skill_validations: int
    knowledge_coverage: float
    learning_progress: float
    peer_validations: int
    capability_score: float
    skill_score: float
    readiness_score: float


def gather_evidence(state: ScoringState) -> dict:
    """
    Fetch real performance evidence from saep-workforce API.

    GET /api/v1/workforce/{workerId}/performance
    Returns task completion stats, skill validations, learning progress.
    """
    from context import tenant_id_ctx
    tenant_id = tenant_id_ctx.get()
    worker_id = state["worker_id"]

    data = fetch_worker_performance(tenant_id, worker_id)

    evidence = {
        "completed_tasks": data.get("completedTasks", data.get("completed_tasks", 0)),
        "failed_tasks": data.get("failedTasks", data.get("failed_tasks", 0)),
        "skill_validations": data.get("skillValidations", data.get("skill_validations", 0)),
        "knowledge_coverage": data.get("knowledgeCoverage", data.get("knowledge_coverage", 0.0)),
        "learning_progress": data.get("learningProgress", data.get("learning_progress", 0.0)),
        "peer_validations": data.get("peerValidations", data.get("peer_validations", 0)),
    }

    logger.info(f"Gathered evidence for worker {worker_id}: {evidence}")
    return evidence


def calculate_capability(state: ScoringState) -> dict:
    """
    Deterministic Capability Score Formula (from WorkforceScoring.md):

        40% Completed Work (max 100 tasks, penalized by failure rate)
        20% Skill Assessments (max 20 validations)
        20% Knowledge Coverage (0.0 to 1.0)
        10% Learning Progress (0.0 to 1.0)
        10% Peer Validation (max 10 validations)

    Score range: 0 to 100
    """
    completed = state.get("completed_tasks", 0)
    failed = state.get("failed_tasks", 0)
    skills = state.get("skill_validations", 0)
    knowledge = state.get("knowledge_coverage", 0.0)
    learning = state.get("learning_progress", 0.0)
    peers = state.get("peer_validations", 0)

    # Success rate penalty: reduce task score proportionally to failures
    total_attempted = completed + failed
    success_rate = completed / total_attempted if total_attempted > 0 else 0.0

    task_component = min(completed / 100.0, 1.0) * success_rate * 40.0
    skill_component = min(skills / 20.0, 1.0) * 20.0
    knowledge_component = min(knowledge, 1.0) * 20.0
    learning_component = min(learning, 1.0) * 10.0
    peer_component = min(peers / 10.0, 1.0) * 10.0

    capability_score = (
        task_component + skill_component + knowledge_component
        + learning_component + peer_component
    )

    # Skill score: normalized to 0-100 scale
    skill_score = min(skills / 20.0, 1.0) * 100.0

    # Readiness score: based on active engagement + current knowledge
    readiness_score = min(
        ((task_component / 40.0) * 0.4 + learning * 0.3 + knowledge * 0.3) * 100.0,
        100.0
    )

    logger.info(
        f"Worker {state['worker_id']} scores: capability={capability_score:.1f}, "
        f"skill={skill_score:.1f}, readiness={readiness_score:.1f}"
    )

    return {
        "capability_score": round(capability_score, 2),
        "skill_score": round(skill_score, 2),
        "readiness_score": round(readiness_score, 2),
    }


def emit_score_event(state: ScoringState) -> dict:
    """
    Emit CapabilityScoreUpdated event with full explainability data.
    Per WorkforceScoring.md: every score must provide Score Factors,
    Signal Sources, Weighting Information.
    """
    return {
        "event_type": "CapabilityScoreUpdated",
        "payload": {
            "worker_id": state["worker_id"],
            "capability_score": state["capability_score"],
            "skill_score": state["skill_score"],
            "readiness_score": state["readiness_score"],
            "scoring_factors": {
                "task_weight": 0.40,
                "skill_weight": 0.20,
                "knowledge_weight": 0.20,
                "learning_weight": 0.10,
                "peer_weight": 0.10,
            },
            "evidence": {
                "completed_tasks": state.get("completed_tasks", 0),
                "failed_tasks": state.get("failed_tasks", 0),
                "skill_validations": state.get("skill_validations", 0),
                "knowledge_coverage": state.get("knowledge_coverage", 0.0),
                "learning_progress": state.get("learning_progress", 0.0),
                "peer_validations": state.get("peer_validations", 0),
            },
        },
    }


def build_scoring_agent():
    workflow = StateGraph(ScoringState)

    workflow.add_node("gather_evidence", gather_evidence)
    workflow.add_node("calculate_capability", calculate_capability)
    workflow.add_node("emit_score_event", emit_score_event)

    workflow.set_entry_point("gather_evidence")
    workflow.add_edge("gather_evidence", "calculate_capability")
    workflow.add_edge("calculate_capability", "emit_score_event")
    workflow.add_edge("emit_score_event", END)

    return workflow.compile()


workforce_scoring_agent = build_scoring_agent()
