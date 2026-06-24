package com.saep.governance.repository;

import com.saep.governance.domain.GovernancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface GovernancePolicyRepository extends JpaRepository<GovernancePolicy, UUID> {
    Optional<GovernancePolicy> findByTenantIdAndProposalTypeAndStatus(UUID tenantId, String proposalType, String status);
    List<GovernancePolicy> findByTenantIdAndStatus(UUID tenantId, String status);
}
