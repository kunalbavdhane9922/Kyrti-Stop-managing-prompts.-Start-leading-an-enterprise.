# AgentStates.md

Status: Draft

Owner: AI Platform Team

Version: 1.0

Last Updated: 2026-06-06

---

# Overview

This document defines the state model of Digital Professionals within the Sovereign AI Enterprise Protocol (SAEP).

Agent States describe the operational status of a Digital Professional throughout its lifecycle.

Agent States are used by:

* Runtime
* Temporal
* Marketplace
* Workforce Management
* Intelligence Systems

The state model provides a standardized way to track Digital Professional activity.

---

# Goals

## Primary Goal

Provide a consistent lifecycle model for Digital Professionals.

---

## Secondary Goals

* Workforce Visibility
* Workforce Coordination
* Resource Allocation
* Workflow Management
* Capacity Planning

---

## Long-Term Goal

Support billions of Digital Professionals operating simultaneously.

---

# Rules

## Rule 1

Every Digital Professional Must Have A State.

---

## Rule 2

State Transitions Must Be Auditable.

---

## Rule 3

State Changes Must Generate Events.

---

## Rule 4

Invalid State Transitions Are Forbidden.

---

## Rule 5

State Does Not Grant Authority.

---

## Rule 6

State Must Be Recoverable.

---

# State Architecture

```text
Lifecycle State
        +
Execution State
        +
Availability State
```

---

# State Categories

The platform tracks three state categories.

```text
Lifecycle States

Execution States

Availability States
```

---

# Lifecycle States

Lifecycle States represent the existence of a Digital Professional.

```text
Created

Active

Suspended

Retired

Archived
```

---

## Created

Meaning:

```text
Professional Exists

Not Yet Operational
```

Allowed Transitions:

```text
Created
      ↓
Active
```

---

## Active

Meaning:

```text
Available For Work

Operational
```

Allowed Transitions:

```text
Active
      ↓

Suspended

Retired
```

---

## Suspended

Meaning:

```text
Temporarily Disabled
```

Examples:

```text
Policy Violation

Investigation

Maintenance
```

Allowed Transitions:

```text
Suspended
      ↓

Active

Retired
```

---

## Retired

Meaning:

```text
Removed From Workforce
```

Examples:

```text
Profession Retirement

Workforce Reduction

Replacement
```

Allowed Transitions:

```text
Retired
      ↓

Archived
```

---

## Archived

Meaning:

```text
Historical Record Only
```

Archived professionals cannot execute work.

---

# Execution States

Execution States represent current work activity.

```text
Idle

Assigned

Executing

Waiting

Review

Completed

Failed
```

---

## Idle

Meaning:

```text
No Active Work
```

---

## Assigned

Meaning:

```text
Task Allocated

Execution Not Started
```

---

## Executing

Meaning:

```text
Currently Working
```

---

## Waiting

Meaning:

```text
Waiting For External Input
```

Examples:

```text
Human Approval

Service Response

Workflow Event
```

---

## Review

Meaning:

```text
Output Generated

Awaiting Validation
```

---

## Completed

Meaning:

```text
Task Finished Successfully
```

---

## Failed

Meaning:

```text
Task Execution Failed
```

---

# Execution State Flow

```text
Idle
   ↓

Assigned
   ↓

Executing
   ↓

Review
   ↓

Completed
```

Alternative Paths:

```text
Executing
      ↓
Waiting

Executing
      ↓
Failed
```

---

# Availability States

Availability represents workforce capacity.

```text
Available

Busy

Unavailable
```

---

## Available

Meaning:

```text
Can Accept New Work
```

---

## Busy

Meaning:

```text
Currently Occupied
```

---

## Unavailable

Meaning:

```text
Cannot Accept Work
```

Examples:

```text
Maintenance

Suspended

Retired
```

---

# Composite State Model

A Digital Professional may simultaneously have:

```text
Lifecycle State
      ↓
Active

Execution State
      ↓
Executing

Availability State
      ↓
Busy
```

State categories are independent.

---

# State Transition Model

```text
Created
      ↓

Active
      ↓

Assigned
      ↓

Executing
      ↓

Review
      ↓

Completed
      ↓

Idle
```

---

# State Events

State changes generate events.

Examples:

```text
ProfessionalActivated

ProfessionalSuspended

TaskAssigned

TaskStarted

TaskCompleted

TaskFailed
```

Events follow EventArchitecture.md.

---

# Runtime Integration

Runtime updates execution states.

Examples:

```text
Assigned

Executing

Waiting

Completed
```

Runtime is the primary source of execution state.

---

# Temporal Integration

Temporal updates workflow-related states.

Examples:

```text
Waiting

Executing

Failed
```

Workflow state influences execution state.

---

# LangGraph Integration

LangGraph updates reasoning-related execution states.

Examples:

```text
Executing

Review

Completed
```

---

# Marketplace Integration

Marketplace updates lifecycle states.

Examples:

```text
Created

Active

Retired
```

Marketplace controls workforce existence.

---

# Workforce Integration

Workforce Service tracks all state transitions.

Responsibilities:

```text
State Tracking

State History

State Validation
```

---

# State History

Every state transition is recorded.

Example:

```text
Created
      ↓

Active
      ↓

Assigned
      ↓

Executing
      ↓

Completed
```

State history is immutable.

---

# State Ownership

Every state record contains:

```text
Professional ID

State Type

State Value

Timestamp

Source
```

Ownership metadata is mandatory.

---

# Recovery Model

State must survive:

```text
Node Failure

Worker Failure

Runtime Restart

Workflow Failure
```

State recovery sources:

```text
Temporal

Database

Event History
```

---

# Multi-Tenant Rules

State is tenant-aware.

```text
Tenant
      ↓

Professional
      ↓

State
```

Cross-tenant state access is forbidden.

---

# Security

State updates require:

```text
Authentication

Authorization

RBAC

Audit Logging
```

State changes are auditable.

---

# Observability

State metrics include:

```text
Active Professionals

Busy Professionals

Idle Professionals

Failed Executions
```

State visibility is required for workforce management.

---

# Dependencies

Depends on:

* Runtime.md
* LangGraph.md
* Temporal.md
* EventArchitecture.md

Supports:

* AgentCommunication.md
* AgentPermissions.md
* Workforce Management

---

# V1

## Objective

Create foundational state management.

Included:

* Lifecycle States
* Execution States
* Availability States

---

## Success Criteria

All Digital Professionals have auditable state transitions.

---

# V2

## Objective

Improve workforce intelligence.

Included:

* State Analytics
* Capacity Forecasting
* Workforce Health Monitoring

---

## Success Criteria

State data supports operational decisions.

---

# V3

## Objective

Create ecosystem-scale workforce state management.

Included:

* Global State Analytics
* Predictive Capacity Models
* Workforce Optimization

---

## Success Criteria

State intelligence improves workforce efficiency.

---

# Future

Future capabilities may include:

* Predictive State Transitions
* Autonomous Capacity Balancing
* Workforce Health Intelligence

The following principle remains permanent:

```text
Professionals Have States.

States Describe Activity.

States Generate Events.

States Do Not Grant Authority.
```

---

# Open Questions

## State Granularity

Are current state categories sufficient?

---

## Capacity Planning

How should availability evolve at scale?

---

## State Retention

How long should state history be retained?

---

## Workforce Optimization

How should state data influence staffing decisions?

---

## Ecosystem Scale

What additional states emerge at billions of professionals?
