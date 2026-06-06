package com.saep.workflow.agent;

import io.temporal.activity.ActivityOptions;
import io.temporal.spring.boot.WorkflowImpl;
import io.temporal.workflow.Workflow;
import java.time.Duration;

@WorkflowImpl(taskQueues = "AGENT_TASK_QUEUE")
public class AgentTaskWorkflowImpl implements AgentTaskWorkflow {

    // Setup the stub to point to the Python Activity
    // The Python worker will be listening on AGENT_TASK_QUEUE
    private final AgentTaskActivity activity = Workflow.newActivityStub(
            AgentTaskActivity.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofMinutes(15)) // Allow up to 15 mins for AI to think
                    .build());

    @Override
    public String executeTask(String taskId, String prompt) {
        
        System.out.println("Starting AI Agent Workflow for Task: " + taskId);
        
        // This will block until the Python worker completes the activity
        String result = activity.executeTask(taskId, prompt);
        
        System.out.println("AI Agent completed Task " + taskId + " with result: " + result);
        
        // In a real scenario, we'd trigger outbox events here to update the task status in the database
        
        return result;
    }
}
