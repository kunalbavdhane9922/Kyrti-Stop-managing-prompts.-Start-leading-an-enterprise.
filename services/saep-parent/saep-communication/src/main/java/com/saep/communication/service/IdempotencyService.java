package com.saep.communication.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.communication.domain.IdempotencyKeyEntity;
import com.saep.communication.repository.IdempotencyKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final IdempotencyKeyRepository repository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Optional<IdempotencyKeyEntity> checkOrStoreIdempotencyKey(UUID tenantId, String key, String requestHash) {
        if (key == null || key.isEmpty()) {
            return Optional.empty();
        }

        Optional<IdempotencyKeyEntity> existing = repository.findByTenantIdAndIdempotencyKey(tenantId, key);
        if (existing.isPresent()) {
            return existing;
        }

        IdempotencyKeyEntity newKey = IdempotencyKeyEntity.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .idempotencyKey(key)
                .requestHash(requestHash)
                .statusCode(202) // pending
                .createdAt(Instant.now())
                .build();

        repository.save(newKey);
        return Optional.empty(); // It's new, so we return empty to signal execution should proceed
    }

    @Transactional
    public void saveResponse(UUID tenantId, String key, Object response, int statusCode) {
        if (key == null || key.isEmpty()) return;

        repository.findByTenantIdAndIdempotencyKey(tenantId, key).ifPresent(entity -> {
            try {
                entity.setResponsePayload(objectMapper.writeValueAsString(response));
                entity.setStatusCode(statusCode);
                repository.save(entity);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize idempotency response", e);
            }
        });
    }
}
