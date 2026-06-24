-- V2__add_outbox_tables.sql

CREATE TABLE outbox_events (
    event_id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMP,
    last_attempt_at TIMESTAMP,
    failure_reason TEXT
);

CREATE INDEX idx_outbox_events_status ON outbox_events(status, next_attempt_at);

CREATE TABLE processed_events (
    event_id VARCHAR(255) PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
