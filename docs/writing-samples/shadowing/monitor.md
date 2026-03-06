---
sidebar_position: 4
title: Monitor Shadowing
description: Monitor Shadowing health with status commands, metrics, and best practices for tracking replication performance.
---

:::info Writing Sample
This page was originally published to [Redpanda's documentation](https://docs.redpanda.com/current/manage/disaster-recovery/shadowing/monitor/) and is reproduced here as a portfolio writing sample.
:::

# Monitor Shadowing

:::note
This feature requires an enterprise license.
:::

Monitor your [shadow links](./setup) to ensure proper replication performance and understand your disaster recovery readiness. Use `rpk` commands, metrics, and status information to track shadow link health and troubleshoot issues.

:::danger Experiencing an active disaster?
See [Failover Runbook](./failover-runbook) for immediate step-by-step disaster procedures.
:::

## Status commands

To list existing shadow links:

```bash
rpk shadow list
```

To view shadow link configuration details:

```bash
rpk shadow describe <shadow-link-name>
```

This command shows the complete configuration of the shadow link, including connection settings, filters, and synchronization options.

To check your shadow link status and ensure proper operation:

```bash
rpk shadow status <shadow-link-name>
```

The status output includes:

- **Shadow link state**: Overall operational state (`ACTIVE`, `PAUSED`).
- **Individual topic states**: Current state of each replicated topic (`ACTIVE`, `FAULTED`, `FAILING_OVER`, `FAILED_OVER`, `PAUSED`).
- **Task status**: Health of replication tasks across brokers (`ACTIVE`, `FAULTED`, `NOT_RUNNING`, `LINK_UNAVAILABLE`). For details about shadow link tasks, see [Shadow link tasks](./overview#shadow-link-tasks).
- **Lag information**: Replication lag per partition showing source vs shadow high watermarks (HWM).

## Metrics

Shadowing provides comprehensive metrics to track replication performance and health via the `public_metrics` endpoint.

| Metric | Type | Description |
|---|---|---|
| `redpanda_shadow_link_shadow_lag` | Gauge | Lag of the shadow partition against the source partition, calculated as source LSO minus shadow HWM. Monitor by `shadow_link_name`, `topic`, and `partition`. |
| `redpanda_shadow_link_total_bytes_fetched` | Count | Total bytes fetched by a sharded replicator (bytes received by the client). Labeled by `shadow_link_name` and `shard`. |
| `redpanda_shadow_link_total_bytes_written` | Count | Total bytes written by a sharded replicator (bytes written to the write_at_offset_stm). Labeled by `shadow_link_name` and `shard`. |
| `redpanda_shadow_link_client_errors` | Count | Number of errors seen by the client. Track by `shadow_link_name` and `shard` to identify connection or protocol issues. |
| `redpanda_shadow_link_shadow_topic_state` | Gauge | Number of shadow topics in each state. Labeled by `shadow_link_name` and `state`. |
| `redpanda_shadow_link_total_records_fetched` | Count | Total records fetched by the sharded replicator. Monitor by `shadow_link_name` and `shard` to track message throughput from the source. |
| `redpanda_shadow_link_total_records_written` | Count | Total records written by a sharded replicator. Labeled by `shadow_link_name` and `shard`. |

## Monitoring best practices

### Health check procedures

Establish regular monitoring workflows to ensure shadow link health:

```bash
# Check all shadow links are active
rpk shadow list | grep -v "ACTIVE" || echo "All shadow links healthy"

# Monitor lag for critical topics
rpk shadow status <shadow-link-name> | grep -E "LAG|Lag"
```

### Alert conditions

Configure monitoring alerts for the following conditions, which indicate problems with Shadowing:

- **High replication lag**: When `redpanda_shadow_link_shadow_lag` exceeds your RPO requirements
- **Connection errors**: When `redpanda_shadow_link_client_errors` increases rapidly
- **Topic state changes**: When topics move to `FAULTED` state
- **Task failures**: When replication tasks enter `FAULTED` or `NOT_RUNNING` states
- **Throughput drops**: When bytes/records fetched drops significantly
- **Link unavailability**: When tasks show `LINK_UNAVAILABLE`, indicating source cluster connectivity issues

For more information about shadow link tasks and their states, see [Shadow link tasks](./overview#shadow-link-tasks).
