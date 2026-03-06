---
sidebar_position: 2
title: Shadowing Overview
description: Learn about disaster recovery using Shadowing for cross-region replication.
---

:::info Writing Sample
This page was originally published to [Redpanda's documentation](https://docs.redpanda.com/current/manage/disaster-recovery/shadowing/overview/) and is reproduced here as a portfolio writing sample.
:::

# Shadowing Overview

:::note
This feature requires an enterprise license.
:::

Shadowing is Redpanda's enterprise-grade disaster recovery solution that establishes asynchronous, offset-preserving replication between two distinct Redpanda clusters. A cluster is able to create a dedicated client that continuously replicates source cluster data, including offsets, timestamps, and cluster metadata. This creates a read-only shadow cluster that you can quickly failover to handle production traffic during a disaster. Shadowing keeps data flowing, even during regional outages.

:::danger Experiencing an active disaster?
See [Failover Runbook](./failover-runbook) for immediate step-by-step disaster procedures.
:::

Unlike traditional replication tools that re-produce messages, Shadowing copies data at the byte level, ensuring shadow topics contain identical copies of source topics with preserved offsets and timestamps.

Shadowing replicates:

- **Topic data**: All records with preserved offsets and timestamps
- **Topic configurations**: Partition counts, retention policies, and other topic properties
- **Consumer group offsets**: Enables seamless consumer resumption after failover
- **Access control lists (ACLs)**: User permissions and security policies
- **Schema Registry data**: Schema definitions and compatibility settings

## How Shadowing fits into disaster recovery

Shadowing addresses enterprise disaster recovery requirements driven by regulatory compliance and business continuity needs. Organizations typically want to minimize both recovery time objective (RTO) and recovery point objective (RPO), and Shadowing's asynchronous replication helps you achieve both goals by reducing data loss during regional outages and enabling rapid application recovery.

The architecture follows an active-passive pattern. The source cluster processes all production traffic while the shadow cluster remains in read-only mode, continuously receiving updates. If a disaster occurs, you can failover the shadow topics, making them fully writable. At that point, you can redirect your applications to the shadow cluster, which becomes the new production cluster.

:::note
To avoid a split-brain scenario after failover, ensure that all clients are reconfigured to point to the shadow cluster before resuming write activity.
:::

Shadowing complements Redpanda's existing availability and recovery capabilities. High availability actively protects your day-to-day operations, handling reads and writes seamlessly during node or availability zone failures within a region. Shadowing is your safety net for catastrophic regional disasters. While Whole Cluster Restore provides point-in-time recovery from Tiered Storage, Shadowing delivers near real-time, cross-region replication for mission-critical applications that require rapid failover with minimal data loss.

## Limitations

Shadowing for disaster recovery currently has the following limitations:

- Shadowing is designed for active-passive disaster recovery scenarios. Each shadow cluster can maintain only one shadow link.
- Shadowing operates exclusively in asynchronous mode and doesn't support active-active configurations. This means there will always be some replication lag.
- Data transforms are not supported on shadow clusters while Shadowing is active. Writing to shadow topics is blocked.
- During a disaster, audit log history from the source cluster is lost, though the shadow cluster begins generating new audit logs immediately after the failover.
- After you failover shadow topics, automatic fallback to the original source cluster is not supported.

## Shadow link tasks

Shadow linking operates through specialized tasks that handle different aspects of replication. If you use a `shadow-config.yaml` configuration file to create the shadow link, each task corresponds to a section in the file. Tasks run continuously to maintain synchronization with the source cluster.

### Source Topic Sync

The **Source Topic Sync task** manages topic discovery and metadata synchronization. This task periodically queries the source cluster to discover available topics, applies your configured topic filters to determine which topics should become shadow topics, and synchronizes topic properties between clusters.

The task is controlled by the `topic_metadata_sync_options` section in the configuration file. It includes:

- **Auto-creation filters**: Determines which source topics automatically become shadow topics
- **Property synchronization**: Controls which topic properties replicate from source to shadow
- **Starting offset**: Sets where new shadow topics begin replication (earliest, latest, or timestamp-based)
- **Sync interval**: How frequently to check for new topics and property changes

When this task discovers a new topic that matches your filters, it creates the corresponding shadow topic and begins replication from your configured starting offset.

### Consumer Group Shadowing

The **Consumer Group Shadowing task** replicates consumer group offsets and membership information from the source cluster. This ensures that consumer applications can resume processing from the correct position after failover.

The task is controlled by the `consumer_offset_sync_options` section in the configuration file. It includes:

- **Group filters**: Determines which consumer groups have their offsets replicated
- **Sync interval**: How frequently to synchronize consumer group offsets
- **Offset clamping**: Automatically adjusts replicated offsets to valid ranges on the shadow cluster

This task runs on brokers that host the `__consumer_offsets` topic and continuously tracks consumer group coordinators to optimize offset synchronization.

### Security Migrator

The **Security Migrator task** replicates security policies, primarily ACLs (access control lists), from the source cluster to maintain consistent authorization across both environments.

The task is controlled by the `security_sync_options` section in the configuration file. It includes:

- **ACL filters**: Determines which security policies replicate
- **Sync interval**: How frequently to synchronize security settings

By default, all ACLs replicate to ensure your shadow cluster maintains the same security posture as your source cluster.

### Task status and monitoring

Each task reports its status through the shadow link status API. Task states include:

- **`ACTIVE`**: Task is running normally and performing synchronization
- **`PAUSED`**: Task has been manually paused through configuration
- **`FAULTED`**: Task encountered an error and requires attention
- **`NOT_RUNNING`**: Task is not currently executing
- **`LINK_UNAVAILABLE`**: Task cannot communicate with the source cluster

You can pause individual tasks by setting the `paused` field to `true` in the corresponding configuration section. This allows you to selectively disable parts of the replication process without affecting the entire shadow link.

For monitoring task health and troubleshooting task issues, see [Monitor Shadowing](./monitor).

## What gets replicated

Shadowing replicates your topic data with complete fidelity, preserving all message records with their original offsets, timestamps, headers, and metadata. The partition structure remains identical between source and shadow clusters, ensuring applications can resume processing from the exact same position after failover.

Consumer group data flows according to your group filters, replicating offsets and membership information for matched groups. ACLs replicate based on your security filters. Schema Registry data synchronizes schema definitions, versions, and compatibility settings.

Partition count is always replicated to ensure the shadow topic matches the source topic's partition structure.

### Topic properties replication

The [Source Topic Sync task](#source-topic-sync) handles topic property replication. For topic properties, Redpanda follows these replication rules:

**Never replicated**

- `redpanda.remote.readreplica`
- `redpanda.remote.recovery`
- `redpanda.remote.allowgaps`
- `redpanda.virtual.cluster.id`
- `redpanda.leaders.preference`
- `redpanda.cloud_topic.enabled`

**Always replicated**

- `max.message.bytes`
- `cleanup.policy`
- `message.timestamp.type`

**Always replicated (unless `exclude_default` is `true`)**

- `compression.type`
- `retention.bytes`
- `retention.ms`
- `delete.retention.ms`
- `replication.factor`
- `min.compaction.lag.ms`
- `max.compaction.lag.ms`

To replicate additional topic properties, explicitly list them in `synced_shadow_topic_properties`.

The filtering system you configure determines the precise scope of replication across all components, allowing you to balance comprehensive disaster recovery with operational efficiency.

## Best practices

To ensure reliable disaster recovery with Shadowing:

- **Avoid write caching on source topics**: Do not shadow source topics that have write caching enabled. Write caching can result in data loss on the source cluster during broker resets, causing cluster divergence if shadow links replicate data before it's lost on the source.
- **Do not modify shadow topic properties**: Avoid modifying synced topic properties on shadow topics, as these properties automatically revert to source topic values.

## Implementation overview

Choose your implementation approach:

- **[Setup and Configuration](./setup)**: Initial shadow configuration, authentication, and topic selection
- **[Monitoring and Operations](./monitor)**: Health checks, lag monitoring, and operational procedures
- **[Planned Failover](./failover)**: Controlled disaster recovery testing and migrations
- **[Failover Runbook](./failover-runbook)**: Rapid disaster response procedures

:::tip
You can create and manage shadow links with Redpanda Console, the Admin API v2, or `rpk`, giving you flexibility in how you interact with your disaster recovery infrastructure.
:::

## Next steps

After setting up Shadowing for your Redpanda clusters, consider these additional steps:

- **Test your disaster recovery procedures**: Regularly practice failover scenarios in a non-production environment. See [Failover Runbook](./failover-runbook) for step-by-step disaster procedures.
- **Monitor shadow link health**: Set up alerting on the metrics described above to ensure early detection of replication issues.
- **Implement automated failover**: Consider developing automation scripts that can detect outages and initiate failover based on predefined criteria.
- **Review security policies**: Ensure your ACL filters replicate the appropriate security settings for your disaster recovery environment.
- **Document your configuration**: Maintain up-to-date documentation of your shadow link configuration, including network settings, authentication details, and filter definitions.
