package com.saep.workflow.orchestration;

import io.temporal.activity.ActivityOptions;
import io.temporal.spring.boot.WorkflowImpl;
import io.temporal.workflow.Workflow;

import java.time.Duration;

@WorkflowImpl(taskQueues = "SAEP_TASK_QUEUE")
public class TaskOrchestrationWorkflowImpl implements TaskOrchestrationWorkflow {

    private final ActivityOptions options = ActivityOptions.newBuilder()
            .setStartToCloseTimeout(Duration.ofMinutes(10))
            .build();

    private final TaskActivities activities = Workflow.newActivityStub(TaskActivities.class, options);

    @Override
    public String executeTask(String tenantId, String professionalId, String taskDescription) {
        // Step 1: Governance Approval (Might take days, but Temporal handles the sleep/waiting natively)
        String approvalStatus = activities.requestGovernanceApproval(tenantId, taskDescription);
        
        if (!"APPROVED".equals(approvalStatus)) {
            return "TASK_REJECTED";
        }

        // Step 2: Invoke Python AI Gateway
        String aiResult = activities.invokeAgentGateway(tenantId, professionalId, taskDescription);

        // Step 3: Store result in Memory
        activities.storeResultInMemory(tenantId, professionalId, aiResult);

        return "TASK_COMPLETED: " + aiResult;
    }
}
