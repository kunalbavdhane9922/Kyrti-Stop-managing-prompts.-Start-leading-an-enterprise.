# Terminology.md

Status: Draft

Owner: Architecture Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document establishes the official terminology standards, naming conventions, abbreviations, lifecycle states, status values, event naming standards, API naming standards, and documentation standards for the Sovereign AI Enterprise Protocol (SAEP).

The purpose of this document is to ensure consistency across:

* Documentation
* Architecture
* APIs
* Databases
* Workflows
* Events
* Agents
* Infrastructure

---

# Goals

* Standardize terminology.
* Prevent naming inconsistencies.
* Ensure engineering consistency.
* Improve maintainability.
* Create a common language for all contributors.

---

# Rules

1. All documents must follow terminology standards.
2. All APIs must follow naming standards.
3. All events must follow naming standards.
4. All database entities must follow naming standards.
5. All status values must use predefined enums.
6. New terminology requires documentation updates.

---

# Architecture

Terminology acts as a cross-cutting standard.

All domains depend on terminology consistency.

---

# Data Model

Not applicable.

---

# APIs

Defined within this document.

---

# Workflows

Naming Workflow

```text
New Concept
      ↓
Glossary Definition
      ↓
Terminology Standard
      ↓
Implementation
```

---

# Security Considerations

Consistent naming reduces implementation errors, security mistakes, and audit confusion.

---

# Dependencies

Depends on:

* Glossary.md

Used by:

* All Documents
* All Services
* All APIs
* All Databases
* All Events

---

# Official Acronyms

## SAEP

Sovereign AI Enterprise Protocol

---

## DP

Digital Professional

---

## HR

Human Resources

---

## RBAC

Role Based Access Control

---

## API

Application Programming Interface

---

## RAG

Retrieval Augmented Generation

---

## LLM

Large Language Model

---

## KPI

Key Performance Indicator

---

## UUID

Universally Unique Identifier

---

## AI

Artificial Intelligence

---

## CEO

Chief Executive Officer

---

## CTO

Chief Technology Officer

---

## COO

Chief Operating Officer

---

# Documentation Naming Standards

All documents must use:

```text
PascalCase.md
```

Examples:

```text
DigitalProfessionals.md
Marketplace.md
SystemArchitecture.md
```

---

Forbidden:

```text
digital-professionals.md
market_place.md
SYSTEMARCHITECTURE.md
```

---

# Database Naming Standards

All tables:

```text
snake_case
plural
```

Examples:

```text
companies
digital_professionals
career_history
reputation_events
```

---

All columns:

```text
snake_case
```

Examples:

```text
company_id
created_at
reputation_score
```

---

Primary Keys

```text
<entity>_id
```

Examples:

```text
company_id
professional_id
department_id
```

---

# API Naming Standards

Base Version Format

```text
/api/v1
```

Examples:

```text
/api/v1/companies
/api/v1/professionals
/api/v1/tasks
```

---

Resources

Use nouns.

Examples:

```text
companies
professionals
projects
tasks
reports
```

---

Forbidden

```text
/getCompanies
/createTask
/deleteProject
```

---

Use HTTP verbs correctly.

```text
GET
POST
PUT
PATCH
DELETE
```

---

# Event Naming Standards

All events use:

```text
Past Tense
```

Examples:

```text
CompanyCreated
ProfessionalHired
TaskAssigned
TaskCompleted
PromotionGranted
TerminationCompleted
```

---

Forbidden

```text
CreateCompany
HireProfessional
AssignTask
```

These are commands, not events.

---

# Command Naming Standards

Commands use:

```text
Verb + Noun
```

Examples:

```text
CreateCompany
HireProfessional
AssignTask
GenerateReport
```

---

# Workflow Naming Standards

Format:

```text
<Entity><Workflow>
```

Examples:

```text
HiringWorkflow
PromotionWorkflow
TerminationWorkflow
CompanyClosureWorkflow
```

---

# Service Naming Standards

Format:

```text
<Entity>Service
```

Examples:

```text
MarketplaceService
MemoryService
CompanyService
AuditService
```

---

# Repository Naming Standards

Format:

```text
<Entity>Repository
```

Examples:

```text
CompanyRepository
ProfessionalRepository
TaskRepository
```

---

# Agent Naming Standards

Format:

```text
<Role>Agent
```

Examples:

```text
CEOAgent
CTOAgent
BackendEngineerAgent
QAAgent
```

---

# Memory Collection Naming Standards

Qdrant Collections

```text
snake_case
```

Examples:

```text
personal_memory
company_memory
profession_memory
ecosystem_memory
```

---

# Status Standards

## Company Status

```text
CREATED
ACTIVE
PAUSED
ARCHIVED
CLOSED
```

---

## Professional Status

```text
CREATED
AVAILABLE
INTERVIEWING
EMPLOYED
TERMINATED
RETIRED
```

---

## Employment Status

```text
PENDING
ACTIVE
PAUSED
TERMINATED
```

---

## Task Status

```text
CREATED
ASSIGNED
PLANNING
IN_PROGRESS
BLOCKED
REVIEW
COMPLETED
CANCELLED
```

---

## Project Status

```text
CREATED
ACTIVE
PAUSED
COMPLETED
ARCHIVED
```

---

## Report Status

```text
DRAFT
GENERATED
APPROVED
ARCHIVED
```

---

# Agent State Standards

All agents use:

```text
AVAILABLE
ASSIGNED
PLANNING
WORKING
BLOCKED
ESCALATED
REVIEW
COMPLETED
```

---

# Memory Type Standards

```text
PERSONAL
COMPANY
PROFESSION
ECOSYSTEM
```

---

# Reputation Tier Standards

```text
ELITE
EXCELLENT
GOOD
AVERAGE
POOR
```

---

# Security Classification Standards

## PUBLIC

Information visible to everyone.

---

## INTERNAL

Information visible within authorized boundaries.

---

## CONFIDENTIAL

Information restricted to specific organizations.

---

## RESTRICTED

Highly sensitive information requiring elevated permissions.

---

# Audit Severity Standards

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# Versioning Standards

Platform Version Format

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

---

# Date Standards

Format:

```text
YYYY-MM-DD
```

Example:

```text
2026-06-06
```

---

# Time Standards

Use:

```text
UTC
```

for all backend systems.

---

# V1

Defines all terminology standards required for initial platform implementation.

---

# V2

Additional terminology standards may be introduced for advanced workforce intelligence systems.

---

# V3

Additional terminology standards may be introduced for advanced governance and profession evolution systems.

---

# Future

The terminology system should remain stable and backward compatible wherever possible.

---

# Open Questions

None currently.
