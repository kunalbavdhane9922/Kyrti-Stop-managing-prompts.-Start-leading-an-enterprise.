package com.saep.workforce.repository;

import com.saep.workforce.domain.ProfessionalReputationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProfessionalReputationRepository extends JpaRepository<ProfessionalReputationEntity, UUID> {    java.util.Optional<com.saep.workforce.domain.ProfessionalReputationEntity> findByTenantIdAndWorkerId(String tenantId, String workerId);
}

