"""
Reputation Analysis Intelligence Agent (LangGraph)

Evaluates the trust and performance reputation for a Digital Professional
by fetching the immutable reputation event ledger from the SAEP workforce service.

V1 Spec (ReputationEngine.md):
    - Reputation Score = Σ weighted events
    - Team Reputation (from team API)
    - Company Reputation (from company API)
    - Trend analysis

Architecture:
    Temporal → Activity → This Agent → saep-workforce API → Reputation Score
"""

import logging
from datetime import datetime, timedelta
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from engine.api_client import (
    fetch_reputation_ledger as api_fetch_ledger,
    fetch_worker_team_and_company,
    fetch_team_reputation,
    fetch_company_reputation,
)

logger = logging.getLogger(__name__)


class ReputationEvent(TypedDict):
    event_type: str
    weight: int
    timestamp: str


class ReputationState(TypedDict):
    tenant_id: str
    worker_id: str
    team_id: str
    company_id: str
    historical_events: List[ReputationEvent]
    reputation_score: int
    team_reputation: int
    company_reputation: int
    reputation_trend: str


def fetch_worker_profile(state: ReputationState) -> dict:
    """
    Fetch the worker's team_id and company_id from saep-workforce API.
    """
    from context import tenant_id_ctx
    tenant_id = tenant_id_ctx.get()
    worker_id = state["worker_id"]

    profile = fetch_worker_team_and_company(tenant_id, worker_id)

    return {
        "tenant_id": tenant_id,
        "team_id": profile.get("teamId", profile.get("team_id", "")),
        "company_id": profile.get("companyId", profile.get("company_id", "")),
    }


def fetch_reputation_events(state: ReputationState) -> dict:
    """
    Fetch the immutable reputation event ledger from saep-workforce API.

    GET /api/v1/reputations/professional/{workerId}/ledger
    Returns list of: { eventType, weight, timestamp }
    """
    tenant_id = state.get("tenant_id", "system")
    worker_id = state["worker_id"]

    raw_events = api_fetch_ledger(tenant_id, worker_id)

    # Normalize field names from Java camelCase to Python
    events = []
    for event in raw_events:
        events.append({
            "event_type": event.get("eventType", event.get("event_type", "Unknown")),
            "weight": event.get("weight", 0),
            "timestamp": event.get("timestamp", event.get("createdAt", "")),
        })

    logger.info(f"Fetched {len(events)} reputation events for worker {worker_id}")
    return {"historical_events": events}


def calculate_reputation_score(state: ReputationState) -> dict:
    """
    Deterministic Reputation Engine:
        Reputation Score = Σ weighted events

    Trend detection:
        - Compare recent 30-day weighted sum vs total weighted sum
        - IMPROVING: recent period contribution is positive and growing
        - DECLINING: recent period contribution is negative
        - STABLE: balanced
    """
    events = state.get("historical_events", [])

    total_score = 0
    recent_score = 0
    cutoff_date = datetime.utcnow() - timedelta(days=30)

    for event in events:
        weight = event.get("weight", 0)
        total_score += weight

        # Parse timestamp for trend analysis
        ts_str = event.get("timestamp", "")
        if ts_str:
            try:
                # Handle ISO formats: 2026-06-01, 2026-06-01T12:00:00, 2026-06-01T12:00:00Z
                ts_clean = ts_str.replace("Z", "+00:00")
                if "T" in ts_clean:
                    event_date = datetime.fromisoformat(ts_clean.split("+")[0])
                else:
                    event_date = datetime.strptime(ts_clean.split("+")[0], "%Y-%m-%d")

                if event_date >= cutoff_date:
                    recent_score += weight
            except (ValueError, TypeError):
                pass

    # Trend determination
    if recent_score > 2:
        trend = "IMPROVING"
    elif recent_score < -2:
        trend = "DECLINING"
    else:
        trend = "STABLE"

    logger.info(
        f"Worker {state['worker_id']} reputation: total={total_score}, "
        f"recent_30d={recent_score}, trend={trend}"
    )

    return {
        "reputation_score": total_score,
        "reputation_trend": trend,
    }


def fetch_aggregate_reputations(state: ReputationState) -> dict:
    """
    Fetch team and company aggregate reputations from saep-workforce API.
    """
    tenant_id = state.get("tenant_id", "system")
    team_id = state.get("team_id", "")
    company_id = state.get("company_id", "")

    team_rep = 0
    company_rep = 0

    if team_id:
        team_data = fetch_team_reputation(tenant_id, team_id)
        team_rep = team_data.get("reputationScore", team_data.get("reputation_score", 0))

    if company_id:
        company_data = fetch_company_reputation(tenant_id, company_id)
        company_rep = company_data.get("reputationScore", company_data.get("reputation_score", 0))

    return {
        "team_reputation": team_rep,
        "company_reputation": company_rep,
    }


def emit_reputation_event(state: ReputationState) -> dict:
    """
    Emit ReputationUpdated event with full context.
    """
    return {
        "event_type": "ReputationUpdated",
        "payload": {
            "worker_id": state["worker_id"],
            "team_id": state.get("team_id", ""),
            "company_id": state.get("company_id", ""),
            "reputation_score": state["reputation_score"],
            "team_reputation": state["team_reputation"],
            "company_reputation": state["company_reputation"],
            "trend": state["reputation_trend"],
            "event_count": len(state.get("historical_events", [])),
        },
    }


def build_reputation_agent():
    workflow = StateGraph(ReputationState)

    workflow.add_node("fetch_worker_profile", fetch_worker_profile)
    workflow.add_node("fetch_reputation_events", fetch_reputation_events)
    workflow.add_node("calculate_reputation_score", calculate_reputation_score)
    workflow.add_node("fetch_aggregate_reputations", fetch_aggregate_reputations)
    workflow.add_node("emit_reputation_event", emit_reputation_event)

    workflow.set_entry_point("fetch_worker_profile")
    workflow.add_edge("fetch_worker_profile", "fetch_reputation_events")
    workflow.add_edge("fetch_reputation_events", "calculate_reputation_score")
    workflow.add_edge("calculate_reputation_score", "fetch_aggregate_reputations")
    workflow.add_edge("fetch_aggregate_reputations", "emit_reputation_event")
    workflow.add_edge("emit_reputation_event", END)

    return workflow.compile()


reputation_agent = build_reputation_agent()
