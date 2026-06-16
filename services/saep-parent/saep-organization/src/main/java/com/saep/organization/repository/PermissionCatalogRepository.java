package com.saep.organization.repository;

import com.saep.organization.domain.PermissionCatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PermissionCatalogRepository extends JpaRepository<PermissionCatalogEntity, UUID> {

    /**
     * Returns all global system permissions (tenant_id IS NULL) plus any custom
     * permissions created by this specific tenant.
     */
    @Query("SELECT p FROM PermissionCatalogEntity p WHERE p.tenantId IS NULL OR p.tenantId = :tenantId ORDER BY p.sortOrder")
    List<PermissionCatalogEntity> findAllForTenant(String tenantId);

    List<PermissionCatalogEntity> findByCategoryOrderBySortOrder(String category);
}
