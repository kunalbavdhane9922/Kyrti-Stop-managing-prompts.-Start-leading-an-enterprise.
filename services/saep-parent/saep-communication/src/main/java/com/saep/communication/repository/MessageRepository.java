package com.saep.communication.repository;

import com.saep.communication.domain.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, String> {
    List<MessageEntity> findByTenantIdAndConversationIdAndDeletedAtIsNull(UUID tenantId, String conversationId);
    Optional<MessageEntity> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, String id);
}
