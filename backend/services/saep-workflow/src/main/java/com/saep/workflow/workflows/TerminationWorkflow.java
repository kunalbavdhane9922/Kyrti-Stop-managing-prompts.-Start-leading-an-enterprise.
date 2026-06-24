package com.saep.workflow.workflows;

import io.temporal.workflow.SignalMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.Map;

@WorkflowInterface
public interface TerminationWorkflow {

    /**
     * Executes the termination workflow for a Digital Professional.
     * @param request Termination details (companyId, professionalId, reason, tenantId)
     * @return Final termination record ID or failure reason
     */
    @WorkflowMethod
    String executeTermination(Map<String, Object> request);

    /**
     * Signal method to receive human HR approval for termination.
     * @param approved boolean indicating if human approved the termination
     */
    @SignalMethod
    void approveTermination(boolean approved);
}
