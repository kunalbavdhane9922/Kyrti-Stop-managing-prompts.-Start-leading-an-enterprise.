package com.saep.workforce.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.workforce.service.ReputationService;
import com.saep.workforce.service.WorkforceScoringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SignalIngestionConsumer {

    private final WorkforceScoringService scoringService;
    private final ReputationService reputationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = {
        "communication.tasks", 
        "governance.policies", 
        "learning.assessments",
        "workforce.career",
        "marketplace.contracts",
        "security.audit"
    }, groupId = "workforce-scoring-group")
    public void consumeEcosystemEvents(ConsumerRecord<String, String> record) {
        log.info("Received event from topic {}: {}", record.topic(), record.value());
        try {
            JsonNode payload = objectMapper.readTree(record.value());
            
            // Expected outbox event structure: 
            // { "eventId": "...", "eventType": "task.completed.v1", "tenantId": "...", "payload": "{\"workerId\": \"...\"}" }
            
            String eventId = payload.path("eventId").asText();
            String eventType = payload.path("eventType").asText();
            String tenantId = payload.path("tenantId").asText();
            
            String innerPayloadStr = payload.path("payload").asText();
            JsonNode innerPayload = objectMapper.readTree(innerPayloadStr);
            
            // Extract subject
            String workerId = innerPayload.path("workerId").asText(null);
            if (workerId == null) {
                workerId = innerPayload.path("subjectId").asText(null);
            }
            
            String signalCode = mapEventToSignalCode(eventType);
            
            if (workerId != null && signalCode != null) {
                // Determine source system based on topic
                String sourceSystem = record.topic().split("\\.")[0]; // e.g. "communication"
                
                // Process Capability/Skill/Readiness
                scoringService.processSignal(tenantId, eventId, sourceSystem, eventType, workerId, signalCode, innerPayload);
                
                // Process Reputation
                reputationService.processReputationSignal(tenantId, eventId, sourceSystem, eventType, workerId, "WORKER", signalCode, innerPayload);
            }
            
        } catch (Exception e) {
            log.error("Failed to process ingested signal", e);
        }
    }
    
    private String mapEventToSignalCode(String eventType) {
        if (eventType == null) return null;
        if (eventType.startsWith("task.completed")) return "TASK_COMPLETED";
        if (eventType.startsWith("task.failed")) return "TASK_FAILED";
        if (eventType.startsWith("policy.violation")) return "POLICY_VIOLATION";
        if (eventType.startsWith("assessment.passed")) return "ASSESSMENT_PASSED";
        if (eventType.startsWith("fraud.detected")) return "FRAUD_DETECTED";
        if (eventType.startsWith("promotion.granted")) return "PROMOTION_GRANTED";
        return eventType.toUpperCase().replace(".", "_");
    }
}
