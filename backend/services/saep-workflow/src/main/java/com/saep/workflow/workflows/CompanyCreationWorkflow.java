package com.saep.workflow.workflows;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.Map;

@WorkflowInterface
public interface CompanyCreationWorkflow {

    /**
     * Executes the company creation workflow.
     * @param request The company creation details (name, industry, founderId, etc.)
     * @return Final company ID or failure reason
     */
    @WorkflowMethod
    String executeCompanyCreation(Map<String, Object> request);
}
