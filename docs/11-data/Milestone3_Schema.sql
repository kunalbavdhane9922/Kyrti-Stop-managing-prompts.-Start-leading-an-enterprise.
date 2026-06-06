-- ==========================================
-- WORKFORCE SCHEMA
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE workforce_professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL, -- Strict tenant isolation
    profession_id UUID NOT NULL, -- Logical reference to Marketplace (no strict FK)
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workforce_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES workforce_professionals(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- Redundant for fast tenant-level querying
    task_description TEXT NOT NULL,
    result TEXT,
    completed_at TIMESTAMP WITH TIME ZONE
);
