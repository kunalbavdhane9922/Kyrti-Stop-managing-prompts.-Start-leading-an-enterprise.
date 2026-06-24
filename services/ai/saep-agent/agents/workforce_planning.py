"""
Workforce Planning Intelligence Agent (LangGraph)

Evaluates current workforce supply vs marketplace demand and generates
planning recommendations by calling real SAEP APIs.

V1 Spec (from Temporal.md Intelligence Workflow Examples):
    - Demand Forecasting
    - Workforce Analysis
    - Recommendation Generation

Architecture:
    Temporal → Activity → This Agent → saep-marketplace + saep-workforce APIs → Recommendation
"""

import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from engine.api_client import (
    fetch_marketplace_demand,
    fetch_marketplace_supply,
    fetch_workforce_count,
)

logger = logging.getLogger(__name__)


class WorkforcePlanningState(TypedDict):
    tenant_id: str
    profession_id: str
    current_workforce: int
    marketplace_demand: int
    capability_gap: float
    reputation_trend: str
    recommendation_event: dict


def aggregate_signals(state: WorkforcePlanningState) -> dict:
    """
    Fetch real workforce and demand signals from SAEP APIs.
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    # Fetch demand data from marketplace
    demand_data = fetch_marketplace_demand(tenant_id, profession_id)
    open_tasks = demand_data.get("openTasks", demand_data.get("open_tasks", 0))
    hiring_requests = demand_data.get("hiringRequests", demand_data.get("hiring_requests", 0))
    total_demand = open_tasks + hiring_requests

    # Fetch supply data from marketplace
    supply_data = fetch_marketplace_supply(tenant_id, profession_id)
    active_professionals = supply_data.get("activeProfessionals", supply_data.get("active_professionals", 0))
    idle_professionals = supply_data.get("idleProfessionals", supply_data.get("idle_professionals", 0))
    total_supply = active_professionals + idle_professionals

    # Fetch workforce count from workforce service (cross-reference)
    count_data = fetch_workforce_count(tenant_id, profession_id)
    workforce_count = count_data.get("count", count_data.get("total", total_supply))

    # Capability gap: difference between demand requirements and available capability
    if total_demand > 0 and total_supply > 0:
        gap = max(0.0, 1.0 - (total_supply / total_demand))
    elif total_demand > 0:
        gap = 1.0  # 100% gap — no supply at all
    else:
        gap = 0.0  # No demand

    # Reputation trend from the supply data (if provided)
    reputation_trend = supply_data.get("reputationTrend", supply_data.get("reputation_trend", "UNKNOWN"))

    logger.info(
        f"Planning signals for {profession_id}: demand={total_demand}, "
        f"supply={total_supply}, workforce={workforce_count}, gap={gap:.2f}"
    )

    return {
        "current_workforce": workforce_count,
        "marketplace_demand": total_demand,
        "capability_gap": round(gap, 4),
        "reputation_trend": reputation_trend,
    }


def evaluate_planning_strategy(state: WorkforcePlanningState) -> dict:
    """
    Deterministic planning strategy based on supply-demand signals.
    """
    demand = state["marketplace_demand"]
    supply = state["current_workforce"]
    gap = state["capability_gap"]
    profession_id = state["profession_id"]

    if demand > supply and gap > 0.15:
        # High demand, significant capability gap → Reskill existing + hire new
        recommendation = {
            "event_type": "WorkforcePlanningRecommendation",
            "payload": {
                "action": "ReskillingAndHiringRecommended",
                "profession_id": profession_id,
                "current_workforce": supply,
                "marketplace_demand": demand,
                "capability_gap": gap,
                "justification": (
                    f"Demand exceeds supply ({demand} > {supply}) with significant "
                    f"capability gap ({gap:.0%}). Recommend reskilling existing "
                    f"workforce and hiring {demand - supply} new professionals."
                ),
            },
        }
    elif demand > supply:
        # Demand exceeds supply but capability is adequate → hire only
        recommendation = {
            "event_type": "WorkforcePlanningRecommendation",
            "payload": {
                "action": "HiringRecommended",
                "profession_id": profession_id,
                "current_workforce": supply,
                "marketplace_demand": demand,
                "capability_gap": gap,
                "justification": (
                    f"Demand exceeds supply ({demand} > {supply}). "
                    f"Recommend hiring {demand - supply} new professionals."
                ),
            },
        }
    elif supply > demand and supply > 0:
        surplus = supply - demand
        # Supply exceeds demand → recommend retirement or redeployment
        recommendation = {
            "event_type": "WorkforcePlanningRecommendation",
            "payload": {
                "action": "RetirementRecommended",
                "profession_id": profession_id,
                "current_workforce": supply,
                "marketplace_demand": demand,
                "capability_gap": gap,
                "justification": (
                    f"Supply exceeds demand ({supply} > {demand}). "
                    f"Consider retiring or redeploying {surplus} professionals."
                ),
            },
        }
    else:
        # Balanced
        recommendation = {
            "event_type": "WorkforcePlanningRecommendation",
            "payload": {
                "action": "MaintainWorkforce",
                "profession_id": profession_id,
                "current_workforce": supply,
                "marketplace_demand": demand,
                "capability_gap": gap,
                "justification": "Market is balanced. Maintain current workforce levels.",
            },
        }

    return {"recommendation_event": recommendation}


def build_planning_agent():
    workflow = StateGraph(WorkforcePlanningState)

    workflow.add_node("aggregate_signals", aggregate_signals)
    workflow.add_node("evaluate_planning_strategy", evaluate_planning_strategy)

    workflow.set_entry_point("aggregate_signals")
    workflow.add_edge("aggregate_signals", "evaluate_planning_strategy")
    workflow.add_edge("evaluate_planning_strategy", END)

    return workflow.compile()


workforce_planning_agent = build_planning_agent()
