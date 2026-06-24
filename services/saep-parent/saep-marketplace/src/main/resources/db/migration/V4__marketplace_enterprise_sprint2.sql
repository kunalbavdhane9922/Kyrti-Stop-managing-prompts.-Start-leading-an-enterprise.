-- V4__marketplace_enterprise_sprint2.sql

-- 1. Create saga_instances table
CREATE TABLE saga_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correlation_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    current_step VARCHAR(100) NOT NULL,
    payload TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- 2. Create employment_contracts table
CREATE TABLE employment_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    agent_id VARCHAR(255) NOT NULL REFERENCES marketplace_agents(id),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    trial_days INT,
    started_at TIMESTAMP,
    expires_at TIMESTAMP,
    terminated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    lifecycle_version BIGINT NOT NULL DEFAULT 0
);

-- Constraints for employment contracts
ALTER TABLE employment_contracts ADD CONSTRAINT chk_contract_status 
CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'TERMINATION_PENDING', 'TERMINATED', 'EXPIRED'));

ALTER TABLE employment_contracts ADD CONSTRAINT chk_contract_lifecycle 
CHECK (lifecycle_version >= 0);

-- Partial index for active contracts
CREATE INDEX idx_active_contracts 
ON employment_contracts(tenant_id, status)
WHERE status = 'ACTIVE';

-- 3. Add Reservation specific columns to marketplace_agents if not fully present
ALTER TABLE marketplace_agents
ADD COLUMN reserved_until TIMESTAMP NULL,
ADD COLUMN reserved_by_tenant_id UUID NULL,
ADD COLUMN reservation_id VARCHAR(255) NULL UNIQUE;
