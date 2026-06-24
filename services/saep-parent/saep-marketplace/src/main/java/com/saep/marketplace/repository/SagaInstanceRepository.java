package com.saep.marketplace.repository;

import com.saep.marketplace.domain.SagaInstanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SagaInstanceRepository extends JpaRepository<SagaInstanceEntity, UUID> {
    Optional<SagaInstanceEntity> findByCorrelationId(String correlationId);
}
