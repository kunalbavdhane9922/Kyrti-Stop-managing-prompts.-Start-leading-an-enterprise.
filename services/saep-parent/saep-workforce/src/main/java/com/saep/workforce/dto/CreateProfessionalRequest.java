package com.saep.workforce.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateProfessionalRequest {
    private String professionCode;
    private Integer templateVersion;
    private UUID companyId; // optional
}
