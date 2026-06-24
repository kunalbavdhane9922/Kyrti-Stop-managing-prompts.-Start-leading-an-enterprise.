-- V3__add_knowledge_transfer_schema.sql

CREATE TABLE memory_transfers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    source_memory_id UUID NOT NULL REFERENCES memory_entries(id),
    target_scope VARCHAR(50) NOT NULL,
    target_tenant_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    reviewer_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_transfers_source ON memory_transfers(source_memory_id);

CREATE TABLE memory_transfer_events (
    id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL REFERENCES memory_transfers(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    actor_id UUID NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_transfer_events_transfer ON memory_transfer_events(transfer_id);
