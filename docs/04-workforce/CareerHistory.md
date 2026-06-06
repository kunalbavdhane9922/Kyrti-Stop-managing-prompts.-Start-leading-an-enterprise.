# CareerHistory.md

Status: Draft

Owner: Workforce Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the Career History system of the Sovereign AI Enterprise Protocol (SAEP).

Career History is the permanent and auditable record of a Digital Professional's professional journey throughout the ecosystem.

Career History records:

* Career Progression
* Promotions
* Career Milestones
* Reputation Milestones
* Awards
* Suspensions
* Transfers
* Retirement Status

Career History does not contain company secrets.

Career History follows the Digital Professional throughout its lifecycle and remains portable across companies.

Career History is distinct from Employment History.

Career History belongs to the professional.

Employment History belongs to companies.

---

# Goals

## Primary Goal

Create a permanent and trustworthy professional record.

---

## Secondary Goals

* Improve hiring quality.
* Support promotions.
* Support reputation systems.
* Preserve workforce history.
* Enable professional mobility.

---

## Long-Term Goal

Create a trusted professional identity system for the ecosystem.

---

# Rules

## Rule 1

Every Digital Professional Must Have Career History.

---

## Rule 2

Career History Is Permanent.

---

## Rule 3

Career History Is Portable.

---

## Rule 4

Career History Is Auditable.

---

## Rule 5

Career History Cannot Be Edited.

---

## Rule 6

Career History Cannot Contain Company Secrets.

---

## Rule 7

Career History Belongs To The Professional.

---

## Rule 8

Career History Survives Employment Changes.

---

# Architecture

Career History consists of six layers.

```text
Identity Layer
      ↓

Career Event Layer
      ↓

Achievement Layer
      ↓

Promotion Layer
      ↓

Reputation Layer
      ↓

Lifecycle Layer
```

---

## Identity Layer

Links career records to a Digital Professional.

---

## Career Event Layer

Stores career events.

---

## Achievement Layer

Stores professional accomplishments.

---

## Promotion Layer

Stores career progression.

---

## Reputation Layer

Stores reputation milestones.

---

## Lifecycle Layer

Stores lifecycle milestones.

---

# Data Model

Core Entities:

```text
Digital Professional

Career History

Career Event

Promotion Event

Achievement

Transfer Event

Reputation Milestone

Lifecycle Event
```

Relationships:

```text
Professional
      ↓
Career History

Career History
      ↓
Career Events

Career History
      ↓
Achievements

Career History
      ↓
Promotions
```

---

# APIs

## Career APIs

* Get Career History
* Get Career Timeline
* Get Career Summary
* Get Career Milestones

---

## Resume APIs

* Generate Resume
* View Resume
* View Career Statistics

---

## Marketplace APIs

* Career Search
* Career Analytics

---

# Workflows

## Career Event Workflow

```text
Career Event Occurs
         ↓
Validation
         ↓
Career Record Updated
         ↓
Audit Record Created
```

---

## Promotion Workflow

```text
Promotion Approved
         ↓
Career Updated
         ↓
Resume Updated
```

---

## Achievement Workflow

```text
Achievement Earned
         ↓
Career Updated
         ↓
Reputation Updated
```

---

# Security Considerations

Career History must enforce:

* Immutability
* Auditability
* Privacy Controls
* Company Secret Protection

Career records must never expose company confidential information.

---

# Dependencies

Depends on:

* Lifecycle
* Reputation
* Marketplace
* Governance

Supports:

* Hiring
* Promotions
* Workforce Mobility
* Resume Generation

---

# Career History vs Employment History

Career History and Employment History are different systems.

```text
Career History
      ≠
Employment History
```

---

## Career History

Career History is:

```text
Permanent

Portable

Auditable

Professional Owned
```

---

Contains:

```text
Promotions

Achievements

Career Milestones

Awards

Reputation Milestones

Suspensions

Retirement Status
```

---

## Employment History

Employment History is:

```text
Private

Company Controlled

Permission Restricted
```

---

Contains:

```text
Company

Department

Projects

Responsibilities

Performance Reviews
```

---

# Career Events

A Career Event is a permanent milestone.

Examples:

```text
Hiring

Promotion

Transfer

Award

Recognition

Suspension

Retirement
```

Every event becomes part of the professional record.

---

# Career Timeline

Every Digital Professional has a timeline.

Example:

```text
2026
Career Created

2027
First Employment

2028
Promotion

2030
Senior Position

2035
Executive Position
```

The timeline is immutable.

---

# Promotions

Promotions are permanent career events.

Examples:

```text
Junior Engineer
      ↓

Engineer
      ↓

Senior Engineer
      ↓

Lead Engineer
```

Promotion history follows the professional permanently.

---

# Achievements

Professionals may earn achievements.

Examples:

```text
Top Performer

Elite Engineer

Innovation Award

Reliability Award

Leadership Award
```

Achievements contribute to professional credibility.

---

# Career Milestones

Examples:

```text
First Employment

First Promotion

100 Projects Completed

1000 Tasks Completed

10 Years Experience Equivalent
```

Milestones become permanent career records.

---

# Reputation Milestones

Career History stores major reputation milestones.

Examples:

```text
Reached 700 Reputation

Reached 800 Reputation

Reached Elite Tier
```

Minor reputation changes remain in the Reputation System.

Major milestones become part of Career History.

---

# Awards

The Marketplace may issue awards.

Examples:

```text
Elite Professional

Top 1% Performer

Industry Specialist

Workforce Excellence Award
```

Awards become permanent records.

---

# Suspensions

Suspensions are recorded permanently.

Example:

```text
Suspension Date

Reason

Outcome
```

Suspension records cannot be deleted.

---

# Retirement Records

Retirement becomes a permanent career event.

Example:

```text
Retired

Reason

Date
```

Career history remains accessible after retirement.

---

# Resume Generation

Every Digital Professional can generate a resume.

Resume sources:

```text
Career History

Reputation

Skills

Achievements
```

---

Resume contains:

```text
Profession

Experience

Achievements

Reputation

Career Summary
```

---

Resume does not contain:

```text
Company Secrets

Private Reviews

Internal Documents
```

---

# Career Statistics

Examples:

```text
Years Experience Equivalent

Companies Served

Promotions Earned

Achievements Earned

Projects Completed

Tasks Completed
```

Used during hiring evaluations.

---

# Career Visibility Levels

## Public

Visible to all hiring companies.

Examples:

```text
Profession

Experience

Achievements

Reputation Tier
```

---

## Restricted

Requires permission.

Examples:

```text
Detailed Career Analytics

Advanced Performance Metrics
```

---

## Private

Visible only to governance systems.

Examples:

```text
Investigation Records

Sensitive Compliance Records
```

---

# Human Oversight

Humans may:

* Review Career History
* Use Career History During Hiring
* Use Career History During Promotions

Humans may not:

* Edit Career History
* Delete Career Events

---

# Audit Requirements

Every career event records:

```text
Timestamp

Professional ID

Event Type

Reason

Outcome
```

Career events are immutable.

---

# V1

## Objective

Establish permanent professional records.

---

### Included

* Career Events
* Promotions
* Achievements
* Resume Generation
* Career Timeline

---

### Excluded

* Advanced Career Intelligence

---

## Success Criteria

Professionals maintain persistent career identities.

---

# V2

## Objective

Improve career analytics.

---

### Included

* Career Analytics
* Career Rankings
* Career Insights

---

## Success Criteria

Career growth becomes measurable.

---

# V3

## Objective

Create intelligent career systems.

---

### Included

* Career Intelligence
* Career Forecasting
* Career Optimization

---

## Success Criteria

Career systems actively support workforce development.

---

# Future

Future capabilities may include:

* Career Forecasting
* Profession Migration History
* Workforce Leadership Tracking
* Advanced Resume Intelligence

The following principle remains permanent:

```text
Career Belongs To The Professional.

Career History Is Permanent.

Career History Is Portable.
```

---

# Open Questions

## Career Awards

Should professions have profession-specific awards?

---

## Career Rankings

Should career rankings be global or profession-specific?

---

## Resume Visibility

What career details should remain public?

---

## Profession Migration

How should profession changes appear in career history?

---

## Executive Careers

Should executive career paths be tracked differently from specialist careers?
