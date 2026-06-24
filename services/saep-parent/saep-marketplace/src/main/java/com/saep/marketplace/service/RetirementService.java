package com.saep.marketplace.service;

import com.saep.marketplace.domain.AgentStatus;
import com.saep.marketplace.domain.MarketplaceAgentEntity;
import com.saep.marketplace.repository.AgentHireRepository;
import com.saep.marketplace.repository.AgentWorkflowRepository;
import com.saep.marketplace.repository.DisputeRepository;
import com.saep.marketplace.repository.MarketplaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RetirementService {

    private final MarketplaceRepository agentRepository;
    private final AgentHireRepository hireRepository;
    private final DisputeRepository disputeRepository;
    private final AgentWorkflowRepository workflowRepository;
    private final AgentLifecycleStateMachine stateMachine;

    /**
     * Automatically retires agents that have consistently low performance 
     * or zero demand after a predefined trial period.
     */
    @Scheduled(cron = "0 0 3 * * ?") // 3 AM every day
    public void scanAndRetireUnderperformingAgents() {
        log.info("Running scheduled automation to retire underperforming agents.");
        
        // Find agents that are available, not reserved, and have a very low score
        List<MarketplaceAgentEntity> candidates = agentRepository.findAll().stream()
            .filter(agent -> agent.getStatus() == AgentStatus.AVAILABLE)
            .filter(agent -> agent.getReservedByTenantId() == null)
            .filter(agent -> agent.getReputationScore() != null && agent.getReputationScore() < 20.0) // Arbitrary threshold for "underperforming"
            .toList();

        for (MarketplaceAgentEntity agent : candidates) {
            try {
                // Ensure no active contracts
                int activeContracts = hireRepository.countActiveContractsForAgent(agent.getId());
                
                // Ensure no running sagas/workflows etc.
                int openDisputes = disputeRepository.countOpenDisputesForAgent(agent.getId());
                int runningWorkflows = workflowRepository.countRunningWorkflowsForAgent(agent.getId());
                
                if (activeContracts == 0 && openDisputes == 0 && runningWorkflows == 0) {
                    stateMachine.transitionToRetired(agent, activeContracts);
                    agentRepository.save(agent);
                    log.info("Retired agent {} due to poor performance/low demand.", agent.getId());
                }
            } catch (Exception e) {
                log.error("Failed to process retirement for agent {}", agent.getId(), e);
            }
        }
    }
}
