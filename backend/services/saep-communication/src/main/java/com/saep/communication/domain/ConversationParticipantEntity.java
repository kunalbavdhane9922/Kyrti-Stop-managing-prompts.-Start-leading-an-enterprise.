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
@Table(name = "communication_participants", indexes = {
    @Index(name = "idx_participant_conv", columnList = "tenant_id, conversation_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationParticipantEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "conversation_id", nullable = false)
    private String conversationId;

    @Column(name = "participant_id", nullable = false)
    private String participantId;

    @Column(name = "participant_type", nullable = false)
    private String participantType; // HUMAN, AGENT, WORKFLOW

    @Version
    private Long version;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;
}
