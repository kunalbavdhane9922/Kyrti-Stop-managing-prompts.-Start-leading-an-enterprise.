CREATE TABLE audit_records (
    event_id UUID NOT NULL,
    schema_version INT NOT NULL DEFAULT 1,
    correlation_id UUID,
    owner_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    source_service VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    tenant_id UUID NOT NULL,
    scope VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NOT NULL,
    result VARCHAR(50) NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    PRIMARY KEY (event_id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- Create partitions for 2026 and 2027
CREATE TABLE audit_records_2026 PARTITION OF audit_records
    FOR VALUES FROM ('2026-01-01 00:00:00') TO ('2027-01-01 00:00:00');

CREATE TABLE audit_records_2027 PARTITION OF audit_records
    FOR VALUES FROM ('2027-01-01 00:00:00') TO ('2028-01-01 00:00:00');

-- True Immutability
REVOKE UPDATE, DELETE ON audit_records FROM PUBLIC;
-- Granting only INSERT and SELECT (assuming application user connects with standard grants, we can just explicitly revoke)
-- In a real environment, you would revoke from the application role, e.g., REVOKE UPDATE, DELETE ON audit_records FROM app_user;

-- Composite Indexes
CREATE INDEX idx_audit_tenant_time ON audit_records(tenant_id, occurred_at DESC);
CREATE INDEX idx_audit_actor_time ON audit_records(actor_id, occurred_at DESC);
CREATE INDEX idx_audit_correlation ON audit_records(correlation_id);
