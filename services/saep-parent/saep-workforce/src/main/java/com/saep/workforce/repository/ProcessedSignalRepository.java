package com.saep.workforce.repository;

import com.saep.workforce.domain.ProcessedSignalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProcessedSignalRepository extends JpaRepository<ProcessedSignalEntity, UUID> {    boolean existsByTenantIdAndSourceEventId(String tenantId, String sourceEventId);
}

