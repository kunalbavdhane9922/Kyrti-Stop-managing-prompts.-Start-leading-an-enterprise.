"""
Profession Health Intelligence Agent (LangGraph)

Evaluates the health of a profession by fetching real demand, supply, and growth
metrics from the SAEP marketplace and workforce services.

V1 Spec (ProfessionHealth.md):
    - Demand Health Score
    - Supply Health Score
    - Growth Health Score
    - Overall composite health
    - Risk assessment
    - Recommendation event emission

Architecture:
    Temporal → Activity → This Agent → saep-marketplace API / saep-workforce API → Score
"""

import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from engine.api_client import (
    fetch_marketplace_demand,
    fetch_marketplace_supply,
    fetch_marketplace_growth,
)

logger = logging.getLogger(__name__)


class ProfessionHealthState(TypedDict):
    tenant_id: str
    profession_id: str
    demand_health_score: float
    supply_health_score: float
    growth_health_score: float
    overall_health_score: float
    risk_assessment: str
    recommendation_event: dict


def analyze_demand_health(state: ProfessionHealthState) -> dict:
    """
    Fetch real hiring demand data from saep-marketplace for this profession.

    Demand Health Score:
        - High demand (many open tasks, many hiring requests) → score close to 1.0
        - Low demand → score close to 0.0
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    data = fetch_marketplace_demand(tenant_id, profession_id)

    open_tasks = data.get("openTasks", data.get("open_tasks", 0))
    hiring_requests = data.get("hiringRequests", data.get("hiring_requests", 0))
    max_capacity = data.get("maxCapacity", data.get("max_capacity", 0))

    # Demand score: ratio of active demand to capacity (capped at 1.0)
    if max_capacity > 0:
        demand_ratio = min((open_tasks + hiring_requests) / max_capacity, 1.0)
    elif open_tasks + hiring_requests > 0:
        # No capacity data available, but demand exists — treat as high demand
        demand_ratio = min((open_tasks + hiring_requests) / 100.0, 1.0)
    else:
        demand_ratio = 0.0

    logger.info(
        f"Profession {profession_id} demand: tasks={open_tasks}, "
        f"hiring={hiring_requests}, capacity={max_capacity}, score={demand_ratio:.2f}"
    )

    return {"demand_health_score": round(demand_ratio, 4)}


def analyze_supply_health(state: ProfessionHealthState) -> dict:
    """
    Fetch real workforce supply data from saep-marketplace for this profession.

    Supply Health Score:
        - Adequate supply relative to demand → score close to 1.0
        - Critical shortage → score close to 0.0
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    data = fetch_marketplace_supply(tenant_id, profession_id)

    active_professionals = data.get("activeProfessionals", data.get("active_professionals", 0))
    idle_professionals = data.get("idleProfessionals", data.get("idle_professionals", 0))
    total_professionals = data.get("totalProfessionals", data.get("total_professionals", 0))

    if total_professionals == 0:
        total_professionals = active_professionals + idle_professionals

    # Supply score: ratio of available (idle + active) to a reasonable target
    # Using demand as the denominator if available
    demand_score = state.get("demand_health_score", 0.5)
    # Scale: if demand is high (1.0) and supply is low, supply_score will be low
    if total_professionals > 0:
        # Idle ratio indicates availability headroom
        idle_ratio = idle_professionals / total_professionals if total_professionals > 0 else 0.0
        # Base supply: proportion of workforce that exists
        supply_ratio = min(total_professionals / max(total_professionals + 10, 1), 1.0)
        # Weight idle availability into the score
        supply_score = (supply_ratio * 0.6) + (idle_ratio * 0.4)
    else:
        supply_score = 0.0

    logger.info(
        f"Profession {profession_id} supply: active={active_professionals}, "
        f"idle={idle_professionals}, total={total_professionals}, score={supply_score:.2f}"
    )

    return {"supply_health_score": round(supply_score, 4)}


def analyze_growth_health(state: ProfessionHealthState) -> dict:
    """
    Fetch real growth metrics from saep-marketplace for this profession.

    Growth Health Score:
        - Strong hiring velocity, population growth → score close to 1.0
        - Stagnation or decline → score close to 0.0
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    data = fetch_marketplace_growth(tenant_id, profession_id)

    new_hires_30d = data.get("newHires30d", data.get("new_hires_30d", 0))
    retirements_30d = data.get("retirements30d", data.get("retirements_30d", 0))
    growth_rate = data.get("growthRate", data.get("growth_rate", 0.0))

    # Net growth as a score
    net_growth = new_hires_30d - retirements_30d

    if growth_rate > 0:
        # Use the API-provided growth rate directly (assumed 0.0 to 1.0 range)
        growth_score = min(growth_rate, 1.0)
    elif net_growth > 0:
        # Positive net growth — normalize to a reasonable range
        growth_score = min(net_growth / 20.0, 1.0)
    elif net_growth == 0:
        growth_score = 0.5  # Stable
    else:
        # Declining
        growth_score = max(0.5 + (net_growth / 20.0), 0.0)

    logger.info(
        f"Profession {profession_id} growth: hires={new_hires_30d}, "
        f"retirements={retirements_30d}, rate={growth_rate}, score={growth_score:.2f}"
    )

    return {"growth_health_score": round(growth_score, 4)}


def calculate_health_score(state: ProfessionHealthState) -> dict:
    """
    Deterministic Profession Health Score:
        Overall Health = 40% Demand + 40% Supply + 20% Growth

    Risk assessment logic:
        - CRITICAL_SHORTAGE_RISK: High demand (>0.7), low supply (<0.4)
        - OVERSUPPLY_RISK: Low demand (<0.4), high supply (>0.7)
        - DECLINING_RISK: Low growth (<0.3)
        - STABLE: Everything balanced
    """
    demand = state["demand_health_score"]
    supply = state["supply_health_score"]
    growth = state["growth_health_score"]

    overall = (demand * 0.4) + (supply * 0.4) + (growth * 0.2)

    if demand > 0.7 and supply < 0.4:
        risk = "CRITICAL_SHORTAGE_RISK"
    elif supply > 0.7 and demand < 0.4:
        risk = "OVERSUPPLY_RISK"
    elif growth < 0.3:
        risk = "DECLINING_RISK"
    else:
        risk = "STABLE"

    return {
        "overall_health_score": round(overall, 4),
        "risk_assessment": risk,
    }


def emit_health_event(state: ProfessionHealthState) -> dict:
    """
    Emit recommendation event based on risk assessment.
    Events follow EventArchitecture.md patterns.
    """
    risk = state["risk_assessment"]
    profession_id = state["profession_id"]
    health_score = state["overall_health_score"]

    if risk != "STABLE":
        event = {
            "event_type": "ProfessionRiskDetected",
            "payload": {
                "profession_id": profession_id,
                "risk_type": risk,
                "health_score": health_score,
                "demand_health": state["demand_health_score"],
                "supply_health": state["supply_health_score"],
                "growth_health": state["growth_health_score"],
            },
        }
    else:
        event = {
            "event_type": "ProfessionHealthCalculated",
            "payload": {
                "profession_id": profession_id,
                "health_score": health_score,
                "demand_health": state["demand_health_score"],
                "supply_health": state["supply_health_score"],
                "growth_health": state["growth_health_score"],
            },
        }

    return {"recommendation_event": event}


def build_profession_health_agent():
    workflow = StateGraph(ProfessionHealthState)

    workflow.add_node("analyze_demand_health", analyze_demand_health)
    workflow.add_node("analyze_supply_health", analyze_supply_health)
    workflow.add_node("analyze_growth_health", analyze_growth_health)
    workflow.add_node("calculate_health_score", calculate_health_score)
    workflow.add_node("emit_health_event", emit_health_event)

    workflow.set_entry_point("analyze_demand_health")
    workflow.add_edge("analyze_demand_health", "analyze_supply_health")
    workflow.add_edge("analyze_supply_health", "analyze_growth_health")
    workflow.add_edge("analyze_growth_health", "calculate_health_score")
    workflow.add_edge("calculate_health_score", "emit_health_event")
    workflow.add_edge("emit_health_event", END)

    return workflow.compile()


profession_health_agent = build_profession_health_agent()
