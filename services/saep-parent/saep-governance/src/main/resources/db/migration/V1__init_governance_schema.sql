-- V1__init_governance_schema.sql

CREATE TABLE governance_policies (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    proposal_type VARCHAR(50) NOT NULL,
    required_approvals INT NOT NULL DEFAULT 1,
    mfa_required BOOLEAN NOT NULL DEFAULT FALSE,
    expiration_days INT NOT NULL DEFAULT 7,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE UNIQUE INDEX idx_active_policy ON governance_policies (tenant_id, proposal_type) WHERE status = 'ACTIVE';

CREATE TABLE governance_proposals (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    proposer_id UUID NOT NULL,
    proposer_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    payload_version VARCHAR(20) NOT NULL,
    required_approvals INT NOT NULL,
    current_approvals INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE governance_decisions (
    id UUID PRIMARY KEY,
    proposal_id UUID NOT NULL,
    approver_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    justification TEXT,
    decided_at TIMESTAMP NOT NULL,
    session_id UUID NOT NULL,
    correlation_id UUID NOT NULL,
    FOREIGN KEY (proposal_id) REFERENCES governance_proposals(id),
    UNIQUE(proposal_id, approver_id)
);

CREATE TABLE proposal_decision_outbox (
    event_id UUID PRIMARY KEY,
    proposal_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING or PUBLISHED
    topic VARCHAR(100) NOT NULL DEFAULT 'governance-events',
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    published_at TIMESTAMP
);
