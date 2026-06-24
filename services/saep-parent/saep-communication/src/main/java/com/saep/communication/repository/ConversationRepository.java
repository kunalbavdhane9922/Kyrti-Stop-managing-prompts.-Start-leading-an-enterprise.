package com.saep.communication.repository;

import com.saep.communication.domain.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, String> {
    Optional<ConversationEntity> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, String id);
    List<ConversationEntity> findByTenantIdAndIdInAndDeletedAtIsNull(UUID tenantId, List<String> ids);

    @Query("SELECT c FROM ConversationEntity c " +
           "JOIN ConversationParticipantEntity cp1 ON c.id = cp1.conversationId " +
           "JOIN ConversationParticipantEntity cp2 ON c.id = cp2.conversationId " +
           "WHERE c.tenantId = :tenantId AND c.conversationType = 'DIRECT' " +
           "AND c.deletedAt IS NULL " +
           "AND cp1.participantId = :p1 AND cp2.participantId = :p2")
    Optional<ConversationEntity> findDirectConversation(
            @Param("tenantId") UUID tenantId, 
            @Param("p1") String p1, 
            @Param("p2") String p2);
}
