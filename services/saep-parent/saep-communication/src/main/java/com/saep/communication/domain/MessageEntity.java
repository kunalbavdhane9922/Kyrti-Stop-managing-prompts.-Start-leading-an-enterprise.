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
@Table(name = "communication_messages", indexes = {
    @Index(name = "idx_msg_conv", columnList = "tenant_id, conversation_id"),
    @Index(name = "idx_msg_recipient", columnList = "tenant_id, recipient_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "conversation_id", nullable = false)
    private String conversationId;

    @Column(name = "message_type", nullable = false)
    private String messageType; // USER, AGENT, SYSTEM

    @Column(name = "correlation_id")
    private String correlationId;

    @Column(name = "sender_id", nullable = false)
    private String senderId;

    @Column(name = "recipient_id")
    private String recipientId;

    @Column(name = "content", columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "metadata_json", columnDefinition = "text")
    private String metadataJson;

    @Column(name = "status", nullable = false)
    private String status;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "deleted_by")
    private String deletedBy;
}
