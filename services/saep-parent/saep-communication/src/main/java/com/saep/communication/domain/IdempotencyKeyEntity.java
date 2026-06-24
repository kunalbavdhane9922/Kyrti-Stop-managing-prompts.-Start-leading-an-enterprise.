package com.saep.communication.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "communication_idempotency_keys", indexes = {
    @Index(name = "idx_idempotency_key", columnList = "tenant_id, idempotency_key", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdempotencyKeyEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "idempotency_key", nullable = false)
    private String idempotencyKey;

    @Column(name = "request_hash")
    private String requestHash;

    @Column(name = "response_payload", columnDefinition = "text")
    private String responsePayload;

    @Column(name = "status_code", nullable = false)
    private Integer statusCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Integer getStatusCode() { return this.statusCode; }
    public String getResponsePayload() { return this.responsePayload; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    public void setResponsePayload(String responsePayload) { this.responsePayload = responsePayload; }
}
