# V1 Release Checklist

Status: Draft
Owner: Engineering & Operations
Version: 1.0

This checklist operationalizes the validation requirements set forth in `docs/15-releases/V1.md` to ensure the Sovereign AI Enterprise Protocol is ready for production.

---

## 1. Security Validation
- [ ] **JWT Authentication**: Verify `saep-identity` issues valid short-lived JWTs and rejects expired or forged tokens.
- [ ] **RBAC Enforcement**: Verify that accessing a protected endpoint without the required `@RequiresPermission` throws an `AccessDeniedException`.
- [ ] **Tenant Isolation**: Verify that a user in Tenant A cannot query Company, Workforce, or Memory data belonging to Tenant B (using Cross-Tenant Validation queries).
- [ ] **Global Error Masking**: Verify that forcing an internal server error (e.g., passing invalid JSON) returns the sanitized `GlobalExceptionHandler` format rather than a Tomcat stack trace.

## 2. Operational Validation
- [ ] **Container Readiness**: Verify all microservices build successfully via the unified `Dockerfile` and start within Docker Compose.
- [ ] **Health Probes**: Verify `GET /actuator/health` returns `{"status":"UP"}` across all services.
- [ ] **Metrics Endpoints**: Verify `GET /actuator/prometheus` exposes JVM and HikariCP connection pool metrics.
- [ ] **Structured Logging**: Verify terminal logs are formatted as JSON and contain `correlation_id` tags for tracing.

## 3. Governance Validation
- [ ] **Approval Gates**: Verify that requesting an executive hire creates a `Pending` Board Decision in `saep-governance` rather than executing immediately.
- [ ] **Policy Immutability**: Verify that Governance Policies cannot be hard-deleted, only transitioned to an `ARCHIVED` state.

## 4. Performance Validation
- [ ] **Event Streaming Throughput**: Verify Kafka topics can handle 1000 domain events per minute without consumer lag exceeding 5 seconds.
- [ ] **Retrieval Latency**: Verify `saep-memory` Qdrant similarity searches return in < 200ms.
- [ ] **Database Connection Pools**: Ensure `max-active` connections do not saturate under load testing.

## 5. Disaster Recovery Validation
- [ ] **Outbox Resiliency**: Temporarily stop Kafka. Perform a business action. Restart Kafka. Verify the Outbox Poller successfully flushes the missed event.
- [ ] **Database Backup**: Execute `pg_dump` on the PostgreSQL volume and successfully restore it to an empty container.
- [ ] **Vector Snapshot**: Verify Qdrant snapshot creation and restoration.

---
**Sign-off:**
- [ ] Engineering Lead: ____________________
- [ ] Security Lead: ____________________
- [ ] Operations Lead: ____________________
