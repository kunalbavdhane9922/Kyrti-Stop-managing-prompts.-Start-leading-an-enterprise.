package com.saep.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionCreationRequest {
    private String professionName;
    private String tenantId;
    private String category;
    private String description;
    private String requestedBy;
}
