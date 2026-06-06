# PostgreSQLSchema.md

Status: Draft

Owner: Data Platform Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the PostgreSQL schema architecture of the Sovereign AI Enterprise Protocol (SAEP).

PostgreSQL serves as the primary transactional database for the platform.

PostgreSQL stores:

* Business Data
* Governance Data
* Identity Data
* Workflow Metadata
* Audit Records
* Memory Metadata
* Configuration Data

Vector data is stored separately in Qdrant.

---

# Goals

## Primary Goal

Provide reliable transactional storage across the ecosystem.

---

## Secondary Goals

* Data Integrity
* Tenant Isolation
* Scalability
* Auditability
* Consistency

---

## Long-Term Goal

Support millions of companies and billions of Digital Professionals.

---

# Rules

## Rule 1

Every Record Must Have Ownership.

---

## Rule 2

Every Record Must Support Auditability.

---

## Rule 3

Tenant Isolation Is Mandatory.

---

## Rule 4

Data Relationships Must Be Explicit.

---

## Rule 5

Sensitive Data Must Be Protected.

---

## Rule 6

Schema Evolution Must Be Controlled.

---

## Rule 7

Business Data And Vector Data Remain Separate.

---

# Database Domains

The platform is divided into domains.

```text
Identity

Marketplace

Company

Workforce

Memory

Communication

Governance

Workflow

Audit

Infrastructure
```

Each domain owns its data.

---

# Schema Architecture

```text
PostgreSQL
      ↓

Identity Schema

Marketplace Schema

Company Schema

Workforce Schema

Memory Schema

Communication Schema

Governance Schema

Workflow Schema

Audit Schema
```

Domain ownership is mandatory.

---

# Identity Schema

Responsible for:

```text
Users

Roles

Permissions

Sessions

Authentication Metadata
```

Reference:

```text
IdentityAPI.md
```

---

# Marketplace Schema

Responsible for:

```text
Professions

Profession Templates

Population Targets

Marketplace Analytics Metadata
```

Reference:

```text
MarketplaceAPI.md
```

---

# Company Schema

Responsible for:

```text
Companies

Departments

Teams

Projects

Assignments
```

Reference:

```text
CompanyAPI.md
```

---

# Workforce Schema

Responsible for:

```text
Digital Professionals

Career History

Skills

Professional State
```

References:

```text
Lifecycle.md

CareerHistory.md
```

---

# Memory Schema

Responsible for:

```text
Memory Metadata

Memory Ownership

Memory Policies

Memory References
```

Embeddings remain outside PostgreSQL.

Reference:

```text
MemoryArchitecture.md
```

---

# Communication Schema

Responsible for:

```text
Messages

Tasks

Notifications

Escalations

Reports Metadata
```

Reference:

```text
CommunicationAPI.md
```

---

# Governance Schema

Responsible for:

```text
Policies

Approvals

Authority Records

Board Decisions
```

Reference:

```text
GovernanceAPI.md
```

---

# Workflow Schema

Responsible for:

```text
Workflow Metadata

Workflow History

Workflow Status

Workflow Ownership
```

Reference:

```text
Temporal.md
```

---

# Audit Schema

Responsible for:

```text
Audit Events

Security Events

Governance Audit Records

Access History
```

Reference:

```text
AuditSystem.md
```

---

# Infrastructure Schema

Responsible for:

```text
Configuration

Feature Flags

Environment Metadata

System Settings
```

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

Memory

Policy

Workflow

Audit Record
```

---

# Tenant Entity

Represents:

```text
Organization Boundary

Ownership Boundary

Isolation Boundary
```

Every business record belongs to a tenant.

---

# User Entity

Represents:

```text
Human Identity

Authentication Context

Authorization Context
```

---

# Company Entity

Represents:

```text
Organization

Business Unit

Tenant Operations
```

---

# Digital Professional Entity

Represents:

```text
Professional Identity

Career State

Professional Metadata
```

---

# Profession Entity

Represents:

```text
Profession Template

Career Structure

Skill Structure
```

---

# Task Entity

Represents:

```text
Assigned Work

Work Ownership

Execution State
```

---

# Memory Entity

Represents:

```text
Memory Metadata

Ownership

Retrieval Policies
```

---

# Workflow Entity

Represents:

```text
Workflow Metadata

Workflow State

Workflow Ownership
```

---

# Policy Entity

Represents:

```text
Governance Rules

Authority Constraints

Policy Lifecycle
```

---

# Audit Record Entity

Represents:

```text
Immutable Event History

Governance History

Security History
```

---

# Relationship Model

Examples:

```text
Tenant
      ↓
Companies

Company
      ↓
Departments

Department
      ↓
Teams

Team
      ↓
Professionals

Professional
      ↓
Tasks

Professional
      ↓
Career History
```

Relationships are defined formally in:

```text
ERDiagram.md
```

---

# Multi-Tenant Strategy

Every business record contains:

```text
Tenant ID
```

Tenant ownership is mandatory.

Example:

```text
Company
      ↓
Tenant ID

Task
      ↓
Tenant ID

Professional
      ↓
Tenant ID
```

---

# Primary Key Strategy

All entities use:

```text
UUID
```

Examples:

```text
Company ID

Professional ID

Task ID

Workflow ID
```

Sequential identifiers are discouraged.

---

# Foreign Key Strategy

Relationships use:

```text
Foreign Keys

Explicit Ownership

Referential Integrity
```

Relationship integrity is mandatory.

---

# Audit Requirements

All critical entities support:

```text
Created At

Updated At

Created By

Updated By
```

Auditability is mandatory.

---

# Soft Delete Strategy

Critical entities use:

```text
Active

Archived

Deleted
```

Physical deletion should be avoided where possible.

---

# Security Requirements

Sensitive data must support:

```text
Encryption

RBAC

Audit Logging

Tenant Isolation
```

Reference:

```text
Security.md
```

---

# Memory Integration

PostgreSQL stores:

```text
Memory Metadata

Memory Policies

Memory Ownership
```

Qdrant stores:

```text
Embeddings

Vectors

Semantic Indexes
```

Reference:

```text
MemoryArchitecture.md
```

---

# Event Integration

Database entities generate:

```text
Domain Events

Workflow Events

System Events
```

Reference:

```text
EventArchitecture.md
```

---

# Monitoring

Database metrics include:

```text
Storage Growth

Query Performance

Connection Count

Transaction Volume
```

Reference:

```text
Monitoring.md
```

---

# Dependencies

Depends on:

* CompanyAPI.md
* MarketplaceAPI.md
* MemoryAPI.md
* GovernanceAPI.md
* IdentityAPI.md
* CommunicationAPI.md

Supports:

* ERDiagram.md
* IndexStrategy.md
* PartitioningStrategy.md

---

# V1

## Objective

Create foundational schema architecture.

### Included

* Core Domains
* Core Entities
* Tenant Isolation

---

## Success Criteria

All platform domains have defined ownership.

---

# V2

## Objective

Improve scalability and performance.

### Included

* Advanced Relationships
* Schema Optimization
* Analytics Support

---

## Success Criteria

Database performance supports platform growth.

---

# V3

## Objective

Create ecosystem-scale data architecture.

### Included

* Massive Multi-Tenant Support
* Advanced Partitioning
* Global Data Operations

---

## Success Criteria

Database architecture supports ecosystem scale.

---

# Future

Future capabilities may include:

* Data Federation
* Cross-Region Replication
* Advanced Analytics Schemas
* Knowledge Graph Integration

The following principle remains permanent:

```text
Data Has Ownership.

Relationships Are Explicit.

Tenants Remain Isolated.

Auditability Is Mandatory.
```

---

# Open Questions

## Data Retention

How long should different data categories persist?

---

## Cross-Tenant Analytics

What analytics may safely span tenants?

---

## Schema Evolution

How should major schema migrations be governed?

---

## Global Data Distribution

When should multi-region data architectures be introduced?

---

## Ecosystem Scale

How should PostgreSQL evolve at billions of professionals?
