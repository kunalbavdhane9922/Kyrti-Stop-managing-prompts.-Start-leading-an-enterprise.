package com.saep.communication.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.communication.domain.NotificationEntity;
import com.saep.communication.domain.events.v1.NotificationCreatedEvent;
import com.saep.communication.repository.NotificationRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public NotificationEntity createNotification(UUID tenantId, String correlationId, String userId, String notificationType, String topic, String message) {
        NotificationEntity notification = NotificationEntity.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .correlationId(correlationId)
                .userId(userId)
                .notificationType(notificationType)
                .topic(topic)
                .message(message)
                .deliveryStatus("PENDING")
                .retryCount(0)
                .createdAt(Instant.now())
                .build();
        
        notification = notificationRepository.save(notification);

        NotificationCreatedEvent event = NotificationCreatedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(notification.getId())
                .aggregateType("Notification")
                .aggregateVersion(notification.getVersion())
                .occurredAt(Instant.now())
                .correlationId(correlationId)
                .causationId(correlationId)
                .actorId(userId)
                .userId(userId)
                .notificationType(notificationType)
                .topic(topic)
                .message(message)
                .build();

        emitOutboxEvent("notification.created.v1", "communication.notifications", tenantId, event);

        return notification;
    }

    @Transactional
    public NotificationEntity markAsRead(UUID tenantId, String notificationId, String currentUserId) {
        NotificationEntity notification = notificationRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found or already deleted"));
                
        if (!notification.getTenantId().equals(tenantId)) {
            throw new org.springframework.security.access.AccessDeniedException("Tenant mismatch");
        }
        
        if (notification.getReadAt() == null) {
            notification.setReadAt(Instant.now());
            notification = notificationRepository.save(notification);
            
            com.saep.communication.domain.events.v1.NotificationReadEvent event = com.saep.communication.domain.events.v1.NotificationReadEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .tenantId(tenantId)
                    .aggregateId(notification.getId())
                    .aggregateType("Notification")
                    .aggregateVersion(notification.getVersion())
                    .occurredAt(Instant.now())
                    .correlationId(notification.getCorrelationId())
                    .causationId(notification.getCorrelationId())
                    .actorId(currentUserId)
                    .userId(notification.getUserId())
                    .build();
                    
            emitOutboxEvent("notification.read.v1", "communication.notifications", tenantId, event);
        }
        
        return notification;
    }

    @Transactional(readOnly = true)
    public java.util.List<NotificationEntity> getUserNotifications(UUID tenantId, String userId) {
        return notificationRepository.findByTenantIdAndUserIdAndDeletedAtIsNull(tenantId, userId);
    }

    @Transactional
    public void archiveNotification(UUID tenantId, String notificationId, String currentUserId) {
        NotificationEntity notification = notificationRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
                
        if (!notification.getUserId().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot archive someone else's notification");
        }
        
        notification.setDeletedAt(Instant.now());
        notificationRepository.save(notification);
    }

    private void emitOutboxEvent(String eventType, String topic, UUID tenantId, Object payload) {
        try {
            OutboxEvent outbox = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType(eventType)
                    .topic(topic)
                    .tenantId(tenantId.toString())
                    .payload(objectMapper.writeValueAsString(payload))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outbox);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize notification event", e);
        }
    }
}
