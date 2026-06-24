package com.saep.memory.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.saep.memory.domain.MemoryChunk;
import com.saep.memory.domain.MemoryEntry;
import com.saep.memory.domain.MemoryVersion;
import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.domain.enums.MemoryStatus;
import com.saep.memory.domain.enums.MemoryVisibility;
import com.saep.memory.domain.events.MemoryEvents;
import com.saep.memory.dto.MemorySearchResult;
import com.saep.memory.exception.MemoryNotFoundException;
import com.saep.memory.exception.UnauthorizedMemoryAccessException;
import com.saep.memory.repository.MemoryChunkRepository;
import com.saep.memory.repository.MemoryEntryRepository;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.saep.memory.repository.MemoryVersionRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import io.qdrant.client.grpc.Points.Condition;
import io.qdrant.client.grpc.Points.FieldCondition;
import io.qdrant.client.grpc.Points.Filter;
import io.qdrant.client.grpc.Points.Match;
import io.qdrant.client.grpc.Points.ScoredPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static io.qdrant.client.ConditionFactory.matchKeyword;

@Service
public class MemoryService {

    private static final Logger log = LoggerFactory.getLogger(MemoryService.class);

    private final MemoryEntryRepository memoryEntryRepository;
    private final MemoryVersionRepository memoryVersionRepository;
    private final MemoryChunkRepository memoryChunkRepository;
    private final QdrantService qdrantService;
    private final OllamaEmbeddingClient ollamaEmbeddingClient;
    private final OutboxEventRepository outboxEventRepository;
    private final ProfessionServiceClient professionServiceClient;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    public MemoryService(MemoryEntryRepository memoryEntryRepository,
                         MemoryVersionRepository memoryVersionRepository,
                         MemoryChunkRepository memoryChunkRepository,
                         QdrantService qdrantService,
                         OllamaEmbeddingClient ollamaEmbeddingClient,
                         OutboxEventRepository outboxEventRepository,
                         ProfessionServiceClient professionServiceClient,
                         MeterRegistry meterRegistry) {
        this.memoryEntryRepository = memoryEntryRepository;
        this.memoryVersionRepository = memoryVersionRepository;
        this.memoryChunkRepository = memoryChunkRepository;
        this.qdrantService = qdrantService;
        this.ollamaEmbeddingClient = ollamaEmbeddingClient;
        this.outboxEventRepository = outboxEventRepository;
        this.professionServiceClient = professionServiceClient;
        this.meterRegistry = meterRegistry;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Transactional
    public MemoryEntry createMemory(MemoryEntry request) {
        if (request.getIdempotencyKey() != null) {
            var existing = memoryEntryRepository.findByTenantIdAndIdempotencyKey(request.getTenantId(), request.getIdempotencyKey());
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        request.setStatus(MemoryStatus.PENDING_EMBEDDING);
        request.setVersionNumber(1);
        MemoryEntry saved = memoryEntryRepository.save(request);

        MemoryVersion version = MemoryVersion.builder()
                .memoryEntry(saved)
                .versionNumber(1)
                .content(saved.getContent())
                .build();
        memoryVersionRepository.save(version);

        // Publish Outbox Event
        MemoryEvents.MemoryCreatedEvent eventDto = MemoryEvents.MemoryCreatedEvent.builder()
                .memoryId(saved.getId().toString())
                .tenantId(saved.getTenantId().toString())
                .scope(saved.getScope().name())
                .traceId(saved.getSourceReference())
                .createdAt(saved.getCreatedAt())
                .build();
        publishOutboxEvent("memory.created.v1", "memory.embedding.requested", saved.getTenantId().toString(), eventDto);

        meterRegistry.counter("memory.created.total").increment();
        return saved;
    }

    @Transactional
    public MemoryEntry updateMemory(UUID id, UUID tenantId, UUID userId, String newContent) {
        MemoryEntry entry = getMemoryWithAuthCheck(id, tenantId, userId);
        
        entry.setContent(newContent);
        entry.setVersionNumber(entry.getVersionNumber() + 1);
        entry.setStatus(MemoryStatus.UPDATED);
        
        MemoryEntry saved = memoryEntryRepository.save(entry);

        MemoryVersion version = MemoryVersion.builder()
                .memoryEntry(saved)
                .versionNumber(saved.getVersionNumber())
                .content(saved.getContent())
                .build();
        memoryVersionRepository.save(version);
        
        MemoryEvents.MemoryUpdatedEvent eventDto = MemoryEvents.MemoryUpdatedEvent.builder()
                .memoryId(saved.getId().toString())
                .tenantId(saved.getTenantId().toString())
                .versionNumber(saved.getVersionNumber())
                .updatedAt(LocalDateTime.now())
                .build();
        publishOutboxEvent("memory.updated.v1", "memory.embedding.requested", saved.getTenantId().toString(), eventDto);

        return saved;
    }

    @Transactional
    public void deleteMemory(UUID id, UUID tenantId, UUID userId) {
        MemoryEntry entry = getMemoryWithAuthCheck(id, tenantId, userId);
        entry.setStatus(MemoryStatus.DELETED);
        memoryEntryRepository.save(entry);

        List<MemoryChunk> chunks = memoryChunkRepository.findByMemoryEntryId(id);
        List<String> vectorIds = chunks.stream().map(c -> c.getVectorId().toString()).collect(Collectors.toList());

        MemoryEvents.MemoryDeletedEvent eventDto = MemoryEvents.MemoryDeletedEvent.builder()
                .memoryId(id.toString())
                .tenantId(tenantId.toString())
                .scope(entry.getScope().name())
                .vectorIds(vectorIds)
                .deletedAt(LocalDateTime.now())
                .build();

        publishOutboxEvent("memory.deleted.v1", "memory.embedding.requested", tenantId.toString(), eventDto);
    }

    @Transactional
    public void archiveMemory(UUID id, UUID tenantId, UUID userId, String reason) {
        MemoryEntry entry = getMemoryWithAuthCheck(id, tenantId, userId);
        entry.setStatus(MemoryStatus.ARCHIVED);
        entry.setArchivedAt(LocalDateTime.now());
        entry.setArchivedBy(userId);
        entry.setArchiveReason(reason);
        memoryEntryRepository.save(entry);
        
        MemoryEvents.MemoryArchivedEvent eventDto = MemoryEvents.MemoryArchivedEvent.builder()
                .memoryId(entry.getId().toString())
                .tenantId(entry.getTenantId().toString())
                .archivedBy(userId.toString())
                .archiveReason(reason)
                .archivedAt(entry.getArchivedAt())
                .build();

        publishOutboxEvent("memory.archived.v1", "memory.embedding.requested", entry.getTenantId().toString(), eventDto);
        meterRegistry.counter("memory.archived.total").increment();
    }

    @Transactional(readOnly = true)
    public MemoryEntry getMemoryWithAuthCheck(UUID id, UUID tenantId, UUID userId) {
        MemoryEntry entry = memoryEntryRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new MemoryNotFoundException("Memory not found with ID: " + id));

        if (entry.getVisibility() == MemoryVisibility.PRIVATE && !entry.getOwnerId().equals(userId)) {
            throw new UnauthorizedMemoryAccessException("Unauthorized: Memory is private");
        }
        
        return entry;
    }

    public List<MemorySearchResult> searchMemories(UUID tenantId, UUID userId, String query, int limit) {
        
        // PRE-SEARCH AUTHORIZATION
        ProfessionServiceClient.MemoryAccessPolicy policy = professionServiceClient.getMemoryProfile(userId);
        
        if (policy.getAllowedScopes() == null || policy.getAllowedScopes().isEmpty()) {
            return new ArrayList<>(); // No access
        }

        List<Double> queryVector = ollamaEmbeddingClient.generateEmbedding(query);

        List<CompletableFuture<List<ScoredPoint>>> futures = new ArrayList<>();

        for (String scopeStr : policy.getAllowedScopes()) {
            MemoryScope scope;
            try {
                scope = MemoryScope.valueOf(scopeStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid scope received from policy: {}", scopeStr);
                continue;
            }

            Filter.Builder tenantFilter = Filter.newBuilder()
                    .addMust(Condition.newBuilder().setField(FieldCondition.newBuilder().setKey("tenant_id").setMatch(Match.newBuilder().setKeyword(tenantId.toString()))).build());

            CompletableFuture<List<ScoredPoint>> future = qdrantService.searchMemoriesAsync(scope, queryVector, tenantFilter.build(), limit * 3)
                    .exceptionally(ex -> {
                        log.warn("Search gracefully degraded. Failed for scope: {}", scope, ex);
                        meterRegistry.counter("memory.search.scope.failure", "scope", scope.name()).increment();
                        return List.of();
                    });
            futures.add(future);
        }

        // Wait for all to complete
        CompletableFuture<Void> allOf = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
        List<ScoredPoint> results = allOf.thenApply(v -> futures.stream()
                .flatMap(f -> f.join().stream())
                .collect(Collectors.toList())).join();

        meterRegistry.counter("memory.search.scope.count").increment(futures.size());

        List<MemorySearchResult> finalResults = new ArrayList<>();

        for (ScoredPoint point : results) {
            String memoryIdStr = point.getPayloadMap().get("memory_id").getStringValue();
            UUID memoryId = UUID.fromString(memoryIdStr);

            MemoryEntry entry = memoryEntryRepository.findById(memoryId).orElse(null);
            if (entry == null || entry.getStatus() == MemoryStatus.DELETED || entry.getStatus() == MemoryStatus.ARCHIVED || entry.getStatus() == MemoryStatus.PENDING_TRANSFER) {
                continue;
            }

            // Enforce RBAC again at DB layer
            if (entry.getVisibility() == MemoryVisibility.PRIVATE && !entry.getOwnerId().equals(userId)) {
                continue;
            }

            double vectorSimilarity = point.getScore();
            double importanceScore = entry.getImportanceScore() != null ? entry.getImportanceScore() / 10.0 : 0.5;
            
            long daysOld = ChronoUnit.DAYS.between(entry.getCreatedAt(), LocalDateTime.now());
            double recencyScore = Math.max(0, 1.0 - (daysOld / 365.0));

            double finalScore = (vectorSimilarity * 0.7) + (importanceScore * 0.2) + (recencyScore * 0.1);

            MemorySearchResult result = MemorySearchResult.builder()
                    .memoryId(memoryId)
                    .score(finalScore)
                    .matchedChunk(point.getPayloadMap().get("chunk_text").getStringValue())
                    .chunkIndex((int) point.getPayloadMap().get("chunk_index").getIntegerValue())
                    .fullContent(entry.getContent())
                    .build();

            finalResults.add(result);
        }

        finalResults.sort(Comparator.comparingDouble(MemorySearchResult::getScore).reversed());
        return finalResults.stream().limit(limit).toList();
    }
    
    private void publishOutboxEvent(String type, String topic, String tenantId, Object payloadDto) {
        try {
            OutboxEvent event = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType(type)
                    .topic(topic)
                    .tenantId(tenantId)
                    .payload(objectMapper.writeValueAsString(payloadDto))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(event);
        } catch (JsonProcessingException e) {
            throw new com.saep.memory.exception.MemoryException("Failed to serialize event payload", "MEMORY_006", e);
        }
    }
}
