package com.saep.memory.controller;

import com.saep.memory.dto.ContextDTOs.AgentContextResponse;
import com.saep.memory.security.TenantAuthenticationToken;
import com.saep.memory.service.ContextAssemblyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/context")
public class ContextController {

    private final ContextAssemblyService contextAssemblyService;

    public ContextController(ContextAssemblyService contextAssemblyService) {
        this.contextAssemblyService = contextAssemblyService;
    }

    private TenantAuthenticationToken getAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<AgentContextResponse> getAgentContext(
            @PathVariable UUID agentId,
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        
        TenantAuthenticationToken auth = getAuth();
        // The agentId passed in path must match the principal, or the principal must have admin rights.
        // For V1, assuming the user requesting is the agent, or the user is querying on behalf of their agent.
        AgentContextResponse response = contextAssemblyService.assembleAgentContext(agentId, auth.getTenantId(), query, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/company")
    public ResponseEntity<AgentContextResponse> getCompanyContext(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        
        TenantAuthenticationToken auth = getAuth();
        // For V1, we route company context through the same assembly service, using the requestor's policy
        // which should inherently include COMPANY scope access if they belong to the tenant.
        AgentContextResponse response = contextAssemblyService.assembleAgentContext((UUID) auth.getPrincipal(), auth.getTenantId(), query, limit);
        return ResponseEntity.ok(response);
    }
}
