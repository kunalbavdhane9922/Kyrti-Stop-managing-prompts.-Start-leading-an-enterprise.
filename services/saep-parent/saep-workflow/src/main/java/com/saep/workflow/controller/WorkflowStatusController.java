package com.saep.workflow.controller;

import com.saep.common.security.RequirePermission;
import io.temporal.api.workflowservice.v1.DescribeWorkflowExecutionRequest;
import io.temporal.api.workflowservice.v1.DescribeWorkflowExecutionResponse;
import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Observability endpoint for querying Temporal workflow status.
 * Exposes workflow ID, status, duration, retries, and failures
 * as required by Temporal.md: "Workflow Observability".
 */
@RestController
@RequestMapping("/api/v1/workflow/status")
public class WorkflowStatusController {

    private final WorkflowClient workflowClient;
    private final WorkflowServiceStubs workflowServiceStubs;

    public WorkflowStatusController(WorkflowClient workflowClient, WorkflowServiceStubs workflowServiceStubs) {
        this.workflowClient = workflowClient;
        this.workflowServiceStubs = workflowServiceStubs;
    }

    @GetMapping("/{workflowId}")
    @RequirePermission("workflow.read")
    public ResponseEntity<Map<String, Object>> getWorkflowStatus(@PathVariable String workflowId) {
        try {
            DescribeWorkflowExecutionRequest request = DescribeWorkflowExecutionRequest.newBuilder()
                    .setNamespace("default")
                    .setExecution(io.temporal.api.common.v1.WorkflowExecution.newBuilder()
                            .setWorkflowId(workflowId)
                            .build())
                    .build();

            DescribeWorkflowExecutionResponse description = workflowServiceStubs.blockingStub()
                    .describeWorkflowExecution(request);

            Map<String, Object> status = new LinkedHashMap<>();
            status.put("workflowId", workflowId);
            status.put("status", description.getWorkflowExecutionInfo().getStatus().name());
            status.put("type", description.getWorkflowExecutionInfo().getType().getName());
            status.put("startTime", description.getWorkflowExecutionInfo().getStartTime().toString());

            if (description.getWorkflowExecutionInfo().hasCloseTime()) {
                status.put("closeTime", description.getWorkflowExecutionInfo().getCloseTime().toString());
            }

            status.put("historyLength", description.getWorkflowExecutionInfo().getHistoryLength());
            status.put("taskQueue", description.getWorkflowExecutionInfo().getTaskQueue());

            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "workflowId", workflowId,
                    "status", "NOT_FOUND",
                    "error", e.getMessage()
            ));
        }
    }
}
