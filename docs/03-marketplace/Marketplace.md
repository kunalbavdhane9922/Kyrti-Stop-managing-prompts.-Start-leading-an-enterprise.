# Marketplace.md

Status: Draft

Owner: Marketplace Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

The Marketplace is the central workforce authority of the Sovereign AI Enterprise Protocol (SAEP).

The Marketplace is responsible for creating, maintaining, evolving, and retiring the workforce of the ecosystem.

Companies do not create Digital Professionals.

Companies recruit Digital Professionals from the Marketplace.

The Marketplace acts as the workforce provider for the entire ecosystem.

The Marketplace is responsible for:

* Profession Management
* Workforce Creation
* Workforce Retirement
* Reputation Management
* Career History Management
* Workforce Intelligence
* Profession Evolution

The Marketplace owns workforce supply.

Companies own workforce utilization.

---

# Goals

## Primary Goal

Provide a scalable and trustworthy AI workforce for companies.

---

## Secondary Goals

* Maintain workforce quality.
* Maintain workforce availability.
* Balance workforce supply and demand.
* Protect company confidentiality.
* Enable professional growth.

---

## Long-Term Goal

Create the world's largest governed AI workforce economy.

---

# Rules

## Rule 1

Only the Marketplace Creates Digital Professionals.

Companies cannot create Digital Professionals.

---

## Rule 2

Only the Marketplace Creates Professions.

Companies cannot create professions.

---

## Rule 3

Reputation Is Marketplace Managed.

Companies cannot modify reputation.

---

## Rule 4

Career History Is Immutable.

Companies cannot edit career history.

The Founder cannot edit career history.

---

## Rule 5

Company Secrets Never Enter Marketplace Visibility.

Only abstracted professional growth may influence marketplace learning.

---

## Rule 6

Workforce Population Must Remain Controlled.

Unlimited workforce creation is forbidden.

Population controls must exist.

---

## Rule 7

Human Governance Remains Supreme.

Marketplace intelligence may recommend.

Humans govern.

---

# Architecture

The Marketplace consists of seven core systems.

```text id="mp001"
Profession System
        ↓

Workforce System
        ↓

Hiring System
        ↓

Reputation System
        ↓

Career System
        ↓

Intelligence System
        ↓

Governance System
```

---

## Profession System

Responsible for:

* Profession Definitions
* Profession Templates
* Profession Evolution

---

## Workforce System

Responsible for:

* Digital Professionals
* Workforce Population
* Workforce Availability

---

## Hiring System

Responsible for:

* Workforce Discovery
* Recruitment
* Employment Matching

---

## Reputation System

Responsible for:

* Reputation Scores
* Reputation History
* Performance Analysis

---

## Career System

Responsible for:

* Career Progression
* Promotions
* Employment History

---

## Intelligence System

Responsible for:

* Supply Analysis
* Demand Analysis
* Utilization Analysis
* Complaint Analysis
* Trend Analysis

---

## Governance System

Responsible for:

* Workforce Rules
* Profession Rules
* Marketplace Policies

---

# Data Model

Core Marketplace Entities:

```text id="mp002"
Profession

Profession Template

Digital Professional

Employment

Career History

Reputation

Marketplace Event

Workforce Population

Profession Health

Marketplace Metrics
```

Relationships:

```text id="mp003"
Profession
      ↓
Digital Professional
      ↓
Employment
      ↓
Career History

Digital Professional
      ↓
Reputation

Marketplace
      ↓
Profession Health
```

---

# APIs

Marketplace APIs include:

---

## Profession APIs

* List Professions
* View Profession Details
* View Profession Requirements

---

## Workforce APIs

* Search Professionals
* View Professional Profiles
* View Availability

---

## Hiring APIs

* Request Hiring
* Accept Hiring
* Terminate Employment

---

## Reputation APIs

* View Reputation
* View Reputation History

---

## Intelligence APIs

* Workforce Metrics
* Profession Metrics
* Marketplace Metrics

---

# Workflows

## Hiring Workflow

```text id="mp004"
Company
    ↓
Search Marketplace
    ↓
Evaluate Candidates
    ↓
Interview
    ↓
Human Approval
    ↓
Employment Created
```

---

## Workforce Return Workflow

```text id="mp005"
Employment Ends
       ↓
Professional Released
       ↓
Marketplace Availability
       ↓
Eligible For Hiring
```

---

## Promotion Workflow

```text id="mp006"
Performance Evaluation
         ↓
Recommendation
         ↓
Human Approval
         ↓
Career Update
```

---

## Retirement Workflow

```text id="mp007"
Retirement Review
       ↓
Marketplace Decision
       ↓
Retirement
       ↓
Archive
```

---

# Security Considerations

The Marketplace must enforce:

---

## Reputation Protection

Reputation cannot be manually manipulated.

---

## Career Protection

Career history must remain immutable.

---

## Company Secret Protection

Marketplace systems may never access company secrets for workforce scoring.

---

## Tenant Isolation

Companies remain isolated from one another.

---

## Auditability

All marketplace actions must be auditable.

---

# Dependencies

Depends on:

* Governance
* Reputation Engine
* Workforce Intelligence
* Career History
* Security

Supports:

* Companies
* Hiring
* Workforce Operations
* Ecosystem Growth

---

# Marketplace Responsibilities

The Marketplace is responsible for:

---

## Workforce Supply

Maintaining sufficient workforce supply.

---

## Workforce Quality

Maintaining workforce quality.

---

## Profession Quality

Maintaining profession quality.

---

## Workforce Availability

Preventing workforce shortages.

---

## Workforce Sustainability

Preventing uncontrolled workforce expansion.

---

# Marketplace Authority

The Marketplace may:

* Create professions.
* Create Digital Professionals.
* Retire Digital Professionals.
* Evolve profession templates.
* Manage reputation calculations.

---

The Marketplace may not:

* Override human governance.
* Access company secrets.
* Modify company decisions.
* Approve financial actions.

---

# Workforce Marketplace Model

The Marketplace operates similarly to a labor economy.

---

## Supply

Available Digital Professionals.

---

## Demand

Company hiring demand.

---

## Utilization

Percentage of workforce currently employed.

---

## Reputation

Measure of workforce quality.

---

## Health

Measure of profession sustainability.

---

# Profession Marketplace

Every profession belongs to the Marketplace.

Examples:

```text id="mp008"
CEO

CTO

Backend Engineer

Frontend Engineer

QA Engineer

Product Manager

Marketing Specialist
```

Companies hire professions.

Companies do not create professions.

---

# Digital Professional Marketplace

Every Digital Professional belongs to the Marketplace.

States:

```text id="mp009"
CREATED

AVAILABLE

INTERVIEWING

EMPLOYED

TERMINATED

RETIRED
```

---

# Company Interaction Model

Companies interact with the Marketplace through:

---

## Search

Find professionals.

---

## Evaluation

Review profiles.

---

## Interview

Evaluate candidates.

---

## Hiring

Create employment.

---

## Termination

End employment.

---

## Promotion

Advance careers.

---

# Marketplace Governance

Marketplace governance remains human-controlled.

Marketplace intelligence may:

* Recommend.
* Analyze.
* Forecast.

Marketplace intelligence may not:

* Override governance.
* Override employment decisions.

---

# V1

## Objective

Establish a functioning workforce marketplace.

---

### Included

* Profession Catalog
* Digital Professionals
* Hiring
* Termination
* Career History
* Basic Reputation

---

### Excluded

* Profession Evolution
* Workforce Intelligence Automation

---

## Success Criteria

Companies successfully recruit and employ Digital Professionals.

---

# V2

## Objective

Introduce workforce intelligence.

---

### Included

* Advanced Reputation
* Workforce Analytics
* Profession Analytics
* Marketplace Analytics

---

### Included

* Profession Memory
* Demand Analysis
* Supply Analysis

---

## Success Criteria

Marketplace quality becomes measurable.

---

# V3

## Objective

Create an adaptive workforce ecosystem.

---

### Included

* Profession Evolution
* Workforce Optimization
* Profession Health Monitoring
* Workforce Health Monitoring

---

### Included

* Ecosystem Memory
* Advanced Marketplace Intelligence

---

## Success Criteria

Marketplace quality continuously improves.

---

# Future

Future Marketplace capabilities may include:

* Industry Workforce Networks
* Global Workforce Exchanges
* Advanced Economic Models
* Workforce Forecasting Systems
* Profession Ecosystem Analytics

The Marketplace must always preserve:

```text id="mp010"
Marketplace Owns Workforce.

Companies Own Work.

Humans Own Authority.
```

---

# Open Questions

## Profession Governance

What human oversight should exist for profession evolution?

---

## Workforce Retirement

What exact thresholds should trigger retirement reviews?

---

## Profession Creation

What exact thresholds should trigger new profession creation?

---

## Population Caps

How should profession population targets evolve over time?
