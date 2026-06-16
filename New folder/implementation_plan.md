# Phase 6.5: Observability Remediation

As you correctly diagnosed, the Golden Path orchestrated perfectly but failed Operational Verification because observability metadata (`traceId`, `correlationId`, `causationId`) is not being properly propagated across the event-driven boundaries. 

This phase will remediate the defect by enforcing trace and correlation continuity across all saga steps.

## Problem Analysis

1. **`EventEnvelope` Truncation**: The `EventEnvelope.wrap()` overloaded methods in `saep-common` hardcode `traceId` to `null` and allow `correlationId` to be omitted.
2. **Missing Context Storage**: Between the REST call for `Create Company` and `Initialize Company`, the original `correlationId` and `traceId` are lost because they are not stored in the database. When `Initialize` is called, it generates a new trace/correlation context.
3. **Kafka Consumer Loss**: When a service consumes a Kafka event, it doesn't inject the event's `traceId` and `correlationId` into the local logging `MDC`, nor does it carry them forward when emitting subsequent events (like `OrganizationProvisionCompleted`).

## Proposed Changes

### 1. `saep-common` (Event Envelope & Tracing)
- **[MODIFY] `EventEnvelope.java`**: Remove the overloaded `wrap` methods that hide or omit `traceId` and `correlationId`. Force the producer to explicitly provide `correlationId`, `causationId`, and `traceId`.
- **[NEW] `TracingFilter.java`**: A standard Servlet Filter that extracts `X-Trace-Id` and `X-Correlation-Id` from incoming HTTP headers and places them into the `MDC`. If absent, it generates new ones.
- **[NEW] `KafkaTracingAspect.java` or Interceptor**: A utility to wrap `@KafkaListener` methods so that incoming `EventEnvelope`'s trace and correlation IDs are automatically loaded into `MDC` before business logic executes.

### 2. `saep-company` (Saga Root)
- **[MODIFY] `CompanyEntity.java`**: Add `sagaCorrelationId` and `sagaTraceId` columns.
- **[MODIFY] `CompanyService.java`**: 
  - `createCompany()`: Read `traceId` and `correlationId` from MDC. Save them to the `CompanyEntity`. Pass them to the `CompanyCreated` event.
  - `initializeCompany()`: Retrieve the saved `sagaCorrelationId` and `sagaTraceId` from the `CompanyEntity`. Use these (instead of MDC's new REST request trace) to emit the `OrganizationProvisionRequested` event. Set `causationId` = the original `CompanyCreated` event ID (which we also need to store, or we use `InitializationRequest` ID as causation).

### 3. `saep-organization` (Saga Participant)
- **[MODIFY] `OrganizationProvisioningService.java`**: When consuming `OrganizationProvisionRequested`, extract the envelope's `correlationId` and `traceId` (or rely on the new Kafka interceptor). When emitting `OrganizationProvisionCompleted`, `PositionCreated`, and `RoleCreated`, explicitly pass the `correlationId` and `traceId`, and set `causationId` = the incoming `eventId`.

## Open Questions

> [!WARNING]
> **REST Continuity vs Saga Continuity**
> The saga spans two distinct REST calls (`POST /companies` and `POST /companies/{id}/initialize`). Standard distributed tracing (like B3 or W3C) would treat these as two separate traces. 
> 
> To achieve your requirement of a **"Single traceId for the entire onboarding saga"**, I propose saving the initial `traceId` and `correlationId` into the `CompanyEntity` during creation, and reloading them during initialization. 
> 
> Are you comfortable with persisting observability IDs in the database entities to bridge disconnected REST calls?

## Verification Plan
1. Rerun the Phase 6 Python script.
2. Assert that `traceId` is non-null and **identical** across all emitted events.
3. Assert that `correlationId` is **identical** across all emitted events.
4. Assert that `causationId` forms a valid linked chain (Event B's causationId == Event A's eventId).
