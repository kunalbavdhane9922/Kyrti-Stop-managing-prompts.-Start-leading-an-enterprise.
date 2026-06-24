package com.saep.governance.controller;

import com.saep.common.security.RequirePermission;
import com.saep.common.tenant.TenantContext;
import com.saep.governance.domain.GovernancePolicy;
import com.saep.governance.domain.GovernanceDecision;
import com.saep.governance.domain.GovernanceProposal;
import com.saep.governance.repository.GovernanceProposalRepository;
import com.saep.governance.service.GovernanceService;
import com.saep.governance.repository.GovernancePolicyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/governance")
public class GovernanceController {

    private final GovernanceService governanceService;
    private final GovernanceProposalRepository proposalRepository;
    private final GovernancePolicyRepository policyRepository;

    public GovernanceController(GovernanceService governanceService, 
                                GovernanceProposalRepository proposalRepository,
                                GovernancePolicyRepository policyRepository) {
        this.governanceService = governanceService;
        this.proposalRepository = proposalRepository;
        this.policyRepository = policyRepository;
    }

    @PostMapping("/policies")
    @RequirePermission("governance.configure")
    public ResponseEntity<?> createOrUpdatePolicy(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("proposalType");
            int requiredApprovals = payload.containsKey("requiredApprovals") ? (Integer) payload.get("requiredApprovals") : 1;
            boolean mfaRequired = payload.containsKey("mfaRequired") ? (Boolean) payload.get("mfaRequired") : false;
            int expirationDays = payload.containsKey("expirationDays") ? (Integer) payload.get("expirationDays") : 7;

            GovernancePolicy policy = governanceService.createOrUpdatePolicy(type, requiredApprovals, mfaRequired, expirationDays);
            return ResponseEntity.ok(policy);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/proposals")
    @RequirePermission("governance.propose")
    public ResponseEntity<?> submitProposal(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");
            String data = payload.get("payload").toString();
            String version = (String) payload.getOrDefault("payloadVersion", "v1");
            
            // Extract from JWT / context
            UUID proposerId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
            String proposerType = com.saep.common.enums.ActorType.USER.name();

            GovernanceProposal proposal = governanceService.submitProposal(type, data, version, proposerId, proposerType);
            return ResponseEntity.ok(proposal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/proposals/pending")
    @RequirePermission("governance.read")
    public ResponseEntity<List<GovernanceProposal>> getPendingProposals() {
        UUID tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(proposalRepository.findByTenantIdAndStatus(tenantId, "PENDING"));
    }

    @GetMapping("/proposals")
    @RequirePermission("governance.read")
    public ResponseEntity<List<GovernanceProposal>> getAllProposals() {
        UUID tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(proposalRepository.findByTenantId(tenantId));
    }

    @GetMapping("/proposals/{id}")
    @RequirePermission("governance.read")
    public ResponseEntity<?> getProposal(@PathVariable UUID id) {
        UUID tenantId = TenantContext.getTenantId();
        return proposalRepository.findById(id)
                .filter(p -> p.getTenantId().equals(tenantId))
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/policies")
    @RequirePermission("governance.read")
    public ResponseEntity<List<GovernancePolicy>> getPolicies() {
        UUID tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(policyRepository.findByTenantIdAndStatus(tenantId, "ACTIVE"));
    }

    @PostMapping("/proposals/{id}/decisions")
    @RequirePermission("governance.approve")
    public ResponseEntity<?> recordDecision(@PathVariable UUID id, @RequestBody Map<String, Object> payload) {
        try {
            String action = (String) payload.get("action");
            String justification = (String) payload.get("justification");
            
            // Extract from JWT / context
            UUID approverId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
            
            // Session and correlation IDs would ideally be passed via headers or claims
            UUID sessionId = UUID.fromString((String) payload.getOrDefault("sessionId", UUID.randomUUID().toString()));
            UUID correlationId = UUID.fromString((String) payload.getOrDefault("correlationId", UUID.randomUUID().toString()));

            GovernanceDecision decision = governanceService.recordDecision(id, approverId, action, justification, sessionId, correlationId);
            return ResponseEntity.ok(decision);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // INTERNAL API for downstream verification fallback
    @GetMapping("/internal/proposals/{id}/verify")
    public ResponseEntity<?> verifyApprovalInternal(@PathVariable UUID id, @RequestParam UUID tenantId, @RequestParam String type, @RequestHeader(value = "X-Internal-Service-Key", required = false) String serviceKey) {
        if (serviceKey == null || (!serviceKey.equals(System.getenv("SAEP_INTERNAL_SERVICE_KEY")) && !"saep-internal-secret-dev-only".equals(serviceKey))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Invalid internal service key"));
        }

        GovernanceProposal proposal = proposalRepository.findById(id).orElse(null);
        if (proposal == null || !proposal.getTenantId().equals(tenantId) || !proposal.getType().equals(type)) {
            return ResponseEntity.ok(Map.of("approved", false));
        }

        return ResponseEntity.ok(Map.of("approved", "APPROVED".equals(proposal.getStatus())));
    }
}
