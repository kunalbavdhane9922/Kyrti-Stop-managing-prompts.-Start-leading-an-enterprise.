package com.saep.company.controller;

import com.saep.company.domain.CompanyEntity;
import com.saep.company.service.CompanyService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyEntity> createCompany(@RequestBody CreateCompanyRequest request) {
        CompanyEntity company = companyService.createCompany(
                request.getName(),
                request.getDomain(),
                request.getTenantId(),
                request.getCreatedBy()
        );
        return ResponseEntity.ok(company);
    }

    @Data
    public static class CreateCompanyRequest {
        private String name;
        private String domain;
        private String tenantId;
        private String createdBy;
    }
}
