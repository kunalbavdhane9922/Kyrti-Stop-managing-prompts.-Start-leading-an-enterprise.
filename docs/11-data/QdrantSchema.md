# QdrantSchema.md

Status: Draft

Owner: Memory Platform Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the Qdrant schema architecture of the Sovereign AI Enterprise Protocol (SAEP).

Qdrant serves as the platform's vector database.

Qdrant is responsible for:

* Embedding Storage
* Vector Search
* Semantic Retrieval
* Similarity Matching
* Context Discovery

Qdrant is not the system of record.

PostgreSQL remains the authoritative source of memory and business data.

---

# Goals

## Primary Goal

Provide high-performance semantic retrieval.

---

## Secondary Goals

* Similarity Search
* Context Retrieval
* Memory Discovery
* Knowledge Discovery
* AI Reasoning Support

---

## Long-Term Goal

Support semantic retrieval across billions of knowledge records.

---

# Rules

## Rule 1

PostgreSQL Remains The Source Of Truth.

---

## Rule 2

Qdrant Stores Embeddings Only.

---

## Rule 3

Every Vector Must Reference An Owner Record.

---

## Rule 4

Tenant Isolation Is Mandatory.

---

## Rule 5

Vectors Must Be Auditable.

---

## Rule 6

Vector Deletion Must Follow Ownership Rules.

---

## Rule 7

Cross-Tenant Retrieval Is Forbidden.

---

# Architecture

```text
Knowledge Record
        ↓

Embedding Model
        ↓

Vector

        ↓

Qdrant
```

Retrieval follows:

```text
Query
      ↓

Embedding
      ↓

Vector Search
      ↓

Matching Records
      ↓

PostgreSQL Lookup
```

---

# Vector Collections

The platform organizes vectors into collections.

Collections represent logical retrieval domains.

```text
Personal Memory

Company Memory

Profession Memory

Ecosystem Memory
```

---

# Personal Memory Collection

Purpose:

```text
Experience

Lessons

Professional Learning

Patterns
```

Reference:

```text
PersonalMemory.md
```

---

# Company Memory Collection

Purpose:

```text
Projects

Processes

Documentation

Internal Knowledge
```

Reference:

```text
CompanyMemory.md
```

---

# Profession Memory Collection

Purpose:

```text
Best Practices

Standards

Industry Knowledge

Skill Knowledge
```

Reference:

```text
ProfessionMemory.md
```

---

# Ecosystem Memory Collection

Purpose:

```text
Marketplace Intelligence

Workforce Intelligence

Global Knowledge
```

Reference:

```text
EcosystemMemory.md
```

---

# Vector Entity

Every vector contains:

```text
Vector ID

Embedding

Owner ID

Tenant ID

Memory Scope

Created At
```

Vectors must be traceable.

---

# Metadata Model

Each vector stores metadata.

Examples:

```text
Record ID

Owner ID

Tenant ID

Memory Type

Profession

Company

Created Timestamp
```

Metadata supports filtering.

---

# Ownership Model

```text
Vector
     ↓

Knowledge Record
     ↓

Memory Owner
```

Vectors never exist without ownership.

---

# Tenant Isolation

Every vector contains:

```text
Tenant ID
```

Retrieval always filters by tenant.

Example:

```text
Tenant A
      ≠
Tenant B
```

Cross-tenant retrieval is forbidden.

---

# Retrieval Architecture

```text
User Query
      ↓

Embedding Model
      ↓

Vector Search
      ↓

Similarity Ranking
      ↓

PostgreSQL Lookup
      ↓

Final Context
```

Vector search does not return final answers.

It returns candidate knowledge records.

---

# Similarity Search

Supported retrieval:

```text
Semantic Similarity

Context Matching

Knowledge Discovery

Experience Discovery
```

Retrieval quality depends on embeddings.

---

# Memory Integration

Qdrant supports:

```text
Personal Memory

Company Memory

Profession Memory

Ecosystem Memory
```

Reference:

```text
MemoryArchitecture.md
```

---

# Agent Integration

Digital Professionals use vector search for:

```text
Knowledge Retrieval

Experience Retrieval

Context Building

Decision Support
```

Reference:

```text
Runtime.md
```

---

# Workflow Integration

Workflows may use vector search for:

```text
Knowledge Discovery

Classification

Recommendation Generation
```

Reference:

```text
Temporal.md
```

---

# Governance Restrictions

Vector retrieval must respect:

```text
Ownership

Permissions

Tenant Isolation

Governance Rules
```

Reference:

```text
Governance.md
```

---

# Security Requirements

Qdrant must enforce:

```text
Tenant Isolation

Encryption

Audit Logging

Access Control
```

Security controls apply to vector retrieval.

---

# Scaling Strategy

Scaling may include:

```text
Additional Nodes

Additional Collections

Collection Sharding

Distributed Retrieval
```

Qdrant must scale independently from PostgreSQL.

---

# Monitoring

Metrics include:

```text
Vector Count

Query Latency

Collection Size

Retrieval Accuracy

Storage Growth
```

Reference:

```text
Monitoring.md
```

---

# Relationship To PostgreSQL

```text
PostgreSQL
      ↓
Business Data

Qdrant
      ↓
Retrieval Layer
```

PostgreSQL owns the records.

Qdrant accelerates retrieval.

---

# Dependencies

Depends on:

* MemoryArchitecture.md
* PostgreSQLSchema.md
* PersonalMemory.md
* CompanyMemory.md
* ProfessionMemory.md
* EcosystemMemory.md

Supports:

* Retrieval
* RAG
* Memory Systems
* Agent Reasoning

---

# V1

## Objective

Create foundational vector retrieval.

### Included

* Personal Memory Collections
* Company Memory Collections
* Profession Memory Collections
* Ecosystem Memory Collections

---

## Success Criteria

Semantic retrieval operates reliably.

---

# V2

## Objective

Improve retrieval quality.

### Included

* Advanced Metadata Filtering
* Collection Optimization
* Retrieval Analytics

---

## Success Criteria

Retrieval relevance improves significantly.

---

# V3

## Objective

Create ecosystem-scale retrieval infrastructure.

### Included

* Distributed Retrieval
* Intelligent Ranking
* Massive Collection Scaling

---

## Success Criteria

Knowledge retrieval supports billions of records.

---

# Future

Future capabilities may include:

* Hybrid Retrieval
* Multi-Modal Embeddings
* Vector Compression
* Adaptive Retrieval

The following principle remains permanent:

```text
PostgreSQL Owns Knowledge.

Qdrant Accelerates Retrieval.

Vectors Support Reasoning.

Tenants Remain Isolated.
```

---

# Open Questions

## Embedding Models

Which embedding models should become standard?

---

## Collection Strategy

Should collections remain memory-type based?

---

## Hybrid Retrieval

When should keyword and vector retrieval be combined?

---

## Multi-Modal Retrieval

How should image and document embeddings be supported?

---

## Ecosystem Scale

How should vector infrastructure evolve at billions of knowledge records?
