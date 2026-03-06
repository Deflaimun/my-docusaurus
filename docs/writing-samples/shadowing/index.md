---
sidebar_position: 1
title: Shadowing — Disaster Recovery
---

:::info Writing Sample
This documentation was originally published to [Redpanda's documentation](https://docs.redpanda.com/current/manage/disaster-recovery/shadowing/) and is reproduced here as a portfolio writing sample.
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

