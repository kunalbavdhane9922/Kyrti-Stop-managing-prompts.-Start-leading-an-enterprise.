package com.saep.organization.repository;

import com.saep.organization.domain.NodeAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NodeAssignmentRepository extends JpaRepository<NodeAssignmentEntity, UUID> {

    List<NodeAssignmentEntity> findByNodeId(UUID nodeId);

    void deleteByNodeId(UUID nodeId);

    List<NodeAssignmentEntity> findByTenantId(String tenantId);
}
