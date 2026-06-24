package com.saep.workforce.domain.ledger;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AgentLedgerRepository extends JpaRepository<AgentLedgerEntity, UUID> {
    // Basic repository. Row-level security is handled by the Hibernate Filter.
}
