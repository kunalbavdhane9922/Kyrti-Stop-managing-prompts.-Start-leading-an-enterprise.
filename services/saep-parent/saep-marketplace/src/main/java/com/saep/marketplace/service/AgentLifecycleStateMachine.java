package com.saep.marketplace.service;

import com.saep.marketplace.domain.AgentStatus;
import com.saep.marketplace.domain.MarketplaceAgentEntity;
import com.saep.marketplace.security.TenantContextEnforcement;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AgentLifecycleStateMachine {

    private final TenantContextEnforcement tenantEnforcement;

    public AgentLifecycleStateMachine(TenantContextEnforcement tenantEnforcement) {
        this.tenantEnforcement = tenantEnforcement;
    }

    /**
     * Validates and transitions the agent to the RESERVED state.
     */
    public void transitionToReserved(MarketplaceAgentEntity agent, UUID reservingTenantId, Instant reservedUntil) {
        enforceTenant(agent);
        if (agent.getStatus() != AgentStatus.AVAILABLE) {
            throw new IllegalStateException("Agent must be AVAILABLE to be reserved.");
        }
        
        agent.setStatus(AgentStatus.RESERVED);
        agent.setReservedByTenantId(reservingTenantId);
        agent.setReservedUntil(reservedUntil);
        incrementLifecycleVersion(agent);
    }

    /**
     * Validates and transitions the agent to the HIRED state.
     */
    public void transitionToHired(MarketplaceAgentEntity agent, UUID hiringTenantId) {
        enforceTenant(agent);
        if (agent.getStatus() != AgentStatus.RESERVED) {
            throw new IllegalStateException("Agent must be RESERVED before being HIRED.");
        }
        if (agent.getReservedByTenantId() != null && !agent.getReservedByTenantId().equals(hiringTenantId)) {
            throw new IllegalStateException("Agent is reserved by a different tenant.");
        }
        
        agent.setStatus(AgentStatus.HIRED);
        agent.setReservedByTenantId(null);
        agent.setReservedUntil(null);
        incrementLifecycleVersion(agent);
    }

    /**
     * Validates and transitions the agent to TERMINATION_PENDING.
     */
    public void transitionToTerminationPending(MarketplaceAgentEntity agent) {
        enforceTenant(agent);
        if (agent.getStatus() != AgentStatus.HIRED) {
            throw new IllegalStateException("Agent must be HIRED to initiate termination.");
        }

        agent.setStatus(AgentStatus.TERMINATION_PENDING);
        incrementLifecycleVersion(agent);
    }

    /**
     * Validates and transitions the agent to AVAILABLE.
     */
    public void transitionToAvailable(MarketplaceAgentEntity agent) {
        enforceTenant(agent);
        if (agent.getStatus() != AgentStatus.TERMINATION_PENDING && agent.getStatus() != AgentStatus.RESERVED) {
            throw new IllegalStateException("Agent must be TERMINATION_PENDING or RESERVED to become AVAILABLE.");
        }

        agent.setStatus(AgentStatus.AVAILABLE);
        agent.setReservedByTenantId(null);
        agent.setReservedUntil(null);
        incrementLifecycleVersion(agent);
    }

    /**
     * Validates and transitions the agent to RETIRED.
     */
    public void transitionToRetired(MarketplaceAgentEntity agent, int activeContractCount) {
        enforceTenant(agent);
        if (agent.getStatus() != AgentStatus.HIRED && agent.getStatus() != AgentStatus.AVAILABLE) {
            throw new IllegalStateException("Agent can only be retired from HIRED or AVAILABLE states.");
        }
        
        // Invariant: activeContractCount == 0
        if (activeContractCount > 0) {
            throw new IllegalStateException("Agent cannot be retired while having active contracts.");
        }

        agent.setStatus(AgentStatus.RETIRED);
        incrementLifecycleVersion(agent);
    }

    private void enforceTenant(MarketplaceAgentEntity agent) {
        if (agent.getTenantId() != null) {
            tenantEnforcement.enforceTenantMatch(agent.getTenantId());
        }
    }

    private void incrementLifecycleVersion(MarketplaceAgentEntity agent) {
        if (agent.getLifecycleVersion() == null) {
            agent.setLifecycleVersion(1L);
        } else {
            agent.setLifecycleVersion(agent.getLifecycleVersion() + 1);
        }
    }
}
