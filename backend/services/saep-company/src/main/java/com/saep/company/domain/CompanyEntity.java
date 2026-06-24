package com.saep.company.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyEntity {
    
    @Id
    private String id;
    
    private String name;
    
    private String domain;
    
    private String tenantId;
    
    @Enumerated(EnumType.STRING)
    private CompanyStatus status;

    @Column(name = "saga_correlation_id")
    private String sagaCorrelationId;

    @Column(name = "latest_event_id")
    private String latestEventId;

    @Column(name = "legal_name")
    private String legalName;

    private String industry;

    @Column(name = "company_type")
    private String companyType;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "tax_number")
    private String taxNumber;

    @Column(name = "hq_country")
    private String hqCountry;

    @Column(name = "hq_state")
    private String hqState;

    @Column(name = "hq_city")
    private String hqCity;

    @Column(name = "hq_address")
    private String hqAddress;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "revenue_range")
    private String revenueRange;

    @Column(name = "growth_stage")
    private String growthStage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
