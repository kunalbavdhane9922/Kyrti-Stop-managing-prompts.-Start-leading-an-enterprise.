package com.saep.marketplace.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "tenant_metrics_read_model")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantMetricsEntity {

    @Id
    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "total_hires_requested", nullable = false)
    @Builder.Default
    private Long totalHiresRequested = 0L;

    @Column(name = "total_hires_completed", nullable = false)
    @Builder.Default
    private Long totalHiresCompleted = 0L;

    @Column(name = "total_payment_failures", nullable = false)
    @Builder.Default
    private Long totalPaymentFailures = 0L;
    
    public void incrementHiresRequested() {
        this.totalHiresRequested++;
    }
    
    public void incrementHiresCompleted() {
        this.totalHiresCompleted++;
    }
    
    public void incrementPaymentFailures() {
        this.totalPaymentFailures++;
    }
}
