package com.saep.organization.controller;

import com.saep.organization.domain.CompanyNodeEntity;
import com.saep.organization.domain.NodePermissionEntity;
import com.saep.organization.domain.PermissionCatalogEntity;
import com.saep.organization.service.OrganizationBuildService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationBuildService buildService;

    // ─── Full Build (Wizard Submission) ───────────────────────────────────────

    @PostMapping("/{tenantId}/build")
    public ResponseEntity<Map<String, Object>> createBuild(
            @PathVariable String tenantId,
            @RequestBody Map<String, Object> payload) {
        log.info("Received organization build request for tenant: {}", tenantId);
        Map<String, Object> result = buildService.createOrganizationBuild(tenantId, payload);
        return ResponseEntity.ok(result);
    }

    // ─── Hierarchy Retrieval ──────────────────────────────────────────────────

    @GetMapping("/{tenantId}/hierarchy")
    public ResponseEntity<Map<String, Object>> getHierarchy(@PathVariable String tenantId) {
        Map<String, Object> hierarchy = buildService.getHierarchy(tenantId);
        return ResponseEntity.ok(hierarchy);
    }

    // ─── Node CRUD ────────────────────────────────────────────────────────────

    @PostMapping("/{tenantId}/nodes")
    public ResponseEntity<CompanyNodeEntity> addNode(
            @PathVariable String tenantId,
            @RequestBody Map<String, Object> nodeData) {
        CompanyNodeEntity node = buildService.addNode(tenantId, nodeData);
        return ResponseEntity.ok(node);
    }

    @PutMapping("/{tenantId}/nodes/{nodeId}")
    public ResponseEntity<CompanyNodeEntity> updateNode(
            @PathVariable String tenantId,
            @PathVariable UUID nodeId,
            @RequestBody Map<String, Object> updates) {
        CompanyNodeEntity node = buildService.updateNode(tenantId, nodeId, updates);
        return ResponseEntity.ok(node);
    }

    @DeleteMapping("/{tenantId}/nodes/{nodeId}")
    public ResponseEntity<Void> deleteNode(
            @PathVariable String tenantId,
            @PathVariable UUID nodeId) {
        buildService.deleteNode(tenantId, nodeId);
        return ResponseEntity.noContent().build();
    }

    // ─── Permission Catalog ───────────────────────────────────────────────────

    @GetMapping("/{tenantId}/permissions/catalog")
    public ResponseEntity<List<PermissionCatalogEntity>> getPermissionCatalog(@PathVariable String tenantId) {
        List<PermissionCatalogEntity> catalog = buildService.getPermissionCatalog(tenantId);
        return ResponseEntity.ok(catalog);
    }

    @PostMapping("/{tenantId}/permissions/catalog")
    public ResponseEntity<PermissionCatalogEntity> addCustomPermission(
            @PathVariable String tenantId,
            @RequestBody Map<String, Object> data) {
        PermissionCatalogEntity perm = buildService.addCustomPermission(tenantId, data);
        return ResponseEntity.ok(perm);
    }

    // ─── Node Permissions ─────────────────────────────────────────────────────

    @GetMapping("/{tenantId}/nodes/{nodeId}/permissions")
    public ResponseEntity<List<NodePermissionEntity>> getNodePermissions(
            @PathVariable String tenantId,
            @PathVariable UUID nodeId) {
        List<NodePermissionEntity> perms = buildService.getNodePermissions(nodeId);
        return ResponseEntity.ok(perms);
    }

    @PutMapping("/{tenantId}/nodes/{nodeId}/permissions")
    public ResponseEntity<List<NodePermissionEntity>> updateNodePermissions(
            @PathVariable String tenantId,
            @PathVariable UUID nodeId,
            @RequestBody List<Map<String, Object>> permissions) {
        List<NodePermissionEntity> updated = buildService.updateNodePermissions(tenantId, nodeId, permissions);
        return ResponseEntity.ok(updated);
    }

    // ─── Invite & Recruit ─────────────────────────────────────────────────────

    @PostMapping("/{tenantId}/nodes/{nodeId}/invite")
    public ResponseEntity<CompanyNodeEntity> inviteHuman(
            @PathVariable String tenantId,
            @PathVariable UUID nodeId,
            @RequestBody Map<String, String> body) {
        CompanyNodeEntity node = buildService.markForInvitation(
                tenantId, nodeId,
                body.get("name"),
                body.get("email"));
        return ResponseEntity.ok(node);
    }

    @PostMapping("/{tenantId}/nodes/{nodeId}/recruit")
    public ResponseEntity<CompanyNodeEntity> recruitAI(
            @PathVariable String tenantId,
            @PathVariable UUID nodeId) {
        CompanyNodeEntity node = buildService.markForAIRecruitment(tenantId, nodeId);
        return ResponseEntity.ok(node);
    }
}
