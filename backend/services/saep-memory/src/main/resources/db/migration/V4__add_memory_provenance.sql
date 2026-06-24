-- V4__add_memory_provenance.sql

-- Add Provenance Tracking to existing memory_entries
ALTER TABLE memory_entries ADD COLUMN origin_memory_id UUID;
ALTER TABLE memory_entries ADD COLUMN transfer_id UUID;

-- Add Archive Metadata
ALTER TABLE memory_entries ADD COLUMN archived_at TIMESTAMP;
ALTER TABLE memory_entries ADD COLUMN archived_by UUID;
ALTER TABLE memory_entries ADD COLUMN archive_reason VARCHAR(255);

-- Add Agent Lineage
ALTER TABLE memory_entries ADD COLUMN agent_id VARCHAR(255);
ALTER TABLE memory_entries ADD COLUMN workflow_id VARCHAR(255);
ALTER TABLE memory_entries ADD COLUMN task_id VARCHAR(255);
