package com.saep.communication.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.communication.domain.TaskEntity;
import com.saep.communication.domain.events.v1.TaskAssignedEvent;
import com.saep.communication.domain.events.v1.TaskCompletedEvent;
import com.saep.communication.repository.TaskRepository;
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
public class TaskService {

    private final TaskRepository taskRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final TaskLifecycleStateMachine stateMachine;
    private final ObjectMapper objectMapper;

    @Transactional
    public TaskEntity assignTask(UUID tenantId, String correlationId, String assignerId, String assigneeId, String payload) {
        TaskEntity task = TaskEntity.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .correlationId(correlationId)
                .assignerId(assignerId)
                .assigneeId(assigneeId)
                .payload(payload)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        
        stateMachine.transition(task, "ASSIGNED");
        task = taskRepository.save(task);

        TaskAssignedEvent event = TaskAssignedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(task.getId())
                .aggregateType("Task")
                .aggregateVersion(task.getVersion())
                .occurredAt(Instant.now())
                .correlationId(correlationId)
                .causationId(correlationId)
                .actorId(assignerId)
                .assignerId(assignerId)
                .assigneeId(assigneeId)
                .payload(payload)
                .build();

        emitOutboxEvent("task.assigned.v1", "communication.tasks", tenantId, event);
        return task;
    }

    @Transactional
    public TaskEntity completeTask(UUID tenantId, String taskId) {
        TaskEntity task = taskRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        stateMachine.transition(task, "COMPLETED");
        task.setUpdatedAt(Instant.now());
        task = taskRepository.save(task);

        TaskCompletedEvent event = TaskCompletedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(task.getId())
                .aggregateType("Task")
                .aggregateVersion(task.getVersion())
                .occurredAt(Instant.now())
                .correlationId(task.getCorrelationId())
                .causationId(task.getCorrelationId())
                .actorId(task.getAssigneeId())
                .assigneeId(task.getAssigneeId())
                .build();

        emitOutboxEvent("task.completed.v1", "communication.tasks", tenantId, event);

        return task;
    }

    @Transactional(readOnly = true)
    public java.util.List<TaskEntity> getUserTasks(UUID tenantId, String assigneeId) {
        return taskRepository.findByTenantIdAndAssigneeIdAndDeletedAtIsNull(tenantId, assigneeId);
    }

    @Transactional
    public TaskEntity transferTask(UUID tenantId, String taskId, String currentUserId, String newAssigneeId, String reason) {
        TaskEntity task = taskRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getAssigneeId().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Only current assignee can transfer the task");
        }

        String previousAssigneeId = task.getAssigneeId();
        task.setAssigneeId(newAssigneeId);
        task.setUpdatedAt(Instant.now());
        task = taskRepository.save(task);

        com.saep.communication.domain.events.v1.TaskTransferredEvent event = com.saep.communication.domain.events.v1.TaskTransferredEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(taskId)
                .aggregateType("Task")
                .aggregateVersion(task.getVersion())
                .occurredAt(Instant.now())
                .correlationId(task.getCorrelationId())
                .causationId(task.getCorrelationId())
                .actorId(currentUserId)
                .previousAssigneeId(previousAssigneeId)
                .newAssigneeId(newAssigneeId)
                .reason(reason)
                .build();
        emitOutboxEvent("task.transferred.v1", "communication.tasks", tenantId, event);
        return task;
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
            throw new RuntimeException("Failed to serialize task event", e);
        }
    }
}
