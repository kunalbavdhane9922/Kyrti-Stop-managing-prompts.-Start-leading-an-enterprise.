package com.saep.workforce.repository;

import com.saep.workforce.domain.CareerHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import java.util.List;

@Repository
public interface CareerHistoryRepository extends JpaRepository<CareerHistoryEntity, UUID> {
    List<CareerHistoryEntity> findByTenantIdAndWorkerIdOrderByOccurredAtDesc(String tenantId, String workerId);
}
