package com.saep.workflow.controller;

import com.saep.common.security.RequirePermission;
import com.saep.common.tenant.TenantContext;
import com.saep.workflow.dto.ProfessionCreationRequest;
import com.saep.workflow.dto.WorkflowResponse;
import com.saep.workflow.event.WorkflowEventPublisher;
import com.saep.workflow.workflows.ProfessionCreationWorkflow;
import io.temporal.api.common.v1.WorkflowExecution;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workflow/professions")
public class ProfessionController {

    private final WorkflowClient workflowClient;
    private final WorkflowEventPublisher eventPublisher;

    @Value("${temporal.task-queue}")
    private String taskQueue;

    public ProfessionController(WorkflowClient workflowClient, WorkflowEventPublisher eventPublisher) {
        this.workflowClient = workflowClient;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/start-creation")
    @RequirePermission("workflow.profession.create")
    public ResponseEntity<WorkflowResponse> startProfessionCreationWorkflow(@RequestBody ProfessionCreationRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().build();
        }
        request.setTenantId(tenantId.toString());

        String workflowId = "profession-creation-" + UUID.randomUUID();

        WorkflowOptions options = WorkflowOptions.newBuilder()
                .setWorkflowId(workflowId)
                .setTaskQueue(taskQueue)
                .build();

        ProfessionCreationWorkflow workflow = workflowClient.newWorkflowStub(ProfessionCreationWorkflow.class, options);

        Map<String, Object> requestMap = Map.of(
                "professionName", request.getProfessionName(),
                "tenantId", request.getTenantId(),
                "category", request.getCategory() != null ? request.getCategory() : "",
                "description", request.getDescription() != null ? request.getDescription() : "",
                "requestedBy", request.getRequestedBy() != null ? request.getRequestedBy() : ""
        );

        WorkflowExecution execution = WorkflowClient.start(workflow::executeProfessionCreation, requestMap);

        eventPublisher.publishWorkflowStarted(
                execution.getWorkflowId(), "PROFESSION_CREATION", tenantId.toString(), workflowId);

        return ResponseEntity.ok(WorkflowResponse.builder()
                .workflowId(execution.getWorkflowId())
                .runId(execution.getRunId())
                .status("STARTED")
                .build());
    }

    @PostMapping("/{workflowId}/approve")
    @RequirePermission("workflow.profession.approve")
    public ResponseEntity<Void> approveProfession(@PathVariable String workflowId, @RequestParam boolean approved) {
        ProfessionCreationWorkflow workflow = workflowClient.newWorkflowStub(ProfessionCreationWorkflow.class, workflowId);
        workflow.approveProfession(approved);
        return ResponseEntity.ok().build();
    }
}
