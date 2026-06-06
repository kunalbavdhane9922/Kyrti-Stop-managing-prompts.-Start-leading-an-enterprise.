package com.saep.workflow.agent;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface AgentTaskWorkflow {

    /**
     * Executes a task using an AI agent.
     * @param taskId The ID of the task to execute
     * @param prompt The prompt or instructions for the agent
     * @return The final result string from the agent
     */
    @WorkflowMethod
    String executeTask(String taskId, String prompt);
}
