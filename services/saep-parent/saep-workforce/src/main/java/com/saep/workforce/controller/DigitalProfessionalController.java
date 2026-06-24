package com.saep.workforce.controller;

import com.saep.workforce.domain.CareerHistoryEntity;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.CreateProfessionalRequest;
import com.saep.workforce.dto.*;
import com.saep.workforce.repository.CareerHistoryRepository;
import com.saep.workforce.repository.WorkerRepository;
import com.saep.workforce.service.DigitalProfessionalService;
import com.saep.workforce.service.ProfessionalResumeService;
import com.saep.workforce.service.PromotionScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/professionals")
@RequiredArgsConstructor
public class DigitalProfessionalController {

    private final WorkerRepository workerRepository;
    private final CareerHistoryRepository careerHistoryRepository;
    private final DigitalProfessionalService professionalService;
    private final ProfessionalResumeService resumeService;
    private final PromotionScoringService promotionScoringService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.create')")
    public ResponseEntity<WorkerEntity> createProfessional(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @RequestBody CreateProfessionalRequest request) {
        
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String tenantId = auth.getTenantId().toString();
        String userId = auth.getPrincipal().toString();
        
        return ResponseEntity.ok(professionalService.createProfessional(tenantId, userId, approverId, request));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.read')")
    public ResponseEntity<Page<WorkerEntity>> getProfessionals(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String professionCode,
            @RequestParam(required = false) String companyId,
            Pageable pageable) {

        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String tenantId = auth.getTenantId().toString();

        Specification<WorkerEntity> spec = (root, query, cb) -> {
            var predicate = cb.equal(root.get("tenantId"), tenantId);
            if (status != null) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), status));
            }
            if (professionCode != null) {
                predicate = cb.and(predicate, cb.equal(root.get("professionId"), professionCode));
            }
            if (companyId != null) {
                predicate = cb.and(predicate, cb.equal(root.get("currentCompanyId"), companyId));
            }
            return predicate;
        };

        return ResponseEntity.ok(workerRepository.findAll(spec, pageable));
    }

    @GetMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.read')")
    public ResponseEntity<WorkerEntity> getProfessional(
            @PathVariable UUID id) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return workerRepository.findByTenantIdAndId(auth.getTenantId().toString(), id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/resume")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.read')")
    public ResponseEntity<ResumeDto> getResume(
            @PathVariable UUID id) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        try {
            return ResponseEntity.ok(resumeService.getResume(auth.getTenantId().toString(), id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/promotion-eligibility")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.read')")
    public ResponseEntity<PromotionEligibilityDto> getPromotionEligibility(
            @PathVariable UUID id) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(promotionScoringService.calculateEligibility(auth.getTenantId().toString(), id.toString()));
    }

    @GetMapping("/{id}/career-history")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.read')")
    public ResponseEntity<List<CareerHistoryEntity>> getCareerHistory(
            @PathVariable UUID id) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(careerHistoryRepository.findByTenantIdAndWorkerIdOrderByOccurredAtDesc(auth.getTenantId().toString(), id.toString()));
    }

    @PostMapping("/{id}/hire")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.hire')")
    public ResponseEntity<WorkerEntity> hireProfessional(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable UUID id,
            @RequestBody com.saep.workforce.dto.HireProfessionalRequest request) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(professionalService.hireProfessional(auth.getTenantId().toString(), id, auth.getPrincipal().toString(), approverId, request));
    }

    @PostMapping("/{id}/promote")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.promote')")
    public ResponseEntity<WorkerEntity> promoteProfessional(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable UUID id,
            @RequestBody com.saep.workforce.dto.PromotionRequest request) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(professionalService.promoteProfessional(auth.getTenantId().toString(), id, auth.getPrincipal().toString(), approverId, request));
    }

    @PostMapping("/{id}/terminate")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.terminate')")
    public ResponseEntity<WorkerEntity> terminateProfessional(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable UUID id,
            @RequestBody com.saep.workforce.dto.TerminationRequest request) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(professionalService.terminateProfessional(auth.getTenantId().toString(), id, auth.getPrincipal().toString(), approverId, request));
    }

    @PostMapping("/{id}/retire")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.retire')")
    public ResponseEntity<WorkerEntity> retireProfessional(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable UUID id,
            @RequestBody com.saep.workforce.dto.RetirementRequest request) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(professionalService.retireProfessional(auth.getTenantId().toString(), id, auth.getPrincipal().toString(), approverId, request));
    }

    @PostMapping("/{id}/achievements")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.achievements.manage')")
    public ResponseEntity<Void> recordAchievement(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable UUID id,
            @RequestBody com.saep.workforce.dto.AchievementRequest request) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        professionalService.recordAchievement(auth.getTenantId().toString(), id, auth.getPrincipal().toString(), approverId, request);
        return ResponseEntity.ok().build();
    }
}
