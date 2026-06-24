package com.saep.governance.service;

import com.saep.common.tenant.TenantContext;
import com.saep.governance.domain.GovernanceDecision;
import com.saep.governance.domain.GovernancePolicy;
import com.saep.governance.domain.GovernanceProposal;
import com.saep.governance.domain.OutboxEvent;
import com.saep.governance.repository.GovernanceDecisionRepository;
import com.saep.governance.repository.GovernancePolicyRepository;
import com.saep.governance.repository.GovernanceProposalRepository;
import com.saep.governance.repository.OutboxEventRepository;
import com.saep.governance.validation.ProposalValidatorFactory;
import com.saep.common.enums.ActorType;
import com.saep.common.enums.AuditResult;
import com.saep.common.enums.AuditScope;
import com.saep.common.event.AuditEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class GovernanceService {

    private final GovernanceProposalRepository proposalRepository;
    private final GovernanceDecisionRepository decisionRepository;
    private final GovernancePolicyRepository policyRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ProposalValidatorFactory validatorFactory;
    private final IdentityServiceClient identityServiceClient;
    private final ObjectMapper objectMapper;

    public GovernanceService(GovernanceProposalRepository proposalRepository,
                             GovernanceDecisionRepository decisionRepository,
                             GovernancePolicyRepository policyRepository,
                             OutboxEventRepository outboxEventRepository,
                             ProposalValidatorFactory validatorFactory,
                             IdentityServiceClient identityServiceClient,
                             ObjectMapper objectMapper) {
        this.proposalRepository = proposalRepository;
        this.decisionRepository = decisionRepository;
        this.policyRepository = policyRepository;
        this.outboxEventRepository = outboxEventRepository;
        this.validatorFactory = validatorFactory;
        this.identityServiceClient = identityServiceClient;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public GovernancePolicy createOrUpdatePolicy(String type, int requiredApprovals, boolean mfaRequired, int expirationDays) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context is required");
        }

        Optional<GovernancePolicy> existingPolicyOpt = policyRepository.findByTenantIdAndProposalTypeAndStatus(tenantId, type, "ACTIVE");

        if (existingPolicyOpt.isPresent()) {
            GovernancePolicy existingPolicy = existingPolicyOpt.get();
            existingPolicy.setStatus("ARCHIVED");
            existingPolicy.setUpdatedAt(LocalDateTime.now());
            policyRepository.save(existingPolicy);
        }

        GovernancePolicy newPolicy = new GovernancePolicy();
        newPolicy.setId(UUID.randomUUID());
        newPolicy.setTenantId(tenantId);
        newPolicy.setProposalType(type);
        newPolicy.setCreatedAt(LocalDateTime.now());
        newPolicy.setStatus("ACTIVE");
        newPolicy.setRequiredApprovals(requiredApprovals);
        newPolicy.setMfaRequired(mfaRequired);
        newPolicy.setExpirationDays(expirationDays);

        return policyRepository.save(newPolicy);
    }

    @Transactional
    public GovernanceProposal submitProposal(String type, String payload, String payloadVersion, UUID proposerId, String proposerType) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context is required");
        }

        // Validate payload
        validatorFactory.validatePayload(type, payload);

        // Fetch Policy
        GovernancePolicy policy = policyRepository.findByTenantIdAndProposalTypeAndStatus(tenantId, type, "ACTIVE")
                .orElseThrow(() -> new IllegalArgumentException("No active governance policy defined for type: " + type + " in tenant: " + tenantId));

        GovernanceProposal proposal = new GovernanceProposal();
        proposal.setId(UUID.randomUUID());
        proposal.setTenantId(tenantId);
        proposal.setType(type);
        proposal.setStatus("PENDING");
        proposal.setProposerId(proposerId);
        proposal.setProposerType(proposerType);
        proposal.setPayload(payload);
        proposal.setPayloadVersion(payloadVersion);
        proposal.setRequiredApprovals(policy.getRequiredApprovals());
        proposal.setCurrentApprovals(0);
        proposal.setCreatedAt(LocalDateTime.now());
        proposal.setExpiresAt(LocalDateTime.now().plusDays(policy.getExpirationDays()));

        return proposalRepository.save(proposal);
    }

    @Transactional
    public GovernanceDecision recordDecision(UUID proposalId, UUID approverId, String action, String justification, UUID sessionId, UUID correlationId) {
        GovernanceProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found"));

        // Tenant Isolation Check
        UUID tenantId = TenantContext.getTenantId();
        if (!proposal.getTenantId().equals(tenantId)) {
            throw new SecurityException("Cross-tenant approval attempt blocked");
        }

        if (proposal.isExpired() || "EXPIRED".equals(proposal.getStatus())) {
            throw new IllegalStateException("Cannot decide on an expired proposal");
        }

        if (!"PENDING".equals(proposal.getStatus())) {
            throw new IllegalStateException("Proposal is already " + proposal.getStatus());
        }

        if (decisionRepository.existsByProposalIdAndApproverId(proposalId, approverId)) {
            throw new IllegalStateException("Approver has already recorded a decision for this proposal");
        }

        GovernancePolicy policy = policyRepository.findByTenantIdAndProposalTypeAndStatus(tenantId, proposal.getType(), "ACTIVE")
                .orElseThrow(() -> new IllegalStateException("Active policy not found"));

        if (policy.isMfaRequired()) {
            LocalDateTime mfaAt = identityServiceClient.getMfaVerifiedAt(sessionId);
            if (mfaAt == null || mfaAt.isBefore(LocalDateTime.now().minusMinutes(10))) {
                throw new SecurityException("MFA verified within the last 10 minutes is required for this proposal type");
            }
        }

        GovernanceDecision decision = new GovernanceDecision();
        decision.setId(UUID.randomUUID());
        decision.setProposalId(proposalId);
        decision.setApproverId(approverId);
        decision.setAction(action);
        decision.setJustification(justification);
        decision.setDecidedAt(LocalDateTime.now());
        decision.setSessionId(sessionId);
        decision.setCorrelationId(correlationId);

        decisionRepository.save(decision);

        if ("REJECT".equalsIgnoreCase(action)) {
            proposal.setStatus("REJECTED");
            proposal.setUpdatedAt(LocalDateTime.now());
            proposalRepository.save(proposal);
            writeOutboxEvent(proposal);
            writeAuditEvent(proposal, approverId, correlationId, "REJECTED");
        } else if ("APPROVE".equalsIgnoreCase(action)) {
            proposal.setCurrentApprovals(proposal.getCurrentApprovals() + 1);
            if (proposal.getCurrentApprovals() >= proposal.getRequiredApprovals()) {
                proposal.setStatus("APPROVED");
                writeOutboxEvent(proposal);
                writeAuditEvent(proposal, approverId, correlationId, "APPROVED");
            }
            proposal.setUpdatedAt(LocalDateTime.now());
            proposalRepository.save(proposal);
        }

        return decision;
    }

    private void writeOutboxEvent(GovernanceProposal proposal) {
        OutboxEvent event = new OutboxEvent();
        event.setEventId(UUID.randomUUID());
        event.setProposalId(proposal.getId());
        event.setStatus("PENDING");
        event.setTopic("governance-events");
        // Using string format for JSONB since it's just passing data down
        String payloadJson = String.format(
            "{\"type\":\"%s\",\"status\":\"%s\",\"tenantId\":\"%s\",\"payload\":%s}",
            proposal.getType(), proposal.getStatus(), proposal.getTenantId(), proposal.getPayload()
        );
        event.setPayload(payloadJson);
        event.setCreatedAt(LocalDateTime.now());
        outboxEventRepository.save(event);
    }

    private void writeAuditEvent(GovernanceProposal proposal, UUID approverId, UUID correlationId, String resultStatus) {
        try {
            AuditEvent auditEvent = new AuditEvent();
            auditEvent.setEventId(UUID.randomUUID());
            auditEvent.setCorrelationId(correlationId);
            auditEvent.setActorId(approverId);
            auditEvent.setActorType(ActorType.USER);
            auditEvent.setSourceService("saep-governance");
            auditEvent.setTenantId(proposal.getTenantId());
            auditEvent.setScope(AuditScope.TENANT);
            auditEvent.setAction("GOVERNANCE_DECISION_" + resultStatus);
            auditEvent.setResourceType("GovernanceProposal");
            auditEvent.setResourceId(proposal.getId());
            auditEvent.setResult("APPROVED".equals(resultStatus) ? AuditResult.SUCCESS : AuditResult.FAILURE);
            auditEvent.setOccurredAt(java.time.Instant.now());

            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setEventId(UUID.randomUUID());
            outboxEvent.setProposalId(proposal.getId());
            outboxEvent.setStatus("PENDING");
            outboxEvent.setTopic("audit-events");
            outboxEvent.setPayload(objectMapper.writeValueAsString(auditEvent));
            outboxEvent.setCreatedAt(LocalDateTime.now());
            
            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            System.err.println("Failed to write audit event to outbox: " + e.getMessage());
        }
    }
}
