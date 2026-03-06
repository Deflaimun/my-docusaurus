---
sidebar_position: 1
title: "Case Study: Redpanda Shadowing (Disaster Recovery)"
description: How I authored end-to-end disaster recovery documentation for Redpanda's Shadowing feature.
---

# Case Study: Redpanda Shadowing

**Project**: Disaster Recovery Documentation
**Company**: Redpanda
**Year**: 2025–2026
**Role**: Technical Writer / Documentation Engineer

---

## What is Shadowing?

Shadowing is Redpanda's enterprise-grade disaster recovery feature. It establishes asynchronous, offset-preserving replication between two geographically separated Redpanda clusters. During a regional outage, operators can failover shadow topics — converting read-only replicas into fully writable production clusters — in minutes rather than hours.

The feature was new in Redpanda v25.3 and targeted enterprise customers with strict RTO/RPO requirements in regulated industries.

## My Role

I authored **95% of this documentation set independently**, including:

- Participating in **engineering design reviews** and **product requirement discussions** before the feature was fully built
- Co-reviewing **PRDs and RFCs** to ensure documentation requirements were captured early
- Writing the complete user-facing documentation: overview, setup, monitoring, planned failover, and emergency runbook
- Designing the **information architecture** — deciding how to structure five interconnected pages across cloud and self-managed deployment models
- Coordinating with PMs, SMEs, and the engineering team to validate technical accuracy
- Designing the **Antora single-source architecture** using tagged regions and conditional blocks to serve cloud and self-managed audiences from shared source files

## Challenges

**Dual audience complexity**: Shadowing behaves differently on Redpanda Cloud (BYOC/Dedicated) versus self-managed clusters. Both audiences read the same documentation site, so every procedure needed conditional branching via Antora `ifdef` directives — cloud users see the Cloud UI and API, self-managed users see `rpk` and Admin API.

**Pre-GA authoring**: I began writing before the feature was fully implemented. This required close collaboration with engineering to validate command outputs, API shapes, and behavior — and meant iterating the documentation as the feature changed.

**Emergency procedure writing**: The failover runbook is high-stakes content that operators read under active disaster conditions. Getting the decision points, command sequence, and troubleshooting logic right required multiple engineering reviews and war-gaming scenarios.

**Enterprise scope**: The feature touches Kafka replication, consumer group offset synchronization, ACL migration, Schema Registry, TLS/SASL authentication, and firewall configuration — all of which needed to be documented clearly for a technically sophisticated audience.

## Approach & Decisions

**Information architecture**: I structured the content as five pages with increasing specificity: overview (concepts), setup (configuration), monitor (operations), failover (planned), and runbook (emergency). This lets operators dive directly to the relevant page based on their situation.

**Active-voice, task-oriented writing**: Each page opens with a clear statement of what you'll accomplish, followed by prerequisites, then step-by-step procedures. This reduces cognitive load during operational tasks.

**Single-sourcing**: I designed the Antora source structure so cloud and self-managed content shares maximum prose while branching only where behavior differs. This reduced maintenance overhead and ensured consistency between audiences.

**Decision tree in the runbook**: I added an explicit "Examples that require failover / Examples that may NOT require failover" section to the emergency runbook. Engineers had not included this — I identified during review that operators under stress would benefit from explicit decision guidance before initiating an irreversible action.

## Outcome

The documentation shipped with Redpanda v25.3 and covers:

- Full configuration reference with an annotated YAML reference
- Monitoring metrics table with descriptions for all 7 Shadowing-specific metrics
- Step-by-step procedures across three interfaces (Console UI, `rpk`, REST API)
- Emergency failover runbook with troubleshooting for 4 common failure modes

## Read the Full Documentation

- [Shadowing Overview](../writing-samples/shadowing/overview) — Architecture, replication model, and shadow link tasks
- [Configure Shadowing](../writing-samples/shadowing/setup) — Prerequisites, shadow link creation, filtering, networking
- [Monitor Shadowing](../writing-samples/shadowing/monitor) — Status commands and metrics reference
- [Failover](../writing-samples/shadowing/failover) — Planned failover procedures and states
- [Failover Runbook](../writing-samples/shadowing/failover-runbook) — Emergency step-by-step disaster procedures
