package com.saep.workflow.workflows;

import io.temporal.workflow.SignalMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.Map;

@WorkflowInterface
public interface ProfessionCreationWorkflow {

    /**
     * Executes the profession creation workflow.
     * @param request The profession details
     * @return Final profession ID or failure reason
     */
    @WorkflowMethod
    String executeProfessionCreation(Map<String, Object> request);

    /**
     * Signal method to receive human approval decision from governance.
     * @param approved boolean indicating if human approved the profession
     */
    @SignalMethod
    void approveProfession(boolean approved);
}
