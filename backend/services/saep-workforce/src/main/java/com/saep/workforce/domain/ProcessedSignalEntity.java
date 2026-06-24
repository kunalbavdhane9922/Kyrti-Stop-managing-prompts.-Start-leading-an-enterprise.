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
@Table(name = "processed_signals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedSignalEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    
    // The Kafka/External event ID to guarantee idempotency across re-deliveries
    private String sourceEventId; 
    
    // Internal signal reference if created
    private String internalSignalId;
    
    private LocalDateTime processedAt;
}
