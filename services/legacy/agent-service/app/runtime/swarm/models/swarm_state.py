from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage
from app.runtime.graph.models.state_models import DynamicAgentState

class SubAgentTask(BaseModel):
    task_id: str
    description: str
    assigned_role: str
    status: Literal["PENDING", "IN_PROGRESS", "QA_REVIEW", "COMPLETED", "FAILED"] = "PENDING"
    result: Optional[str] = None
    qa_votes: Dict[str, str] = Field(default_factory=dict) # e.g. {"QA_1": "PASS", "QA_2": "FAIL"}

class SwarmState(DynamicAgentState):
    """
    Massive Map-Reduce State Object.
    Tracks the overarching progress of a task that has been shattered into 
    parallel pieces by the Architect node.
    """
    architect_plan: Optional[str] = None
    subtasks: List[SubAgentTask] = Field(default_factory=list)
    consensus_reached: bool = False
    
    # We extend the base state but add tracking for swarm parallelism
    total_swarm_cost: float = 0.0
