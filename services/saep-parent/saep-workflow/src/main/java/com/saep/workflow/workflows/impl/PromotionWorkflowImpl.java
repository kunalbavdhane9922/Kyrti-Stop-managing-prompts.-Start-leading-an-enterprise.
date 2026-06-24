package com.saep.workflow.workflows.impl;

import com.saep.workflow.activities.WorkforceActivities;
import com.saep.workflow.workflows.PromotionWorkflow;
import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.Map;

/**
 * Implements the promotion workflow defined in PromotionRules.md.
 * Promotion requires human HR approval (Rule: Human Authority Remains Final).
 * This workflow blocks until a human sends an approval signal.
 */
public class PromotionWorkflowImpl implements PromotionWorkflow {

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
    public String executePromotion(Map<String, Object> request) {
        String companyId = (String) request.get("companyId");
        String professionalId = (String) request.get("professionalId");
        String targetLevel = (String) request.getOrDefault("targetLevel", "");
        String workflowId = Workflow.getInfo().getWorkflowId();

        // Stage 1: Validate promotion eligibility
        activities.validatePromotion(companyId, professionalId, targetLevel);

        // Stage 2: Request human HR approval
        activities.requestPromotionApproval(companyId, professionalId, workflowId, targetLevel);

        // Stage 3: Wait for human approval signal
        Workflow.await(() -> approvalReceived);

        if (!isApproved) {
            activities.publishWorkforceEvent(companyId, professionalId, "PROMOTION_REJECTED");
            return "FAILED: Human rejected promotion.";
        }

        // Stage 4: Execute promotion
        String promotionId = activities.executePromotion(companyId, professionalId, targetLevel);
        activities.publishWorkforceEvent(companyId, professionalId, "PROMOTION_APPROVED");

        return "SUCCESS: " + promotionId;
    }

    @Override
    public void approvePromotion(boolean approved) {
        this.isApproved = approved;
        this.approvalReceived = true;
    }
}
