package com.saep.organization.repository;

import com.saep.organization.domain.OrganizationBuildEntity;
import com.saep.organization.domain.OrganizationBuildStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganizationBuildRepository extends JpaRepository<OrganizationBuildEntity, UUID> {
    Optional<OrganizationBuildEntity> findByTenantIdAndStatus(String tenantId, OrganizationBuildStatus status);
}
