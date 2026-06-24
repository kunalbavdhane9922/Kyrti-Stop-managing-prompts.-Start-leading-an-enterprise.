# ADR 003: Idempotent Event Processing

## Status
Approved

## Context
As defined in ADR 001, the system relies on the Transactional Outbox Pattern which guarantees At-Least-Once delivery. Kafka may redeliver events due to network partitions, consumer crashes before offset commits, or intentional topic rewinds. If an Embedding Worker blindly processes events, the system will generate duplicate vector chunks in Qdrant, inflating storage costs and skewing retrieval rankings.

## Decision
All event consumers must be rigorously Idempotent.
1. Consumers must rely on a `ProcessedEventRepository` (or equivalent persistent store).
2. Before processing any Kafka event, the consumer must execute `processedEventRepository.existsById(eventId)`.
3. If the event exists, the consumer must silently acknowledge the event and return without executing side effects.
4. If the event does not exist, the consumer executes the business logic, and saves the `eventId` to the `processed_events` table as part of the database transaction.

### Storage Retention
To prevent the `processed_events` table from growing infinitely, a scheduled maintenance task must prune processed events older than 90 days.

## Consequences
- Protects Qdrant and Neo4j from duplicate data insertions.
- Protects LLM token quotas from duplicate embedding generation costs.
- Requires maintenance overhead to prune the `processed_events` table.
