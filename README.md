# Kyrti - SAEP (Standardised Autonomous Enterprise Protocol) V1

Welcome to the **SAEP V1 Scaffold**. This repository contains the foundational architecture for the Kyrti enterprise agent platform, implementing strict Tenant Isolation, Governance Policies, and Distributed Orchestration.

## Architecture Highlights

This repository uses a polyglot architecture:
1. **Java 17 (Spring Boot)**: Core backend services managing state, metadata, policies, and orchestration.
2. **Python 3.10 (FastAPI + LangGraph)**: AI Execution gateways running autonomous prompts and tools.
3. **Infrastructure**: PostgreSQL, Kafka, Temporal, Qdrant, and Ollama.

## Microservices (Java Polyrepo)
Located under `services/saep-parent`:

1. `saep-common`: Shared JWT security, Tenant Context, and DTOs.
2. `saep-identity`: Central User/Auth management.
3. `saep-company`: Tenant/Company configuration.
4. `saep-marketplace`: Global digital profession templates.
5. `saep-governance`: Strict Human-in-the-Loop policies and approvals.
6. `saep-workforce`: Hired digital professionals and career history.
7. `saep-memory`: Vector context metadata storage.
8. `saep-workflow`: Temporal SDK integrations for distributed orchestration.

## Getting Started

### 1. Start Infrastructure
Boot up the foundational databases and orchestrators:
```bash
cd infrastructure
docker-compose up -d
```
*(This will automatically initialize `saep_identity`, `saep_company`, `saep_marketplace`, `saep_governance`, `saep_workforce`, and `saep_memory` databases in PostgreSQL).*

### 2. Build the Java Backend
Ensure you have **Java 17** and **Maven** installed:
```bash
cd services/saep-parent
mvn clean install -DskipTests
```

### 3. Run Microservices
Each service can be run locally using the Spring Boot Maven Plugin or directly from your IDE. For example:
```bash
cd services/saep-parent/saep-identity
mvn spring-boot:run
```

### 4. Build AI Services
The Python services can be built via Docker or run locally via `uvicorn`:
```bash
cd services/ai-services/ai-gateway
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Documentation
- API Specifications: `docs/10-api/`
- Database Schemas: `docs/11-data/`
- Architecture Analysis: Reference the generated markdown artifacts.

---
*Built by Antigravity.*
