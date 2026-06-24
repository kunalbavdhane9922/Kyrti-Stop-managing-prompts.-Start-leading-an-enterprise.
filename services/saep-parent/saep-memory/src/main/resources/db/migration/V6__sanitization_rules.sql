-- V6__sanitization_rules.sql

CREATE TABLE sanitization_rules (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    regex_pattern TEXT NOT NULL,
    replacement_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sanitization_rules_tenant ON sanitization_rules(tenant_id);
