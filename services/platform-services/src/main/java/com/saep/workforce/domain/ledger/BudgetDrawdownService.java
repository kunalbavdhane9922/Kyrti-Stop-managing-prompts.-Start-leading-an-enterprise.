package com.saep.workforce.domain.ledger;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class BudgetDrawdownService {

    private final AgentLedgerRepository ledgerRepository;

    public BudgetDrawdownService(AgentLedgerRepository ledgerRepository) {
        this.ledgerRepository = ledgerRepository;
    }

    /**
     * STRICT ACID TRANSACTION
     * If the server crashes inside this method, PostgreSQL automatically rolls back the entire state.
     * The cost limit is locked.
     */
    @Transactional
    public AgentLedgerEntity hireAgentSafely(String tenantId, String professionalId, BigDecimal limitUsd) {
        // Enforce strict business logic
        if (limitUsd.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("CRITICAL: Cannot hire an agent with zero budget.");
        }

        AgentLedgerEntity newAgent = new AgentLedgerEntity(tenantId, professionalId, limitUsd);
        
        // This save is queued in the transaction context. It hasn't hit the disk permanently yet.
        return ledgerRepository.save(newAgent);
    }
}
