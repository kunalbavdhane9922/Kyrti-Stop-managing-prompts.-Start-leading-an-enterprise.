package com.saep.memory.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.memory.domain.MemoryChunk;
import com.saep.memory.domain.MemoryEntry;
import com.saep.memory.domain.ProcessedEvent;
import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.domain.enums.MemoryStatus;
import com.saep.memory.domain.events.MemoryEvents;
import com.saep.memory.exception.EmbeddingProcessingException;
import com.saep.memory.repository.MemoryChunkRepository;
import com.saep.memory.repository.MemoryEntryRepository;
import com.saep.memory.repository.ProcessedEventRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.micrometer.core.instrument.MeterRegistry;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmbeddingWorkerService {

    private final MemoryEntryRepository memoryEntryRepository;
    private final MemoryChunkRepository memoryChunkRepository;
    private final ChunkingStrategy chunkingStrategy;
    private final OllamaEmbeddingClient ollamaEmbeddingClient;
    private final QdrantService qdrantService;
    private final ProcessedEventRepository processedEventRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    public EmbeddingWorkerService(MemoryEntryRepository memoryEntryRepository,
                                  MemoryChunkRepository memoryChunkRepository,
                                  ChunkingStrategy chunkingStrategy,
                                  OllamaEmbeddingClient ollamaEmbeddingClient,
                                  QdrantService qdrantService,
                                  ProcessedEventRepository processedEventRepository,
                                  OutboxEventRepository outboxEventRepository,
                                  MeterRegistry meterRegistry) {
        this.memoryEntryRepository = memoryEntryRepository;
        this.memoryChunkRepository = memoryChunkRepository;
        this.chunkingStrategy = chunkingStrategy;
        this.ollamaEmbeddingClient = ollamaEmbeddingClient;
        this.qdrantService = qdrantService;
        this.processedEventRepository = processedEventRepository;
        this.outboxEventRepository = outboxEventRepository;
        this.meterRegistry = meterRegistry;
        this.objectMapper = new ObjectMapper();
    }

    @RetryableTopic(
        attempts = "3",
        backoff = @Backoff(delay = 1000, multiplier = 5.0, maxDelay = 30000),
        retryTopicSuffix = "-retry",
        dltTopicSuffix = "-dlt"
    )
    @KafkaListener(topics = "memory.embedding.requested", groupId = "saep-embedding-worker")
    @Transactional
    public void onMemoryEvent(String message, Acknowledgment acknowledgment) {
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventId = root.path("eventId").asText();
            String eventType = root.path("eventType").asText();
            String payloadStr = root.path("payload").asText();

            // 1. Check Idempotency Guard
            if (processedEventRepository.existsById(eventId)) {
                log.info("Event {} already processed. Idempotency guard triggered.", eventId);
                acknowledgment.acknowledge();
                return;
            }

            // 2. Route Event
            if ("memory.created.v1".equals(eventType) || "memory.updated.v1".equals(eventType)) {
                MemoryEvents.MemoryCreatedEvent event = objectMapper.readValue(payloadStr, MemoryEvents.MemoryCreatedEvent.class);
                processEmbeddingForMemory(UUID.fromString(event.getMemoryId()), eventId);
            } else if ("memory.deleted.v1".equals(eventType)) {
                MemoryEvents.MemoryDeletedEvent event = objectMapper.readValue(payloadStr, MemoryEvents.MemoryDeletedEvent.class);
                processMemoryDeletion(event);
            }
            
            // 3. Mark Processed inside the same transaction
            processedEventRepository.save(
                ProcessedEvent.builder()
                    .eventId(eventId)
                    .processedAt(LocalDateTime.now())
                    .build()
            );

            // 4. Manually Acknowledge ONLY after Postgres state and Qdrant are fully updated
            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("Failed to process Kafka message for embedding. Retrying...", e);
            throw new EmbeddingProcessingException("Kafka processing failed", e);
        }
    }

    @DltHandler
    public void handleDltMessage(String message, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic, Acknowledgment acknowledgment) {
        log.error("Poison pill event sent to DLQ from topic: {}. Message: {}", topic, message);
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.path("eventType").asText();
            if ("memory.created.v1".equals(eventType) || "memory.updated.v1".equals(eventType)) {
                String payloadStr = root.path("payload").asText();
                MemoryEvents.MemoryCreatedEvent event = objectMapper.readValue(payloadStr, MemoryEvents.MemoryCreatedEvent.class);
                MemoryEntry entry = memoryEntryRepository.findById(UUID.fromString(event.getMemoryId())).orElse(null);
                if (entry != null) {
                    entry.setStatus(MemoryStatus.EMBEDDING_FAILED);
                    entry.setLastEmbeddingError("Exhausted retries. Sent to DLQ.");
                    memoryEntryRepository.save(entry);
                    meterRegistry.counter("embedding.failed.dlq.total").increment();
                }
            } else if ("memory.deleted.v1".equals(eventType)) {
                log.error("Failed to delete vectors from Qdrant after exhausting retries. Message: {}", message);
                meterRegistry.counter("memory.delete.dlq.total").increment();
            }
        } catch (Exception e) {
            log.error("Failed to parse DLQ message for status update", e);
        } finally {
            // Even if DLT handling fails, we should ack to avoid looping in DLT
            acknowledgment.acknowledge();
        }
    }
    
    private void processMemoryDeletion(MemoryEvents.MemoryDeletedEvent event) {
        if (event.getVectorIds() == null || event.getVectorIds().isEmpty()) {
            return;
        }
        
        List<UUID> vectorIds = event.getVectorIds().stream().map(UUID::fromString).collect(Collectors.toList());
        MemoryScope scope = MemoryScope.valueOf(event.getScope().toUpperCase());
        
        try {
            qdrantService.deleteVectors(scope, vectorIds);
            log.info("Successfully deleted {} vectors from scope {} for memory {}", vectorIds.size(), scope, event.getMemoryId());
            meterRegistry.counter("memory.deleted.vectors.total", "scope", scope.name()).increment(vectorIds.size());
        } catch (Exception e) {
            throw new EmbeddingProcessingException("Failed to delete vectors for memory " + event.getMemoryId(), e);
        }
    }

    private void processEmbeddingForMemory(UUID memoryId, String sourceEventId) {
        MemoryEntry entry = memoryEntryRepository.findById(memoryId).orElseThrow();
        
        if (entry.getStatus() == MemoryStatus.ARCHIVED || entry.getStatus() == MemoryStatus.DELETED) {
            return;
        }

        entry.setStatus(MemoryStatus.EMBEDDING_PROCESSING);
        memoryEntryRepository.save(entry);

        try {
            // Clear old chunks if this is an update using Bulk delete
            List<MemoryChunk> oldChunks = memoryChunkRepository.findByMemoryEntryId(entry.getId());
            if (!oldChunks.isEmpty()) {
                List<UUID> oldVectorIds = oldChunks.stream().map(MemoryChunk::getVectorId).collect(Collectors.toList());
                try {
                    qdrantService.deleteVectors(entry.getScope(), oldVectorIds);
                } catch (Exception e) {
                    log.warn("Failed to delete old vectors from Qdrant during update", e);
                }
            }
            memoryChunkRepository.deleteByMemoryEntryId(entry.getId());

            List<String> textChunks = chunkingStrategy.splitText(entry.getContent());
            
            // Generate Embeddings
            Map<Integer, List<Double>> embeddings = new HashMap<>();
            for (int i = 0; i < textChunks.size(); i++) {
                List<Double> vector = ollamaEmbeddingClient.generateEmbedding(textChunks.get(i));
                embeddings.put(i, vector);
            }

            entry.setStatus(MemoryStatus.EMBEDDING_COMPLETE);
            entry.setEmbeddingAttempts(entry.getEmbeddingAttempts() + 1);
            memoryEntryRepository.save(entry);
            
            // Index to Vector DB
            entry.setStatus(MemoryStatus.VECTOR_INDEXING);
            memoryEntryRepository.save(entry);

            for (int i = 0; i < textChunks.size(); i++) {
                String text = textChunks.get(i);
                List<Double> vector = embeddings.get(i);
                
                UUID vectorId = UUID.randomUUID();
                int tokenCount = text.length() / 4; 
                
                MemoryChunk chunk = MemoryChunk.builder()
                        .memoryEntry(entry)
                        .chunkIndex(i)
                        .vectorId(vectorId)
                        .tokenCount(tokenCount)
                        .contentChunk(text)
                        .embeddingModel(ollamaEmbeddingClient.getEmbeddingModel())
                        .embeddingVersion("1.0")
                        .build();
                
                memoryChunkRepository.save(chunk);
                
                Map<String, Object> payload = new HashMap<>();
                payload.put("memory_id", entry.getId().toString());
                payload.put("tenant_id", entry.getTenantId().toString());
                payload.put("scope", entry.getScope().name());
                payload.put("visibility", entry.getVisibility().name());
                payload.put("chunk_index", i);
                payload.put("chunk_text", text);
                
                try {
                    qdrantService.upsertVector(entry.getScope(), vectorId, vector, payload);
                } catch (Exception e) {
                    entry.setStatus(MemoryStatus.VECTOR_INDEX_FAILED);
                    entry.setLastEmbeddingError("Qdrant indexing failed: " + e.getMessage());
                    entry.setNextRetryAt(LocalDateTime.now().plusMinutes(5));
                    memoryEntryRepository.save(entry);
                    meterRegistry.counter("embedding.vector.failed.total").increment();
                    throw e; // Triggers Retry
                }
            }

            entry.setStatus(MemoryStatus.ACTIVE);
            entry.setLastEmbeddingError(null);
            entry.setNextRetryAt(null);
            memoryEntryRepository.save(entry);
            meterRegistry.counter("embedding.success.total").increment();

            // Publish EmbeddingGeneratedEvent
            MemoryEvents.EmbeddingGeneratedEvent eventDto = MemoryEvents.EmbeddingGeneratedEvent.builder()
                    .memoryId(entry.getId().toString())
                    .tenantId(entry.getTenantId().toString())
                    .modelUsed(ollamaEmbeddingClient.getEmbeddingModel())
                    .generatedAt(LocalDateTime.now())
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType("embedding.generated.v1")
                    .topic("memory.events")
                    .tenantId(entry.getTenantId().toString())
                    .payload(objectMapper.writeValueAsString(eventDto))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outboxEvent);

        } catch (Exception e) {
            handleFailure(entry, e);
            throw new EmbeddingProcessingException("Embedding or Indexing failed", e);
        }
    }

    private void handleFailure(MemoryEntry entry, Exception e) {
        entry.setLastEmbeddingError(e.getMessage());
        entry.setNextRetryAt(LocalDateTime.now().plusSeconds(5)); // Roughly matches backoff
        memoryEntryRepository.save(entry);
    }
}
