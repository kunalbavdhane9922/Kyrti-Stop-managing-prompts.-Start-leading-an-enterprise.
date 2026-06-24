package com.saep.communication.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.communication.domain.ConversationEntity;
import com.saep.communication.domain.ConversationParticipantEntity;
import com.saep.communication.repository.ConversationParticipantRepository;
import com.saep.communication.repository.ConversationRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ConversationEntity createConversation(UUID tenantId, String type, String currentUserId, List<String> initialParticipants) {
        
        if ("DIRECT".equals(type) && initialParticipants.size() == 2) {
            String p1 = initialParticipants.get(0);
            String p2 = initialParticipants.get(1);
            
            var existingOpt = conversationRepository.findDirectConversation(tenantId, p1, p2);
            if (existingOpt.isPresent()) {
                return existingOpt.get();
            }
        }

        ConversationEntity conversation = ConversationEntity.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .conversationType(type)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        
        conversation = conversationRepository.save(conversation);

        for (String participantId : initialParticipants) {
            addParticipantInternal(tenantId, conversation.getId(), participantId, "HUMAN", currentUserId);
        }

        emitOutboxEvent("conversation.created.v1", "communication.conversations", tenantId, Map.of(
            "eventId", UUID.randomUUID().toString(),
            "tenantId", tenantId,
            "aggregateId", conversation.getId(),
            "aggregateType", "Conversation",
            "aggregateVersion", conversation.getVersion(),
            "occurredAt", Instant.now().toString(),
            "actorId", currentUserId,
            "conversationType", type
        ));

        return conversation;
    }

    @Transactional
    public ConversationParticipantEntity addParticipant(UUID tenantId, String conversationId, String participantId, String participantType, String currentUserId, boolean isAdmin) {
        ConversationEntity conversation = conversationRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conversation.getTenantId().equals(tenantId)) {
            throw new org.springframework.security.access.AccessDeniedException("Tenant mismatch");
        }

        // Membership validation
        if (!isAdmin) {
            boolean isMember = participantRepository.findByTenantIdAndConversationId(tenantId, conversationId).stream()
                    .anyMatch(p -> p.getParticipantId().equals(currentUserId));
            if (!isMember) {
                throw new org.springframework.security.access.AccessDeniedException("Must be a member to add participants");
            }
        }

        return addParticipantInternal(tenantId, conversationId, participantId, participantType, currentUserId);
    }

    private ConversationParticipantEntity addParticipantInternal(UUID tenantId, String conversationId, String participantId, String participantType, String currentUserId) {
        ConversationParticipantEntity participant = ConversationParticipantEntity.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .conversationId(conversationId)
                .participantId(participantId)
                .participantType(participantType)
                .joinedAt(Instant.now())
                .build();

        participant = participantRepository.save(participant);

        emitOutboxEvent("participant.added.v1", "communication.conversations", tenantId, Map.of(
            "eventId", UUID.randomUUID().toString(),
            "tenantId", tenantId,
            "aggregateId", conversationId,
            "aggregateType", "Conversation",
            "occurredAt", Instant.now().toString(),
            "actorId", currentUserId,
            "participantId", participantId,
            "participantType", participantType
        ));

        return participant;
    }

    @Transactional(readOnly = true)
    public List<ConversationEntity> getUserConversations(UUID tenantId, String userId) {
        List<String> conversationIds = participantRepository.findByTenantIdAndParticipantId(tenantId, userId)
                .stream().map(ConversationParticipantEntity::getConversationId).toList();
        if (conversationIds.isEmpty()) {
            return List.of();
        }
        return conversationRepository.findByTenantIdAndIdInAndDeletedAtIsNull(tenantId, conversationIds);
    }

    @Transactional
    public void archiveConversation(UUID tenantId, String conversationId, String currentUserId, boolean isAdmin) {
        ConversationEntity conversation = conversationRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
                
        boolean isMember = participantRepository.findByTenantIdAndConversationIdAndParticipantId(tenantId, conversationId, currentUserId).isPresent();
        if (!isMember && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Must be a participant to archive");
        }
        
        conversation.setDeletedAt(Instant.now());
        conversationRepository.save(conversation);
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
            throw new RuntimeException("Failed to serialize conversation event", e);
        }
    }
}
