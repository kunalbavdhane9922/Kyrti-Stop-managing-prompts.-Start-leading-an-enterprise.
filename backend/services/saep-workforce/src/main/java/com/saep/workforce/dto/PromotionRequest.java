package com.saep.workforce.dto;

import lombok.Data;

@Data
public class PromotionRequest {
    private String newLevel;
    private String newRole;
    private String reason;
}
