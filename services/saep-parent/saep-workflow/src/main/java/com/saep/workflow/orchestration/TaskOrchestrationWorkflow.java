package com.saep.workflow.orchestration;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface TaskOrchestrationWorkflow {

    /**
     * Executes the main task orchestration logic.
     * 
     * @param tenantId The company tenant ID
     * @param professionalId The ID of the hired professional executing this task
     * @param taskDescription The description of the task to be completed
     * @return The final result of the task execution
     */
    @WorkflowMethod
    String executeTask(String tenantId, String professionalId, String taskDescription);
}
