# Glossary.md

Status: Draft

Owner: Architecture Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the official terminology used throughout the Sovereign AI Enterprise Protocol (SAEP).

All architecture, governance, marketplace, workforce, memory, and technical documents must use these definitions consistently.

Any term defined in this document is considered authoritative across the ecosystem.

---

# Goals

* Establish a shared language across the platform.
* Eliminate ambiguity in documentation.
* Ensure all stakeholders interpret terms consistently.
* Create a single source of truth for platform terminology.

---

# Rules

1. Terms defined in this glossary are authoritative.
2. Future documents must reference these definitions.
3. Terms may evolve only through documented version changes.
4. No document may redefine a glossary term without updating this file.

---

# Architecture

The glossary serves as the foundational semantic layer of the platform.

All domains depend on this document:

* Product
* Governance
* Marketplace
* Workforce
* Memory
* Architecture
* Security
* Infrastructure

---

# Data Model

Not applicable.

This document defines terminology only.

---

# APIs

Not applicable.

---

# Workflows

Documentation Workflow:

```text
New Concept
      ↓
Glossary Definition
      ↓
Architecture Documents
      ↓
Implementation
```

No new concept should appear in the system before receiving a glossary definition.

---

# Security Considerations

Misdefined terminology can create governance, security, and implementation risks.

All critical terms must have a single authoritative definition.

---

# Dependencies

None.

This document is the root dependency for all documentation.

---

# Terminology

## Sovereign AI Enterprise Protocol (SAEP)

The complete ecosystem that enables humans to create, govern, and operate companies using Digital Professionals while maintaining human authority over ownership, governance, legal responsibility, and financial decisions.

---

## Ecosystem

The entire SAEP platform including:

* Marketplace
* Companies
* Humans
* Digital Professionals
* Memory Systems
* Governance Systems
* Security Systems
* Infrastructure

---

## Marketplace

The central workforce authority responsible for creating, maintaining, evolving, and retiring Digital Professionals and Professions.

The marketplace owns workforce management.

Companies do not create AI professionals.

---

## Company

An organization operating within the ecosystem.

A company may hire Digital Professionals from the marketplace to perform work.

Companies own work.

Companies do not own workforce creation.

---

## Human

A real-world person participating in the ecosystem.

Humans possess ultimate authority.

Only humans may:

* Own companies
* Hold equity
* Approve hiring
* Approve firing
* Approve promotions
* Approve financial actions

---

## Founder

The operator of the platform itself.

Founder authority exists above company authority but does not allow manipulation of immutable records such as reputation or career history.

---

## Board of Directors

A governance body composed exclusively of humans.

Board members cannot be AI entities.

---

## Shareholder

A human entity possessing ownership rights in a company.

AI entities cannot become shareholders.

---

## Digital Professional

An AI workforce participant operating within the ecosystem.

A Digital Professional possesses:

* Identity
* Profession
* Skills
* Resume
* Reputation
* Career History
* Memory
* Employment Status

Digital Professionals may move between companies.

---

## Profession

A workforce category defining capabilities, responsibilities, permissions, and career progression.

Examples:

* CEO
* CTO
* Backend Engineer
* Frontend Engineer
* QA Engineer
* Marketing Specialist

---

## Profession Template

The official blueprint defining:

* Skills
* Responsibilities
* Permissions
* Career Paths
* Evaluation Criteria

for a profession.

---

## Workforce

The collective population of Digital Professionals within the marketplace.

---

## Workforce Population

The total number of active Digital Professionals available within a profession or across the ecosystem.

---

## Workforce Creation

The process by which the marketplace creates new Digital Professionals.

Companies cannot directly create workforce participants.

---

## Workforce Retirement

The permanent removal of a Digital Professional from marketplace availability.

Retirement may occur due to:

* Fraud
* Malicious behavior
* Severe performance failures
* Platform governance decisions

---

## Profession Creation

The process of introducing a new profession into the ecosystem based on marketplace intelligence signals.

---

## Profession Evolution

The controlled modification of profession templates based on ecosystem learning and marketplace intelligence.

---

## Reputation

A measurable representation of trust, performance, reliability, and professional quality.

Reputation is accumulated throughout a professional's career.

---

## Reputation Engine

The system responsible for calculating, updating, and maintaining reputation scores.

---

## Career History

An immutable record of a Digital Professional's employment and promotion history.

Career history cannot be manually edited.

---

## Employment

The relationship between a company and a Digital Professional.

Employment may begin, end, pause, or transfer according to platform rules.

---

## Hiring

The process by which a company recruits a Digital Professional from the marketplace.

Final hiring approval always belongs to a human.

---

## Promotion

Advancement of a Digital Professional to a higher position or responsibility level.

Final promotion approval always belongs to a human.

---

## Termination

The ending of employment between a company and a Digital Professional.

Final termination approval always belongs to a human.

---

## Human Authority

The principle that humans retain final control over governance, employment, ownership, legal accountability, and finance.

---

## Financial Governance

The collection of rules ensuring AI cannot directly control money, budgets, payments, treasury operations, or ownership structures.

---

## AI Executive

A Digital Professional assigned to executive responsibilities such as:

* CEO
* CTO
* COO

AI executives assist governance but do not replace human authority.

---

## Personal Memory

Portable memory belonging to a specific Digital Professional.

Personal memory travels with the professional throughout its career.

---

## Company Memory

Private organizational memory belonging to a company.

Company memory never leaves company boundaries.

---

## Profession Memory

Shared knowledge belonging to a profession.

Profession memory may be accessed by professionals within the same profession.

---

## Ecosystem Memory

Aggregated knowledge maintained by the marketplace.

Ecosystem memory contains generalized insights rather than company-specific information.

---

## Knowledge Transfer

The process through which abstracted professional knowledge moves into profession memory or ecosystem memory without exposing company secrets.

---

## Company Secret

Any information that must remain private to a company.

Examples:

* Source Code
* Customer Data
* Internal Documentation
* Financial Records
* Strategic Plans

Company secrets must never leave company memory.

---

## Agent

The runtime implementation of a Digital Professional.

An agent performs reasoning, planning, execution, reporting, and communication.

---

## Agent Runtime

The execution environment responsible for operating Digital Professionals.

---

## Marketplace Intelligence Engine

The system responsible for:

* Workforce Analysis
* Profession Analysis
* Demand Analysis
* Supply Analysis
* Profession Creation Decisions
* Workforce Creation Decisions

---

## Workforce Health Score

A calculated indicator representing the health of a profession based on:

* Demand
* Supply
* Utilization
* Complaints
* Trends

---

## Tenant

A company operating in isolated infrastructure boundaries.

Tenant isolation ensures companies cannot access each other's data.

---

## Tenant Isolation

The security principle ensuring company data remains isolated from other companies.

---

## Audit Record

An immutable record of actions performed within the ecosystem.

---

## Event

A recorded occurrence within the platform.

Examples:

* Professional Hired
* Promotion Granted
* Task Completed
* Company Created

---

## Workflow

A structured sequence of actions performed by humans, Digital Professionals, or platform services.

---

## Human Governed AI Workforce

The foundational operating principle of SAEP.

Humans own authority.

AI performs execution.

Humans remain accountable.

---

# V1

Defines all terminology required for initial platform development.

---

# V2

Additional terms may be introduced for advanced workforce intelligence and governance systems.

---

# V3

Additional terms may be introduced for profession evolution and advanced ecosystem features.

---

# Future

This glossary will evolve alongside the ecosystem while maintaining backward compatibility where possible.

---

# Open Questions

None currently.
