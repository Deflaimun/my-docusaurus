---
sidebar_position: 1
title: Shadowing — Disaster Recovery
---

:::info Writing Sample
This page was originally published to [Redpanda's documentation](https://docs.redpanda.com/current/manage/disaster-recovery/shadowing/overview/) and is reproduced here as a portfolio writing sample.
:::

# Shadowing — Disaster Recovery

Redpanda's **Shadowing** feature enables enterprise-grade disaster recovery through asynchronous, offset-preserving cross-region replication between Redpanda clusters.

This documentation set covers the full lifecycle of Shadowing — from initial setup through emergency failover procedures.

## In this section

- **[Overview](./overview)** — Architecture, replication model, shadow link tasks, and best practices
- **[Configure Shadowing](./setup)** — Prerequisites, shadow link creation, filtering, networking, and authentication
- **[Monitor Shadowing](./monitor)** — Status commands, metrics reference, and health check procedures
- **[Failover](./failover)** — Planned failover procedures, failover states, and post-failover behavior
- **[Failover Runbook](./failover-runbook)** — Emergency step-by-step guide for active disaster scenarios

## About this documentation

These pages demonstrate documentation written for a technically complex enterprise feature. Key authoring challenges included:

- **Dual audience**: Content had to serve both cloud-managed (BYOC/Dedicated) and self-managed deployment models, with conditional content for each
- **Cross-functional source material**: Working directly from engineering design reviews, PRDs, and RFCs to produce user-facing guides
- **Reuse architecture**: Designing partials and tagged regions for single-sourcing across multiple Antora modules
- **Emergency procedures**: Writing high-stakes runbook content with clear decision trees and verified command examples
