-- V5__optimistic_locking.sql

ALTER TABLE memory_entries ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE memory_transfers ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
