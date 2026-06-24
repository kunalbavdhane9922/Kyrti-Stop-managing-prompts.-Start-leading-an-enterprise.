package com.saep.organization.repository;

import com.saep.organization.domain.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity, UUID> {

    List<DepartmentEntity> findByBuildIdOrderBySortOrder(UUID buildId);

    List<DepartmentEntity> findByTenantIdOrderBySortOrder(String tenantId);
}
