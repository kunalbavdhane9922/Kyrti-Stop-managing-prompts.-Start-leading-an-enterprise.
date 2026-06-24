-- V7__marketplace_enterprise_sprint4.sql

-- 1. Create career_history table
CREATE TABLE career_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(255) NOT NULL REFERENCES marketplace_agents(id),
    tenant_id UUID NOT NULL,
    contract_id UUID NOT NULL REFERENCES employment_contracts(id),
    contract_snapshot TEXT NOT NULL,
    agent_snapshot TEXT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_career_history_agent 
ON career_history(agent_id);

CREATE INDEX idx_career_history_tenant 
ON career_history(tenant_id);

-- 2. Create reputation_events table (Append-only Ledger)
CREATE TABLE reputation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(255) NOT NULL REFERENCES marketplace_agents(id),
    event_type VARCHAR(255) NOT NULL,
    score_delta DOUBLE PRECISION NOT NULL,
    causation_id VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_reputation_events_agent 
ON reputation_events(agent_id, occurred_at ASC);
