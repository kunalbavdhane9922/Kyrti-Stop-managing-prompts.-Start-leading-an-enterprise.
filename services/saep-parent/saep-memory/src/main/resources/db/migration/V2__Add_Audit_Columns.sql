-- V2: Add audit columns to memory service tables
ALTER TABLE memory_metadata ADD COLUMN created_by UUID;
ALTER TABLE memory_metadata ADD COLUMN updated_by UUID;
