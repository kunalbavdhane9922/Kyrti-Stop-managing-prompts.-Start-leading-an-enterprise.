-- V2: Add audit columns to governance service tables
ALTER TABLE governance_policies ADD COLUMN created_by UUID;
ALTER TABLE governance_policies ADD COLUMN updated_by UUID;

ALTER TABLE governance_approvals ADD COLUMN created_by UUID;
ALTER TABLE governance_approvals ADD COLUMN updated_by UUID;

ALTER TABLE governance_audit_logs ADD COLUMN created_by UUID;
ALTER TABLE governance_audit_logs ADD COLUMN updated_by UUID;
ALTER TABLE governance_audit_logs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
