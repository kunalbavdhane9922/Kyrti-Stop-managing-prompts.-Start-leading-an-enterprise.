package com.saep.workflow.workflows.impl;

import com.saep.workflow.activities.WorkforceActivities;
import com.saep.workflow.workflows.TerminationWorkflow;
import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.Map;

/**
 * Implements the termination workflow defined in TerminationRules.md.
 * Termination requires human HR approval (Rule: Human Authority Remains Final).
 * This workflow blocks until a human sends an approval signal.
 */
public class TerminationWorkflowImpl implements TerminationWorkflow {

    private boolean isApproved = false;
    private boolean approvalReceived = false;

    private final WorkforceActivities activities = Workflow.newActivityStub(
            WorkforceActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofMinutes(2))
                    .setRetryOptions(RetryOptions.newBuilder()
                            .setInitialInterval(Duration.ofSeconds(1))
                            .setMaximumInterval(Duration.ofSeconds(30))
                            .setBackoffCoefficient(2.0)
                            .setMaximumAttempts(3)
                            .build())
                    .build()
    );

    @Override
    public String executeTermination(Map<String, Object> request) {
        String companyId = (String) request.get("companyId");
        String professionalId = (String) request.get("professionalId");
        String reason = (String) request.getOrDefault("reason", "");
        String workflowId = Workflow.getInfo().getWorkflowId();

        // Stage 1: Validate termination eligibility
        activities.validateTermination(companyId, professionalId);

        // Stage 2: Request human HR approval
        activities.requestTerminationApproval(companyId, professionalId, workflowId, reason);

        // Stage 3: Wait for human approval signal
        Workflow.await(() -> approvalReceived);

        if (!isApproved) {
            activities.publishWorkforceEvent(companyId, professionalId, "TERMINATION_REJECTED");
            return "FAILED: Human rejected termination.";
        }

        // Stage 4: Execute termination
        String terminationId = activities.executeTermination(companyId, professionalId);
        activities.publishWorkforceEvent(companyId, professionalId, "PROFESSIONAL_TERMINATED");

        return "SUCCESS: " + terminationId;
    }

    @Override
    public void approveTermination(boolean approved) {
        this.isApproved = approved;
        this.approvalReceived = true;
    }
}
