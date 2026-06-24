-- V3__rbac_and_outbox.sql

-- 1. Create audit_outbox table
CREATE TABLE audit_outbox (
    id UUID PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Drop old global roles mapping
DROP TABLE IF EXISTS user_roles;

-- 3. Replace permission UUIDs with simple string permissions
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id, permission)
);

-- 4. Add multi-role support to user_tenant_memberships
CREATE TABLE user_tenant_roles (
    membership_id UUID NOT NULL REFERENCES user_tenant_memberships(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (membership_id, role_id)
);
