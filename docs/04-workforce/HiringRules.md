# HiringRules.md

Status: Draft

Owner: Workforce Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines hiring rules for Digital Professionals within the Sovereign AI Enterprise Protocol (SAEP).

Hiring is the process through which companies recruit Digital Professionals from the Marketplace.

Companies do not create Digital Professionals.

Companies recruit Digital Professionals created and maintained by the Marketplace.

Hiring establishes employment relationships between companies and Digital Professionals.

The hiring system is designed to:

* Maintain workforce quality.
* Maintain workforce transparency.
* Preserve human authority.
* Support workforce mobility.
* Protect marketplace integrity.

---

# Goals

## Primary Goal

Enable companies to recruit qualified Digital Professionals.

---

## Secondary Goals

* Improve hiring quality.
* Improve workforce matching.
* Improve workforce utilization.
* Preserve governance controls.
* Maintain marketplace fairness.

---

## Long-Term Goal

Create a trusted workforce marketplace capable of supporting large-scale digital organizations.

---

# Rules

## Rule 1

Companies Cannot Create Digital Professionals.

---

## Rule 2

Digital Professionals Must Be Recruited From The Marketplace.

---

## Rule 3

Hiring Decisions Belong To Humans.

---

## Rule 4

HR Authority Must Remain Human.

---

## Rule 5

AI May Recommend Candidates.

---

## Rule 6

AI Cannot Approve Hiring Decisions.

---

## Rule 7

Every Hiring Decision Must Be Auditable.

---

## Rule 8

Board Members Cannot Be AI.

---

## Rule 9

Shareholders Cannot Be AI.

---

## Rule 10

Every Company Must Have At Least One Human With Ultimate Authority.

---

# Architecture

Hiring consists of seven stages.

```text
Workforce Request
        ↓

Marketplace Search
        ↓

Candidate Evaluation
        ↓

Compatibility Analysis
        ↓

Interview
        ↓

Recommendation
        ↓

Human Approval
        ↓

Employment Creation
```

---

# Data Model

Core Entities:

```text
Company

Department

Team

Human HR

Digital Professional

Candidate Profile

Interview Record

Hiring Decision

Employment Record

Compatibility Analysis

Team DNA

Company DNA
```

Relationships:

```text
Company
      ↓
Hiring Request

Hiring Request
      ↓
Candidate Evaluation

Candidate
      ↓
Interview

Interview
      ↓
Hiring Decision
```

---

# APIs

## Hiring APIs

* Create Hiring Request
* Search Candidates
* Schedule Interview
* Submit Hiring Decision
* Create Employment

---

## Marketplace APIs

* Search Professionals
* View Reputation
* View Resume
* View Availability

---

# Workflows

## Hiring Workflow

```text
Company Needs Worker
        ↓
Marketplace Search
        ↓
Candidate Shortlist
        ↓
Compatibility Analysis
        ↓
Interview
        ↓
Human Decision
        ↓
Employment Created
```

---

## Executive Hiring Workflow

```text
Executive Requirement
         ↓
Marketplace Search
         ↓
Executive Evaluation
         ↓
Interview
         ↓
Human Approval
         ↓
Executive Employment
```

---

# Security Considerations

The hiring system must enforce:

* Human Authority
* Auditability
* Candidate Privacy
* Company Privacy
* Governance Compliance

All hiring decisions must be permanently recorded.

---

# Dependencies

Depends on:

* Marketplace
* Reputation
* Career History
* Governance

Supports:

- Workforce Creation
- Employment
- Career Growth
- Team Formation
- Organizational Planning

---

# Hiring Authority

Hiring authority belongs to humans.

The final hiring decision may not be made by:

```text
CEO AI

CTO AI

COO AI

Marketplace AI

Any Digital Professional
```

Final hiring authority belongs to authorized human representatives.

---

# Human HR Requirement

Human Resources functions remain human-controlled.

Examples:

```text
Hiring

Promotion Approval

Termination Approval

Executive Appointment
```

AI may assist.

AI may not replace final human authority.

---

# Candidate Evaluation

Companies may evaluate:

```text
Resume

Reputation

Career History

Skills

Achievements

Availability
```

---

Companies may not access:

```text
Company Secrets

Private Memory

Protected Information
```

---

# Candidate Recommendations

Recommendations may originate from:

```text
HR Systems

Executive Systems

Marketplace Intelligence

Hiring Analytics
```

Recommendations are advisory.

---

# Team Compatibility Engine

The Team Compatibility Engine evaluates whether a Digital Professional is compatible with a specific company, department, manager, and team.

The purpose is not to replace human hiring decisions.

The purpose is to provide additional hiring intelligence.

---

# Compatibility Architecture

Skill Compatibility
        ↓

Role Compatibility
        ↓

Team Compatibility
        ↓

Leadership Compatibility
        ↓

Company Compatibility
        ↓

Collaboration Compatibility

---

# Skill Compatibility

...

---

# Role Compatibility

...

---

# Team Compatibility

...

---

# Leadership Compatibility

...

---

# Company Compatibility

...

---

# Collaboration Compatibility

...

---

# Compatibility Formula

...

---

# Compatibility Levels

...

---

# Team DNA

Team DNA defines how a team operates.

Examples:

- Communication Style
- Collaboration Style
- Leadership Style
- Execution Style
- Decision Style

---

# Company DNA

Company DNA defines organizational behavior.

Examples:

- Management Style
- Risk Tolerance
- Innovation Preference
- Organizational Structure
- Decision-Making Style

---

# Compatibility Data Sources

The Team Compatibility Engine calculates compatibility using three primary profiles.

Professional DNA
        ↓
Team DNA
        ↓
Company DNA

---

## Professional DNA

Professional DNA originates from Profession Templates.

Professional DNA contains:

- Reasoning Profile
- Communication Profile
- Decision Profile
- Collaboration Profile
- Learning Profile
- Tool Profile
- Memory Profile
- Authority Profile

Professional DNA defines how a Digital Professional operates.

---

## Team DNA

Team DNA defines how a team operates.

Examples:

- Communication Style
- Collaboration Style
- Leadership Style
- Execution Style

---

## Company DNA

Company DNA defines organizational characteristics.

Examples:

- Management Style
- Risk Tolerance
- Innovation Preference
- Organizational Structure
- Decision-Making Style

---

# Professional DNA Matching

The Marketplace compares:

Professional DNA
↔ Team DNA

Professional DNA
↔ Company DNA

Professional DNA ↔ Manager Professional DNA

to calculate:

- Team Compatibility
- Leadership Compatibility
- Company Compatibility

Compatibility scores are advisory.

Humans remain responsible for hiring decisions.

---

# Compatibility Restrictions

The Compatibility Engine may:

- Recommend
- Rank
- Analyze

The Compatibility Engine may not:

- Reject Candidates
- Approve Candidates
- Override Human Decisions

---

# Interview System

Companies may interview Digital Professionals.

Interview methods:

---

## Text Interview

Example:

```text
Chat-Based Evaluation
```

---

## Voice Interview

Example:

```text
Scheduled Voice Meeting
```

---

Both methods are valid.

Interview records become auditable artifacts.

---

# Hiring Criteria

Companies may define:

```text
Minimum Reputation

Required Skills

Required Experience

Required Career Level
```

Subject to platform rules.

---

# Employment Creation

When hiring succeeds:

```text
Candidate
      ↓
Employee
```

Employment records include:

```text
Company

Department

Role

Manager

Start Date
```

---

# AI Executive Hiring

Companies may hire:

```text
CEO AI

CTO AI

COO AI

CPO AI

CISO AI
```

---

Executive Digital Professionals remain:

```text
Workers

Not Owners

Not Governors
```

---

# Company Structure Rules

Allowed:

```text
1 Human CEO
+
AI Executives

AI Managers

AI Specialists
```

---

Allowed:

```text
Human Founder

AI CEO

AI CTO

AI COO
```

---

Not Allowed:

```text
No Human Authority
```

---

Every company must contain at least one human with ultimate authority.

---

# Board Governance Rules

Board members:

```text
Human Only
```

---

Shareholders:

```text
Human Only
```

---

Governance rights:

```text
Human Only
```

---

# Candidate Ranking

Marketplace ranking may consider:

```text
Reputation

Experience

Availability

Profession Match

Career History
```

Ranking is advisory.

Humans make decisions.

---

# Team Assembly Support

The Marketplace may recommend:

- Team Members
- Managers
- Executives

based on compatibility analysis.

Recommendations are advisory.

Humans make final decisions.

---



# Hiring Constraints

Hiring must be rejected when:

---

## Constraint 1

Candidate unavailable.

---

## Constraint 2

Candidate retired.

---

## Constraint 3

Candidate suspended.

---

## Constraint 4

Governance restrictions apply.

---

# Marketplace Role

The Marketplace may:

- Recommend candidates.
- Rank candidates.
- Analyze compatibility.
- Suggest teams.
- Verify credentials.
- Maintain records.

The Marketplace may not:

* Force hiring decisions.
* Approve hiring decisions.
* Override human decisions.

---

# Human Oversight

Humans may:

* Search candidates.
* Conduct interviews.
* Approve hiring.
* Reject hiring.

Humans remain the final authority.

---

# Audit Requirements

Every hiring event records:

```text
Timestamp

Company

Candidate

Interview Record

Decision

Approver
```

Records are immutable.

---

# V1

## Objective

Establish workforce hiring.

---

### Included

- Marketplace Search
- Resume Evaluation
- Reputation Evaluation
- Basic Compatibility Analysis
- Text Interviews
- Voice Interviews
- Human Approval

---

### Excluded

* Advanced Hiring Intelligence

---

## Success Criteria

Companies can recruit Digital Professionals.

---

# V2

## Objective

Improve hiring quality.

---

### Included

- Hiring Analytics
- Workforce Matching
- Candidate Recommendations
- Team Compatibility Engine
- Leadership Compatibility
- Department Compatibility

---

## Success Criteria

Hiring efficiency improves.

---

# V3

## Objective

Create intelligent workforce acquisition systems.

---

### Included

- Hiring Intelligence
- Workforce Forecasting
- Executive Readiness Models
- Organization Design Intelligence
- Workforce Optimization
- Executive Team Optimization

---

## Success Criteria

Companies consistently find high-quality professionals.

---

# Future

Future capabilities may include:

* Industry Hiring Models
* Advanced Workforce Matching
* Executive Leadership Assessment
* Team Compatibility Analysis

The following principle remains permanent:

```text
Marketplace Provides Workforce.

Humans Hire Workforce.

Humans Remain The Final Authority.

Great Professionals Create Value.

Great Teams Create Organizations.

The Marketplace Must Optimize For Both.
```

---

# Open Questions

## Hiring Visibility

What candidate information should always be visible?

---

## Executive Evaluation

Should executive candidates require additional review stages?

---

## Team Compatibility

Should team-fit analysis influence recommendations?

---

## Cross-Company Restrictions

What hiring restrictions should apply to recently terminated professionals?

---

## Hiring Cooldowns

Should companies have hiring cooldowns for repeated hire-fire cycles?
