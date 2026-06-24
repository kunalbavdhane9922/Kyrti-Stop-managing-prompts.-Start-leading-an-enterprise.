package com.saep.identity.service;

import com.saep.identity.domain.AuditOutbox;
import com.saep.identity.repository.AuditOutboxRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OutboxPublisher {

    private static final Logger log = LoggerFactory.getLogger(OutboxPublisher.class);

    private final AuditOutboxRepository outboxRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public OutboxPublisher(AuditOutboxRepository outboxRepository, KafkaTemplate<String, Object> kafkaTemplate, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.outboxRepository = outboxRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void publishOutboxEvents() {
        List<AuditOutbox> pendingEvents = outboxRepository.findByProcessedFalseOrderByCreatedAtAsc();

        for (AuditOutbox event : pendingEvents) {
            try {
                if ("AUDIT_EVENT".equals(event.getEventType())) {
                    Object payloadObj = objectMapper.readValue(event.getPayload(), Object.class);
                    kafkaTemplate.send("audit-events", event.getId().toString(), payloadObj);
                }
                event.setProcessed(true);
                outboxRepository.save(event);
            } catch (Exception e) {
                log.error("Failed to publish outbox event: {}", event.getId(), e);
                // Break out of loop to maintain ordering if there's a Kafka failure
                break;
            }
        }
    }
}
