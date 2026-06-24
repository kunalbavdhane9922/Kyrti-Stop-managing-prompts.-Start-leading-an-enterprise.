package com.saep.communication.repository;

import com.saep.communication.domain.ConversationParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipantEntity, String> {
    List<ConversationParticipantEntity> findByTenantIdAndConversationId(UUID tenantId, String conversationId);
    Optional<ConversationParticipantEntity> findByTenantIdAndConversationIdAndParticipantId(UUID tenantId, String conversationId, String participantId);
    List<ConversationParticipantEntity> findByTenantIdAndParticipantId(UUID tenantId, String participantId);
}
