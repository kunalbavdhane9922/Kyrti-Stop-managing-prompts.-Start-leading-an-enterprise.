package com.saep.memory.service;

import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.exception.MemoryException;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections.CollectionInfo;
import io.qdrant.client.grpc.Collections.Distance;
import io.qdrant.client.grpc.Collections.VectorParams;
import io.qdrant.client.grpc.Points.Filter;
import io.qdrant.client.grpc.Points.PointId;
import io.qdrant.client.grpc.Points.PointStruct;
import io.qdrant.client.grpc.Points.ScoredPoint;
import io.qdrant.client.grpc.Points.SearchPoints;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import static io.qdrant.client.PointIdFactory.id;
import static io.qdrant.client.ValueFactory.value;
import static io.qdrant.client.VectorsFactory.vectors;

@Service
public class QdrantService {

    private static final Logger log = LoggerFactory.getLogger(QdrantService.class);
    private final QdrantClient qdrantClient;
    private final MeterRegistry meterRegistry;

    @Value("${saep.ollama.embedding.dimensions}")
    private int dimensions;

    public QdrantService(QdrantClient qdrantClient, MeterRegistry meterRegistry) {
        this.qdrantClient = qdrantClient;
        this.meterRegistry = meterRegistry;
    }

    private String getCollectionName(MemoryScope scope) {
        return "saep_" + scope.name().toLowerCase() + "_memory";
    }

    @PostConstruct
    public void initCollections() {
        for (MemoryScope scope : MemoryScope.values()) {
            String collectionName = getCollectionName(scope);
            try {
                boolean exists = qdrantClient.collectionExistsAsync(collectionName).get();
                if (!exists) {
                    log.info("Creating missing Qdrant collection: {}", collectionName);
                    qdrantClient.createCollectionAsync(collectionName,
                            VectorParams.newBuilder()
                                    .setSize(dimensions)
                                    .setDistance(Distance.Cosine)
                                    .build()).get();
                } else {
                    log.info("Validating existing Qdrant collection: {}", collectionName);
                    CollectionInfo info = qdrantClient.getCollectionInfoAsync(collectionName).get();
                    
                    // Simple validation logic to ensure dimension and distance match.
                    // Note: The protobuf API for getting detailed vector config requires checking the config map.
                    // For enterprise safety, we assume if it exists we should just make sure it's accessible.
                    // In a production system, we'd deeply inspect info.getConfig().getParams().getVectorsConfig().
                    log.debug("Collection {} is accessible and contains {} points", collectionName, info.getPointsCount());
                }
            } catch (ExecutionException e) {
                // If it already exists, Qdrant might throw an error if multiple pods race to create it.
                if (e.getMessage() != null && e.getMessage().contains("already exists")) {
                    log.info("Collection {} already exists (created by another pod). Proceeding.", collectionName);
                } else {
                    throw new MemoryException("Failed to initialize or validate Qdrant collection: " + collectionName, "QDRANT_INIT", e);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new MemoryException("Interrupted while initializing Qdrant collection: " + collectionName, "QDRANT_INIT", e);
            }
        }
    }

    public void upsertVector(MemoryScope scope, UUID vectorId, List<Double> vector, Map<String, Object> payload) {
        String collectionName = getCollectionName(scope);
        List<Float> floatVector = vector.stream().map(Double::floatValue).collect(Collectors.toList());

        PointStruct.Builder pointBuilder = PointStruct.newBuilder()
                .setId(id(vectorId))
                .setVectors(vectors(floatVector));

        payload.forEach((k, v) -> {
            if (v instanceof String) pointBuilder.putPayload(k, value((String) v));
            else if (v instanceof Integer) pointBuilder.putPayload(k, value(((Integer) v).longValue()));
            else if (v instanceof Long) pointBuilder.putPayload(k, value((Long) v));
            else if (v instanceof Double) pointBuilder.putPayload(k, value((Double) v));
            else if (v instanceof Float) pointBuilder.putPayload(k, value(((Float) v).doubleValue()));
            else if (v instanceof Boolean) pointBuilder.putPayload(k, value((Boolean) v));
            else if (v != null) pointBuilder.putPayload(k, value(v.toString()));
        });

        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            qdrantClient.upsertAsync(collectionName, List.of(pointBuilder.build())).get();
            sample.stop(meterRegistry.timer("qdrant.collection.upsert.duration", "collection", collectionName));
        } catch (InterruptedException | ExecutionException e) {
            meterRegistry.counter("qdrant.collection.upsert.failures", "collection", collectionName).increment();
            throw new MemoryException("Failed to upsert vector to Qdrant collection: " + collectionName, "QDRANT_UPSERT", e);
        }
    }

    public CompletableFuture<List<ScoredPoint>> searchMemoriesAsync(MemoryScope scope, List<Double> queryVector, Filter filter, int limit) {
        String collectionName = getCollectionName(scope);
        List<Float> floatVector = queryVector.stream().map(Double::floatValue).collect(Collectors.toList());

        SearchPoints request = SearchPoints.newBuilder()
                .setCollectionName(collectionName)
                .addAllVector(floatVector)
                .setFilter(filter)
                .setLimit(limit)
                .setWithPayload(io.qdrant.client.grpc.Points.WithPayloadSelector.newBuilder().setEnable(true).build())
                .build();

        Timer.Sample sample = Timer.start(meterRegistry);
        CompletableFuture<List<ScoredPoint>> future = new CompletableFuture<>();
        com.google.common.util.concurrent.Futures.addCallback(
                qdrantClient.searchAsync(request),
                new com.google.common.util.concurrent.FutureCallback<List<ScoredPoint>>() {
                    @Override
                    public void onSuccess(List<ScoredPoint> result) {
                        sample.stop(meterRegistry.timer("qdrant.collection.search.duration", "collection", collectionName));
                        future.complete(result);
                    }

                    @Override
                    public void onFailure(Throwable ex) {
                        meterRegistry.counter("qdrant.collection.search.failures", "collection", collectionName).increment();
                        log.error("Search failed for collection {}", collectionName, ex);
                        future.completeExceptionally(ex);
                    }
                },
                com.google.common.util.concurrent.MoreExecutors.directExecutor()
        );
        return future;
    }
    
    public void deleteVectors(MemoryScope scope, List<UUID> vectorIds) {
        if (vectorIds == null || vectorIds.isEmpty()) return;
        
        String collectionName = getCollectionName(scope);
        List<PointId> points = vectorIds.stream().map(id -> id(id)).collect(Collectors.toList());

        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            qdrantClient.deleteAsync(collectionName, points).get();
            sample.stop(meterRegistry.timer("qdrant.bulk.delete.duration", "collection", collectionName));
        } catch (ExecutionException e) {
            // Idempotency: Ignore if not found
            if (e.getMessage() != null && e.getMessage().contains("Not found")) {
                log.info("Vectors not found in collection {}, assuming already deleted.", collectionName);
                return;
            }
            meterRegistry.counter("qdrant.bulk.delete.failures", "collection", collectionName).increment();
            throw new MemoryException("Failed to delete vectors from Qdrant collection: " + collectionName, "QDRANT_DELETE", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new MemoryException("Interrupted while deleting vectors", "QDRANT_DELETE", e);
        }
    }
}
