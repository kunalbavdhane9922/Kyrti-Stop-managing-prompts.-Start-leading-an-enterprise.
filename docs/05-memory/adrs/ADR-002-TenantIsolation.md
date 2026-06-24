# ADR 002: Strict Repository-Level Tenant Isolation

## Status
Approved

## Context
In a multi-tenant SaaS environment, the risk of cross-tenant data leakage is catastrophic. Specifically, resource enumeration attacks occur when an attacker discovers valid resource IDs by guessing UUIDs or manipulating API paths, and the system responds with a `403 Forbidden` instead of a `404 Not Found`. Returning a `403` proves to the attacker that the resource exists, which is a leak of metadata.

## Decision
All repository data access related to the Memory System must enforce multi-tenant isolation at the query level.
1. No generic `findById(UUID id)` calls are permitted for user-facing reads.
2. All repository methods must explicitly require the `tenantId` (e.g., `findByIdAndTenantId(UUID id, UUID tenantId)`).
3. If a record is not found for that specific tenant ID, the system must throw a `MemoryNotFoundException`, resulting in a `404 Not Found` response.

## Consequences
- Impossible to execute cross-tenant queries accidentally.
- Prevents resource enumeration metadata leaks.
- Requires passing `tenantId` throughout the entire service layer stack.
