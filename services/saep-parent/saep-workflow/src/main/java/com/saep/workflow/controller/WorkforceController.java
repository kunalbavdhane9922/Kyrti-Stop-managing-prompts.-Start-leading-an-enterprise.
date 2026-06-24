package com.saep.workflow.controller;

import com.saep.common.security.RequirePermission;
import com.saep.common.tenant.TenantContext;
import com.saep.workflow.dto.WorkflowResponse;
import com.saep.workflow.event.WorkflowEventPublisher;
import com.saep.workflow.workflows.PromotionWorkflow;
import com.saep.workflow.workflows.TerminationWorkflow;
import io.temporal.api.common.v1.WorkflowExecution;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workflow/workforce")
public class WorkforceController {

    private final WorkflowClient workflowClient;
    private final WorkflowEventPublisher eventPublisher;

    @Value("${temporal.task-queue}")
    private String taskQueue;

    public WorkforceController(WorkflowClient workflowClient, WorkflowEventPublisher eventPublisher) {
        this.workflowClient = workflowClient;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/termination/start")
    @RequirePermission("workflow.termination.start")
    public ResponseEntity<WorkflowResponse> startTerminationWorkflow(@RequestBody Map<String, Object> request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().build();
        }
        request.put("tenantId", tenantId.toString());

        String workflowId = "termination-" + UUID.randomUUID();

        WorkflowOptions options = WorkflowOptions.newBuilder()
                .setWorkflowId(workflowId)
                .setTaskQueue(taskQueue)
                .build();

        TerminationWorkflow workflow = workflowClient.newWorkflowStub(TerminationWorkflow.class, options);
        WorkflowExecution execution = WorkflowClient.start(workflow::executeTermination, request);

        eventPublisher.publishWorkflowStarted(
                execution.getWorkflowId(), "TERMINATION", tenantId.toString(), workflowId);

        return ResponseEntity.ok(WorkflowResponse.builder()
                .workflowId(execution.getWorkflowId())
                .runId(execution.getRunId())
                .status("STARTED")
                .build());
    }

    @PostMapping("/termination/{workflowId}/approve")
    @RequirePermission("workflow.termination.approve")
    public ResponseEntity<Void> approveTermination(@PathVariable String workflowId, @RequestParam boolean approved) {
        TerminationWorkflow workflow = workflowClient.newWorkflowStub(TerminationWorkflow.class, workflowId);
        workflow.approveTermination(approved);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/promotion/start")
    @RequirePermission("workflow.promotion.start")
    public ResponseEntity<WorkflowResponse> startPromotionWorkflow(@RequestBody Map<String, Object> request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().build();
        }
        request.put("tenantId", tenantId.toString());

        String workflowId = "promotion-" + UUID.randomUUID();

        WorkflowOptions options = WorkflowOptions.newBuilder()
                .setWorkflowId(workflowId)
                .setTaskQueue(taskQueue)
                .build();

        PromotionWorkflow workflow = workflowClient.newWorkflowStub(PromotionWorkflow.class, options);
        WorkflowExecution execution = WorkflowClient.start(workflow::executePromotion, request);

        eventPublisher.publishWorkflowStarted(
                execution.getWorkflowId(), "PROMOTION", tenantId.toString(), workflowId);

        return ResponseEntity.ok(WorkflowResponse.builder()
                .workflowId(execution.getWorkflowId())
                .runId(execution.getRunId())
                .status("STARTED")
                .build());
    }

    @PostMapping("/promotion/{workflowId}/approve")
    @RequirePermission("workflow.promotion.approve")
    public ResponseEntity<Void> approvePromotion(@PathVariable String workflowId, @RequestParam boolean approved) {
        PromotionWorkflow workflow = workflowClient.newWorkflowStub(PromotionWorkflow.class, workflowId);
        workflow.approvePromotion(approved);
        return ResponseEntity.ok().build();
    }
}
