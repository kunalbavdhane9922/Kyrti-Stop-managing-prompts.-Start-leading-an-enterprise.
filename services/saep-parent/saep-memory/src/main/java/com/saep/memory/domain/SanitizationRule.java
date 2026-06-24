package com.saep.memory.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sanitization_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SanitizationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "rule_name", nullable = false)
    private String ruleName;

    @Column(name = "regex_pattern", nullable = false, columnDefinition = "TEXT")
    private String regexPattern;

    @Column(name = "replacement_text", nullable = false)
    private String replacementText;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
