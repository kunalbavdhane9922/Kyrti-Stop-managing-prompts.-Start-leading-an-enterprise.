package com.saep.workflow.orchestration;

import io.temporal.spring.boot.ActivityImpl;
import org.springframework.stereotype.Component;

@Component
@ActivityImpl(taskQueues = "SAEP_TASK_QUEUE")
public class TaskActivitiesImpl implements TaskActivities {

    @Override
    public String requestGovernanceApproval(String tenantId, String taskDescription) {
        // In a real scenario, this would make an HTTP call to the saep-governance service.
        // It might return 'PENDING' and rely on a signal, or the governance service might
        // complete the activity asynchronously.
        // For scaffold, we auto-approve.
        return "APPROVED";
    }

    @Override
    public String invokeAgentGateway(String tenantId, String professionalId, String taskDescription) {
        // In a real scenario, this would make an HTTP call to the Python agent-service (FastAPI/LangGraph)
        // For scaffold, return a mock result.
        return "Agent successfully processed: " + taskDescription;
    }

    @Override
    public void storeResultInMemory(String tenantId, String professionalId, String result) {
        // In a real scenario, this makes an HTTP call to saep-memory or publishes a Kafka event.
        System.out.println("Stored in memory: " + result);
    }
}
