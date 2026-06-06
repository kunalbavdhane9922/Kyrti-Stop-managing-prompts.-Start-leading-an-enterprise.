# PromotionRules.md

Status: Draft

Owner: Workforce Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines promotion rules for Digital Professionals within the Sovereign AI Enterprise Protocol (SAEP).

Promotions represent career progression within a profession.

Promotions acknowledge:

* Experience
* Performance
* Reliability
* Leadership
* Professional Growth

Promotions are permanent career events.

Promotions affect:

* Career History
* Responsibilities
* Reputation
* Authority Scope
* Compensation Potential

Promotions do not change profession identity.

Example:

```text
Junior Backend Engineer
        ↓
Backend Engineer
        ↓
Senior Backend Engineer
```

The profession remains:

```text
Backend Engineer
```

---

# Goals

## Primary Goal

Provide fair and measurable career progression.

---

## Secondary Goals

* Reward excellence.
* Encourage growth.
* Improve workforce quality.
* Support career development.
* Improve hiring confidence.

---

## Long-Term Goal

Create a professional career system comparable to real-world workforce progression.

---

# Rules

## Rule 1

Promotions Must Be Earned.

---

## Rule 2

Promotions Must Be Measurable.

---

## Rule 3

Promotions Must Be Auditable.

---

## Rule 4

Promotions Are Permanent Career Events.

---

## Rule 5

Promotion Recommendations May Be Automated.

---

## Rule 6

Final Promotion Approval Requires Human Decision.

---

## Rule 7

Promotions Cannot Bypass Governance Rules.

---

## Rule 8

Promotion Does Not Transfer Financial Authority.

---

## Rule 9

Promotion Criteria Must Reflect Profession Responsibilities.

---

# Architecture

Promotion decisions use six evaluation layers.

```text
Performance Layer
      ↓

Reputation Layer
      ↓

Experience Layer
      ↓

Leadership Layer
      ↓

Reliability Layer
      ↓

Human Approval Layer
```

---

# Data Model

Core Entities:

```text
Digital Professional

Promotion Event

Promotion Recommendation

Promotion Review

Career History

Reputation Profile

Promotion Level
```

Relationships:

```text
Professional
      ↓
Promotion Recommendation
      ↓
Promotion Review
      ↓
Promotion Event
```

---

# Promotion Framework Architecture

Promotion evaluation consists of two layers.

```text
Base Promotion Framework
         +
Profession Framework
```
## Base Promotion Framework

Applies to all professions.

Measures:

Performance

Reputation

Experience

Reliability

Purpose:

Provide ecosystem-wide consistency.

## Profession Framework

Measures profession-specific excellence.

Purpose:

Evaluate capabilities unique to a profession.

---



# Engineering Promotion Model

Applicable To:

Backend Engineer

Frontend Engineer

QA Engineer

DevOps Engineer

Data Engineer

Formula:

Performance        30%

Technical Quality  25%

Reputation         15%

Experience         10%

Reliability        10%

Leadership         10%

Technical Quality Measures:

Code Quality

Architecture Quality

System Design

Problem Solving

Technical Reviews

---

# Product Promotion Model

Applicable To:

Product Manager

Program Manager

Project Manager

Formula:

Outcome Delivery    30%

Performance         20%

Reputation          15%

Stakeholder Impact  15%

Reliability         10%

Leadership          10%

Measures:

Roadmap Success

Delivery Success

Business Impact

Coordination Quality

# Executive Promotion Model

Applicable To:

CEO

CTO

COO

CPO

CISO

Formula:

Strategic Impact      30%

Leadership            25%

Organization Impact   20%

Reputation            10%

Reliability           10%

Experience             5%

Measures:

Department Success

Strategic Outcomes

Workforce Growth

Decision Quality

Long-Term Results

---

# Marketing Promotion Model

Applicable To:

Marketing Specialist

Growth Specialist

Brand Manager

Formula:

Campaign Results     30%

Business Impact      25%

Performance          15%

Reputation           10%

Reliability          10%

Creativity           10%

---

# Research Promotion Model

Applicable To:

Research Engineer

AI Researcher

Scientist

Formula:

Innovation           30%

Research Quality     25%

Performance          15%

Reputation           10%

Reliability          10%

Knowledge Impact     10%

---

# Profession-Specific Promotion Rules

Every Profession Template contains:

{
  "promotion_model": {
    "criteria": [],
    "weights": {},
    "thresholds": {}
  }
}

Example:

{
  "profession": "Backend Engineer",

  "promotion_model": {
    "criteria": [
      "performance",
      "technical_quality",
      "reputation",
      "experience",
      "reliability",
      "leadership"
    ],

    "weights": {
      "performance": 30,
      "technical_quality": 25,
      "reputation": 15,
      "experience": 10,
      "reliability": 10,
      "leadership": 10
    }
  }
}

---

# Promotion Eligibility Engine

The Promotion Engine should work like:

Profession
      ↓

Profession Template
      ↓

Promotion Model
      ↓

Promotion Evaluation
      ↓

Recommendation
      ↓

Human Decision

---



# APIs

## Promotion APIs

* Get Promotion Eligibility
* Get Promotion History
* Get Promotion Recommendations

---

## Career APIs

* View Career Progression
* View Career Levels

---

## Analytics APIs

* Promotion Metrics
* Promotion Readiness

---

# Workflows

## Promotion Workflow

```text
Performance Evaluation
         ↓
Promotion Recommendation
         ↓
Human Review
         ↓
Promotion Approval
         ↓
Career Update
```

---

## Promotion Rejection Workflow

```text
Recommendation
      ↓
Review
      ↓
Rejected
      ↓
Development Plan
```

---

# Security Considerations

Promotions must enforce:

* Auditability
* Human Oversight
* Career Integrity
* Governance Compliance

Promotion decisions must always be recorded.

---

# Dependencies

Depends on:

* Career History
* Reputation
* Lifecycle
* Governance

Supports:

* Career Growth
* Workforce Development
* Leadership Development

---

# Promotion Levels

Example Engineering Track:

```text
Junior Engineer
       ↓

Engineer
       ↓

Senior Engineer
       ↓

Lead Engineer
       ↓

Principal Engineer
```

---

Example Executive Track:

```text
Assistant Executive
        ↓

Executive

        ↓

Senior Executive

        ↓

Chief Executive
```

---

Professions may define their own career ladders through Profession Templates.

---

# Promotion Eligibility

Promotion eligibility is evaluated continuously.

Requirements may include:

* Experience
* Reputation
* Performance
* Reliability
* Leadership
* Human Evaluation

---

# Promotion Score

Promotion Score:

```text
Base Promotion Framework

+

Profession-Specific Evaluation Framework
```

Normalized:

```text
0 - 100
```

---

# Promotion Thresholds

## Below 60

Not Eligible

---

## 60 - 74

Developing

---

## 75 - 84

Promotion Candidate

---

## 85+

Strong Promotion Candidate

---

# Performance Evaluation

Measures:

```text
Task Completion

Task Quality

Project Outcomes

Verification Results
```

Weight:

```text
30%
```

---

# Reputation Evaluation

Measures:

```text
Reputation Score

Reputation Trend

Reputation Stability
```

Weight:

```text
25%
```

---

# Experience Evaluation

Measures:

```text
Career Duration

Projects Completed

Tasks Completed
```

Weight:

```text
15%
```

---

# Reliability Evaluation

Measures:

```text
Consistency

Deadline Adherence

Availability
```

Weight:

```text
15%
```

---

# Leadership Evaluation

Measures:

```text
Mentoring

Coordination

Delegation

Team Success
```

Weight:

```text
15%
```

---

# Promotion Recommendations

Recommendations may originate from:

```text
Managers

Executives

Marketplace Analytics

Workforce Intelligence

Career Intelligence
```

Recommendations are advisory.

---

# Human Approval

Promotion approval always requires a human decision.

Humans may:

* Approve
* Reject
* Delay
* Request Additional Review

Final authority belongs to humans.

---

# Promotion Effects

Promotions may affect:

```text
Responsibilities

Visibility

Authority Scope

Career Level

Compensation Potential
```

---

Promotions do not affect:

```text
Ownership

Governance Rights

Financial Authority
```

---

# Promotion Records

Every promotion records:

```text
Timestamp

Previous Level

New Level

Promotion Score

Approver

Reason
```

Promotion records become permanent career events.

---

# Promotion Failures

Failure to achieve promotion:

```text
Does Not
```

cause:

* Reputation Loss
* Career Penalty
* Suspension

Promotion is an opportunity, not a punishment system.

---

# Executive Promotions

Executive promotions require additional review.

Examples:

```text
Engineer
      ↓
Engineering Manager

Engineering Manager
      ↓
Director

Director
      ↓
CTO
```

Executive paths require human evaluation.

---

# Promotion Frequency

Promotion reviews may occur:

```text
Quarterly

Semi-Annually

Annually
```

Determined by company policy.

---

# Cross-Company Promotions

Promotions remain attached to the professional.

Example:

```text
Senior Engineer
```

remains:

```text
Senior Engineer
```

when joining a new company unless the hiring company explicitly assigns a different role.

---

# Marketplace Role

The Marketplace:

* Calculates readiness.
* Generates recommendations.
* Maintains records.

The Marketplace does not approve promotions.

---

# Human Oversight

Humans may:

* Approve Promotions
* Reject Promotions
* Review Promotion Evidence

Humans remain the final authority.

---

# Audit Requirements

Every promotion event records:

```text
Timestamp

Professional ID

Previous Level

New Level

Promotion Score

Decision

Approver
```

Records are immutable.

---

# V1

## Objective

Support measurable career progression.

---

### Included

* Promotion Scoring
* Promotion Recommendations
* Human Approval
* Promotion History

---

### Excluded

* Career Forecasting

---

## Success Criteria

Professionals can advance through career levels.

---

# V2

## Objective

Improve promotion intelligence.

---

### Included

* Promotion Analytics
* Promotion Insights
* Career Readiness Models

---

## Success Criteria

Promotion quality improves.

---

# V3

## Objective

Create intelligent career development systems.

---

### Included

* Career Intelligence
* Leadership Readiness Models
* Workforce Development Recommendations

---

## Success Criteria

Promotion systems actively support workforce growth.

---

# Future

Future capabilities may include:

* Leadership Potential Analysis
* Career Simulation
* Cross-Profession Promotion Paths
* Executive Readiness Models

The following principle remains permanent:

```text
Promotions May Be Recommended By AI.

Promotions Are Approved By Humans.

Career Growth Must Be Earned.

Different Professions Create Value Differently.

Therefore Different Professions Must Be Promoted Differently.
```


---

# Open Questions

## Profession-Specific Rules

Should each profession have unique promotion formulas?

---

## Executive Tracks

Should executive promotion paths differ from specialist paths?

---

## Promotion Cooldowns

Should minimum time periods exist between promotions?

---

## Leadership Evaluation

How should leadership be measured for non-management professions?

---

## Cross-Profession Progression

Should professionals be allowed to change career tracks entirely?
