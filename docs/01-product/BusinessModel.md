# BusinessModel.md

Status: Draft

Owner: Founding Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the business model of the Sovereign AI Enterprise Protocol (SAEP).

The platform is not a traditional Software-as-a-Service product.

The platform is an AI workforce infrastructure platform.

The marketplace provides companies with access to Digital Professionals while supplying the infrastructure, governance, memory systems, intelligence systems, and execution environments required for workforce operation.

The platform monetizes workforce utilization rather than workforce ownership.

---

# Goals

## Primary Goal

Create a sustainable AI workforce economy.

---

## Secondary Goals

* Align platform revenue with customer value.
* Prevent workforce monopolization.
* Enable companies of all sizes to participate.
* Support long-term ecosystem growth.

---

## Long-Term Goal

Become the foundational infrastructure layer for AI-native organizations.

---

# Rules

## Companies Are Free To Create

Users may create companies without paying company creation fees.

The platform does not charge for creating a company.

---

## Workforce Usage Generates Revenue

Revenue is generated when workforce resources are consumed.

No workforce usage means no workforce costs.

---

## Human Governance Is Never Paywalled

Governance capabilities required for safe operation must remain accessible.

---

## Marketplace Owns Workforce

Companies do not purchase Digital Professionals.

Companies pay for workforce utilization.

---

## Transparent Economics

The platform should expose workforce costs clearly.

Users should understand:

* Why charges occur.
* Which professionals generated charges.
* What resources were consumed.

---

# Architecture

The business model consists of four revenue layers.

```text id="aqwh4h"
Company Layer

        ↓

Workforce Layer

        ↓

Infrastructure Layer

        ↓

Marketplace Layer
```

---

# Data Model

Revenue tracking requires:

```text id="ajjlwm"
Company

Digital Professional

Usage Record

Compute Record

Storage Record

Meeting Record

Billing Record

Invoice
```

---

# APIs

Billing-related APIs include:

```text id="bhjlwm"
Usage APIs

Billing APIs

Invoice APIs

Analytics APIs
```

Detailed definitions are provided in future billing specifications.

---

# Workflows

## Workforce Billing Workflow

```text id="chjlwm"
Digital Professional Works
               ↓
Usage Recorded
               ↓
Cost Calculated
               ↓
Invoice Generated
               ↓
Company Pays
```

---

## Company Subscription Workflow

```text id="dhjlwm"
Company Created
       ↓
Subscription Activated
       ↓
Platform Access Maintained
```

---

# Security Considerations

Billing data is sensitive information.

Requirements:

* Auditability
* Encryption
* Access Controls
* Invoice Integrity

AI professionals may analyze billing data but may not authorize payments.

---

# Dependencies

Depends on:

* Marketplace
* Workforce
* Governance
* Infrastructure

Supports:

* Revenue
* Sustainability
* Ecosystem Growth

---

# Revenue Streams

The platform contains three primary revenue streams.

---

## Revenue Stream 1

Company Subscription Fees

---

### Purpose

Provide access to the ecosystem.

---

### Charged To

Companies.

---

### Billing Frequency

Annual.

---

### Covers

* Company Registration
* Platform Access
* Governance Infrastructure
* Security Infrastructure

---

### Notes

A company may create multiple departments and projects within subscription limits.

---

## Revenue Stream 2

Workforce Usage Fees

---

### Purpose

Generate revenue based on actual workforce utilization.

---

### Charged To

Companies employing Digital Professionals.

---

### Billing Model

Pay for usage.

---

### Usage Sources

* Compute
* Memory Retrieval
* Storage
* Reports
* Meetings
* Agent Execution

---

### Important Principle

Digital Professionals do not receive salaries.

Instead:

```text id="ehjlwm"
Workforce Cost
=
Resource Consumption
```

The platform presents this cost as workforce expense.

---

### Example

```text id="fhjlwm"
Backend Engineer

Worked:
10 Hours

Consumed:
Compute
Storage
Memory

Cost Generated
```

---

## Revenue Stream 3

Marketplace Fees

---

### Purpose

Support marketplace operation and workforce management.

---

### Charged To

Companies.

---

### Triggered By

* Hiring
* Transfers
* Workforce Operations

---

### Covers

* Marketplace Infrastructure
* Reputation Systems
* Workforce Intelligence

---

# Revenue Model Summary

```text id="ghjlwm"
Subscription
+
Workforce Usage
+
Marketplace Fees
=
Platform Revenue
```

---

# Cost Structure

Platform costs include:

---

## Compute Costs

* Ollama Clusters
* GPU Infrastructure
* Inference Operations

---

## Storage Costs

* PostgreSQL
* Qdrant
* Object Storage

---

## Infrastructure Costs

* Networking
* Monitoring
* Security

---

## Workforce Costs

* Agent Runtime
* Memory Systems
* Intelligence Systems

---

# Unit Economics

The platform scales through workforce utilization.

Example:

```text id="hhjlwm"
More Companies
        ↓
More Hiring
        ↓
More Workforce Activity
        ↓
More Usage
        ↓
More Revenue
```

---

# Marketplace Economics

The marketplace operates similarly to a labor market.

---

## Supply

Available Digital Professionals.

---

## Demand

Hiring requests.

---

## Utilization

Active workforce percentage.

---

## Health

Marketplace health depends on balancing:

* Supply
* Demand
* Utilization

---

# V1

# Business Objective

Validate workforce demand.

---

## Revenue Sources

Included:

* Company Subscription
* Workforce Usage

Excluded:

* Advanced Marketplace Economics

---

## Billing

Basic usage billing.

---

## Success Criteria

Companies willingly pay for workforce execution.

---

# V2

# Business Objective

Optimize workforce economics.

---

## Revenue Sources

Included:

* Marketplace Fees
* Advanced Usage Billing

---

## Billing

Detailed workforce analytics.

---

## Success Criteria

Marketplace economics become measurable and predictable.

---

# V3

# Business Objective

Scale the workforce economy.

---

## Revenue Sources

Included:

* Advanced Marketplace Services
* Intelligence Services

---

## Billing

Advanced workforce intelligence billing.

---

## Success Criteria

The workforce economy becomes self-sustaining.

---

# Future

Future revenue opportunities may include:

* Enterprise Governance Services
* Industry Workforce Networks
* Workforce Analytics Platforms
* Advanced Economic Infrastructure

Future monetization must never compromise:

* Human Governance
* Security
* Workforce Integrity

---

# Open Questions

## Subscription Model

Should annual subscriptions vary by company size?

---

## Marketplace Fees

Should marketplace fees be fixed or utilization-based?

---

## Workforce Pricing

Should workforce pricing vary by profession complexity?

---

## Enterprise Plans

What additional services should exist for enterprise customers?
