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
@Table(name = "communication_conversations", indexes = {
    @Index(name = "idx_conv_tenant", columnList = "tenant_id, id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "conversation_type", nullable = false)
    private String conversationType; // DIRECT, GROUP, WORKFLOW

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
