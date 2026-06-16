# Build the Governance System (`saep-governance`)

This document outlines the detailed, production-grade implementation plan to build the `saep-governance` service from the ground up, utilizing **Temporal** for durable Human-in-the-loop (HITL) workflows and **Kafka** for immutable event publishing.

## User Review Required

> [!IMPORTANT]
> **This is a major architectural addition.** It introduces the first functional Temporal workflow into the backend system. 
> Please review the proposed architecture, database models, and API surface below. Let me know if you approve this approach or if you want to alter the workflow structure (e.g., adding timeouts, escalations).

## Open Questions

1. **Temporal Worker:** Do you want the Temporal Worker to run directly inside the Spring Boot application (simplest), or should we decouple it into a separate worker service later? *(This plan assumes running the worker inside the Spring Boot app for V1).*
2. **Approval Target Routing:** When a governance request is approved, we publish an `ApprovalGrantedEvent` to Kafka. Does this match your intended event-driven architecture, or do you want the Temporal workflow to directly call synchronous REST endpoints on other services to execute the actions? *(This plan assumes Kafka Event-Driven execution).*

---

## Proposed Architecture

`saep-governance` will be a standard Spring Boot microservice. Its primary responsibility is to capture a requested action (e.g., spending $50k), start a dormant Temporal workflow, wait indefinitely for a human to hit "Approve", and then reliably broadcast the result to Kafka.

### 1. Project Configuration

*   **`pom.xml`**: We will create a `pom.xml` in `services/saep-parent/saep-governance` importing `saep-common`, `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `temporal-sdk`, and `spring-kafka`.
*   **Root `pom.xml`**: We will add the new module to the root build cycle.
*   **`application.yml`**: Configure the database connection (`jdbc:postgresql://localhost:5432/saep_db`), Temporal gRPC connection (`localhost:7233`), and Kafka brokers (`localhost:9094`).

### 2. Domain & Database Layer

We will track the state of approvals in PostgreSQL for fast frontend querying, while Temporal handles the actual durable state machine.

*   **`ApprovalStatus` (Enum)**: `PENDING`, `APPROVED`, `REJECTED`, `TIMEOUT`.
*   **`ApprovalRequest` (JPA Entity)**:
    *   `id` (UUID) - Matches the Temporal Workflow ID.
    *   `tenantId` (String) - For Tenant Isolation.
    *   `requesterId` (String) - Who asked for it.
    *   `actionType` (String) - What is being requested (e.g., `FINANCIAL_TRANSFER`).
    *   `payload` (JSONB/String) - The exact details of the request.
    *   `status` (ApprovalStatus) - Current status.

### 3. Temporal Workflow Layer

This is the core of the Governance engine. It completely eliminates hardcoded thread-sleeps or brittle database polling.

*   **`GovernanceApprovalWorkflow` (Interface)**
    *   `@WorkflowMethod`: `void requestApproval(ApprovalRequest request)`
    *   `@SignalMethod`: `void approve(String approverId)`
    *   `@SignalMethod`: `void reject(String rejecterId, String reason)`
*   **`GovernanceApprovalWorkflowImpl` (Implementation)**
    *   Saves the initial state.
    *   Uses `Workflow.await(() -> isApproved || isRejected)` to safely sleep.
    *   Once awoken, calls the `GovernanceActivities` to execute the final steps.
*   **`GovernanceActivities` (Interface & Impl)**
    *   Updates the local PostgreSQL `ApprovalRequest` record to `APPROVED`/`REJECTED`.
    *   Publishes the final decision to Kafka (e.g., topic `governance.events`).

### 4. REST Controller Layer

This provides the HTTP API for the frontend Dashboard and Marketplace to interact with governance.

*   **`GovernanceController`**:
    *   `POST /api/v1/governance/approvals`: Initiates a new approval. Starts the Temporal Workflow.
    *   `GET /api/v1/governance/approvals`: Lists all pending approvals for the current Tenant.
    *   `POST /api/v1/governance/approvals/{id}/approve`: Sends an "Approve" Signal to the running Temporal Workflow.
    *   `POST /api/v1/governance/approvals/{id}/reject`: Sends a "Reject" Signal.

### 5. Kafka Integration

*   **Producer**: The `GovernanceActivities` will use a `KafkaTemplate` to emit events like `GovernanceDecisionEvent`. 
*   This ensures the rest of the ecosystem (like Financial services or Audit systems) can react immutably to the human's decision.

---

## Proposed Changes

### Configuration
#### [MODIFY] `pom.xml` (Root)
- Add `<module>services/saep-parent/saep-governance</module>`

#### [NEW] `services/saep-parent/saep-governance/pom.xml`
- Complete Maven definition for the microservice.

#### [NEW] `services/saep-parent/saep-governance/src/main/resources/application.yml`
- Production-grade properties for Postgres, Kafka, Temporal, and port 8086.

### Core Application
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/SaepGovernanceApplication.java`
- Spring Boot Main Class.

#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/config/SecurityConfig.java`
- Configures Spring Security to use `JwtAuthenticationFilter` (inherited from `saep-common`) to enforce identity and tenant isolation.

#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/config/TemporalConfig.java`
- Registers the Temporal Worker and connects to the Temporal cluster.

#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/config/KafkaTopicConfig.java`
- Ensures the `governance.events` topic is created.

### Domain & Repository
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/domain/ApprovalRequest.java`
- JPA Entity.
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/repository/ApprovalRequestRepository.java`
- Spring Data JPA Repository.

### Temporal Workflows
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/workflow/GovernanceApprovalWorkflow.java`
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/workflow/GovernanceApprovalWorkflowImpl.java`
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/workflow/GovernanceActivities.java`
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/workflow/GovernanceActivitiesImpl.java`

### Services & Controllers
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/service/GovernanceService.java`
- Orchestrates between the REST controller, the database, and the Temporal client.
#### [NEW] `services/saep-parent/saep-governance/src/main/java/com/saep/governance/controller/GovernanceController.java`
- Secure REST endpoints.

---

## Verification Plan

### Automated Verification
1. I will compile the `saep-governance` module to ensure all dependencies (Temporal SDK, Kafka) are correctly resolved.
2. I will verify that the module integrates perfectly with `saep-common`.

### Manual Verification
1. Once built, we will run the `saep-governance` microservice using the existing `start_backend.ps1` flow.
2. We will trigger an approval request via curl/Postman to ensure the Temporal Workflow successfully starts and goes to sleep.
3. We will send an approval signal and verify that Kafka receives the `GovernanceDecisionEvent`.
