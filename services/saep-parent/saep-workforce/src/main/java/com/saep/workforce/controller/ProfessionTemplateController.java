package com.saep.workforce.controller;

import com.saep.workforce.domain.ProfessionTemplateDefinition;
import com.saep.workforce.domain.ProfessionTemplateEntity;
import com.saep.workforce.repository.ProfessionTemplateRepository;
import com.saep.workforce.service.ProfessionTemplateService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/professions")
@RequiredArgsConstructor
public class ProfessionTemplateController {

    private final ProfessionTemplateRepository repository;
    private final ProfessionTemplateService service;

    @GetMapping("/{code}/templates")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.template.read')")
    public ResponseEntity<List<ProfessionTemplateEntity>> getTemplates(
            @PathVariable String code) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(repository.findByTenantIdAndProfessionCode(auth.getTenantId().toString(), code));
    }

    @GetMapping("/{code}/templates/active")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.template.read')")
    public ResponseEntity<ProfessionTemplateEntity> getActiveTemplate(
            @PathVariable String code) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return repository.findByTenantIdAndProfessionCodeAndActiveFlagTrue(auth.getTenantId().toString(), code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{code}/templates/{version}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.template.read')")
    public ResponseEntity<ProfessionTemplateEntity> getTemplateVersion(
            @PathVariable String code,
            @PathVariable Integer version) {
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return repository.findByTenantIdAndProfessionCodeAndTemplateVersion(auth.getTenantId().toString(), code, version)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{code}/templates")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.template.create')")
    public ResponseEntity<ProfessionTemplateEntity> createTemplate(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable String code,
            @RequestBody CreateTemplateRequest request) {
        
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        ProfessionTemplateEntity created = service.createTemplate(auth.getTenantId().toString(), code, request.getProfessionName(), 
                request.getCategory(), request.getDefinition(), auth.getPrincipal().toString());
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{code}/templates/{version}/activate")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('workforce.template.activate')")
    public ResponseEntity<ProfessionTemplateEntity> activateTemplate(
            @RequestHeader(value = "X-Approver-Id", required = false) String approverId,
            @PathVariable String code,
            @PathVariable Integer version) {
        
        var auth = (com.saep.workforce.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(service.activateVersion(auth.getTenantId().toString(), code, version));
    }
    
    @Data
    public static class CreateTemplateRequest {
        private String professionName;
        private String category;
        private ProfessionTemplateDefinition definition;
    }
}
