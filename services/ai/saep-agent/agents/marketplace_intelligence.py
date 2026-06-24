"""
Marketplace Intelligence Agent (LangGraph)

Analyzes marketplace demand vs supply, detects gaps, generates forecasts,
and produces population planning recommendations by calling real SAEP APIs.

V1 Spec (MarketplaceIntelligence.md):
    - Demand analysis
    - Supply analysis
    - Gap detection
    - Forecasting
    - Population planning
    - Recommendation generation

Architecture:
    Temporal → Activity → This Agent → saep-marketplace API → Intelligence
"""

import logging
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from engine.api_client import (
    fetch_marketplace_demand,
    fetch_marketplace_supply,
    fetch_marketplace_growth,
)

logger = logging.getLogger(__name__)


class MarketplaceState(TypedDict):
    tenant_id: str
    profession_id: str
    demand_metrics: dict
    supply_metrics: dict
    gap_analysis: dict
    forecast: dict
    population_plan: dict
    recommendation_event: dict


def analyze_demand(state: MarketplaceState) -> dict:
    """
    Fetch real demand data from saep-marketplace API.
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    data = fetch_marketplace_demand(tenant_id, profession_id)

    demand_metrics = {
        "open_tasks": data.get("openTasks", data.get("open_tasks", 0)),
        "hiring_requests": data.get("hiringRequests", data.get("hiring_requests", 0)),
        "avg_task_duration_hours": data.get("avgTaskDurationHours", data.get("avg_task_duration_hours", 0)),
        "pending_assignments": data.get("pendingAssignments", data.get("pending_assignments", 0)),
    }

    logger.info(f"Marketplace demand for {profession_id}: {demand_metrics}")
    return {"demand_metrics": demand_metrics}


def analyze_supply(state: MarketplaceState) -> dict:
    """
    Fetch real supply data from saep-marketplace API.
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    data = fetch_marketplace_supply(tenant_id, profession_id)

    supply_metrics = {
        "active_professionals": data.get("activeProfessionals", data.get("active_professionals", 0)),
        "idle_professionals": data.get("idleProfessionals", data.get("idle_professionals", 0)),
        "total_professionals": data.get("totalProfessionals", data.get("total_professionals", 0)),
        "avg_utilization": data.get("avgUtilization", data.get("avg_utilization", 0.0)),
    }

    logger.info(f"Marketplace supply for {profession_id}: {supply_metrics}")
    return {"supply_metrics": supply_metrics}


def detect_gaps(state: MarketplaceState) -> dict:
    """
    Deterministic gap detection: compare demand vs supply to find shortages or oversupply.
    """
    open_tasks = state["demand_metrics"].get("open_tasks", 0)
    hiring_requests = state["demand_metrics"].get("hiring_requests", 0)
    total_demand = open_tasks + hiring_requests

    active = state["supply_metrics"].get("active_professionals", 0)
    idle = state["supply_metrics"].get("idle_professionals", 0)
    total_supply = active + idle

    if total_demand > 0 and total_supply > 0:
        demand_supply_ratio = total_demand / total_supply
    elif total_demand > 0:
        demand_supply_ratio = float("inf")
    else:
        demand_supply_ratio = 0.0

    if demand_supply_ratio > 2.0:
        gap = {
            "status": "CRITICAL_SHORTAGE",
            "deficit": total_demand - total_supply,
            "demand_supply_ratio": round(demand_supply_ratio, 2),
        }
    elif demand_supply_ratio > 1.2:
        gap = {
            "status": "MODERATE_SHORTAGE",
            "deficit": total_demand - total_supply,
            "demand_supply_ratio": round(demand_supply_ratio, 2),
        }
    elif total_supply > 0 and total_demand > 0 and total_supply > total_demand * 2:
        gap = {
            "status": "OVERSUPPLY",
            "surplus": total_supply - total_demand,
            "demand_supply_ratio": round(demand_supply_ratio, 2),
        }
    else:
        gap = {
            "status": "BALANCED",
            "demand_supply_ratio": round(demand_supply_ratio, 2) if demand_supply_ratio != float("inf") else 0.0,
        }

    logger.info(f"Gap analysis for {state['profession_id']}: {gap}")
    return {"gap_analysis": gap}


def generate_forecast(state: MarketplaceState) -> dict:
    """
    Generate a 30-day deterministic forecast based on current gap trends.
    Uses growth data from marketplace API for projection.
    """
    tenant_id = state["tenant_id"]
    profession_id = state["profession_id"]

    growth_data = fetch_marketplace_growth(tenant_id, profession_id)

    new_hires_30d = growth_data.get("newHires30d", growth_data.get("new_hires_30d", 0))
    retirements_30d = growth_data.get("retirements30d", growth_data.get("retirements_30d", 0))
    growth_rate = growth_data.get("growthRate", growth_data.get("growth_rate", 0.0))

    gap = state["gap_analysis"]
    deficit = gap.get("deficit", 0)
    surplus = gap.get("surplus", 0)

    # Project forward 30 days using current growth trajectory
    net_change_30d = new_hires_30d - retirements_30d

    forecast = {
        "projected_deficit_30d": max(deficit - net_change_30d, 0) if deficit > 0 else 0,
        "projected_surplus_30d": max(surplus + net_change_30d, 0) if surplus > 0 else 0,
        "projected_net_change": net_change_30d,
        "hiring_velocity_30d": new_hires_30d,
        "attrition_velocity_30d": retirements_30d,
        "growth_rate": growth_rate,
    }

    logger.info(f"Forecast for {profession_id}: {forecast}")
    return {"forecast": forecast}


def generate_population_plan(state: MarketplaceState) -> dict:
    """
    Deterministic V1 population planning based on gap analysis and forecast.
    """
    status = state["gap_analysis"]["status"]
    total_demand = (
        state["demand_metrics"].get("open_tasks", 0)
        + state["demand_metrics"].get("hiring_requests", 0)
    )
    total_supply = (
        state["supply_metrics"].get("active_professionals", 0)
        + state["supply_metrics"].get("idle_professionals", 0)
    )
    net_change = state["forecast"].get("projected_net_change", 0)

    # Target workforce size: demand-driven with buffer
    if total_demand > 0:
        # Target = enough professionals to handle demand with 20% headroom
        target_size = int(total_demand * 1.2)
    else:
        target_size = total_supply

    # Hiring velocity recommendation
    if status in ("CRITICAL_SHORTAGE", "MODERATE_SHORTAGE"):
        hiring_velocity = "HIGH"
        retraining_priority = "NORMAL"
    elif status == "OVERSUPPLY":
        hiring_velocity = "FREEZE"
        retraining_priority = "CRITICAL"
    else:
        hiring_velocity = "STANDARD"
        retraining_priority = "NORMAL"

    plan = {
        "target_workforce_size": target_size,
        "current_workforce_size": total_supply,
        "recommended_hiring_velocity": hiring_velocity,
        "retraining_priority": retraining_priority,
        "gap_to_close": max(target_size - total_supply, 0),
    }

    logger.info(f"Population plan for {state['profession_id']}: {plan}")
    return {"population_plan": plan}


def generate_recommendation(state: MarketplaceState) -> dict:
    """
    Emit recommendation event based on gap analysis and population plan.
    """
    status = state["gap_analysis"]["status"]
    profession_id = state["profession_id"]

    base_payload = {
        "profession_id": profession_id,
        "gap_status": status,
        "population_plan": state["population_plan"],
        "forecast": state["forecast"],
    }

    if status == "CRITICAL_SHORTAGE":
        event = {
            "event_type": "ProfessionDemandDetected",
            "payload": {
                **base_payload,
                "recommended_action": "WorkforceExpansionRecommended",
                "target_increase": state["gap_analysis"].get("deficit", 0),
            },
        }
    elif status == "MODERATE_SHORTAGE":
        event = {
            "event_type": "ProfessionDemandDetected",
            "payload": {
                **base_payload,
                "recommended_action": "GradualExpansionRecommended",
                "target_increase": state["gap_analysis"].get("deficit", 0),
            },
        }
    elif status == "OVERSUPPLY":
        event = {
            "event_type": "ProfessionOversupplyDetected",
            "payload": {
                **base_payload,
                "recommended_action": "WorkforceReductionRecommended",
                "target_decrease": state["gap_analysis"].get("surplus", 0),
            },
        }
    else:
        event = {
            "event_type": "MarketplaceBalanced",
            "payload": base_payload,
        }

    return {"recommendation_event": event}


def build_marketplace_agent():
    workflow = StateGraph(MarketplaceState)

    workflow.add_node("analyze_demand", analyze_demand)
    workflow.add_node("analyze_supply", analyze_supply)
    workflow.add_node("detect_gaps", detect_gaps)
    workflow.add_node("generate_forecast", generate_forecast)
    workflow.add_node("generate_population_plan", generate_population_plan)
    workflow.add_node("generate_recommendation", generate_recommendation)

    workflow.set_entry_point("analyze_demand")
    workflow.add_edge("analyze_demand", "analyze_supply")
    workflow.add_edge("analyze_supply", "detect_gaps")
    workflow.add_edge("detect_gaps", "generate_forecast")
    workflow.add_edge("generate_forecast", "generate_population_plan")
    workflow.add_edge("generate_population_plan", "generate_recommendation")
    workflow.add_edge("generate_recommendation", END)

    return workflow.compile()


marketplace_agent = build_marketplace_agent()
