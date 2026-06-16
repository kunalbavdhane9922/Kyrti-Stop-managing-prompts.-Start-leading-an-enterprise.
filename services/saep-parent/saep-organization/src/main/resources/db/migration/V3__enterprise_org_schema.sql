DROP TABLE IF EXISTS position_relationships;
DROP TABLE IF EXISTS positions;

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    build_id UUID NOT NULL REFERENCES organization_builds(id),
    tenant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE role_templates (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    template_data JSONB
);

CREATE TABLE company_nodes (
    id UUID PRIMARY KEY,
    build_id UUID NOT NULL REFERENCES organization_builds(id),
    tenant_id VARCHAR(255) NOT NULL,
    parent_node_id UUID REFERENCES company_nodes(id),
    department_id UUID REFERENCES departments(id),
    role_id UUID REFERENCES roles(id),
    title VARCHAR(255) NOT NULL,
    occupant_type VARCHAR(50) NOT NULL
);

CREATE TABLE node_permissions (
    id UUID PRIMARY KEY,
    node_id UUID NOT NULL REFERENCES company_nodes(id),
    permission_key VARCHAR(255) NOT NULL,
    is_granted BOOLEAN NOT NULL
);

CREATE TABLE node_assignments (
    id UUID PRIMARY KEY,
    node_id UUID NOT NULL REFERENCES company_nodes(id),
    assigned_entity_id UUID NOT NULL,
    assigned_at TIMESTAMP NOT NULL
);
