-- Marketplace Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE marketplace_professions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE marketplace_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profession_id UUID NOT NULL REFERENCES marketplace_professions(id) ON DELETE CASCADE,
    capability_name VARCHAR(255) NOT NULL,
    description TEXT
);
