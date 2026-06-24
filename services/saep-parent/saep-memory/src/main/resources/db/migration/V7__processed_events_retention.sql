-- V7__processed_events_retention.sql

-- Ensure processed_events has an index on processed_at to support the 90-day retention cleanup queries efficiently
CREATE INDEX idx_processed_events_processed_at ON processed_events(processed_at);
