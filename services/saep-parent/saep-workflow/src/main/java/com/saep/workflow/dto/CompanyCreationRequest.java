package com.saep.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCreationRequest {
    private String companyName;
    private String tenantId;
    private String founderId;
    private String industry;
    private String initialDepartmentName;
}
