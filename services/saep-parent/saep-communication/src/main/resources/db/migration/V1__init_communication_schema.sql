-- V1__init_communication_schema.sql

CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    visibility VARCHAR(50) NOT NULL,
    content_summary TEXT,
    content_payload JSONB,
    idempotency_key VARCHAR(255),
    generated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_reports_tenant_type_status ON reports(tenant_id, type, status);
CREATE INDEX idx_reports_idempotency ON reports(tenant_id, idempotency_key);

CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    assignee_id VARCHAR(36),
    creator_id VARCHAR(36) NOT NULL,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_tasks_tenant_assignee ON tasks(tenant_id, assignee_id);

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    recipient_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    payload JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_notifications_recipient ON notifications(tenant_id, recipient_id, read_at);

CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    topic VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE conversation_participants (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
    participant_id VARCHAR(36) NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    left_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_conv_participants_part ON conversation_participants(tenant_id, participant_id);

CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
    sender_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

CREATE TABLE message_receipts (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    message_id VARCHAR(36) NOT NULL REFERENCES messages(id),
    participant_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_msg_receipts_message ON message_receipts(message_id);

CREATE TABLE idempotency_keys (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    response_status INT NOT NULL,
    response_body TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_idempotency_key UNIQUE (tenant_id, idempotency_key)
);
