package com.saep.organization.service;

import com.saep.organization.domain.*;
import com.saep.organization.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrganizationBuildService {

    private final OrganizationBuildRepository buildRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyNodeRepository companyNodeRepository;
    private final NodePermissionRepository nodePermissionRepository;
    private final NodeAssignmentRepository nodeAssignmentRepository;
    private final RoleRepository roleRepository;
    private final PermissionCatalogRepository permissionCatalogRepository;

    // ─── Full Org Build from Wizard ───────────────────────────────────────────

    @Transactional
    public Map<String, Object> createOrganizationBuild(String tenantId, Map<String, Object> payload) {
        log.info("Creating organization build for tenant: {}", tenantId);

        // Archive any existing active build
        buildRepository.findByTenantIdAndStatus(tenantId, OrganizationBuildStatus.ACTIVE)
                .ifPresent(old -> {
                    old.setStatus(OrganizationBuildStatus.ARCHIVED);
                    buildRepository.save(old);
                });

        // Create new build
        OrganizationBuildEntity build = OrganizationBuildEntity.builder()
                .tenantId(tenantId)
                .status(OrganizationBuildStatus.ACTIVE)
                .buildVersion(1)
                .build();
        build = buildRepository.save(build);

        UUID buildId = build.getId();
        Map<String, UUID> tempIdMap = new HashMap<>(); // maps frontend temp IDs to real UUIDs

        // 1. Create departments
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> departments = (List<Map<String, Object>>) payload.getOrDefault("departments", Collections.emptyList());
        int deptOrder = 0;
        for (Map<String, Object> dept : departments) {
            DepartmentEntity entity = DepartmentEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .name((String) dept.get("name"))
                    .description((String) dept.getOrDefault("description", ""))
                    .isCustom(Boolean.TRUE.equals(dept.get("isCustom")))
                    .sortOrder(deptOrder++)
                    .build();
            entity = departmentRepository.save(entity);

            String tempId = (String) dept.get("tempId");
            if (tempId != null) {
                tempIdMap.put(tempId, entity.getId());
            }
        }

        // 2. Create company nodes (board, executives, dept leads, teams, positions)
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) payload.getOrDefault("nodes", Collections.emptyList());
        
        // PRE-VALIDATION: Find CEO node
        UUID ceoNodeId = null;
        for (Map<String, Object> node : nodes) {
            String title = (String) node.getOrDefault("title", "");
            if ("EXECUTIVE".equals(node.get("nodeType")) && "CEO".equals(title)) {
                String tempId = (String) node.get("tempId");
                if (tempId != null) {
                    ceoNodeId = tempIdMap.getOrDefault(tempId, tryParseUUID(tempId));
                    if (ceoNodeId == null) {
                        ceoNodeId = UUID.randomUUID(); // Pre-allocate ID
                        tempIdMap.put(tempId, ceoNodeId);
                    }
                }
            }
        }

        // Pass 1: Pre-allocate IDs and save all nodes WITHOUT parentNodeId to avoid FK violations
        int nodeOrder = 0;
        List<CompanyNodeEntity> savedNodes = new ArrayList<>();
        
        for (Map<String, Object> node : nodes) {
            UUID nodeId = UUID.randomUUID();
            String tempId = (String) node.get("tempId");
            if (tempId != null) {
                if (tempIdMap.containsKey(tempId)) {
                    nodeId = tempIdMap.get(tempId);
                } else {
                    tempIdMap.put(tempId, nodeId);
                }
            }

            // PRODUCTION GRADE ENFORCEMENT
            String title = (String) node.getOrDefault("title", "");
            if ("EXECUTIVE".equals(node.get("nodeType")) && !title.equals("CEO") && !title.toLowerCase().contains("custom")) {
                if (title.length() <= 4 && title.startsWith("C") && title.endsWith("O")) {
                    if (ceoNodeId == null) {
                        throw new IllegalArgumentException("Enterprise Hierarchy Enforcement: A CEO must exist if other Chief officers are present.");
                    }
                }
            }

            // Resolve department ID
            UUID departmentId = null;
            String deptRef = (String) node.get("departmentId");
            if (deptRef != null && !deptRef.isEmpty()) {
                departmentId = tempIdMap.getOrDefault(deptRef, tryParseUUID(deptRef));
            }

            CompanyNodeEntity nodeEntity = CompanyNodeEntity.builder()
                    .id(nodeId)
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .parentNodeId(null) // Set to null for first pass
                    .departmentId(departmentId)
                    .title(title)
                    .occupantType((String) node.getOrDefault("occupantType", "VACANT"))
                    .nodeType((String) node.getOrDefault("nodeType", "POSITION_GROUP"))
                    .occupantName((String) node.get("occupantName"))
                    .occupantEmail((String) node.get("occupantEmail"))
                    .occupantPhone((String) node.get("occupantPhone"))
                    .assignmentStatus((String) node.getOrDefault("assignmentStatus", "VACANT"))
                    .decisionAuthority((String) node.get("decisionAuthority"))
                    .sortOrder(nodeOrder++)
                    .groupCount(node.get("groupCount") != null ? ((Number) node.get("groupCount")).intValue() : 1)
                    .seniority((String) node.get("seniority"))
                    .build();
            
            savedNodes.add(companyNodeRepository.save(nodeEntity));
        }

        // Pass 2: Link nodes to their parents
        for (int i = 0; i < nodes.size(); i++) {
            Map<String, Object> node = nodes.get(i);
            CompanyNodeEntity entity = savedNodes.get(i);
            
            String parentRef = (String) node.get("parentNodeId");
            if (parentRef != null && !parentRef.isEmpty()) {
                UUID parentNodeId = tempIdMap.getOrDefault(parentRef, tryParseUUID(parentRef));
                entity.setParentNodeId(parentNodeId);
                companyNodeRepository.save(entity);
            }
        }

        // 3. Create node permissions
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> permissions = (List<Map<String, Object>>) payload.getOrDefault("permissions", Collections.emptyList());
        for (Map<String, Object> perm : permissions) {
            String nodeRef = (String) perm.get("nodeId");
            UUID nodeId = tempIdMap.getOrDefault(nodeRef, tryParseUUID(nodeRef));
            if (nodeId == null) continue;

            NodePermissionEntity permEntity = NodePermissionEntity.builder()
                    .id(UUID.randomUUID())
                    .nodeId(nodeId)
                    .permissionKey((String) perm.get("permissionKey"))
                    .isGranted(Boolean.TRUE.equals(perm.get("isGranted")))
                    .tenantId(tenantId)
                    .permissionCategory((String) perm.get("permissionCategory"))
                    .permissionLabel((String) perm.get("permissionLabel"))
                    .build();
            nodePermissionRepository.save(permEntity);
        }

        log.info("Organization build created successfully for tenant: {} with {} departments and {} nodes",
                tenantId, departments.size(), nodes.size());

        Map<String, Object> result = new HashMap<>();
        result.put("buildId", buildId.toString());
        result.put("status", build.getStatus().name());
        result.put("departmentCount", departments.size());
        result.put("nodeCount", nodes.size());
        result.put("permissionCount", permissions.size());
        return result;
    }

    // ─── Hierarchy Retrieval ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getHierarchy(String tenantId) {
        Optional<OrganizationBuildEntity> activeBuild = buildRepository.findByTenantIdAndStatus(tenantId, OrganizationBuildStatus.ACTIVE);
        if (activeBuild.isEmpty()) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("nodes", Collections.emptyList());
            empty.put("departments", Collections.emptyList());
            return empty;
        }

        UUID buildId = activeBuild.get().getId();
        List<CompanyNodeEntity> nodes = companyNodeRepository.findByBuildIdOrderBySortOrder(buildId);
        List<DepartmentEntity> departments = departmentRepository.findByBuildIdOrderBySortOrder(buildId);

        Map<String, Object> result = new HashMap<>();
        result.put("buildId", buildId.toString());
        result.put("nodes", nodes);
        result.put("departments", departments);
        return result;
    }

    // ─── Single Node Operations ───────────────────────────────────────────────

    @Transactional
    public CompanyNodeEntity addNode(String tenantId, Map<String, Object> nodeData) {
        Optional<OrganizationBuildEntity> activeBuild = buildRepository.findByTenantIdAndStatus(tenantId, OrganizationBuildStatus.ACTIVE);
        if (activeBuild.isEmpty()) {
            throw new IllegalStateException("No active organization build for tenant: " + tenantId);
        }

        UUID buildId = activeBuild.get().getId();
        UUID parentNodeId = nodeData.get("parentNodeId") != null ? tryParseUUID((String) nodeData.get("parentNodeId")) : null;
        UUID departmentId = nodeData.get("departmentId") != null ? tryParseUUID((String) nodeData.get("departmentId")) : null;

        CompanyNodeEntity node = CompanyNodeEntity.builder()
                .id(UUID.randomUUID())
                .buildId(buildId)
                .tenantId(tenantId)
                .parentNodeId(parentNodeId)
                .departmentId(departmentId)
                .title((String) nodeData.getOrDefault("title", "New Position"))
                .occupantType((String) nodeData.getOrDefault("occupantType", "VACANT"))
                .nodeType((String) nodeData.getOrDefault("nodeType", "POSITION_GROUP"))
                .occupantName((String) nodeData.get("occupantName"))
                .occupantEmail((String) nodeData.get("occupantEmail"))
                .occupantPhone((String) nodeData.get("occupantPhone"))
                .assignmentStatus((String) nodeData.getOrDefault("assignmentStatus", "VACANT"))
                .decisionAuthority((String) nodeData.get("decisionAuthority"))
                .groupCount(nodeData.get("groupCount") != null ? ((Number) nodeData.get("groupCount")).intValue() : 1)
                .seniority((String) nodeData.get("seniority"))
                .build();

        return companyNodeRepository.save(node);
    }

    @Transactional
    public CompanyNodeEntity updateNode(String tenantId, UUID nodeId, Map<String, Object> updates) {
        CompanyNodeEntity node = companyNodeRepository.findById(nodeId)
                .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));

        if (!node.getTenantId().equals(tenantId)) {
            throw new SecurityException("Node does not belong to tenant: " + tenantId);
        }

        if (updates.containsKey("title")) node.setTitle((String) updates.get("title"));
        if (updates.containsKey("occupantType")) node.setOccupantType((String) updates.get("occupantType"));
        if (updates.containsKey("nodeType")) node.setNodeType((String) updates.get("nodeType"));
        if (updates.containsKey("occupantName")) node.setOccupantName((String) updates.get("occupantName"));
        if (updates.containsKey("occupantEmail")) node.setOccupantEmail((String) updates.get("occupantEmail"));
        if (updates.containsKey("occupantPhone")) node.setOccupantPhone((String) updates.get("occupantPhone"));
        if (updates.containsKey("assignmentStatus")) node.setAssignmentStatus((String) updates.get("assignmentStatus"));
        if (updates.containsKey("decisionAuthority")) node.setDecisionAuthority((String) updates.get("decisionAuthority"));
        if (updates.containsKey("parentNodeId")) {
            String parentRef = (String) updates.get("parentNodeId");
            node.setParentNodeId(parentRef != null && !parentRef.isEmpty() ? tryParseUUID(parentRef) : null);
        }
        if (updates.containsKey("departmentId")) {
            String deptRef = (String) updates.get("departmentId");
            node.setDepartmentId(deptRef != null && !deptRef.isEmpty() ? tryParseUUID(deptRef) : null);
        }
        if (updates.containsKey("groupCount")) node.setGroupCount(((Number) updates.get("groupCount")).intValue());
        if (updates.containsKey("seniority")) node.setSeniority((String) updates.get("seniority"));

        return companyNodeRepository.save(node);
    }

    @Transactional
    public void deleteNode(String tenantId, UUID nodeId) {
        CompanyNodeEntity node = companyNodeRepository.findById(nodeId)
                .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));
        if (!node.getTenantId().equals(tenantId)) {
            throw new SecurityException("Node does not belong to tenant: " + tenantId);
        }

        // Re-parent children to this node's parent
        List<CompanyNodeEntity> children = companyNodeRepository.findByParentNodeId(nodeId);
        for (CompanyNodeEntity child : children) {
            child.setParentNodeId(node.getParentNodeId());
            companyNodeRepository.save(child);
        }

        // Delete permissions for this node
        nodePermissionRepository.deleteByNodeId(nodeId);
        // Delete assignments for this node
        nodeAssignmentRepository.deleteByNodeId(nodeId);
        // Delete the node
        companyNodeRepository.deleteById(nodeId);
    }

    // ─── Permission Operations ────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<PermissionCatalogEntity> getPermissionCatalog(String tenantId) {
        return permissionCatalogRepository.findAllForTenant(tenantId);
    }

    @Transactional
    public PermissionCatalogEntity addCustomPermission(String tenantId, Map<String, Object> data) {
        PermissionCatalogEntity perm = PermissionCatalogEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .category((String) data.getOrDefault("category", "CUSTOM"))
                .permissionKey((String) data.get("permissionKey"))
                .label((String) data.get("label"))
                .description((String) data.get("description"))
                .isSystem(false)
                .sortOrder(data.get("sortOrder") != null ? ((Number) data.get("sortOrder")).intValue() : 100)
                .build();
        return permissionCatalogRepository.save(perm);
    }

    @Transactional
    public List<NodePermissionEntity> updateNodePermissions(String tenantId, UUID nodeId, List<Map<String, Object>> permissions) {
        // Verify node belongs to tenant
        CompanyNodeEntity node = companyNodeRepository.findById(nodeId)
                .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));
        if (!node.getTenantId().equals(tenantId)) {
            throw new SecurityException("Node does not belong to tenant: " + tenantId);
        }

        // Delete existing permissions for this node
        nodePermissionRepository.deleteByNodeId(nodeId);

        // Create new permissions
        List<NodePermissionEntity> saved = new ArrayList<>();
        for (Map<String, Object> perm : permissions) {
            NodePermissionEntity entity = NodePermissionEntity.builder()
                    .id(UUID.randomUUID())
                    .nodeId(nodeId)
                    .permissionKey((String) perm.get("permissionKey"))
                    .isGranted(Boolean.TRUE.equals(perm.get("isGranted")))
                    .tenantId(tenantId)
                    .permissionCategory((String) perm.get("permissionCategory"))
                    .permissionLabel((String) perm.get("permissionLabel"))
                    .build();
            saved.add(nodePermissionRepository.save(entity));
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<NodePermissionEntity> getNodePermissions(UUID nodeId) {
        return nodePermissionRepository.findByNodeId(nodeId);
    }

    // ─── Invite / Recruit Operations ──────────────────────────────────────────

    @Transactional
    public CompanyNodeEntity markForInvitation(String tenantId, UUID nodeId, String name, String email) {
        CompanyNodeEntity node = companyNodeRepository.findById(nodeId)
                .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));
        if (!node.getTenantId().equals(tenantId)) {
            throw new SecurityException("Node does not belong to tenant: " + tenantId);
        }

        node.setOccupantType("HUMAN");
        node.setAssignmentStatus("INVITED");
        node.setOccupantName(name);
        node.setOccupantEmail(email);
        return companyNodeRepository.save(node);
    }

    @Transactional
    public CompanyNodeEntity markForAIRecruitment(String tenantId, UUID nodeId) {
        CompanyNodeEntity node = companyNodeRepository.findById(nodeId)
                .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));
        if (!node.getTenantId().equals(tenantId)) {
            throw new SecurityException("Node does not belong to tenant: " + tenantId);
        }

        node.setOccupantType("AI");
        node.setAssignmentStatus("AI_VACANT");
        return companyNodeRepository.save(node);
    }

    // ─── Utilities ────────────────────────────────────────────────────────────

    private UUID tryParseUUID(String value) {
        if (value == null || value.isEmpty()) return null;
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
