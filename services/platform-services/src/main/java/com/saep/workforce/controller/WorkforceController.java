package com.saep.workforce.controller;

import com.saep.workforce.domain.DigitalProfessional;
import com.saep.workforce.service.WorkforceService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workforce/professionals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For Next.js frontend integration
public class WorkforceController {

    private final WorkforceService workforceService;

    @GetMapping("/{tenantId}")
    public ResponseEntity<List<DigitalProfessional>> getProfessionalsForTenant(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(workforceService.getProfessionalsForTenant(tenantId));
    }

    @PostMapping("/hire")
    public ResponseEntity<DigitalProfessional> hireProfessional(
            @RequestParam UUID tenantId,
            @RequestParam UUID templateId) {
        return ResponseEntity.ok(workforceService.hireProfessional(tenantId, templateId));
    }

    @PostMapping("/{professionalId}/assign-task")
    public ResponseEntity<Void> assignTask(
            @PathVariable UUID professionalId,
            @RequestBody TaskRequest request) {
        
        workforceService.assignTask(
            professionalId, 
            request.getTask(), 
            request.getGithubRepoUrl(), 
            request.getGithubToken()
        );
        return ResponseEntity.accepted().build();
    }
}

@Data
class TaskRequest {
    private String task;
    private String githubRepoUrl;
    private String githubToken;
}
