package com.saep.workflow.controller;

import com.saep.common.security.RequirePermission;
import com.saep.common.tenant.TenantContext;
import com.saep.workflow.dto.CompanyCreationRequest;
import com.saep.workflow.dto.WorkflowResponse;
import com.saep.workflow.event.WorkflowEventPublisher;
import com.saep.workflow.workflows.CompanyCreationWorkflow;
import io.temporal.api.common.v1.WorkflowExecution;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workflow/companies")
public class CompanyController {

    private final WorkflowClient workflowClient;
    private final WorkflowEventPublisher eventPublisher;

    @Value("${temporal.task-queue}")
    private String taskQueue;

    public CompanyController(WorkflowClient workflowClient, WorkflowEventPublisher eventPublisher) {
        this.workflowClient = workflowClient;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/start-creation")
    @RequirePermission("workflow.company.create")
    public ResponseEntity<WorkflowResponse> startCompanyCreationWorkflow(@RequestBody CompanyCreationRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().build();
        }
        request.setTenantId(tenantId.toString());

        String workflowId = "company-creation-" + UUID.randomUUID();

        WorkflowOptions options = WorkflowOptions.newBuilder()
                .setWorkflowId(workflowId)
                .setTaskQueue(taskQueue)
                .build();

        CompanyCreationWorkflow workflow = workflowClient.newWorkflowStub(CompanyCreationWorkflow.class, options);

        Map<String, Object> requestMap = Map.of(
                "companyName", request.getCompanyName(),
                "tenantId", request.getTenantId(),
                "founderId", request.getFounderId(),
                "industry", request.getIndustry() != null ? request.getIndustry() : "",
                "initialDepartmentName", request.getInitialDepartmentName() != null ? request.getInitialDepartmentName() : "Headquarters"
        );

        WorkflowExecution execution = WorkflowClient.start(workflow::executeCompanyCreation, requestMap);

        eventPublisher.publishWorkflowStarted(
                execution.getWorkflowId(), "COMPANY_CREATION", tenantId.toString(), workflowId);

        return ResponseEntity.ok(WorkflowResponse.builder()
                .workflowId(execution.getWorkflowId())
                .runId(execution.getRunId())
                .status("STARTED")
                .build());
    }
}
