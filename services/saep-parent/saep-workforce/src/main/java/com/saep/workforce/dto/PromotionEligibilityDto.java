package com.saep.workforce.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PromotionEligibilityDto {
    private double totalScore;
    private double requiredThreshold;
    private boolean eligible;
    private String eligibilityStatus;
}
