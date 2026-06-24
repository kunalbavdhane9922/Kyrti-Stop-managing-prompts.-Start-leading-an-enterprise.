# Memory Lifecycle State Machine

## Overview
The Memory System implements an explicit state machine to strictly govern the lifecycle of a memory entry from ingestion, through LLM embedding generation, vector indexing, and eventual archival.

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> PENDING_EMBEDDING : createMemory()
    
    PENDING_EMBEDDING --> EMBEDDING_PROCESSING : Worker Picks Up Event
    
    EMBEDDING_PROCESSING --> EMBEDDING_FAILED : LLM API Fails / Timeout
    EMBEDDING_FAILED --> PENDING_EMBEDDING : DLQ / Retry Initiated
    
    EMBEDDING_PROCESSING --> EMBEDDING_COMPLETE : Embeddings Generated Successfully
    
    EMBEDDING_COMPLETE --> VECTOR_INDEXING : Sending to Qdrant
    
    VECTOR_INDEXING --> VECTOR_INDEX_FAILED : Qdrant Unreachable / Reject
    VECTOR_INDEX_FAILED --> VECTOR_INDEXING : Retry
    
    VECTOR_INDEXING --> ACTIVE : Vectors Indexed Successfully
    
    ACTIVE --> PENDING_TRANSFER : Transfer Requested
    PENDING_TRANSFER --> ACTIVE : Transfer Approved / Cloned
    
    ACTIVE --> UPDATED : Memory Content Edited
    UPDATED --> PENDING_EMBEDDING : Re-trigger Worker
    
    ACTIVE --> ARCHIVED : Soft Delete (archiveMemory)
    ARCHIVED --> [*]
    
    ACTIVE --> DELETED : Hard Delete (deleteMemory)
    DELETED --> [*]
```

## Failure Paths
Isolating LLM failures from Vector DB failures is critical for operational observability. 
- **`EMBEDDING_FAILED`**: Represents a failure communicating with the LLM Embedding Provider (e.g., Ollama/OpenAI). The vectors were never generated. The payload remains in Postgres.
- **`VECTOR_INDEX_FAILED`**: Represents a failure communicating with Qdrant. The embeddings *were* successfully generated (meaning we paid the token cost), but we failed to persist them to the vector database. Operations teams can inspect this state to recover the embeddings without regenerating them.

Every failure state records `last_embedding_error`, `embedding_attempts`, and `next_retry_at` in the `memory_entries` table.
