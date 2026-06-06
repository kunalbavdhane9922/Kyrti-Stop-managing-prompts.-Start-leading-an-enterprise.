# RBAC.md

Status: Draft

Owner: Security Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the Role-Based Access Control (RBAC) architecture of the Sovereign AI Enterprise Protocol (SAEP).

RBAC controls access to:

* Services
* Data
* Memory
* Workflows
* Communication
* Governance Systems

RBAC determines what an actor may do.

RBAC does not determine authority.

Authority is governed separately through Governance systems.

---

# Goals

## Primary Goal

Provide secure and auditable access control across the ecosystem.

---

## Secondary Goals

* Least Privilege
* Tenant Isolation
* Permission Management
* Security Enforcement
* Auditability

---

## Long-Term Goal

Support billions of users and Digital Professionals with secure access controls.

---

# Rules

## Rule 1

Every Actor Must Have A Role.

---

## Rule 2

Every Action Requires Permission.

---

## Rule 3

Permissions Must Be Explicit.

---

## Rule 4

Least Privilege Is Mandatory.

---

## Rule 5

Roles Do Not Grant Governance Authority.

---

## Rule 6

Cross-Tenant Access Is Forbidden.

---

## Rule 7

Permission Decisions Must Be Auditable.

---

# RBAC Architecture

```text
Actor
      ↓

Role
      ↓

Permissions
      ↓

Resources
      ↓

Action
```

RBAC determines access before execution.

---

# Actor Types

The platform supports:

```text
Human Users

Digital Professionals

System Services

Workflow Systems
```

All actors participate in RBAC.

---

# Role Hierarchy

```text
Marketplace Roles

Company Roles

Department Roles

Professional Roles

System Roles
```

Roles exist within defined scopes.

---

# Marketplace Roles

Marketplace-wide roles.

Examples:

```text
Marketplace Founder

Marketplace Administrator

Marketplace Governance Member

Marketplace Auditor

Marketplace Observer
```

Marketplace roles operate across the ecosystem.

---

# Company Roles

Company-level roles.

Examples:

```text
Company Owner

Company Administrator

Department Manager

Project Manager

Employee
```

Company roles are tenant-scoped.

---

# Department Roles

Department-level roles.

Examples:

```text
Department Head

Team Lead

Department Member
```

Department roles inherit company boundaries.

---

# Digital Professional Roles

Roles assigned to Digital Professionals.

Examples:

```text
Backend Engineer

Frontend Engineer

Architect

QA Engineer

Product Manager
```

These roles define operational permissions.

---

# System Roles

Infrastructure and automation roles.

Examples:

```text
Runtime Service

Workflow Service

Memory Service

Communication Service
```

System roles are service-scoped.

---

# Permission Model

Permissions follow:

```text
Resource
        +
Action
```

Examples:

```text
company.read

company.create

company.update

memory.read

memory.write

workflow.execute
```

---

# Permission Categories

The platform supports:

```text
Data Permissions

Memory Permissions

Communication Permissions

Workflow Permissions

Tool Permissions

Governance Permissions
```

---

# Data Permissions

Examples:

```text
company.read

company.create

company.update

department.read

professional.read
```

---

# Memory Permissions

Examples:

```text
memory.personal.read

memory.personal.write

memory.company.read

memory.profession.read

memory.ecosystem.read
```

---

# Communication Permissions

Examples:

```text
message.send

message.receive

task.assign

report.generate
```

---

# Workflow Permissions

Examples:

```text
workflow.start

workflow.join

workflow.execute

workflow.complete
```

---

# Tool Permissions

Examples:

```text
tool.company.use

tool.memory.use

tool.communication.use

tool.marketplace.use
```

---

# Governance Permissions

Allowed:

```text
approval.request

review.request

recommendation.submit
```

Restricted:

```text
approval.grant

budget.approve

policy.approve

promotion.approve
```

Governance authority requires separate approval mechanisms.

---

# Permission Scopes

Permissions exist within scopes.

```text
Marketplace
      ↓

Tenant
      ↓

Department
      ↓

Resource
```

Scope validation is mandatory.

---

# Role Assignment Model

```text
Actor
      ↓

Role
      ↓

Permissions
```

Actors may have multiple roles.

Permissions are cumulative unless explicitly denied.

---

# Role Inheritance

Roles may inherit permissions.

Example:

```text
Company Administrator
        ↓

Department Manager
        ↓

Employee
```

Inheritance simplifies permission management.

---

# Permission Evaluation Flow

```text
Request
      ↓

Identity Service
      ↓

Role Lookup
      ↓

Permission Evaluation
      ↓

Decision
```

Execution occurs only after approval.

---

# Permission Resolution

Permission evaluation considers:

```text
Role

Scope

Tenant

Resource

Action
```

All checks must pass.

---

# Dynamic Permissions

Temporary permissions may be granted.

Examples:

```text
Project Assignment

Emergency Access

Workflow Participation
```

Temporary permissions must have expiration.

---

# Denied Permissions

Examples:

```text
Cross-Tenant Access

Unauthorized Memory Access

Governance Bypass

Direct Database Access
```

Denied permissions override granted permissions.

---

# Digital Professional RBAC

Digital Professionals operate under:

```text
Profession Template

Assigned Role

Company Policies

Governance Policies
```

All permission sources are evaluated together.

---

# Service RBAC

Services authenticate using service identities.

Examples:

```text
Memory Service

Runtime Service

Communication Service

Workflow Service
```

Services receive only required permissions.

---

# Workflow RBAC

Temporal workflows operate under delegated permissions.

```text
User
      ↓

Workflow
      ↓

Execution Context
```

Workflows cannot elevate permissions.

---

# Memory RBAC

Memory access requires:

```text
Role Validation

Permission Validation

Tenant Validation
```

Memory retrieval is audited.

---

# Communication RBAC

Communication requires:

```text
Sender Validation

Receiver Validation

Permission Validation
```

Communication Service enforces RBAC.

---

# Governance And RBAC

RBAC controls access.

Governance controls authority.

```text
Permission
      ≠
Authority

Access
      ≠
Approval
```

Human governance remains the final authority.

---

# Audit Requirements

Every RBAC decision records:

```text
Actor

Role

Permission

Resource

Result

Timestamp
```

Audit records are immutable.

---

# Security Considerations

RBAC must enforce:

```text
Least Privilege

Tenant Isolation

Audit Logging

Permission Validation
```

Security violations are critical incidents.

---

# Dependencies

Depends on:

* Security.md
* Governance.md
* HumanAuthority.md
* AgentPermissions.md

Supports:

* TenantIsolation.md
* AuditSystem.md
* Identity Service
* Runtime

---

# V1

## Objective

Create foundational RBAC architecture.

Included:

* Roles
* Permissions
* Tenant Scoping
* Audit Logging

---

## Success Criteria

All platform actions require RBAC validation.

---

# V2

## Objective

Improve permission flexibility.

Included:

* Dynamic Permissions
* Advanced Role Inheritance
* Workflow Permissions

---

## Success Criteria

RBAC adapts to operational complexity.

---

# V3

## Objective

Create ecosystem-scale access control.

Included:

* Advanced Policy Evaluation
* Permission Analytics
* Role Optimization

---

## Success Criteria

RBAC remains manageable at ecosystem scale.

---

# Future

Future capabilities may include:

* Attribute-Based Access Control (ABAC)
* Risk-Based Access Control
* Adaptive Permission Policies
* Permission Intelligence

The following principle remains permanent:

```text
Roles Grant Permissions.

Permissions Enable Actions.

Actions Do Not Grant Authority.

Authority Requires Governance.
```

---

# Open Questions

## Role Explosion

How should role growth be controlled?

---

## Dynamic Access

How flexible should temporary permissions become?

---

## ABAC Adoption

When should attribute-based access control be introduced?

---

## Permission Analytics

How should permission usage be analyzed?

---

## Ecosystem Scale

How should RBAC evolve at global scale?
