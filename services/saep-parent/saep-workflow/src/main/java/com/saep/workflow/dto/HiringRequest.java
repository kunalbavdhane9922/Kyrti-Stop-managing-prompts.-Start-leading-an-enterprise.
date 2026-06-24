package com.saep.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiringRequest {
    private String companyId;
    private String tenantId;
    private String requiredProfessionId;
    private String departmentId;
    private String requestedBy;
    private Integer minimumReputation;
    private String requiredCareerLevel;
}
