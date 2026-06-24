package com.saep.workforce.application.commands;

import java.math.BigDecimal;

/**
 * COMMAND QUERY RESPONSIBILITY SEGREGATION (CQRS)
 * This is a heavy Write-Model. It strictly encapsulates the data required to alter
 * the state of the system (hiring an agent). It is completely decoupled from Read-Models.
 */
public record HireAgentCommand(
    String tenantId,
    String professionalId,
    String taskDescription,
    BigDecimal budgetLimitUsd
) {
    public HireAgentCommand {
        if (tenantId == null || tenantId.isBlank()) {
            throw new IllegalArgumentException("Tenant ID is strictly required for sovereign execution.");
        }
        if (budgetLimitUsd == null || budgetLimitUsd.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget Limit must be greater than zero.");
        }
    }
}
