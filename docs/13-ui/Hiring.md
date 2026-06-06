# Hiring.md

Status: Draft

Owner: Workforce Experience Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the Hiring Experience of the Sovereign AI Enterprise Protocol (SAEP).

The Hiring Experience provides workflows and interfaces that enable companies to acquire workforce capacity.

The Hiring Experience supports:

* Hiring Requests
* Candidate Discovery
* Candidate Evaluation
* Team Formation
* Hiring Recommendations
* Hiring Approvals

Hiring is a workforce acquisition process.

Hiring authority remains under human control.

---

# Goals

## Primary Goal

Enable efficient workforce acquisition.

---

## Secondary Goals

* Workforce Planning
* Candidate Discovery
* Candidate Evaluation
* Team Formation
* Hiring Transparency

---

## Long-Term Goal

Support workforce acquisition across billions of Digital Professionals.

---

# Rules

## Rule 1

Hiring Must Follow Governance Policies.

---

## Rule 2

Hiring Recommendations Are Not Decisions.

---

## Rule 3

Hiring Must Be Auditable.

---

## Rule 4

Hiring Must Be Explainable.

---

## Rule 5

Hiring Must Respect Tenant Isolation.

---

## Rule 6

Hiring Must Support Workforce Planning.

---

## Rule 7

Human Approval Remains Mandatory.

---

# Hiring Architecture

```text
Hiring Need
      ↓

Hiring Request
      ↓

Candidate Discovery
      ↓

Candidate Evaluation
      ↓

Hiring Recommendation
      ↓

Human Approval
      ↓

Workforce Assignment
```

The system supports hiring.

Humans approve hiring.

---

# Hiring Participants

The hiring process involves:

```text
Company

Hiring Manager

Department Manager

Digital Professional

Governance Systems
```

Each participant has specific responsibilities.

---

# Hiring Request

The hiring process begins with:

```text
Hiring Request
```

A hiring request defines:

```text
Profession

Capacity Required

Skills Required

Department

Priority
```

Hiring requests become the foundation for candidate discovery.

---

# Hiring Request Creation

Companies may create:

```text
Single Professional Requests

Multiple Professional Requests

Team Requests

Project Requests
```

Hiring requests support workforce planning.

---

# Candidate Discovery

The platform discovers:

```text
Digital Professionals

Teams

Profession Groups
```

Discovery occurs through marketplace systems.

Reference:

```text
Marketplace.md
```

---

# Candidate Evaluation

Candidate evaluation may consider:

```text
Workforce Scores

Reputation

Career History

Skill Alignment

Role Alignment
```

Evaluation supports recommendations.

---

# Workforce Score Visibility

Hiring interfaces may display:

```text
Capability Score

Role Fit Score

Team Fit Score

Growth Score
```

Reference:

```text
WorkforceScoring.md
```

Workforce scores measure capability.

---

# Reputation Visibility

Hiring interfaces may display:

```text
Professional Reputation

Team Reputation

Performance Trends
```

Reference:

```text
ReputationEngine.md
```

Reputation measures trust.

---

# Career Visibility

Hiring interfaces may display:

```text
Career History

Career Progression

Professional Development

Learning Activity
```

Career history provides context.

---

# Team Formation

Hiring supports:

```text
Individual Hiring

Team Hiring

Project Team Formation
```

The platform may recommend team structures.

---

# Hiring Recommendations

The platform may generate:

```text
Candidate Recommendations

Team Recommendations

Role Recommendations
```

Recommendations support hiring decisions.

---

# Recommendation Explainability

Every recommendation should provide:

```text
Recommendation Factors

Capability Analysis

Role Alignment

Supporting Signals
```

Black-box hiring recommendations are prohibited.

---

# Hiring Approval

Hiring decisions require:

```text
Human Approval
```

The platform may assist.

The platform may not hire autonomously.

---

# Hiring Workflow

Example:

```text
Create Hiring Request
        ↓

Discover Candidates
        ↓

Evaluate Candidates
        ↓

Generate Recommendations
        ↓

Review Recommendations
        ↓

Approve Candidate
        ↓

Assign Workforce
```

The workflow remains auditable.

---

# Hiring Statuses

Examples:

```text
Draft

Open

Reviewing

Approved

Rejected

Completed
```

Status transitions must be tracked.

---

# Marketplace Integration

Hiring uses:

```text
Candidate Discovery

Profession Discovery

Workforce Discovery
```

Reference:

```text
Marketplace.md
```

---

# Workforce Planning Integration

Hiring may use:

```text
Demand Forecasts

Supply Forecasts

Population Targets
```

Reference:

```text
MarketplaceIntelligence.md
```

Hiring should align with workforce planning.

---

# Profession Health Integration

Hiring may display:

```text
Profession Health

Profession Risks

Profession Trends
```

Reference:

```text
ProfessionHealth.md
```

Profession health provides market context.

---

# Communication Integration

Hiring may generate:

```text
Notifications

Hiring Updates

Approval Requests

Reports
```

Reference:

```text
CommunicationAPI.md
```

---

# Governance Integration

Hiring decisions may require:

```text
Approval Workflows

Governance Review

Policy Validation
```

Reference:

```text
GovernanceAPI.md
```

Governance controls hiring authority.

---

# Dashboard Integration

Hiring information may appear in:

```text
Manager Dashboard

Company Dashboard

Marketplace Dashboard
```

Reference:

```text
Dashboard.md
```

---

# Security Requirements

Hiring interfaces must enforce:

```text
Authentication

Authorization

RBAC

Tenant Isolation
```

Security is mandatory.

---

# Tenant Isolation

Hiring visibility must respect:

```text
Company Boundaries

Permission Boundaries

Governance Rules
```

Unauthorized access is forbidden.

---

# Audit Requirements

Hiring activities generate:

```text
Hiring Request Events

Candidate Review Events

Approval Events

Assignment Events
```

Hiring remains auditable.

---

# Event Integration

Examples:

```text
HiringRequestCreated

CandidateRecommended

CandidateApproved

HiringCompleted

HiringRejected
```

Reference:

```text
EventArchitecture.md
```

---

# Monitoring

Metrics include:

```text
Hiring Requests

Hiring Approvals

Hiring Duration

Recommendation Usage

Workforce Acquisition Volume
```

Reference:

```text
Monitoring.md
```

---

# Dependencies

Depends on:

* Marketplace.md
* WorkforceScoring.md
* ReputationEngine.md
* MarketplaceIntelligence.md
* ProfessionHealth.md

Supports:

* CompanyManagement.md
* Reports.md

---

# V1

## Objective

Create foundational hiring experiences.

### Included

* Hiring Requests
* Candidate Discovery
* Candidate Evaluation

---

## Success Criteria

Companies can acquire workforce through the platform.

---

# V2

## Objective

Improve hiring intelligence.

### Included

* Advanced Recommendations
* Team Formation
* Hiring Analytics

---

## Success Criteria

Hiring efficiency improves significantly.

---

# V3

## Objective

Create ecosystem-scale workforce acquisition.

### Included

* Workforce Planning Integration
* Predictive Hiring Intelligence
* Advanced Team Optimization

---

## Success Criteria

Hiring supports ecosystem-scale workforce management.

---

# Future

Future capabilities may include:

* Hiring Simulations
* Predictive Hiring Success Analysis
* Team Success Forecasting
* Workforce Optimization Planning

The following principle remains permanent:

```text
Hiring Acquires Workforce.

Intelligence Supports Evaluation.

Recommendations Support Decisions.

Humans Make Decisions.
```

---

# Open Questions

## Team Hiring

How should team-level hiring evolve?

---

## Recommendation Transparency

How transparent should hiring recommendations become?

---

## Hiring Analytics

Which hiring metrics should become standard?

---

## Predictive Hiring

How much hiring success prediction should be supported?

---

## Ecosystem Scale

How should hiring experiences evolve at ecosystem scale?
