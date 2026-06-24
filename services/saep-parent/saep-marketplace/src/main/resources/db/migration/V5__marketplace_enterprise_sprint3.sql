-- V5__marketplace_enterprise_sprint3.sql

-- Drop the old table if it exists
DROP TABLE IF EXISTS processed_events;

-- Create the robust idempotency table
CREATE TABLE processed_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    consumer_group VARCHAR(255) NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (event_id, consumer_group)
);

-- Note: In a real production system, we would partition this table by month
-- or set up a pg_cron job to delete records older than 90 days.
