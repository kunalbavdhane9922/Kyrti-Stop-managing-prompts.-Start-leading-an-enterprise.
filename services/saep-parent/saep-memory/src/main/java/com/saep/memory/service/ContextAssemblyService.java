package com.saep.memory.service;

import com.saep.memory.domain.MemoryEntry;
import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.domain.enums.MemoryStatus;
import com.saep.memory.domain.enums.MemoryVisibility;
import com.saep.memory.dto.ContextDTOs.AgentContextResponse;
import com.saep.memory.dto.ContextDTOs.ContextCandidate;
import com.saep.memory.repository.MemoryEntryRepository;
import io.micrometer.core.instrument.MeterRegistry;
import io.qdrant.client.grpc.Points.Condition;
import io.qdrant.client.grpc.Points.FieldCondition;
import io.qdrant.client.grpc.Points.Filter;
import io.qdrant.client.grpc.Points.Match;
import io.qdrant.client.grpc.Points.ScoredPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ContextAssemblyService {

    private static final Logger log = LoggerFactory.getLogger(ContextAssemblyService.class);

    private final ProfessionServiceClient professionServiceClient;
    private final OllamaEmbeddingClient ollamaEmbeddingClient;
    private final QdrantService qdrantService;
    private final MemoryEntryRepository memoryEntryRepository;
    private final ContextRankingService contextRankingService;
    private final MeterRegistry meterRegistry;

    public ContextAssemblyService(ProfessionServiceClient professionServiceClient,
                                  OllamaEmbeddingClient ollamaEmbeddingClient,
                                  QdrantService qdrantService,
                                  MemoryEntryRepository memoryEntryRepository,
                                  ContextRankingService contextRankingService,
                                  MeterRegistry meterRegistry) {
        this.professionServiceClient = professionServiceClient;
        this.ollamaEmbeddingClient = ollamaEmbeddingClient;
        this.qdrantService = qdrantService;
        this.memoryEntryRepository = memoryEntryRepository;
        this.contextRankingService = contextRankingService;
        this.meterRegistry = meterRegistry;
    }

    public AgentContextResponse assembleAgentContext(UUID agentId, UUID tenantId, String query, int maxResults) {
        ProfessionServiceClient.MemoryAccessPolicy policy = professionServiceClient.getMemoryProfile(agentId);

        if (policy.getAllowedScopes() == null || policy.getAllowedScopes().isEmpty()) {
            return AgentContextResponse.builder()
                    .estimatedTokens(0)
                    .averageRankingScore(0.0)
                    .semanticResults(new ArrayList<>())
                    .build();
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

            CompletableFuture<List<ScoredPoint>> future = qdrantService.searchMemoriesAsync(scope, queryVector, tenantFilter.build(), maxResults * 3)
                    .exceptionally(ex -> {
                        log.warn("Context Assembly search gracefully degraded. Failed for scope: {}", scope, ex);
                        meterRegistry.counter("context.assembly.scope.failure", "scope", scope.name()).increment();
                        return List.of();
                    });
            futures.add(future);
        }

        // Wait for all queries to complete
        CompletableFuture<Void> allOf = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
        List<ScoredPoint> results = allOf.thenApply(v -> futures.stream()
                .flatMap(f -> f.join().stream())
                .collect(Collectors.toList())).join();

        meterRegistry.counter("context.assembly.scope.count").increment(futures.size());

        List<ContextCandidate> candidates = new ArrayList<>();
        int totalEstimatedTokens = 0;

        for (ScoredPoint point : results) {
            String memoryIdStr = point.getPayloadMap().get("memory_id").getStringValue();
            UUID memoryId = UUID.fromString(memoryIdStr);

            MemoryEntry entry = memoryEntryRepository.findById(memoryId).orElse(null);
            if (entry == null || entry.getStatus() == MemoryStatus.DELETED || entry.getStatus() == MemoryStatus.ARCHIVED || entry.getStatus() == MemoryStatus.PENDING_TRANSFER) {
                continue;
            }

            if (entry.getVisibility() == MemoryVisibility.PRIVATE && !entry.getOwnerId().equals(agentId)) {
                continue;
            }

            double semanticScore = point.getScore();
            long daysOld = ChronoUnit.DAYS.between(entry.getCreatedAt(), LocalDateTime.now());
            double recencyScore = Math.max(0, 1.0 - (daysOld / 365.0));
            double accessPriority = entry.getImportanceScore() != null ? entry.getImportanceScore() / 10.0 : 0.5;

            String content = point.getPayloadMap().get("chunk_text").getStringValue();

            ContextCandidate candidate = ContextCandidate.builder()
                    .memoryId(memoryIdStr)
                    .semanticScore(semanticScore)
                    .recencyScore(recencyScore)
                    .accessPriority(accessPriority)
                    .content(content)
                    .build();

            candidates.add(candidate);
        }

        List<ContextCandidate> rankedResults = contextRankingService.rankContext(candidates, maxResults);
        
        for (ContextCandidate c : rankedResults) {
            totalEstimatedTokens += (c.getContent().length() / 4);
        }

        return AgentContextResponse.builder()
                .estimatedTokens(totalEstimatedTokens)
                .averageRankingScore(contextRankingService.calculateAverageScore(rankedResults))
                .semanticResults(rankedResults)
                .build();
    }
}
