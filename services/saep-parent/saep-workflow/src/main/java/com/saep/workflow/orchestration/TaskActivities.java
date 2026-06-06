package com.saep.workflow.orchestration;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface TaskActivities {

    @ActivityMethod
    String requestGovernanceApproval(String tenantId, String taskDescription);

    @ActivityMethod
    String invokeAgentGateway(String tenantId, String professionalId, String taskDescription);

    @ActivityMethod
    void storeResultInMemory(String tenantId, String professionalId, String result);
}
