package com.saep.workflow.workflows.impl;

import com.saep.workflow.activities.HiringActivities;
import com.saep.workflow.workflows.HiringWorkflow;
import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class HiringWorkflowImpl implements HiringWorkflow {

    private boolean isApproved = false;
    private boolean approvalReceived = false;

    private final HiringActivities activities = Workflow.newActivityStub(
            HiringActivities.class,
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
    public String executeHiring(Map<String, Object> request) {
        String companyId = (String) request.get("companyId");
        String requiredProfessionId = (String) request.get("requiredProfessionId");
        String workflowId = Workflow.getInfo().getWorkflowId();

        // Stage 1: Marketplace Search
        List<Map<String, Object>> candidates = activities.searchMarketplace(requiredProfessionId, request);
        if (candidates == null || candidates.isEmpty()) {
            return "FAILED: No candidates found.";
        }

        // Stage 2 & 3: Candidate Evaluation and Compatibility
        Map<String, Object> bestCandidate = activities.evaluateCandidates(candidates, companyId);
        if (bestCandidate == null) {
            return "FAILED: No suitable candidates passed evaluation.";
        }
        String candidateId = (String) bestCandidate.get("candidateId");

        // Stage 4: Interview
        Map<String, Object> interviewResult = activities.conductInterview(candidateId, companyId);
        if (!(Boolean) interviewResult.getOrDefault("passed", false)) {
            return "FAILED: Candidate failed interview.";
        }

        // Stage 5 & 6: Recommendation and Human Approval
        activities.requestHumanApproval(companyId, candidateId, workflowId);
        
        // Wait indefinitely until human approval signal is received
        Workflow.await(() -> approvalReceived);

        if (!isApproved) {
            activities.publishHiringEvent(companyId, candidateId, "HIRING_REJECTED");
            return "FAILED: Human rejected hiring recommendation.";
        }

        // Stage 7: Employment Creation
        String employmentId = activities.createEmploymentRecord(companyId, candidateId);
        activities.publishHiringEvent(companyId, candidateId, "HIRING_COMPLETED");

        return "SUCCESS: " + employmentId;
    }

    @Override
    public void approveHiring(boolean approved) {
        this.isApproved = approved;
        this.approvalReceived = true;
    }
}
