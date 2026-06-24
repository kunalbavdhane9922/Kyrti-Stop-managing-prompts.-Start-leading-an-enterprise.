package com.saep.workforce.repository;

import com.saep.workforce.domain.CompanyReputationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface CompanyReputationRepository extends JpaRepository<CompanyReputationEntity, UUID> {    java.util.Optional<com.saep.workforce.domain.CompanyReputationEntity> findByTenantIdAndCompanyId(String tenantId, String companyId);
}

