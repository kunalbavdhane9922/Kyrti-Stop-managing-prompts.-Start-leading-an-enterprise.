package com.saep.communication.repository;

import com.saep.communication.domain.MessageReceiptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageReceiptRepository extends JpaRepository<MessageReceiptEntity, String> {
    Optional<MessageReceiptEntity> findByTenantIdAndMessageIdAndUserId(UUID tenantId, String messageId, String userId);
}
