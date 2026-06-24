# ADR 001: Transactional Outbox Delivery Semantics

## Status
Approved

## Context
The Memory Platform requires asynchronous event publishing (e.g., triggering LLM embedding generation) upon memory creation or update. Publishing to Kafka directly from within the PostgreSQL database transaction creates a distributed consistency problem (Two-Phase Commit). If the database commits successfully but the Kafka publish fails, the system is left in a permanently inconsistent state (a memory exists but is unsearchable because no event was emitted).

## Decision
We will exclusively use the **Transactional Outbox Pattern** for all event publishing.
1. Any business operation (e.g., `createMemory`) must save the business entity (e.g., `MemoryEntry`) and the `OutboxEvent` within the exact same `@Transactional` boundary in PostgreSQL.
2. A separate background worker reads the `outbox_events` table and publishes them to Kafka asynchronously.

## Consequences
- **At-Least-Once Delivery Guarantees**: Outbox guarantees that the event will be published *at least once*. It does **NOT** guarantee Exactly-Once delivery.
- **Consumer Requirements**: Because events may be delivered multiple times, all downstream consumers (e.g., the Embedding Worker) **must** implement Idempotency to prevent duplicate side effects. (See ADR 003).
