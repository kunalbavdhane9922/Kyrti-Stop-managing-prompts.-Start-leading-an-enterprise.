package com.saep.communication.repository;

import com.saep.communication.domain.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, String> {
    List<TaskEntity> findByTenantIdAndAssigneeIdAndDeletedAtIsNull(UUID tenantId, String assigneeId);
    Optional<TaskEntity> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, String id);
    List<TaskEntity> findByTenantIdAndDeletedAtIsNull(UUID tenantId);
}
