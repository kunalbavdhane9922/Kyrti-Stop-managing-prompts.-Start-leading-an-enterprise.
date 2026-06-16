package com.saep.organization.repository;

import com.saep.organization.domain.NodePermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NodePermissionRepository extends JpaRepository<NodePermissionEntity, UUID> {

    List<NodePermissionEntity> findByNodeId(UUID nodeId);

    void deleteByNodeId(UUID nodeId);
}
