-- V8__memory_failure_metadata.sql

-- Alter Memory Status enum (implicitly via varchar, but adding new logical states)
-- No explicit ENUM alteration needed since it is stored as VARCHAR in V1 migration.

-- Add granular failure metadata
ALTER TABLE memory_entries ADD COLUMN next_retry_at TIMESTAMP;
-- Note: embedding_attempts and last_embedding_error were already added in V1.
