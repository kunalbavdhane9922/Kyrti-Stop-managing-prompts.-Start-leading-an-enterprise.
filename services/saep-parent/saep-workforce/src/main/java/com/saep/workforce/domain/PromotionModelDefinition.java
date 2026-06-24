package com.saep.workforce.domain;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class PromotionModelDefinition {
    private Map<String, BigDecimal> weights;
    private BigDecimal promotionThreshold;
    private BigDecimal strongCandidateThreshold;
    private BigDecimal experienceWeight;
    private BigDecimal reputationWeight;
    private BigDecimal workforceWeight;
}
