package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "processed_events",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "consumer_group"})
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private String eventId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "consumer_group", nullable = false)
    private String consumerGroup;

    @Column(name = "processed_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime processedAt = LocalDateTime.now();
}
