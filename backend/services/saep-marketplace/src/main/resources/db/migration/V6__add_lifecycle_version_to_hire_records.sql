-- V6__add_lifecycle_version_to_hire_records.sql

ALTER TABLE agent_hire_records
ADD COLUMN lifecycle_version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE agent_hire_records ADD CONSTRAINT chk_hire_lifecycle_version 
CHECK (lifecycle_version >= 0);
