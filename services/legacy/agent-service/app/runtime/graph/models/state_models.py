import uuid
from typing import Annotated, Sequence, Dict, Any, List, Optional
from pydantic import BaseModel, Field, validator
from langchain_core.messages import BaseMessage

class NodeExecutionMetadata(BaseModel):
    """Deep metadata tracking for individual node execution."""
    node_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    node_name: str
    execution_time_ms: float = 0.0
    tokens_consumed: int = 0
    estimated_cost: float = 0.0
    retry_count: int = 0
    status: str = Field(default="PENDING")  # PENDING, RUNNING, SUCCESS, FAILED, DLQ
    error_trace: Optional[str] = None

class DynamicAgentState(BaseModel):
    """
    The master state object passed between nodes in the DAG.
    Uses strict Pydantic validation to guarantee state integrity across the cluster.
    """
    messages: Sequence[BaseMessage] = Field(default_factory=list, description="The LangChain message history.")
    task: str = Field(..., description="The original task description assigned to the agent.")
    tenant_id: str = Field(..., description="The isolated tenant boundary for this execution.")
    professional_id: str = Field(..., description="The ID of the digital professional.")
    
    # Advanced State Tracking
    current_node: str = Field(default="START", description="The node currently processing the state.")
    execution_history: List[NodeExecutionMetadata] = Field(default_factory=list, description="Telemetry for every node hit.")
    shared_memory: Dict[str, Any] = Field(default_factory=dict, description="Scratchpad for subagents to share variables.")
    
    # DLQ (Dead Letter Queue) Management
    is_paused: bool = Field(default=False, description="True if the graph hit a circuit breaker and is paused.")
    dlq_reason: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

    def log_node_start(self, node_name: str) -> NodeExecutionMetadata:
        meta = NodeExecutionMetadata(node_name=node_name, status="RUNNING")
        self.execution_history.append(meta)
        self.current_node = node_name
        return meta

    def log_node_finish(self, meta: NodeExecutionMetadata, status: str = "SUCCESS", error: str = None):
        meta.status = status
        if error:
            meta.error_trace = error
            
    def get_recent_errors(self) -> List[str]:
        return [m.error_trace for m in self.execution_history if m.status == "FAILED" and m.error_trace]
