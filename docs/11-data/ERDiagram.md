# ERDiagram.md

Status: Draft

Owner: Data Platform Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the Entity Relationship Model (ER Model) of the Sovereign AI Enterprise Protocol (SAEP).

The ER model defines:

* Core Entities
* Entity Ownership
* Entity Relationships
* Relationship Cardinality
* Domain Boundaries

This document is the authoritative source for platform data relationships.

Physical database implementation is defined separately.

Reference:

```text
PostgreSQLSchema.md
```

---

# Goals

## Primary Goal

Provide a consistent relationship model across the ecosystem.

---

## Secondary Goals

* Data Consistency
* Referential Integrity
* Tenant Isolation
* Domain Ownership
* Auditability

---

## Long-Term Goal

Support ecosystem-scale relationship management.

---

# Relationship Rules

## Rule 1

Every Entity Must Have Ownership.

---

## Rule 2

Every Business Entity Must Belong To A Tenant.

---

## Rule 3

Relationships Must Be Explicit.

---

## Rule 4

Cross-Tenant Relationships Are Forbidden.

---

## Rule 5

Entity Lifecycles Must Remain Traceable.

---

# Core Entities

The platform contains the following primary entities:

```text
Tenant

User

Company

Department

Team

Digital Professional

Profession

Task

Workflow

Memory

Policy

Approval

Audit Record
```

---

# Tenant Ownership Model

```text
Tenant
  │
  ├── Companies
  ├── Users
  ├── Teams
  ├── Tasks
  ├── Workflows
  ├── Memory
  └── Audit Records
```

Tenant is the root ownership boundary.

---

# Organization Relationship Model

```text
Tenant
    │
    ▼

Company
    │
    ▼

Department
    │
    ▼

Team
```

Cardinality:

```text
Tenant
  1 → N
Company

Company
  1 → N
Department

Department
  1 → N
Team
```

---

# Workforce Relationship Model

```text
Team
    │
    ▼

Digital Professional
```

Cardinality:

```text
Team
  1 → N
Digital Professional
```

A professional belongs to one team at a time.

Team assignments may change over time.

---

# Profession Relationship Model

```text
Profession
      │
      ▼

Digital Professional
```

Cardinality:

```text
Profession
  1 → N
Digital Professional
```

A profession may contain many professionals.

A professional has one primary profession.

---

# Career Relationship Model

```text
Digital Professional
        │
        ▼

Career History
```

Cardinality:

```text
Digital Professional
  1 → N
Career History
```

Reference:

```text
CareerHistory.md
```

---

# Task Relationship Model

```text
Team
     │
     ▼

Task
     │
     ▼

Digital Professional
```

Cardinality:

```text
Team
  1 → N
Task

Digital Professional
  1 → N
Task
```

A task may be reassigned.

Task history remains auditable.

---

# Workflow Relationship Model

```text
Task
    │
    ▼

Workflow
```

Cardinality:

```text
Task
  1 → N
Workflow
```

A task may create multiple workflow executions.

Reference:

```text
Temporal.md
```

---

# Memory Relationship Model

```text
Digital Professional
          │
          ▼

Personal Memory

Company
    │
    ▼

Company Memory

Profession
     │
     ▼

Profession Memory
```

Cardinality:

```text
Digital Professional
  1 → N
Personal Memory

Company
  1 → N
Company Memory

Profession
  1 → N
Profession Memory
```

Reference:

```text
MemoryArchitecture.md
```

---

# Governance Relationship Model

```text
Policy
   │
   ▼

Approval
   │
   ▼

Decision
```

Cardinality:

```text
Policy
  1 → N
Approval

Approval
  1 → N
Decision Records
```

Reference:

```text
Governance.md
```

---

# User Relationship Model

```text
User
   │
   ▼

Role
   │
   ▼

Permission
```

Cardinality:

```text
User
  N → N
Role

Role
  N → N
Permission
```

Reference:

```text
RBAC.md
```

---

# Communication Relationship Model

```text
User
     │
     ▼

Message

Digital Professional
          │
          ▼

Message
```

Cardinality:

```text
User
  1 → N
Message

Digital Professional
  1 → N
Message
```

Reference:

```text
CommunicationAPI.md
```

---

# Audit Relationship Model

```text
Entity
    │
    ▼

Audit Record
```

Cardinality:

```text
Entity
  1 → N
Audit Records
```

Every critical entity is auditable.

---

# Identity Relationship Model

```text
Identity
     │
     ▼

Session
     │
     ▼

Token
```

Cardinality:

```text
Identity
  1 → N
Session

Session
  1 → N
Token
```

Reference:

```text
IdentityAPI.md
```

---

# Complete Ecosystem Relationship Diagram

```text
Tenant
 │
 ├── Company
 │     │
 │     ├── Department
 │     │       │
 │     │       └── Team
 │     │               │
 │     │               ├── Digital Professional
 │     │               │         │
 │     │               │         ├── Career History
 │     │               │         ├── Personal Memory
 │     │               │         └── Tasks
 │     │               │
 │     │               └── Workflows
 │     │
 │     └── Company Memory
 │
 ├── Users
 │      │
 │      ├── Roles
 │      └── Sessions
 │
 ├── Governance
 │      │
 │      ├── Policies
 │      ├── Approvals
 │      └── Decisions
 │
 └── Audit Records

Profession
      │
      ├── Profession Memory
      └── Digital Professionals
```

---

# Relationship Ownership

Ownership rules:

```text
Tenant
      ↓
Owns Business Records

Company
      ↓
Owns Company Resources

Profession
      ↓
Owns Profession Knowledge

Marketplace
      ↓
Owns Ecosystem Knowledge
```

---

# Multi-Tenant Rules

Allowed:

```text
Tenant
      ↓
Own Entities
```

Forbidden:

```text
Tenant A
      ↓
Tenant B Data
```

Cross-tenant relationships are prohibited.

---

# Future Relationship Expansion

Future entities may include:

```text
Knowledge Graph Nodes

External Integrations

Marketplace Analytics

Simulation Entities
```

All future entities must follow the same ownership model.

---

# Dependencies

Depends on:

* PostgreSQLSchema.md
* MemoryArchitecture.md
* Governance.md
* IdentityAPI.md
* CompanyAPI.md

Supports:

* IndexStrategy.md
* PartitioningStrategy.md
* Future Database Design

---

# Future

The following principle remains permanent:

```text
Entities Have Ownership.

Relationships Are Explicit.

Tenants Remain Isolated.

Auditability Is Mandatory.
```
