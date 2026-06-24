from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
import uuid
import datetime

class KafkaBaseEvent(BaseModel):
    """The strictly-typed foundation for all messages moving through the Nervous System."""
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    event_type: str = Field(..., description="The classification of the event.")
    source_system: str = Field(default="JavaPlatformServices")

class TaskAssignedEvent(KafkaBaseEvent):
    """Fired when the Java backend hires an agent and assigns it a task."""
    event_type: Literal["TaskAssigned"] = "TaskAssigned"
    professional_id: str
    tenant_id: str
    task: str
    github_repo_url: str
    github_token: str
    professional_dna: Dict[str, Any]

class AgentPausedEvent(KafkaBaseEvent):
    """Fired when an agent hits a DLQ circuit breaker."""
    event_type: Literal["AgentPaused"] = "AgentPaused"
    professional_id: str
    tenant_id: str
    reason: str

class SagaTriggeredEvent(KafkaBaseEvent):
    """Fired when a catastrophic failure demands a git rollback."""
    event_type: Literal["SagaTriggered"] = "SagaTriggered"
    professional_id: str
    tenant_id: str
    error_trace: str
