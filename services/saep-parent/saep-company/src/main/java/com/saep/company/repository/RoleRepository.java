package com.saep.company.repository;

import com.saep.company.domain.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    List<RoleEntity> findByTenantIdAndStatus(String tenantId, String status);
    Optional<RoleEntity> findByTenantIdAndNameAndStatus(String tenantId, String name, String status);
}
