-- Flyway Migration: V1 Initial Schema for Workforce

CREATE TABLE workers (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    worker_code VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    profession_id VARCHAR(255),
    level VARCHAR(255),
    worker_type VARCHAR(255),
    origin_template_id VARCHAR(255),
    origin_template_version INTEGER,
    origin_template_snapshot JSONB,
    status VARCHAR(255),
    current_company_id VARCHAR(255),
    hire_date TIMESTAMP,
    retirement_date TIMESTAMP,
    active_assignment_count INTEGER,
    completed_task_count INTEGER,
    failed_task_count INTEGER,
    current_capability_score DOUBLE PRECISION,
    current_reputation_score DOUBLE PRECISION,
    created_at TIMESTAMP,
    version BIGINT
);

CREATE SEQUENCE worker_code_seq START 1 INCREMENT 1;

CREATE TABLE career_history (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255),
    professional_name VARCHAR(255),
    role_title VARCHAR(255),
    level VARCHAR(255),
    company_id VARCHAR(255),
    actor_id VARCHAR(255),
    approver_id VARCHAR(255),
    previous_value TEXT,
    new_value TEXT,
    reason TEXT,
    occurred_at TIMESTAMP,
    promotion_score DOUBLE PRECISION,
    promotion_threshold DOUBLE PRECISION
);

CREATE TABLE profession_templates (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    profession_code VARCHAR(255) NOT NULL,
    profession_name VARCHAR(255),
    category VARCHAR(255),
    template_version INTEGER,
    active_flag BOOLEAN,
    definition JSONB,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    supersedes_template_id VARCHAR(255),
    CONSTRAINT uk_tenant_code_version UNIQUE (tenant_id, profession_code, template_version)
);

CREATE TABLE workforce_scores (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    capability_score DOUBLE PRECISION,
    readiness_score DOUBLE PRECISION,
    skill_score DOUBLE PRECISION,
    updated_at TIMESTAMP,
    version BIGINT,
    CONSTRAINT uk_tenant_worker UNIQUE (tenant_id, worker_id)
);

CREATE TABLE workforce_score_history (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    score_type VARCHAR(255),
    old_value DOUBLE PRECISION,
    new_value DOUBLE PRECISION,
    delta DOUBLE PRECISION,
    reason TEXT,
    recorded_at TIMESTAMP
);

CREATE TABLE reputation_scores (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    reputation_score DOUBLE PRECISION,
    confidence_score DOUBLE PRECISION,
    updated_at TIMESTAMP,
    version BIGINT,
    CONSTRAINT uk_tenant_entity UNIQUE (tenant_id, entity_id, entity_type)
);

CREATE TABLE reputation_score_history (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    old_value DOUBLE PRECISION,
    new_value DOUBLE PRECISION,
    delta DOUBLE PRECISION,
    reason TEXT,
    recorded_at TIMESTAMP
);

CREATE TABLE evidence_records (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    source_domain VARCHAR(255),
    event_id VARCHAR(255),
    payload JSONB,
    checksum VARCHAR(255),
    received_at TIMESTAMP,
    CONSTRAINT uk_tenant_source_event UNIQUE (tenant_id, source_domain, event_id)
);

CREATE TABLE processed_signals (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    signal_id VARCHAR(255) NOT NULL,
    signal_type VARCHAR(255) NOT NULL,
    processed_at TIMESTAMP,
    CONSTRAINT uk_tenant_signal UNIQUE (tenant_id, signal_id, signal_type)
);

CREATE TABLE workforce_signals (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    evidence_id VARCHAR(255),
    signal_definition_id VARCHAR(255),
    capability_impact DOUBLE PRECISION,
    skill_impact DOUBLE PRECISION,
    readiness_impact DOUBLE PRECISION,
    occurred_at TIMESTAMP,
    applied_at TIMESTAMP
);

CREATE TABLE reputation_signals (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    evidence_id VARCHAR(255),
    signal_definition_id VARCHAR(255),
    reputation_impact DOUBLE PRECISION,
    occurred_at TIMESTAMP,
    applied_at TIMESTAMP
);

CREATE TABLE signal_definitions (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    impact_type VARCHAR(255),
    default_weight DOUBLE PRECISION,
    confidence_factor DOUBLE PRECISION,
    decay_rate DOUBLE PRECISION,
    active_flag BOOLEAN,
    CONSTRAINT uk_tenant_domain_event UNIQUE (tenant_id, domain, event_name)
);

CREATE TABLE scoring_policies (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    policy_name VARCHAR(255) NOT NULL,
    dimension VARCHAR(255) NOT NULL,
    max_score DOUBLE PRECISION,
    min_score DOUBLE PRECISION,
    algorithm_version VARCHAR(255),
    active_flag BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE professional_reputations (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    score DOUBLE PRECISION,
    calculation_version VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    CONSTRAINT uk_tenant_profrep UNIQUE (tenant_id, worker_id)
);

CREATE TABLE company_reputations (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    score DOUBLE PRECISION,
    calculation_version VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    CONSTRAINT uk_tenant_comprep UNIQUE (tenant_id, company_id)
);

CREATE TABLE team_reputations (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    team_id VARCHAR(255) NOT NULL,
    score DOUBLE PRECISION,
    calculation_version VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    CONSTRAINT uk_tenant_teamrep UNIQUE (tenant_id, team_id)
);
