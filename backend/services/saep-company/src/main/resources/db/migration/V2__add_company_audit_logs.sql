CREATE TABLE IF NOT EXISTS company_audit_logs (
    id UUID PRIMARY KEY,
    entity_id UUID NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    old_state TEXT,
    new_state TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id VARCHAR(255),
    tenant_id VARCHAR(255),
    correlation_id VARCHAR(255)
);
