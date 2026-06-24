-- V2__marketplace_enterprise_audit.sql

-- 1. Create Processed Events table for Idempotent Consumer Inbox
CREATE TABLE IF NOT EXISTS processed_events (
    event_id VARCHAR(255) PRIMARY KEY,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Agent Hire Records table
CREATE TABLE IF NOT EXISTS agent_hire_records (
    id VARCHAR(255) PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    request_id VARCHAR(255) NOT NULL,
    agent_template_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    hired_agent_name VARCHAR(255) NOT NULL,
    hired_price VARCHAR(255) NOT NULL,
    hired_engine VARCHAR(255) NOT NULL,
    trial_days INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_tenant_request UNIQUE (tenant_id, request_id)
);

-- 3. Modify marketplace_agents to support soft deletes and optimistic locking
ALTER TABLE marketplace_agents ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE marketplace_agents ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE marketplace_agents ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- 4. Create Outbox Events table for Transactional Outbox Pattern
CREATE TABLE IF NOT EXISTS outbox_events (
    event_id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    retry_count INT NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMP,
    last_attempt_at TIMESTAMP,
    failure_reason TEXT
);
