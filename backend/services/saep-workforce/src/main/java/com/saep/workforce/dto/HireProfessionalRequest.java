package com.saep.workforce.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class HireProfessionalRequest {
    private UUID companyId;
    private String newRole;
    private String reason;
}
