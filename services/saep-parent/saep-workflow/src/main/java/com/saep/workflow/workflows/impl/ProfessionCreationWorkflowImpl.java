package com.saep.workflow.workflows.impl;

import com.saep.workflow.activities.MarketplaceActivities;
import com.saep.workflow.workflows.ProfessionCreationWorkflow;
import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.Map;

public class ProfessionCreationWorkflowImpl implements ProfessionCreationWorkflow {

    private boolean isApproved = false;
    private boolean approvalReceived = false;

    private final MarketplaceActivities activities = Workflow.newActivityStub(
            MarketplaceActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofMinutes(1))
                    .setRetryOptions(RetryOptions.newBuilder()
                            .setInitialInterval(Duration.ofSeconds(1))
                            .setMaximumInterval(Duration.ofSeconds(10))
                            .setBackoffCoefficient(2.0)
                            .setMaximumAttempts(3)
                            .build())
                    .build()
    );

    @Override
    public String executeProfessionCreation(Map<String, Object> request) {
        String workflowId = Workflow.getInfo().getWorkflowId();

        // Stage 1: Register Draft Profession
        String professionId = activities.registerProfession(request);

        // Stage 2: Request Governance Approval
        activities.requestProfessionApproval(professionId, workflowId);

        // Wait indefinitely until human approval signal is received
        Workflow.await(() -> approvalReceived);

        if (!isApproved) {
            activities.rejectProfession(professionId);
            return "FAILED: Governance rejected profession creation.";
        }

        // Stage 3: Activate Profession
        activities.activateProfession(professionId);

        return "SUCCESS: " + professionId;
    }

    @Override
    public void approveProfession(boolean approved) {
        this.isApproved = approved;
        this.approvalReceived = true;
    }
}
