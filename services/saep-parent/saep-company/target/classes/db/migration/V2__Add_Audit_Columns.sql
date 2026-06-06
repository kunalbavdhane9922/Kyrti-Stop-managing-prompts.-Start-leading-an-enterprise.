-- V2: Add audit columns to company service tables
ALTER TABLE company_tenants ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE company_tenants ADD COLUMN created_by UUID;
ALTER TABLE company_tenants ADD COLUMN updated_by UUID;

ALTER TABLE company_companies ADD COLUMN created_by UUID;
ALTER TABLE company_companies ADD COLUMN updated_by UUID;

ALTER TABLE company_departments ADD COLUMN created_by UUID;
ALTER TABLE company_departments ADD COLUMN updated_by UUID;

ALTER TABLE company_teams ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE company_teams ADD COLUMN created_by UUID;
ALTER TABLE company_teams ADD COLUMN updated_by UUID;
