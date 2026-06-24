package com.saep.communication.repository;

import com.saep.communication.domain.IdempotencyKeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKeyEntity, String> {
    Optional<IdempotencyKeyEntity> findByTenantIdAndIdempotencyKey(UUID tenantId, String idempotencyKey);
}
