package com.saep.communication.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.communication.domain.ConversationEntity;
import com.saep.communication.domain.MessageEntity;
import com.saep.communication.domain.events.v1.MessageSentEvent;
import com.saep.communication.repository.ConversationRepository;
import com.saep.communication.repository.MessageRepository;
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
public class MessagingService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final com.saep.communication.repository.ConversationParticipantRepository participantRepository;
    private final com.saep.communication.repository.MessageReceiptRepository messageReceiptRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public MessageEntity sendMessage(UUID tenantId, String conversationId, String correlationId, String senderId, String recipientId, String content, String messageType) {
        
        // Ensure conversation exists
        ConversationEntity conversation = conversationRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        MessageEntity message = MessageEntity.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .conversationId(conversation.getId())
                .messageType(messageType)
                .correlationId(correlationId)
                .senderId(senderId)
                .recipientId(recipientId)
                .content(content)
                .status("SENT")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        
        message = messageRepository.save(message);

        MessageSentEvent event = MessageSentEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(message.getId())
                .aggregateType("Message")
                .aggregateVersion(message.getVersion())
                .occurredAt(Instant.now())
                .correlationId(correlationId)
                .causationId(correlationId)
                .actorId(senderId)
                .conversationId(conversationId)
                .senderId(senderId)
                .recipientId(recipientId)
                .content(content)
                .messageType(messageType)
                .build();

        emitOutboxEvent("message.sent.v1", "communication.messages", tenantId, event);

        return message;
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
            throw new RuntimeException("Failed to serialize message event", e);
        }
    }

    @Transactional
    public void deleteMessage(UUID tenantId, String messageId, String currentUserId, boolean isAdmin) {
        MessageEntity message = messageRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found or already deleted"));
        
        if (!message.getTenantId().equals(tenantId)) {
            throw new org.springframework.security.access.AccessDeniedException("Tenant mismatch");
        }
        
        if (!isAdmin && !message.getSenderId().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Only the sender or admin can delete this message");
        }
        
        message.setDeletedAt(Instant.now());
        message.setDeletedBy(currentUserId);
        messageRepository.save(message);
        
        com.saep.communication.domain.events.v1.MessageDeletedEvent event = com.saep.communication.domain.events.v1.MessageDeletedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(message.getId())
                .aggregateType("Message")
                .aggregateVersion(message.getVersion())
                .occurredAt(Instant.now())
                .correlationId(message.getCorrelationId())
                .causationId(message.getCorrelationId())
                .actorId(currentUserId)
                .conversationId(message.getConversationId())
                .deletedBy(currentUserId)
                .build();
                
        emitOutboxEvent("message.deleted.v1", "communication.messages", tenantId, event);
    }

    @Transactional(readOnly = true)
    public java.util.List<MessageEntity> getConversationMessages(UUID tenantId, String conversationId, String currentUserId) {
        boolean isMember = participantRepository.findByTenantIdAndConversationId(tenantId, conversationId).stream()
                .anyMatch(p -> p.getParticipantId().equals(currentUserId));
        if (!isMember) {
            throw new org.springframework.security.access.AccessDeniedException("Must be a participant to read messages in this conversation");
        }
        return messageRepository.findByTenantIdAndConversationIdAndDeletedAtIsNull(tenantId, conversationId);
    }

    @Transactional
    public com.saep.communication.domain.MessageReceiptEntity markMessageAsRead(UUID tenantId, String messageId, String currentUserId) {
        MessageEntity message = messageRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found or deleted"));

        boolean isMember = participantRepository.findByTenantIdAndConversationId(tenantId, message.getConversationId()).stream()
                .anyMatch(p -> p.getParticipantId().equals(currentUserId));
        if (!isMember) {
            throw new org.springframework.security.access.AccessDeniedException("Must be a participant to read messages in this conversation");
        }

        com.saep.communication.domain.MessageReceiptEntity receipt = messageReceiptRepository.findByTenantIdAndMessageIdAndUserId(tenantId, messageId, currentUserId)
                .orElseGet(() -> com.saep.communication.domain.MessageReceiptEntity.builder()
                        .id(UUID.randomUUID().toString())
                        .tenantId(tenantId)
                        .messageId(messageId)
                        .userId(currentUserId)
                        .status("READ")
                        .readAt(Instant.now())
                        .build());

        if (receipt.getReadAt() == null || !"READ".equals(receipt.getStatus())) {
            receipt.setStatus("READ");
            receipt.setReadAt(Instant.now());
            receipt = messageReceiptRepository.save(receipt);

            com.saep.communication.domain.events.v1.MessageReadEvent event = com.saep.communication.domain.events.v1.MessageReadEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .tenantId(tenantId)
                    .aggregateId(messageId)
                    .aggregateType("Message")
                    .aggregateVersion(receipt.getVersion())
                    .occurredAt(Instant.now())
                    .correlationId(message.getCorrelationId())
                    .causationId(message.getCorrelationId())
                    .actorId(currentUserId)
                    .messageId(messageId)
                    .userId(currentUserId)
                    .readAt(receipt.getReadAt())
                    .build();

            emitOutboxEvent("message.read.v1", "communication.messages", tenantId, event);
        }

        return receipt;
    }
}
