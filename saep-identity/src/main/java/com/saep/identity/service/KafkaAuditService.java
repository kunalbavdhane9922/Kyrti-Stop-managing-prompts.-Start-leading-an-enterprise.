package com.saep.identity.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class KafkaAuditService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "identity-events";

    public KafkaAuditService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void emitEvent(String eventType, UUID userId, UUID tenantId, Map<String, Object> additionalData) {
        Map<String, Object> payload = Map.of(
                "eventType", eventType,
                "userId", userId,
                "tenantId", tenantId != null ? tenantId : "null",
                "timestamp", LocalDateTime.now(),
                "data", additionalData != null ? additionalData : Map.of()
        );

        kafkaTemplate.send(TOPIC, userId.toString(), payload);
    }
}
