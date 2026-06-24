package com.saep.governance.repository;

import com.saep.governance.domain.GovernanceProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface GovernanceProposalRepository extends JpaRepository<GovernanceProposal, UUID> {
    List<GovernanceProposal> findByTenantIdAndStatus(UUID tenantId, String status);
    List<GovernanceProposal> findByTenantId(UUID tenantId);

    @Modifying
    @Query("UPDATE GovernanceProposal p SET p.status = 'EXPIRED' WHERE p.status = 'PENDING' AND p.expiresAt < :now")
    int markExpiredProposals(@Param("now") LocalDateTime now);
}
