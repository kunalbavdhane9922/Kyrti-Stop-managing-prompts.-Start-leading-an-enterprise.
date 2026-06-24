package com.saep.workflow.workflows;

import io.temporal.workflow.SignalMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.Map;

@WorkflowInterface
public interface HiringWorkflow {

    /**
     * Executes the hiring workflow for a given company and profession requirement.
     * @param request The hiring request details (companyId, requiredProfessionId, criteria)
     * @return Final employment record ID or failure reason
     */
    @WorkflowMethod
    String executeHiring(Map<String, Object> request);

    /**
     * Signal method to receive human approval decision.
     * @param approved boolean indicating if human approved the recommendation
     */
    @SignalMethod
    void approveHiring(boolean approved);
}
