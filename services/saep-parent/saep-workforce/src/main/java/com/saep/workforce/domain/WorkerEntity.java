package com.saep.workforce.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerEntity {
    @Id
    private UUID id;
    private String tenantId;
    private String workerType; // AI, HUMAN
    private String status; // ACTIVE, INACTIVE
    private LocalDateTime createdAt;
}
