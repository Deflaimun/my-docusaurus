---
sidebar_position: 3
title: Configure Shadowing
description: Set up Shadowing for disaster recovery, including cross-region replication, data filters, networking, and authentication.
---

:::info Writing Sample
This page was originally published to [Redpanda's documentation](https://docs.redpanda.com/current/manage/disaster-recovery/shadowing/setup/) and is reproduced here as a portfolio writing sample.
:::

# Configure Shadowing

You can create and manage shadow links with Redpanda Console, the Admin API v2, or `rpk`, giving you flexibility in how you interact with your disaster recovery infrastructure.

:::tip
Deploy clusters in different geographic regions to protect against regional disasters.
:::

## Prerequisites

:::note
This feature requires an enterprise license. Both clusters must have valid Enterprise Edition licenses.
:::

### License and cluster requirements

- Both clusters must be running Redpanda v25.3 or later.
- If you use Redpanda Console, ensure that it is running v3.30 or later.
- You must have Enterprise Edition licenses on both clusters.

### Cluster configuration

The shadow cluster must have the `enable_shadow_linking` cluster property set to `true`.

To enable this property, run:

```bash
rpk cluster config set enable_shadow_linking true
```

:::note
This cluster property must be configured using `rpk` or the Admin API v1 before you can create shadow links through any interface.
:::

### Administrative access

Superuser access is required on both clusters through `rpk`, the Admin API, or Redpanda Console to create and manage shadow links.

### Replication service permissions

You must configure a service account on the source cluster with the following ACL permissions for shadow link replication:

- **Topics**: `read` permission on all topics you want to replicate
- **Topic configurations**: `describe_configs` permission on topics for configuration synchronization
- **Consumer groups**: `describe` and `read` permission on consumer groups for offset replication
- **ACLs**: `describe` permission on ACL resources to replicate security policies
- **Cluster**: `describe` permission on the cluster resource to access ACLs

This service account authenticates from the shadow cluster to the source cluster and performs the actual data replication. The credentials for this account are provided when you set up the shadow link.

### Network and authentication

You must configure network connectivity between clusters with appropriate firewall rules to allow the shadow cluster to connect to the source cluster for data replication. Shadowing uses a pull-based architecture where the shadow cluster fetches data from the source cluster. For detailed networking configuration, see [Networking](#networking).

If using authentication for the shadow link connection, configure the source cluster with your chosen authentication method (SASL/SCRAM, SASL/PLAIN, TLS, mTLS) and ensure the shadow cluster has the proper credentials to authenticate to the source cluster.

## Set up Shadowing

To set up Shadowing, you need to create a shadow link and configure filters to select which topics, consumer groups, ACLs, and Schema Registry data to replicate.

### Create a shadow link

Any cluster can create a shadow link to a source cluster.

:::tip
You can use `rpk` to generate a sample configuration file with common filter patterns:

```bash
# Generate a sample configuration file with placeholder values
rpk shadow config generate -o shadow-config.yaml

# Or generate a template with detailed field documentation
rpk shadow config generate --print-template -o shadow-config-template.yaml
```

This creates a complete YAML configuration file that you can customize for your environment. The template includes all available fields with comments explaining their purpose.
:::

<details>
<summary>Explore the full configuration file</summary>

```yaml
# Sample ShadowLinkConfig YAML with all fields

name: <shadow-link-name>            # Unique name for this shadow link, example: "production-dr"

client_options:
  bootstrap_servers:                         # Source cluster brokers to connect to
  - <source-broker-1>:<port>                 # Example: "prod-kafka-1.example.com:9092"
  - <source-broker-2>:<port>                 # Example: "prod-kafka-2.example.com:9092"
  - <source-broker-3>:<port>                 # Example: "prod-kafka-3.example.com:9092"
  source_cluster_id: <cluster-id>            # Optional: UUID assigned by Redpanda
                                             # Example: a882bc98-7aca-40f6-a657-36a0b4daf1fd
  # To get source_cluster_id, run `rpk cluster config get cluster_id`.

  # TLS settings using file paths
  tls_settings:
    enabled: true                     # Enable TLS
    tls_file_settings:
      ca_path: <ca-cert-path>         # Path to CA certificate, example: "/etc/ssl/certs/ca.crt"
      key_path: <client-key-path>     # Optional: Path to client private key
      cert_path: <client-cert-path>   # Optional: Path to client certificate
    do_not_set_sni_hostname: false   # Optional: Skip SNI hostname when using TLS (default: false)

  authentication_configuration:
    # SASL/SCRAM authentication
    scram_configuration:
      username: <sasl-username>       # SASL/SCRAM username
      password: <sasl-password>       # SASL/SCRAM password
      scram_mechanism: SCRAM_SHA_256  # SCRAM mechanism: "SCRAM_SHA_256" or "SCRAM_SHA_512"
    # SASL/PLAIN authentication
    plain_configuration:
      username: <sasl-username>
      password: <sasl-password>

  # Connection tuning - adjust based on network characteristics
  metadata_max_age_ms: 10000          # How often to refresh cluster metadata (default: 10000ms)
  connection_timeout_ms: 1000         # Connection timeout (default: 1000ms, increase for high latency)
  retry_backoff_ms: 100               # Backoff between retries (default: 100ms)
  fetch_wait_max_ms: 500              # Max time to wait for fetch requests (default: 500ms)
  fetch_min_bytes: 5242880            # Min bytes per fetch (default: 5MB)
  fetch_max_bytes: 20971520           # Max bytes per fetch (default: 20MB)
  fetch_partition_max_bytes: 1048576  # Max bytes per partition fetch (default: 1MB)

topic_metadata_sync_options:
  interval: 30s                       # How often to sync topic metadata
  auto_create_shadow_topic_filters:   # Filters for automatic topic creation
  - pattern_type: LITERAL
    filter_type: INCLUDE
    name: '*'
  - pattern_type: PREFIX
    filter_type: EXCLUDE
    name: <topic-prefix-to-exclude>   # Examples: "temp-", "test-", "debug-"
  synced_shadow_topic_properties:
  - retention.ms
  - segment.ms
  exclude_default: false
  start_at_earliest: {}
  paused: false

consumer_offset_sync_options:
  interval: 30s
  paused: false
  group_filters:
  - pattern_type: LITERAL
    filter_type: INCLUDE
    name: '*'

security_sync_options:
  interval: 30s
  paused: false
  acl_filters:
  - resource_filter:
      resource_type: TOPIC
      pattern_type: PREFIXED
      name: <resource-pattern>
    access_filter:
      principal: User:<username>
      operation: ANY
      permission_type: ALLOW
      host: '*'

schema_registry_sync_options:
  shadow_schema_registry_topic: {}
```

</details>

To create a shadow link with the source cluster using `rpk`, run the following command from the shadow cluster:

```bash
# Use the generated configuration file to create the shadow link
rpk shadow create --config-file shadow-config.yaml
```

:::tip
Use `rpk profile` to save your cluster connection details and credentials for both source and shadow clusters. This allows you to easily switch between the two configurations.
:::

### Set filters

Filters determine which resources Shadowing automatically creates when establishing your shadow link.

Topic filters select which topics Shadowing automatically creates as shadow topics when they appear on the source cluster. After Shadowing creates a shadow topic, it continues replicating until you failover the topic, delete it, or delete the entire shadow link.

Consumer group and ACL filters control which groups and security policies replicate to maintain application functionality.

#### Filter types and patterns

Each filter uses two key settings:

- **Pattern type**: Determines how names are matched
  - `LITERAL`: Matches names exactly (including the special wildcard `*` to match all items)
  - `PREFIX`: Matches names that start with the specified string
- **Filter type**: Specifies whether to INCLUDE or EXCLUDE matching items
  - `INCLUDE`: Replicate items that match the pattern
  - `EXCLUDE`: Skip items that match the pattern

#### Filter processing rules

Redpanda processes filters in the order you define them with EXCLUDE filters taking precedence. Design your filter lists carefully:

1. **Exclude filters win**: If any EXCLUDE filter matches a resource, it is excluded regardless of INCLUDE filters.
2. **Order matters for INCLUDE filters**: Among INCLUDE filters, the first match determines the result.
3. **Default behavior**: Items that don't match any filter are excluded from replication.

#### Common filtering patterns

Replicate all topics except test topics:

```yaml
topic_metadata_sync_options:
  auto_create_shadow_topic_filters:
  - pattern_type: PREFIX
    filter_type: EXCLUDE
    name: test-                        # Exclude all test topics
  - pattern_type: LITERAL
    filter_type: INCLUDE
    name: '*'                          # Include all other topics
```

Replicate only production topics:

```yaml
topic_metadata_sync_options:
  auto_create_shadow_topic_filters:
  - pattern_type: PREFIX
    filter_type: INCLUDE
    name: prod-                        # Include production topics
  - pattern_type: PREFIX
    filter_type: INCLUDE
    name: production-                  # Alternative production prefix
```

Replicate specific consumer groups:

```yaml
consumer_offset_sync_options:
  group_filters:
  - pattern_type: LITERAL
    filter_type: INCLUDE
    name: critical-app-consumers       # Include specific consumer group
  - pattern_type: PREFIX
    filter_type: INCLUDE
    name: prod-consumer-               # Include production consumers
```

#### Schema Registry synchronization

Shadowing can replicate Schema Registry data by shadowing the `_schemas` system topic. When enabled, this provides byte-for-byte replication of schema definitions, versions, and compatibility settings.

To enable Schema Registry synchronization, add the following to your shadow link configuration:

```yaml
schema_registry_sync_options:
  shadow_schema_registry_topic: {}
```

Requirements:

- The `_schemas` topic must exist on the source cluster
- The `_schemas` topic must not exist on the shadow cluster, or must be empty
- Once enabled, the `_schemas` topic will be replicated completely

:::warning
After the `_schemas` topic becomes a shadow topic, it cannot be stopped without either failing over the topic or deleting it entirely.
:::

#### System topic filtering rules

Redpanda system topics have the following specific filtering restrictions:

- Literal filters for `__consumer_offsets` and `_redpanda.audit_log` are rejected.
- Prefix filters for topics starting with `_redpanda` or `__redpanda` are rejected.
- Wildcard `*` filters will not match topics that start with `_redpanda` or `__redpanda`.
- To shadow specific system topics, you must provide explicit literal filters for those individual topics.

#### ACL filtering

ACLs are replicated by the Security Migrator task. This is recommended to ensure that your shadow cluster has the same permissions as your source cluster. To configure ACL filters:

```yaml
security_sync_options:
  acl_filters:
  # Include read permissions for production topics
  - resource_filter:
      resource_type: TOPIC
      pattern_type: PREFIXED
      name: prod-
    access_filter:
      principal: User:app-user
      operation: READ
      permission_type: ALLOW
      host: '*'
  # Include consumer group permissions
  - resource_filter:
      resource_type: GROUP
      pattern_type: LITERAL
      name: '*'
    access_filter:
      principal: User:app-user
      operation: READ
      permission_type: ALLOW
      host: '*'
```

#### Consumer group filtering and behavior

Consumer group filters determine which consumer groups have their offsets replicated to the shadow cluster by the Consumer Group Shadowing task.

Offset replication operates selectively within each consumer group. Only committed offsets for active shadow topics are synchronized, even if the consumer group has offsets for additional topics that aren't being shadowed. For example, if consumer group "app-consumers" has committed offsets for "orders", "payments", and "inventory" topics, but only "orders" is an active shadow topic, then only the "orders" offsets will be replicated to the shadow cluster.

```yaml
consumer_offset_sync_options:
  interval: 30s
  paused: false
  group_filters:
  - pattern_type: PREFIX
    filter_type: INCLUDE
    name: prod-consumer-              # Include production consumer groups
  - pattern_type: LITERAL
    filter_type: EXCLUDE
    name: test-consumer-group         # Exclude specific test groups
```

##### Important consumer group considerations

**Avoid name conflicts:** If you plan to consume data from the shadow cluster, do not use the same consumer group names as those used on the source cluster. While this won't break shadow linking, it can impact your RPO/RTO because conflicting group names may interfere with offset replication and consumer resumption during disaster recovery.

**Offset clamping:** When Redpanda replicates consumer group offsets from the source cluster, offsets are automatically "clamped" during the commit process on the shadow cluster. If a committed offset from the source cluster is above the high watermark (HWM) of the corresponding shadow partition, Redpanda clamps the offset to the shadow partition's HWM before committing it to the shadow cluster. This ensures offsets remain valid and prevents consumers from seeking beyond available data on the shadow cluster.

#### Starting offset for new shadow topics

When the Source Topic Sync task creates a shadow topic for the first time, you can control where replication begins on the source topic. This setting only applies to empty shadow partitions and is crucial for disaster recovery planning. Changing this configuration only affects new shadow topics; existing shadow topics continue replicating from their current position.

```yaml
# Start from the beginning of the source topic (default)
topic_metadata_sync_options:
  start_at_earliest: {}
```

```yaml
# Start from the most recent offset
topic_metadata_sync_options:
  start_at_latest: {}
```

```yaml
# Start from a specific timestamp
topic_metadata_sync_options:
  start_at_timestamp: 2024-01-01T00:00:00Z
```

Starting offset options:

- **`earliest`** (default): Replicates all existing data from the source topic. Use this for complete disaster recovery where you need full data history.
- **`latest`**: Starts replication from the current end of the source topic, skipping existing data. Use this when you only need new data and want to minimize initial replication time.
- **`timestamp`**: Starts replication from the first record with a timestamp at or after the specified time. Use this for point-in-time disaster recovery scenarios.

:::danger
The starting offset only affects **new shadow topics**. After a shadow topic exists and has data, changing this setting has no effect on that topic's replication.
:::

### Networking {#networking}

Configure network connectivity between your source and shadow clusters to enable shadow link replication. The shadow cluster initiates connections to the source cluster using a pull-based architecture.

#### Connection requirements

- **Direction**: Shadow cluster connects to source cluster (outbound from shadow, inbound to source)
- **Protocol**: Kafka protocol over TCP (default port 9092, or your configured listener ports)
- **Persistence**: Connections remain active for continuous replication

#### Firewall configuration

You must configure firewall rules to allow the shadow cluster to reach the source cluster.

**On the source cluster network:**

- Allow inbound TCP connections on Kafka listener ports (typically 9092).
- Allow connections from the shadow cluster's IP addresses or subnets.

**On the shadow cluster network:**

- Allow outbound TCP connections to the source cluster's Kafka listener ports.
- Ensure DNS resolution works for source cluster hostnames.

#### Bootstrap servers

Specify multiple bootstrap servers in your shadow link configuration for high availability:

```yaml
client_options:
  bootstrap_servers:
  - prod-kafka-1.example.com:9092
  - prod-kafka-2.example.com:9092
  - prod-kafka-3.example.com:9092
```

The shadow cluster uses these addresses to discover all brokers in the source cluster. If one bootstrap server is unavailable, the shadow cluster tries the next one in the list.

#### Network security

For production deployments, secure the network connection between clusters:

TLS encryption:

```yaml
client_options:
  tls_settings:
    enabled: true
    tls_file_settings:
      ca_path: /etc/ssl/certs/ca.crt
      key_path: /etc/ssl/private/client.key   # Optional: for mTLS
      cert_path: /etc/ssl/certs/client.crt    # Optional: for mTLS
    do_not_set_sni_hostname: false
```

Authentication:

```yaml
client_options:
  authentication_configuration:
    scram_configuration:
      username: shadow-replication-user
      password: <sasl-password>
      scram_mechanism: SCRAM_SHA_256
```

#### Connection tuning

Adjust connection parameters based on your network characteristics:

```yaml
client_options:
  connection_timeout_ms: 1000         # Default 1000ms; increase for high-latency networks
  retry_backoff_ms: 100               # Default 100ms
  metadata_max_age_ms: 10000          # Default 10000ms
  fetch_wait_max_ms: 500              # Default 500ms
  fetch_min_bytes: 5242880            # Default 5MB
  fetch_max_bytes: 20971520           # Default 20MB
  fetch_partition_max_bytes: 1048576  # Default 1MB
```

## Update an existing shadow link

To modify a shadow link configuration after creation, run:

```bash
rpk shadow update <shadow-link-name>
```

This opens your default editor to modify the shadow link configuration. Only changed fields are updated on the server. The shadow link name cannot be changed — you must delete and recreate the link to rename it.
