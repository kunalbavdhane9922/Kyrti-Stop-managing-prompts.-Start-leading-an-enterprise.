package com.saep.workforce.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResumeDto {
    private String workerId;
    private String workerCode;
    private String displayName;
    private String professionName;
    private String currentLevel;
    private String status;
    
    private Double reputationScore;
    private Double capabilityScore;
    
    // Experience derived fields
    private Long yearsActive;
    private Integer completedAssignments;
    private Integer completedTasks;
    
    private List<String> skills;
    private List<CareerMilestoneDto> careerMilestones;
    
    @Data
    @Builder
    public static class CareerMilestoneDto {
        private String eventType;
        private String description;
        private String timestamp;
    }
}
