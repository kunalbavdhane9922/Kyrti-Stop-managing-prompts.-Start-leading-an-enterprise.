package com.saep.workforce.repository;

import com.saep.workforce.domain.WorkforceScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface WorkforceScoreRepository extends JpaRepository<WorkforceScoreEntity, UUID> {    java.util.Optional<com.saep.workforce.domain.WorkforceScoreEntity> findByTenantIdAndWorkerId(String tenantId, String workerId);
}

