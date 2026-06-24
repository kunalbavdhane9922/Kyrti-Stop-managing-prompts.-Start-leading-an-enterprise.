package com.saep.audit.consumer;

import com.saep.audit.repository.AuditWriteRepository;
import com.saep.common.event.AuditEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Service
public class AuditKafkaConsumer {

    private static final Logger logger = LoggerFactory.getLogger(AuditKafkaConsumer.class);

    private final AuditWriteRepository auditWriteRepository;

    public AuditKafkaConsumer(AuditWriteRepository auditWriteRepository) {
        this.auditWriteRepository = auditWriteRepository;
    }

    @KafkaListener(topics = "audit-events", groupId = "saep-audit-group")
    public void consumeAuditEvent(AuditEvent event, Acknowledgment acknowledgment) {
        try {
            logger.debug("Received audit event: {}", event.getEventId());
            
            auditWriteRepository.insertAuditRecord(event);
            
            // Manual ACKs strictly after successful database insert
            acknowledgment.acknowledge();
            
        } catch (Exception e) {
            logger.error("Failed to process audit event: {}", event.getEventId(), e);
            // We do NOT acknowledge here. It will either retry or go to DLT depending on Kafka config.
            throw e; 
        }
    }
}
