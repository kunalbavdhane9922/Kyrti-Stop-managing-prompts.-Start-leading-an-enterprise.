-- V2: Add audit columns to marketplace service tables
ALTER TABLE marketplace_professions ADD COLUMN tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'; -- Marketplace is a tenant
ALTER TABLE marketplace_professions ADD COLUMN created_by UUID;
ALTER TABLE marketplace_professions ADD COLUMN updated_by UUID;

ALTER TABLE marketplace_capabilities ADD COLUMN tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE marketplace_capabilities ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE marketplace_capabilities ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE marketplace_capabilities ADD COLUMN created_by UUID;
ALTER TABLE marketplace_capabilities ADD COLUMN updated_by UUID;
