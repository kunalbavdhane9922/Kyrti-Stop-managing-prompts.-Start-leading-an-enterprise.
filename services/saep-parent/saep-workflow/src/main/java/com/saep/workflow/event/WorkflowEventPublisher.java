package com.saep.workflow.event;

import com.saep.common.event.EventEnvelope;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

/**
 * Publishes workflow lifecycle events (WorkflowStarted, WorkflowCompleted, etc.)
 * to Kafka using the standard EventEnvelope from saep-common.
 * Adheres to EventArchitecture.md: events are immutable, auditable, and tenant-scoped.
 */
@Component
public class WorkflowEventPublisher {

    private static final String WORKFLOW_EVENTS_TOPIC = "workflow.events";
    private static final String EVENT_VERSION = "v1";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public WorkflowEventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.findAndRegisterModules();
    }

    public void publishWorkflowStarted(String workflowId, String workflowType, String tenantId, String correlationId) {
        publish("WorkflowStarted", workflowId, workflowType, tenantId, correlationId, Map.of(
                "workflowId", workflowId,
                "workflowType", workflowType
        ));
    }

    public void publishWorkflowCompleted(String workflowId, String workflowType, String tenantId, String correlationId, String result) {
        publish("WorkflowCompleted", workflowId, workflowType, tenantId, correlationId, Map.of(
                "workflowId", workflowId,
                "workflowType", workflowType,
                "result", result
        ));
    }

    public void publishWorkflowFailed(String workflowId, String workflowType, String tenantId, String correlationId, String reason) {
        publish("WorkflowFailed", workflowId, workflowType, tenantId, correlationId, Map.of(
                "workflowId", workflowId,
                "workflowType", workflowType,
                "failureReason", reason
        ));
    }

    public void publishApprovalRequested(String workflowId, String workflowType, String tenantId, String correlationId, String targetId) {
        publish("ApprovalRequested", workflowId, workflowType, tenantId, correlationId, Map.of(
                "workflowId", workflowId,
                "workflowType", workflowType,
                "targetId", targetId
        ));
    }

    private void publish(String eventType, String workflowId, String workflowType, String tenantId, String correlationId, Map<String, String> payload) {
        String traceId = UUID.randomUUID().toString();
        EventEnvelope<Map<String, String>> envelope = EventEnvelope.wrap(
                payload,
                eventType,
                EVENT_VERSION,
                tenantId,
                correlationId != null ? correlationId : UUID.randomUUID().toString(),
                workflowId,
                traceId
        );

        try {
            String json = objectMapper.writeValueAsString(envelope);
            kafkaTemplate.send(WORKFLOW_EVENTS_TOPIC, workflowId, json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize workflow event: " + eventType, e);
        }
    }
}
