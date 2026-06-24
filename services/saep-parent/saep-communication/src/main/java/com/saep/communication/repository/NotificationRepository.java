package com.saep.communication.repository;

import com.saep.communication.domain.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, String> {
    List<NotificationEntity> findByTenantIdAndUserIdAndDeletedAtIsNull(UUID tenantId, String userId);
    Optional<NotificationEntity> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, String id);
    List<NotificationEntity> findNotifications(UUID tenantId, String userId);
}
