package com.saep.organization.repository;

import com.saep.organization.domain.CompanyNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CompanyNodeRepository extends JpaRepository<CompanyNodeEntity, UUID> {

    List<CompanyNodeEntity> findByBuildIdOrderBySortOrder(UUID buildId);

    List<CompanyNodeEntity> findByTenantIdOrderBySortOrder(String tenantId);

    List<CompanyNodeEntity> findByParentNodeId(UUID parentNodeId);

    List<CompanyNodeEntity> findByDepartmentId(UUID departmentId);
}
