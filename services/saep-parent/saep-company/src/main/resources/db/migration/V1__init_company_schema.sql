CREATE TABLE companies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    saga_correlation_id VARCHAR(255),
    latest_event_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE initialization_requests (
    id UUID PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id),
    tenant_id VARCHAR(255) NOT NULL,
    schema_version INT NOT NULL,
    payload_reference TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE invitations (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    invited_by UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE memberships (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    membership_type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP NOT NULL,
    UNIQUE(tenant_id, user_id)
);

CREATE TABLE membership_roles (
    id UUID PRIMARY KEY,
    membership_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMP NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    UNIQUE(membership_id, role_id)
);

CREATE TABLE permission_catalog (
    code VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    module VARCHAR(255) NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    display_order INT NOT NULL,
    is_system_role BOOLEAN NOT NULL,
    version BIGINT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY,
    role_id UUID NOT NULL,
    permission_code VARCHAR(255) NOT NULL
);

CREATE TABLE outbox_events (
    event_id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    retry_count INT NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMP,
    last_attempt_at TIMESTAMP,
    failure_reason TEXT
);

CREATE TABLE processed_events (
    event_id VARCHAR(255) PRIMARY KEY,
    processed_at TIMESTAMP NOT NULL
);