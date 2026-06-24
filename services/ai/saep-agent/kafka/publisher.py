import json
import os
import uuid
from datetime import datetime
from confluent_kafka import Producer
from context import correlation_id_ctx
import logging

logger = logging.getLogger(__name__)

KAFKA_BROKER = os.getenv("KAFKA_BROKERS", "localhost:9092")

class EventPublisher:
    def __init__(self):
        self.producer = Producer({'bootstrap.servers': KAFKA_BROKER})

    def _create_event_envelope(self, event_type: str, actor_id: str, tenant_id: str, payload: dict) -> dict:
        return {
            "eventId": str(uuid.uuid4()),
            "eventType": event_type,
            "correlationId": correlation_id_ctx.get(),
            "timestamp": datetime.utcnow().isoformat(),
            "tenantId": tenant_id,
            "actorId": actor_id,
            "payload": payload
        }

    def _emit(self, event_type: str, actor_id: str, tenant_id: str, payload: dict, key: str = None):
        event = self._create_event_envelope(event_type, actor_id, tenant_id, payload)
        
        try:
            self.producer.produce(
                'saep-audit-events', 
                key=key.encode('utf-8') if key else b'global',
                value=json.dumps(event).encode('utf-8')
            )
            self.producer.flush()
            logger.info(f"Published event {event_type}", extra={"correlation_id": correlation_id_ctx.get()})
        except Exception as e:
            logger.error(f"Failed to publish event {event_type}: {e}", extra={"correlation_id": correlation_id_ctx.get()})

    def emit_task_started(self, tenant_id: str, worker_id: str, task_id: str):
        self._emit("AgentTaskStarted", worker_id or "system", tenant_id, {"task_id": task_id}, key=worker_id)

    def emit_task_completed(self, tenant_id: str, worker_id: str, task_id: str):
        self._emit("AgentTaskCompleted", worker_id or "system", tenant_id, {"task_id": task_id}, key=worker_id)

    def emit_task_failed(self, tenant_id: str, worker_id: str, task_id: str, error: str):
        self._emit("AgentTaskFailed", worker_id or "system", tenant_id, {"task_id": task_id, "error": error}, key=worker_id)

    def emit_recommendation_generated(self, tenant_id: str, worker_id: str, recommendation: dict):
        self._emit("AgentRecommendationGenerated", worker_id or "system", tenant_id, recommendation, key=worker_id)

    def emit_memory_updated(self, tenant_id: str, worker_id: str, task_id: str, memory_id: str):
        self._emit("AgentMemoryUpdated", worker_id or "system", tenant_id, {"task_id": task_id, "memory_id": memory_id}, key=worker_id)

    def emit_decision_generated(self, tenant_id: str, worker_id: str, task_id: str, decision: dict):
        self._emit("AgentDecisionGenerated", worker_id or "system", tenant_id, {"task_id": task_id, "decision": decision}, key=worker_id)

    def emit_escalation_requested(self, tenant_id: str, worker_id: str, task_id: str, reason: str):
        self._emit("AgentEscalationRequested", worker_id or "system", tenant_id, {"task_id": task_id, "reason": reason}, key=worker_id)

    def emit_access_violation_detected(self, tenant_id: str, worker_id: str, task_id: str, action: str, error: str):
        self._emit("AccessViolationDetected", worker_id or "system", tenant_id, {"task_id": task_id, "action": action, "error": error}, key=worker_id)

event_publisher = EventPublisher()
