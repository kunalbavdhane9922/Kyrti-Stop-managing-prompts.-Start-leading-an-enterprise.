package com.saep.governance.repository;

import com.saep.governance.domain.GovernanceDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GovernanceDecisionRepository extends JpaRepository<GovernanceDecision, UUID> {
    boolean existsByProposalIdAndApproverId(UUID proposalId, UUID approverId);
}
