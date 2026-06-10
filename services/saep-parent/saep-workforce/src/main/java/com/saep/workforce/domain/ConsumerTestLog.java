package com.saep.workforce.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "consumer_test_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsumerTestLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "processing_order")
    private Long processingOrder;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "event_id", nullable = false)
    private String eventId;

    @Column(name = "sequence_name")
    private String sequenceName;

    @Column(name = "received_at", nullable = false)
    private LocalDateTime receivedAt;
}
