package com.saep.identity.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SessionDto {
    private UUID id;
    private UUID userId;
    private String tenantId;
    private String deviceId;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
    private LocalDateTime lastAccessedAt;
}
