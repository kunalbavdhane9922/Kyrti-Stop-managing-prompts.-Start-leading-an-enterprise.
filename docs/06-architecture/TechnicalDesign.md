# TechnicalDesign.md

Status: Draft

Owner: Architecture Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the technical implementation architecture of the Sovereign AI Enterprise Protocol (SAEP).

While System Architecture defines the ecosystem and its major subsystems, Technical Design defines how those systems are implemented.

This document focuses on:

* Software Architecture
* Service Architecture
* Runtime Architecture
* Data Architecture
* Event Architecture
* Security Architecture
* Infrastructure Architecture

This document does not define business rules.

Business rules are defined in:

* Governance Documents
* Marketplace Documents
* Workforce Documents
* Memory Documents

---

# Goals

## Primary Goal

Provide a scalable, secure, maintainable, and extensible technical foundation for the ecosystem.

---

## Secondary Goals

* Support millions of companies.
* Support billions of Digital Professionals.
* Support massive event volumes.
* Support AI-native workflows.
* Support long-term evolution.

---

## Long-Term Goal

Create a platform architecture capable of operating a global digital economy.

---

# Rules

## Rule 1

Business Logic Must Be Domain Driven.

---

## Rule 2

All Services Must Be Independently Deployable.

---

## Rule 3

All Services Must Be Horizontally Scalable.

---

## Rule 4

All Communication Must Be Observable.

---

## Rule 5

All Critical Actions Must Be Auditable.

---

## Rule 6

Company Isolation Must Be Enforced.

---

## Rule 7

Intelligence Does Not Equal Authority.

---

## Rule 8

Humans Remain The Final Authority.

---

## Rule 9

Infrastructure Must Remain Vendor Independent.

---

## Rule 10

Open Source Technologies Are Preferred.

---

# Design Principles

The platform follows the following design principles.

---

## Domain Driven Design

Business domains are isolated.

Examples:

```text
Marketplace

Workforce

Company

Memory

Governance

Security

Intelligence
```

Each domain owns its data and business logic.

---

## Hexagonal Architecture

The platform follows Ports and Adapters architecture.

Business logic remains independent of:

* Databases
* APIs
* Message Brokers
* LLM Providers
* User Interfaces

---

## Event Driven Architecture

The platform communicates through events whenever possible.

Examples:

```text
Professional Created

Company Created

Task Assigned

Memory Updated

Promotion Approved
```

---

## API First Design

All capabilities are exposed through APIs.

Internal systems consume APIs exactly as external systems do.

---

## Security First Design

Security is a foundational requirement.

Security is not added later.

---

## AI Native Design

The platform is designed around Digital Professionals from the beginning.

AI systems are first-class citizens.

---

# Hexagonal Architecture

The platform follows a strict Hexagonal Architecture.

```text
                    External World
                           │
                           ▼

+--------------------------------------------------+
|                    Adapters                      |
|--------------------------------------------------|
| REST API                                         |
| GraphQL API                                      |
| Kafka Consumers                                  |
| Kafka Producers                                  |
| Temporal Workers                                 |
| LangGraph Runtime                                |
| Ollama Adapter                                   |
| PostgreSQL Adapter                               |
| Qdrant Adapter                                   |
+--------------------------------------------------+

                           │
                           ▼

+--------------------------------------------------+
|                     Ports                        |
|--------------------------------------------------|
| Company Port                                     |
| Workforce Port                                   |
| Marketplace Port                                 |
| Memory Port                                      |
| Intelligence Port                                |
| Governance Port                                  |
+--------------------------------------------------+

                           │
                           ▼

+--------------------------------------------------+
|                  Domain Layer                    |
|--------------------------------------------------|
| Company Domain                                   |
| Workforce Domain                                 |
| Marketplace Domain                               |
| Memory Domain                                    |
| Intelligence Domain                              |
| Governance Domain                                |
+--------------------------------------------------+
```

---

# Domain Layer

The Domain Layer contains all business rules.

The Domain Layer must not directly depend on:

* PostgreSQL
* Kafka
* Qdrant
* Ollama
* REST APIs
* React

The Domain Layer contains:

```text
Entities

Aggregates

Value Objects

Domain Services

Domain Events

Policies
```

---

# Application Layer

The Application Layer coordinates workflows.

Responsibilities:

```text
Use Cases

Commands

Queries

Workflow Coordination

Transaction Management
```

The Application Layer may call:

```text
Ports
```

but may not call infrastructure directly.

---

# Infrastructure Layer

The Infrastructure Layer contains implementations.

Examples:

```text
PostgreSQL Repositories

Kafka Publishers

Kafka Consumers

Ollama Client

Qdrant Client

Temporal Workers

LangGraph Runtime
```

Infrastructure may be replaced without changing business logic.

---

# Technology Principles

## Backend

Primary Language:

```text
Java 21
```

Framework:

```text
Spring Boot
```

Architecture:

```text
Hexagonal Architecture
```

---

## Frontend

Framework:

```text
React
```

Language:

```text
TypeScript
```

State Management:

```text
Zustand
```

Communication:

```text
REST APIs

WebSockets
```

---

## AI Layer

Inference Engine:

```text
Ollama
```

No external AI APIs are required.

Supported Models:

```text
Llama

Qwen

DeepSeek

Custom Models
```

Model selection is controlled by platform governance.

---


## AI Service Architecture

The platform separates business operations from AI operations.

Architecture:

```text
React
      ↓

Java Platform Services
      ↓

Kafka / REST
      ↓

Python AI Services
      ↓

Ollama
```

### Java Services

Responsible for:

- Authentication
- Authorization
- Companies
- Workforce
- Marketplace
- Governance
- Billing
- Reputation
- APIs

### Python Services

Responsible for:

- LangGraph
- Agent Runtime
- RAG
- Embeddings
- Memory Retrieval
- Tool Calling
- Marketplace Intelligence
- AI Evaluation

### AI Framework

```text
FastAPI
```

### AI Runtime

```text
LangGraph
      ↓
Tools
      ↓
Memory
      ↓
Ollama
```

## Workflow Layer

Workflow Engine:

```text
Temporal
```

Responsibilities:

```text
Long Running Tasks

Retries

Compensations

Workflow Recovery

Orchestration
```

---

## Agent Layer

Agent Runtime:

```text
LangGraph
```

Responsibilities:

```text
Reasoning

Decision Making

Tool Usage

Memory Retrieval

Task Execution
```

---

## Data Layer

Relational Database:

```text
PostgreSQL
```

Purpose:

```text
Transactions

Metadata

Business Records

Governance Records
```

---

Vector Database:

```text
Qdrant
```

Purpose:

```text
Memory Search

Semantic Search

Knowledge Retrieval
```

---

Event Platform:

```text
Kafka
```

Purpose:

```text
Events

Streaming

Analytics

Intelligence Signals
```

---

# Service Architecture

The platform follows microservice architecture.

Core services:

```text
Marketplace Service

Company Service

Workforce Service

Memory Service

Intelligence Service

Governance Service

Communication Service

Identity Service
```

Each service owns its data.

Cross-service database access is forbidden.

---

# Technical Architecture Principles

```text
Database Per Service

API Per Service

Independent Deployment

Independent Scaling

Independent Monitoring

Independent Ownership
```

---

# Backend Architecture

The backend follows a Domain Driven Design (DDD) and Hexagonal Architecture approach.

Business logic is isolated from infrastructure.

Infrastructure components may change without affecting domain logic.

---

# Backend Technology Stack

The platform uses a polyglot backend architecture.

---

## Primary Platform Backend

```text
Java 21

Spring Boot
```

Purpose:

```text
Companies

Marketplace

Workforce

Governance

Security

APIs
```

---

## AI Backend

```text
Python

FastAPI
```

Purpose:

```text
LangGraph

RAG

Embeddings

Agent Runtime

Marketplace Intelligence

AI Evaluation
```

---

## Architecture

```text
Java
      ↓
Business Platform

Python
      ↓
AI Platform

Ollama
      ↓
Inference Layer
```

---

# Backend Layer Architecture

```text
Controller Layer
        ↓

Application Layer
        ↓

Domain Layer
        ↓

Ports
        ↓

Adapters
        ↓

Infrastructure
```

---

# Controller Layer

Responsibilities:

* REST APIs
* WebSocket APIs
* Request Validation
* Authentication
* Authorization

Controllers must never contain business logic.

Controllers only delegate requests.

---

# Application Layer

Responsibilities:

* Use Cases
* Workflow Coordination
* Transaction Management
* Service Orchestration

Examples:

```text
Create Company

Hire Professional

Create Profession

Terminate Professional

Promote Professional
```

---

# Domain Layer

The Domain Layer contains:

```text
Entities

Aggregates

Value Objects

Domain Services

Policies

Domain Events
```

The Domain Layer is the core of the platform.

The Domain Layer must not depend on:

```text
Spring Boot

PostgreSQL

Kafka

Qdrant

Ollama
```

---

# Ports

Ports define contracts.

Examples:

```text
CompanyRepositoryPort

MemoryRepositoryPort

EventPublisherPort

LLMPort

VectorStorePort
```

Ports belong to the domain.

---

# Adapters

Adapters implement ports.

Examples:

```text
PostgreSQL Adapter

Kafka Adapter

Qdrant Adapter

Ollama Adapter

Temporal Adapter
```

Adapters belong to infrastructure.

---

# Infrastructure Layer

Infrastructure contains:

```text
Database Clients

Kafka Clients

Temporal Workers

LangGraph Runtime

Ollama Runtime

Monitoring
```

Infrastructure never contains business rules.

---

# Backend Folder Structure

```text
backend/

├── platform-services/
│
│   ├── marketplace-service/
│   ├── company-service/
│   ├── workforce-service/
│   ├── memory-service/
│   ├── intelligence-service/
│   ├── governance-service/
│   ├── communication-service/
│   └── identity-service/
│
├── ai-services/
│
│   ├── agent-service/
│   ├── rag-service/
│   ├── embedding-service/
│   ├── memory-retrieval-service/
│   ├── evaluation-service/
│   └── marketplace-intelligence-service/

├── shared/

│   ├── events/
│   ├── security/
│   ├── observability/
│   ├── contracts/
│   └── commons/

├── infrastructure/

│   ├── kafka/
│   ├── temporal/
│   ├── ollama/
│   ├── postgres/
│   └── qdrant/

└── deployment/
```

---

# Service Internal Structure

Every service follows the same structure.

Example:

```text
company-service/

src/main/java/

├── application/
├── domain/
├── ports/
├── adapters/
├── infrastructure/
├── api/
└── config/
```

---

# Domain Structure Example

```text
domain/

├── entities/
├── valueobjects/
├── aggregates/
├── services/
├── policies/
├── events/
└── exceptions/
```

---

# Application Structure Example

```text
application/

├── commands/
├── queries/
├── handlers/
├── usecases/
└── workflows/
```

---

# API Structure Example

```text
api/

├── rest/
├── websocket/
├── dto/
├── requests/
└── responses/
```

---

# Persistence Structure Example

```text
adapters/persistence/

├── postgres/
├── repositories/
├── mappers/
└── entities/
```

---

# AI Integration Layer

The backend communicates with AI models only through the AI Adapter.

```text
Application Layer
        ↓
LLM Port
        ↓
Ollama Adapter
        ↓
Ollama Runtime
```

No service may call Ollama directly.

---

# AI Execution Flow

AI execution follows strict service boundaries.

```text
Frontend
      ↓

Java Platform Service
      ↓

Kafka / REST
      ↓

Python AI Service
      ↓

LangGraph
      ↓

Ollama
      ↓

Response
```

---

# Memory Integration Layer

Memory access always goes through Memory Service.

```text
Company Service
        ↓
Memory Service API
        ↓
Qdrant
```

Direct access is forbidden.

---

# Event Publishing

Events are published through Kafka.

```text
Domain Event
        ↓
Application Layer
        ↓
Event Publisher Port
        ↓
Kafka Adapter
        ↓
Kafka Topic
```

---

# Backend Security

Every service enforces:

```text
Authentication

Authorization

Tenant Isolation

Audit Logging
```

Security is mandatory.

---

# Backend Observability

Every service must expose:

```text
Metrics

Logs

Traces

Health Checks
```

OpenTelemetry is recommended.

---

# Dependencies

This document is implemented through:

* DatabaseDesign.md
* ServiceArchitecture.md
* EventArchitecture.md
* LangGraph.md
* Runtime.md
* PostgreSQLSchema.md
* OpenAPI.yaml

---

# V1

## Objective

Build the foundational platform.

Included:

* Hexagonal Architecture
* Microservices
* PostgreSQL
* Kafka
* Qdrant
* Ollama
* LangGraph
* Temporal

---

# V2

## Objective

Improve scalability and intelligence.

Included:

* Advanced Analytics
* Advanced Intelligence
* Workflow Optimization

---

# V3

## Objective

Create ecosystem-scale infrastructure.

Included:

* Global Scaling
* Knowledge Graph Integration
* Advanced Intelligence Systems

---

# Future

Future capabilities may include:

* Multi-Region Deployment
* Global Event Federation
* Advanced Knowledge Graphs
* Distributed Intelligence Systems

The following principle remains permanent:

```text
Business Logic First.

Infrastructure Second.

Humans Govern.

AI Assists.

Architecture Evolves.
```

---

# Open Questions

## Service Boundaries

Are current domain boundaries optimal?

---

## Knowledge Graph Adoption

When should graph infrastructure become first-class?

---

## Multi-Region Architecture

When should global deployment begin?

---

## AI Model Governance

How should model upgrades be approved?

---

## Long-Term Scaling

What architectural changes become necessary beyond ecosystem-scale adoption?
