package com.saep.governance.controller;

import com.saep.common.security.TenantContext;
import com.saep.governance.model.Approval;
import com.saep.governance.model.Policy;
import com.saep.governance.repository.ApprovalRepository;
import com.saep.governance.repository.PolicyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/governance")
public class GovernanceController {

    private final PolicyRepository policyRepository;
    private final ApprovalRepository approvalRepository;

    public GovernanceController(PolicyRepository policyRepository, ApprovalRepository approvalRepository) {
        this.policyRepository = policyRepository;
        this.approvalRepository = approvalRepository;
    }

    @PostMapping("/policies")
    public ResponseEntity<Policy> createPolicy(@RequestBody Policy policy) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }
        
        policy.setTenantId(tenantId);
        Policy savedPolicy = policyRepository.save(policy);
        return ResponseEntity.status(201).body(savedPolicy);
    }

    @GetMapping("/policies")
    public ResponseEntity<List<Policy>> getPolicies() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }
        
        List<Policy> policies = policyRepository.findByTenantId(tenantId);
        return ResponseEntity.ok(policies);
    }

    @PostMapping("/approvals/{id}/approve")
    public ResponseEntity<String> approve(@PathVariable UUID id, @RequestBody ApprovalRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        Optional<Approval> approvalOpt = approvalRepository.findByIdAndTenantId(id, tenantId);
        if (approvalOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Approval approval = approvalOpt.get();
        approval.setStatus(request.isApproved() ? "APPROVED" : "REJECTED");
        approvalRepository.save(approval);

        // In a full implementation, an audit log would be written here
        
        return ResponseEntity.ok("Approval status updated");
    }
}

class ApprovalRequest {
    private boolean approved;
    private String comments;

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
