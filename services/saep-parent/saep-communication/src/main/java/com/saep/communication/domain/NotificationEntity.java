package com.saep.communication.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "communication_notifications", indexes = {
    @Index(name = "idx_notif_user", columnList = "tenant_id, user_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "correlation_id")
    private String correlationId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "notification_type", nullable = false)
    private String notificationType;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "message", columnDefinition = "text", nullable = false)
    private String message;

    @Column(name = "delivery_status", nullable = false)
    private String deliveryStatus; // PENDING, DELIVERED, FAILED

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "last_attempt_at")
    private Instant lastAttemptAt;

    @Column(name = "failure_reason", columnDefinition = "text")
    private String failureReason;

    @Column(name = "read_at")
    private Instant readAt;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
