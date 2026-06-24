import json
import os
import uuid
import logging
import threading
from datetime import datetime
from confluent_kafka import Consumer, KafkaError
from kafka.registry import get_agent_for_task
from models.execution import AgentExecution, SessionLocal
from engine.memory import memory_client
from kafka.publisher import event_publisher

logger = logging.getLogger(__name__)

# Graceful shutdown flag
_shutdown_event = threading.Event()


def process_task(task_payload):
    """Process a single agent task from the Kafka queue."""
    # Parse payload
    task_id = task_payload.get("taskId", str(uuid.uuid4()))
    worker_id = task_payload.get("workerId")
    input_text = task_payload.get("input", "")
    tenant_id = task_payload.get("tenantId", "system")
    workflow_id = task_payload.get("workflowId")

    # Propagate correlation ID and context
    passed_correlation = task_payload.get("correlationId")
    from context import correlation_id_ctx, tenant_id_ctx, worker_id_ctx, task_id_ctx
    if passed_correlation:
        correlation_id_ctx.set(passed_correlation)
    tenant_id_ctx.set(tenant_id)
    worker_id_ctx.set(worker_id)
    task_id_ctx.set(task_id)

    # Create DB entry
    db = SessionLocal()
    execution = AgentExecution(
        id=str(uuid.uuid4()),
        tenant_id=tenant_id,
        workflow_id=workflow_id,
        task_id=task_id,
        worker_id=worker_id,
        status="Executing"
    )
    db.add(execution)
    db.commit()

    # Run graph via registry
    agent_graph = get_agent_for_task(task_payload.get("task_type", "PROFESSIONAL_TASK"))

    # Emit AgentTaskStarted
    event_publisher.emit_task_started(tenant_id, worker_id, task_id)

    try:
        final_state = agent_graph.invoke({
            "task_id": task_id,
            "worker_id": worker_id,
            "profession_id": task_payload.get("profession_id"),
            "input_text": input_text,
            "requires_approval": False
        })

        execution.status = final_state.get("status", "Completed")
        execution.reasoning_summary = final_state.get("reasoning", "")
        execution.decision = final_state.get("decision", "")
        execution.completed_at = datetime.utcnow()
        db.commit()
        
        # 0. Emit the decision generated event
        if execution.decision:
            if execution.decision == "ACCESS_DENIED":
                event_publisher.emit_access_violation_detected(
                    tenant_id,
                    worker_id,
                    task_id,
                    action=final_state.get("action_payload", {}).get("type", "UNKNOWN"),
                    error=execution.reasoning_summary
                )
            else:
                event_publisher.emit_decision_generated(
                    tenant_id, 
                    worker_id, 
                    task_id, 
                    {"decision": execution.decision, "reasoning": execution.reasoning_summary}
                )

        # Store experience to Memory (Learning)
        # Per MemoryArchitecture.md: saep-memory handles embedding generation internally
        if execution.reasoning_summary and worker_id:
            try:
                memory_client.store_memory(
                    payload={
                        "worker_id": worker_id,
                        "task_id": task_id,
                        "tenant_id": tenant_id,
                        "learning": execution.reasoning_summary,
                        "scope": "PERSONAL",
                    }
                )
            except Exception:
                pass  # Non-critical failure for memory

        # 1. Emit the specific recommendation event for internal agents
        out_event = final_state.get("recommendation_event") or \
                    (final_state.get("event_type") and {
                        "event_type": final_state.get("event_type"),
                        "payload": final_state.get("payload")
                    })

        if out_event:
            # Emit AgentRecommendationGenerated
            event_publisher.emit_recommendation_generated(tenant_id, worker_id, out_event)

        # 2. Emit the appropriate task completion event
        if execution.status == "Failed":
            event_publisher.emit_task_failed(tenant_id, worker_id, task_id, execution.reasoning_summary)
        else:
            event_publisher.emit_task_completed(tenant_id, worker_id, task_id)

    except Exception as e:
        execution.status = "Failed"
        execution.reasoning_summary = str(e)
        execution.completed_at = datetime.utcnow()
        db.commit()

        event_publisher.emit_task_failed(tenant_id, worker_id, task_id, str(e))
    finally:
        db.close()


def start_consumer():
    """Start the Kafka consumer loop. Runs until stop_consumer() is called."""
    _shutdown_event.clear()

    c = Consumer({
        'bootstrap.servers': os.getenv("KAFKA_BROKERS", "localhost:9092"),
        'group.id': 'saep-agent-group',
        'auto.offset.reset': 'earliest'
    })

    c.subscribe(['saep-agent-tasks'])
    logger.info("Kafka consumer started on topic 'saep-agent-tasks'")

    try:
        while not _shutdown_event.is_set():
            msg = c.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    logger.error(f"Kafka error: {msg.error()}")
                    break

            try:
                payload = json.loads(msg.value().decode('utf-8'))
                process_task(payload)
            except Exception as e:
                logger.error(f"Error processing message: {e}")

    finally:
        c.close()
        logger.info("Kafka consumer shut down gracefully")


def stop_consumer():
    """Signal the consumer loop to shut down gracefully."""
    logger.info("Stop signal received for Kafka consumer")
    _shutdown_event.set()


if __name__ == "__main__":
    start_consumer()
