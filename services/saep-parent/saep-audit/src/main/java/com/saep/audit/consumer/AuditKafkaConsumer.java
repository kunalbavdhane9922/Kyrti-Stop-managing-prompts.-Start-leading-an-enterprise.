package com.saep.audit.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.audit.domain.AuditEvent;
import com.saep.audit.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditKafkaConsumer {

    private final AuditRepository auditRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "audit-events", groupId = "saep-audit-group")
    @Transactional
    public void consumeEvent(String message) {
        try {
            PlatformDomainEvent event = objectMapper.readValue(message, PlatformDomainEvent.class);
            
            // Find previous hash for the tenant
            Optional<AuditEvent> lastEvent = auditRepository.findFirstByTenantIdOrderByOccurredAtDesc(event.getTenantId());
            String previousHash = lastEvent.map(AuditEvent::getHash).orElse("0000000000000000000000000000000000000000000000000000000000000000");

            // Compute current hash = SHA-256(previousHash + eventData)
            String rawData = previousHash + event.getTenantId() + event.getAction() + event.getActorId() + event.getResourceId() + event.getOccurredAt();
            String currentHash = computeSha256(rawData);

            // Create AuditEvent
            AuditEvent auditEvent = new AuditEvent();
            auditEvent.setId(UUID.randomUUID());
            auditEvent.setTenantId(event.getTenantId());
            auditEvent.setAction(event.getAction());
            auditEvent.setActor(event.getActorId());
            auditEvent.setTarget(event.getResourceType() + ":" + event.getResourceId());
            
            java.time.LocalDateTime parsedTime = java.time.LocalDateTime.now(); // fallback
            try {
                // Instant format handling or LocalDateTime
                if (event.getOccurredAt() != null) {
                    if (event.getOccurredAt().contains("T")) {
                         parsedTime = java.time.ZonedDateTime.parse(event.getOccurredAt()).toLocalDateTime();
                    }
                }
            } catch (Exception e) {}
            auditEvent.setOccurredAt(parsedTime);
            
            auditEvent.setSeverity("INFO");
            auditEvent.setDetails("{\"source\":\"" + event.getSourceService() + "\", \"result\":\"" + event.getResult() + "\"}");
            auditEvent.setPreviousHash(previousHash);
            auditEvent.setHash(currentHash);

            auditRepository.save(auditEvent);
            log.info("Saved audit event {} for tenant {} with hash {}", auditEvent.getId(), auditEvent.getTenantId(), auditEvent.getHash());

        } catch (Exception e) {
            log.error("Failed to process audit event: {}", message, e);
            // In production, send to a Dead Letter Queue (DLQ)
        }
    }

    private String computeSha256(String data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
