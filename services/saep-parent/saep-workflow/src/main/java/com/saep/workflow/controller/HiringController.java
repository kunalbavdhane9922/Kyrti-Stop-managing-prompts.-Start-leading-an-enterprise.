package com.saep.workflow.controller;

import com.saep.common.security.RequirePermission;
import com.saep.common.tenant.TenantContext;
import com.saep.workflow.dto.HiringRequest;
import com.saep.workflow.dto.WorkflowResponse;
import com.saep.workflow.event.WorkflowEventPublisher;
import com.saep.workflow.workflows.HiringWorkflow;
import io.temporal.api.common.v1.WorkflowExecution;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workflow/hiring")
public class HiringController {

    private final WorkflowClient workflowClient;
    private final WorkflowEventPublisher eventPublisher;

    @Value("${temporal.task-queue}")
    private String taskQueue;

    public HiringController(WorkflowClient workflowClient, WorkflowEventPublisher eventPublisher) {
        this.workflowClient = workflowClient;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/start")
    @RequirePermission("workflow.hiring.start")
    public ResponseEntity<WorkflowResponse> startHiringWorkflow(@RequestBody HiringRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().build();
        }
        request.setTenantId(tenantId.toString());

        String workflowId = "hiring-" + UUID.randomUUID();

        WorkflowOptions options = WorkflowOptions.newBuilder()
                .setWorkflowId(workflowId)
                .setTaskQueue(taskQueue)
                .build();

        HiringWorkflow workflow = workflowClient.newWorkflowStub(HiringWorkflow.class, options);

        Map<String, Object> requestMap = Map.of(
                "companyId", request.getCompanyId(),
                "tenantId", request.getTenantId(),
                "requiredProfessionId", request.getRequiredProfessionId(),
                "departmentId", request.getDepartmentId() != null ? request.getDepartmentId() : "",
                "requestedBy", request.getRequestedBy() != null ? request.getRequestedBy() : ""
        );

        WorkflowExecution execution = WorkflowClient.start(workflow::executeHiring, requestMap);

        eventPublisher.publishWorkflowStarted(
                execution.getWorkflowId(), "HIRING", tenantId.toString(), workflowId);

        return ResponseEntity.ok(WorkflowResponse.builder()
                .workflowId(execution.getWorkflowId())
                .runId(execution.getRunId())
                .status("STARTED")
                .build());
    }

    @PostMapping("/{workflowId}/approve")
    @RequirePermission("workflow.hiring.approve")
    public ResponseEntity<Void> approveHiring(@PathVariable String workflowId, @RequestParam boolean approved) {
        HiringWorkflow workflow = workflowClient.newWorkflowStub(HiringWorkflow.class, workflowId);
        workflow.approveHiring(approved);
        return ResponseEntity.ok().build();
    }
}
