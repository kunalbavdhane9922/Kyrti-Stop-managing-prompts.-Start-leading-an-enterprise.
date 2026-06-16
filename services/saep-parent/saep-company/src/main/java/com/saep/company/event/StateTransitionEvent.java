package com.saep.company.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateTransitionEvent {
    private String entityId;
    private String entityType;
    private String oldState;
    private String newState;
    private String tenantId;
    private String userId;
}
