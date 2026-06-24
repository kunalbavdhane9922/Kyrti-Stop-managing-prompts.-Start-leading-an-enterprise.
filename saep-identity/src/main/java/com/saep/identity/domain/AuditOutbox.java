package com.saep.identity.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_outbox")
@Getter
@Setter
public class AuditOutbox {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "payload", columnDefinition = "text", nullable = false)
    private String payload;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed", nullable = false)
    private boolean processed = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
