package com.saep.outbox.domain;

public enum EventStatus {
    PENDING,
    PROCESSING,
    PUBLISHED,
    FAILED,
    PERMANENTLY_FAILED
}
