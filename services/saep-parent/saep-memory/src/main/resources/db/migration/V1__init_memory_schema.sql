-- V1__init_memory_schema.sql

CREATE TABLE memory_entries (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    owner_type VARCHAR(50) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    visibility VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    version_number INTEGER NOT NULL DEFAULT 1,
    importance_score INTEGER NOT NULL DEFAULT 5,
    status VARCHAR(50) NOT NULL,
    source_type VARCHAR(50),
    source_reference VARCHAR(255),
    embedding_attempts INTEGER NOT NULL DEFAULT 0,
    last_embedding_error TEXT,
    idempotency_key VARCHAR(255),
    expires_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_tenant_idempotency UNIQUE (tenant_id, idempotency_key)
);

CREATE INDEX idx_memory_entries_tenant ON memory_entries(tenant_id);
CREATE INDEX idx_memory_entries_owner ON memory_entries(owner_id, owner_type);
CREATE INDEX idx_memory_entries_status ON memory_entries(status);

CREATE TABLE memory_versions (
    id UUID PRIMARY KEY,
    memory_entry_id UUID NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_versions_entry ON memory_versions(memory_entry_id);

CREATE TABLE memory_chunks (
    id UUID PRIMARY KEY,
    memory_entry_id UUID NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    vector_id UUID NOT NULL,
    token_count INTEGER NOT NULL,
    content_chunk TEXT NOT NULL,
    embedding_model VARCHAR(100) NOT NULL,
    embedding_version VARCHAR(100) NOT NULL
);

CREATE INDEX idx_memory_chunks_entry ON memory_chunks(memory_entry_id);
CREATE INDEX idx_memory_chunks_vector ON memory_chunks(vector_id);

CREATE TABLE memory_relations (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    source_memory_id UUID NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
    target_memory_id UUID NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
    relation_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_relations_source ON memory_relations(source_memory_id);
CREATE INDEX idx_memory_relations_target ON memory_relations(target_memory_id);

CREATE TABLE memory_events (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    memory_entry_id UUID NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    request_id VARCHAR(255),
    trace_id VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_events_entry ON memory_events(memory_entry_id);
CREATE INDEX idx_memory_events_tenant ON memory_events(tenant_id);
