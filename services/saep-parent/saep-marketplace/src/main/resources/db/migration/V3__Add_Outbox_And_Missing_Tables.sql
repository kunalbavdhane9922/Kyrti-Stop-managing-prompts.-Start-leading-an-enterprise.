-- V3: Missing tables and Outbox pattern

CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_type VARCHAR(255) NOT NULL,
    aggregate_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    processed BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE marketplace_profession_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profession_id UUID NOT NULL REFERENCES marketplace_professions(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    configuration_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE TABLE marketplace_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE TABLE marketplace_profession_skills (
    profession_id UUID NOT NULL REFERENCES marketplace_professions(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES marketplace_skills(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    PRIMARY KEY (profession_id, skill_id)
);
