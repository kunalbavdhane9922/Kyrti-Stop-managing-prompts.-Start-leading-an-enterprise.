package com.saep.organization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "node_permissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NodePermissionEntity {

    @Id
    private UUID id;

    @Column(name = "node_id", nullable = false)
    private UUID nodeId;

    @Column(name = "permission_key", nullable = false)
    private String permissionKey;

    @Column(name = "is_granted", nullable = false)
    private Boolean isGranted;

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "permission_category")
    private String permissionCategory;

    @Column(name = "permission_label")
    private String permissionLabel;
}
