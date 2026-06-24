package com.saep.communication.service;

import com.saep.communication.domain.TaskEntity;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class TaskLifecycleStateMachine {

    private static final Map<String, List<String>> ALLOWED_TRANSITIONS = Map.of(
            "ASSIGNED", Arrays.asList("ACCEPTED", "CANCELLED"),
            "ACCEPTED", Arrays.asList("IN_PROGRESS", "BLOCKED", "CANCELLED"),
            "IN_PROGRESS", Arrays.asList("COMPLETED", "BLOCKED", "CANCELLED"),
            "BLOCKED", Arrays.asList("IN_PROGRESS", "CANCELLED"),
            "COMPLETED", List.of(),
            "CANCELLED", List.of()
    );

    public void transition(TaskEntity task, String newStatus) {
        if (task.getStatus() == null) {
            if (!"ASSIGNED".equals(newStatus)) {
                throw new IllegalStateException("Initial task status must be ASSIGNED.");
            }
        } else {
            List<String> allowed = ALLOWED_TRANSITIONS.getOrDefault(task.getStatus(), List.of());
            if (!allowed.contains(newStatus)) {
                throw new IllegalStateException(String.format("Invalid transition from %s to %s", task.getStatus(), newStatus));
            }
        }
        task.setStatus(newStatus);
    }
}
