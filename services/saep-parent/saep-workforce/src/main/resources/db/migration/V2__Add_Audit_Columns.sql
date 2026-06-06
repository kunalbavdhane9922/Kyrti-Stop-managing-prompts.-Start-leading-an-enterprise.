-- V2: Add audit columns to workforce service tables
ALTER TABLE workforce_professionals ADD COLUMN created_by UUID;
ALTER TABLE workforce_professionals ADD COLUMN updated_by UUID;

ALTER TABLE workforce_history ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE workforce_history ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE workforce_history ADD COLUMN created_by UUID;
ALTER TABLE workforce_history ADD COLUMN updated_by UUID;
