CREATE TABLE organization_builds (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    build_version INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX idx_unique_active_build ON organization_builds (tenant_id) WHERE status = 'ACTIVE';

CREATE TABLE departments (
    id UUID PRIMARY KEY,
    build_id UUID NOT NULL REFERENCES organization_builds(id),
    tenant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE positions (
    id UUID PRIMARY KEY,
    build_id UUID NOT NULL REFERENCES organization_builds(id),
    tenant_id VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    position_type VARCHAR(50) NOT NULL,
    assignment_status VARCHAR(50) NOT NULL,
    assigned_worker_id UUID
);

CREATE TABLE position_relationships (
    id UUID PRIMARY KEY,
    build_id UUID NOT NULL REFERENCES organization_builds(id),
    position_id UUID NOT NULL REFERENCES positions(id),
    parent_position_id UUID NOT NULL REFERENCES positions(id),
    relationship_type VARCHAR(50) NOT NULL
);
