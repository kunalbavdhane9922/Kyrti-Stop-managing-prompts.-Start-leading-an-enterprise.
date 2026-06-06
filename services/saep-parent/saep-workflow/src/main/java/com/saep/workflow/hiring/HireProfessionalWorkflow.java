package com.saep.workflow.hiring;

import io.temporal.workflow.SignalMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.UUID;

@WorkflowInterface
public interface HireProfessionalWorkflow {

    @WorkflowMethod
    void hireProfessional(UUID tenantId, UUID companyId, UUID professionId);

    @SignalMethod
    void receiveGovernanceApproval(boolean approved, String reason);
}
