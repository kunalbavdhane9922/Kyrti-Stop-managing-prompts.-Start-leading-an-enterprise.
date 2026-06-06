package com.saep.workflow.hiring;

import io.temporal.spring.boot.WorkflowImpl;
import io.temporal.workflow.Workflow;
import java.time.Duration;
import java.util.UUID;

@WorkflowImpl(taskQueues = "HIRING_TASK_QUEUE")
public class HireProfessionalWorkflowImpl implements HireProfessionalWorkflow {

    private boolean isApproved = false;
    private boolean approvalReceived = false;
    private String approvalReason;

    @Override
    public void hireProfessional(UUID tenantId, UUID companyId, UUID professionId) {
        
        // Wait up to 7 days for governance approval
        Workflow.await(Duration.ofDays(7), () -> approvalReceived);

        if (!approvalReceived) {
            throw Workflow.wrap(new RuntimeException("Hiring request timed out waiting for governance approval."));
        }

        if (!isApproved) {
            // Log rejection
            System.out.println("Hiring request rejected by governance: " + approvalReason);
            return;
        }

        // Governance approved. Proceed with hiring logic.
        // In a full implementation, we would call an Activity here to create the Professional record
        // and publish outbox events.
        
        System.out.println("Hiring request approved! Company: " + companyId + " Profession: " + professionId);
    }

    @Override
    public void receiveGovernanceApproval(boolean approved, String reason) {
        this.isApproved = approved;
        this.approvalReason = reason;
        this.approvalReceived = true;
    }
}
