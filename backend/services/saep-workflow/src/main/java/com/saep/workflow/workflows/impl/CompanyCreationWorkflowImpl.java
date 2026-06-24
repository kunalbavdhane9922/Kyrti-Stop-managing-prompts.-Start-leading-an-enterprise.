package com.saep.workflow.workflows.impl;

import com.saep.workflow.activities.CompanyActivities;
import com.saep.workflow.workflows.CompanyCreationWorkflow;
import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.Map;

public class CompanyCreationWorkflowImpl implements CompanyCreationWorkflow {

    private final CompanyActivities activities = Workflow.newActivityStub(
            CompanyActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofMinutes(1))
                    .setRetryOptions(RetryOptions.newBuilder()
                            .setInitialInterval(Duration.ofSeconds(1))
                            .setMaximumInterval(Duration.ofSeconds(10))
                            .setBackoffCoefficient(2.0)
                            .setMaximumAttempts(5)
                            .build())
                    .build()
    );

    @Override
    public String executeCompanyCreation(Map<String, Object> request) {
        // Stage 1: Create company record
        String companyId = activities.createCompanyRecord(request);

        // Stage 2: Create root department
        activities.createInitialDepartment(companyId, "Headquarters");

        // Stage 3: Establish Founder Human Authority
        String founderId = (String) request.get("founderId");
        if (founderId != null) {
            activities.establishHumanAuthority(companyId, founderId);
        }

        // Stage 4: Publish Event
        activities.publishCompanyEvent(companyId, "COMPANY_CREATED");

        return "SUCCESS: " + companyId;
    }
}
