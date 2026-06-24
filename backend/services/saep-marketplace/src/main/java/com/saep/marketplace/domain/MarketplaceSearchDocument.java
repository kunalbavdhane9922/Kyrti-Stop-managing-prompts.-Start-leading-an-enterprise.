package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "marketplace_search_documents")
@Data
@NoArgsConstructor
public class MarketplaceSearchDocument {

    @Id
    @Column(name = "agent_id")
    private String agentId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "document_body", columnDefinition = "text", nullable = false)
    private String documentBody; // JSONB or text string containing keywords, skills, etc.

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "reputation_score")
    private Double reputationScore;
    
    @Column(name = "updated_at")
    private java.time.Instant updatedAt = java.time.Instant.now();
}
