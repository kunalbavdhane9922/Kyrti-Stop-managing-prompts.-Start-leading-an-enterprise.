package com.saep.marketplace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.marketplace.domain.MarketplaceSearchDocument;
import com.saep.marketplace.domain.ProcessedEventEntity;
import com.saep.marketplace.repository.MarketplaceSearchRepository;
import com.saep.marketplace.repository.MarketplaceProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchProjector {

    private final MarketplaceProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;
    private final MarketplaceSearchRepository searchRepository;

    /**
     * Consumes marketplace domain events to populate the Search Projection table.
     * This decouples complex search logic from the core transactional aggregate.
     */
    @KafkaListener(topics = "marketplace.events.outbound", groupId = "saep-marketplace-search-projector")
    @Transactional
    public void projectSearchIndex(String message) {
        log.debug("Projecting event to search index: {}", message);
        
        try {
            JsonNode eventNode = objectMapper.readTree(message);
            
            // 1. Schema Validation
            if (!eventNode.has("eventId") || !eventNode.has("eventType") || !eventNode.has("payload")) {
                log.error("Invalid event schema. Missing required envelopes: {}", message);
                return; // DLQ handling should occur here
            }
            
            String eventId = eventNode.get("eventId").asText();
            String eventType = eventNode.get("eventType").asText();
            JsonNode payload = eventNode.get("payload");
            
            // 2. Transactional Atomic Inbox (Idempotency)
            if (processedEventRepository.existsByEventIdAndConsumerGroup(eventId, "search-projector")) {
                log.info("Event {} already processed by search-projector. Skipping.", eventId);
                return;
            }

            // 3. Upcasting Strategy
            if (eventType.equals("agent.created.v1")) {
                log.info("Upcasting agent.created.v1 to agent.created.v2 for search projection");
                // Example Upcast: adding default schema fields that were introduced in v2
                // ((ObjectNode) payload).put("defaultTier", "STANDARD");
                eventType = "agent.created.v2";
            }
            
            // 4. Projection Logic
            if (eventType.equals("agent.created.v2") || eventType.equals("agent.updated.v1")) {
                String agentId = payload.get("agentId").asText();
                MarketplaceSearchDocument doc = searchRepository.findById(agentId)
                        .orElse(new MarketplaceSearchDocument());
                
                doc.setAgentId(agentId);
                doc.setTenantId(UUID.fromString(payload.get("tenantId").asText()));
                doc.setDocumentBody(payload.toString());
                doc.setStatus(payload.has("status") ? payload.get("status").asText() : "UNKNOWN");
                if (payload.has("reputationScore")) {
                    doc.setReputationScore(payload.get("reputationScore").asDouble());
                }
                doc.setUpdatedAt(java.time.Instant.now());
                
                searchRepository.save(doc);
                log.info("Successfully projected event {} to search index", eventId);
            }
            
            // 5. Mark as processed in the same transaction
            ProcessedEventEntity processed = new ProcessedEventEntity();
            processed.setEventId(eventId);
            processed.setConsumerGroup("search-projector");
            processed.setProcessedAt(LocalDateTime.now());
            processedEventRepository.save(processed);
            
        } catch (Exception e) {
            log.error("Failed to project search index for message: {}", message, e);
            throw new RuntimeException("Search projection failed, triggering retry/DLQ", e);
        }
    }
}
