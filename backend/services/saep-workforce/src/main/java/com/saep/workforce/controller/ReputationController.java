package com.saep.workforce.controller;

import com.saep.workforce.domain.ProfessionalReputationEntity;
import com.saep.workforce.repository.ProfessionalReputationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/reputations")
@RequiredArgsConstructor
public class ReputationController {

    private final ProfessionalReputationRepository professionalRepo;

    @GetMapping("/professional/{workerId}")
    public ResponseEntity<ProfessionalReputationEntity> getProfessionalReputation(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable String workerId) {
        
        return professionalRepo.findByTenantIdAndWorkerId(tenantId, workerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
