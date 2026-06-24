from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class ProfessionHealthRequest:
    tenant_id: str
    profession_id: str
    company_id: Optional[str] = None
    worker_id: Optional[str] = None
    correlation_id: str = "system"
    evaluation_date: Optional[str] = None


@dataclass
class ProfessionHealthResult:
    health_score: float
    demand_health: float
    supply_health: float
    growth_health: float
    risk_level: str
    recommendations: List[dict] = field(default_factory=list)


@dataclass
class MarketplaceIntelligenceRequest:
    tenant_id: str
    profession_id: str
    worker_id: Optional[str] = None
    correlation_id: str = "system"


@dataclass
class MarketplaceIntelligenceResult:
    demand_metrics: dict = field(default_factory=dict)
    supply_metrics: dict = field(default_factory=dict)
    gap_analysis: dict = field(default_factory=dict)
    forecast: dict = field(default_factory=dict)
    population_plan: dict = field(default_factory=dict)
    recommendations: List[dict] = field(default_factory=list)


@dataclass
class WorkforceScoringRequest:
    tenant_id: str
    worker_id: str
    correlation_id: str = "system"


@dataclass
class WorkforceScoringResult:
    capability_score: float = 0.0
    skill_score: float = 0.0
    readiness_score: float = 0.0
    evidence: dict = field(default_factory=dict)


@dataclass
class ReputationAnalysisRequest:
    tenant_id: str
    worker_id: str
    correlation_id: str = "system"


@dataclass
class ReputationAnalysisResult:
    reputation_score: int = 0
    team_reputation: int = 0
    company_reputation: int = 0
    trend: str = "UNKNOWN"


@dataclass
class WorkforcePlanningRequest:
    tenant_id: str
    profession_id: str
    worker_id: Optional[str] = None
    correlation_id: str = "system"


@dataclass
class WorkforcePlanningResult:
    current_workforce: int = 0
    marketplace_demand: int = 0
    capability_gap: float = 0.0
    recommendation: dict = field(default_factory=dict)
