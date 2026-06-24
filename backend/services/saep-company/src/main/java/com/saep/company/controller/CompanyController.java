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
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyEntity> createCompany(@RequestBody CreateCompanyRequest request, @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        System.out.println("----- SECURITY VERIFICATION -----");
        System.out.println("Received Company Creation Request: " + request.getName());
        System.out.println("X-User-Id from Gateway: " + userId);
        System.out.println("---------------------------------");
        
        CompanyEntity company = companyService.createCompany(
                request.getName(),
                request.getDomain(),
                request.getTenantId(),
                userId,
                request.getLegalName(),
                request.getIndustry(),
                request.getCompanyType(),
                request.getRegistrationNumber(),
                request.getTaxNumber(),
                request.getHqCountry(),
                request.getHqState(),
                request.getHqCity(),
                request.getHqAddress(),
                request.getEmployeeCount(),
                request.getRevenueRange(),
                request.getGrowthStage()
        );
        return ResponseEntity.ok(company);
    }

    @Data
    public static class CreateCompanyRequest {
        private String name;
        private String domain;
        private String tenantId;
        private String legalName;
        private String industry;
        private String companyType;
        private String registrationNumber;
        private String taxNumber;
        private String hqCountry;
        private String hqState;
        private String hqCity;
        private String hqAddress;
        private Integer employeeCount;
        private String revenueRange;
        private String growthStage;
    }

    @PostMapping("/{id}/initialize")
    public ResponseEntity<Void> initializeCompany(
            @org.springframework.web.bind.annotation.PathVariable("id") String id,
            @RequestBody InitializeCompanyRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        companyService.initializeCompany(
                id,
                request.getTenantId(),
                request.getSchemaVersion(),
                request.getPayload(),
                userId
        );
        return ResponseEntity.accepted().build();
    }

    @Data
    public static class InitializeCompanyRequest {
        private String tenantId;
        private Integer schemaVersion;
        private String payload;
    }
}
