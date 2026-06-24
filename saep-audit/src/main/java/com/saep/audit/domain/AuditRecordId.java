package com.saep.audit.domain;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class AuditRecordId implements Serializable {
    private UUID eventId;
    private Instant occurredAt;

    public AuditRecordId() {}

    public AuditRecordId(UUID eventId, Instant occurredAt) {
        this.eventId = eventId;
        this.occurredAt = occurredAt;
    }

    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }
    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuditRecordId that = (AuditRecordId) o;
        return Objects.equals(eventId, that.eventId) && Objects.equals(occurredAt, that.occurredAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, occurredAt);
    }
}
