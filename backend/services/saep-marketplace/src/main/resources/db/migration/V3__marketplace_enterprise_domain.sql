-- V3__marketplace_enterprise_domain.sql

-- 1. Create professions table
CREATE TABLE professions (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add columns to marketplace_agents
ALTER TABLE marketplace_agents
ADD COLUMN profession_id UUID NULL REFERENCES professions(id),
ADD COLUMN tenant_id UUID NULL,
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN lifecycle_version BIGINT NOT NULL DEFAULT 0;

-- Set a default dummy tenant_id for existing records temporarily
UPDATE marketplace_agents SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
ALTER TABLE marketplace_agents ALTER COLUMN tenant_id SET NOT NULL;

-- Ensure constraints on status
ALTER TABLE marketplace_agents ADD CONSTRAINT chk_status_valid 
CHECK (status IN ('AVAILABLE', 'RESERVED', 'HIRED', 'TERMINATION_PENDING', 'RETIRED'));

ALTER TABLE marketplace_agents ADD CONSTRAINT chk_lifecycle_version 
CHECK (lifecycle_version >= 0);

-- 3. Backfill profession data
INSERT INTO professions (id, name, description)
SELECT gen_random_uuid(), specialization, 'Auto-generated profession'
FROM (
    SELECT DISTINCT specialization 
    FROM marketplace_agents 
    WHERE specialization IS NOT NULL 
      AND specialization NOT IN (SELECT name FROM professions)
) as dist_specs;

UPDATE marketplace_agents
SET profession_id = p.id
FROM professions p
WHERE marketplace_agents.specialization = p.name;

-- Note: We leave profession_id nullable for now to allow safe phased rollouts.

-- 4. Create Partial Indexes
CREATE INDEX idx_marketplace_available
ON marketplace_agents(status)
WHERE status = 'AVAILABLE';

CREATE INDEX idx_marketplace_tenant_available
ON marketplace_agents(tenant_id, status);
