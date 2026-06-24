package com.saep.workforce.controller;

import com.saep.workforce.domain.WorkforceScoreEntity;
import com.saep.workforce.repository.WorkforceScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/workforce-scores")
@RequiredArgsConstructor
public class WorkforceScoreController {

    private final WorkforceScoreRepository repository;

    @GetMapping("/{workerId}")
    public ResponseEntity<WorkforceScoreEntity> getScore(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable String workerId) {
        
        return repository.findByTenantIdAndWorkerId(tenantId, workerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
