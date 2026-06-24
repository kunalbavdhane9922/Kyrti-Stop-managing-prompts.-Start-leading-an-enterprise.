package com.saep.workflow.workflows;

import io.temporal.workflow.SignalMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.Map;

@WorkflowInterface
public interface PromotionWorkflow {

    /**
     * Executes the promotion workflow for a Digital Professional.
     * @param request Promotion details (companyId, professionalId, targetLevel, tenantId)
     * @return Final promotion record ID or failure reason
     */
    @WorkflowMethod
    String executePromotion(Map<String, Object> request);

    /**
     * Signal method to receive human HR approval for promotion.
     * @param approved boolean indicating if human approved the promotion
     */
    @SignalMethod
    void approvePromotion(boolean approved);
}
