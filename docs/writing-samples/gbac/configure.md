---
sidebar_position: 2
title: Configure Group-Based Access Control
description: Configure GBAC cluster properties, assign groups to roles, and create group-based ACLs.
---

:::info Writing Sample
This page was originally written for [Redpanda](https://redpanda.com) as part of the Group-Based Access Control (GBAC) feature. It is reproduced here as a portfolio writing sample.
:::

# Configure Group-Based Access Control

:::note
This feature requires an Enterprise Edition license on your cluster.
:::

Group-based access control (GBAC) extends OIDC authentication to let you manage permissions at the group level instead of per user. You can grant permissions to groups in two ways: create ACLs with `Group:<name>` principals, or assign groups as members of RBAC roles. Both approaches can be used independently or together. Because group membership is managed by your identity provider (IdP), onboarding and offboarding require no changes in Redpanda.

After reading this page, you will be able to:

- Configure the cluster properties that enable GBAC
- Assign an OIDC group to an RBAC role
- Create a group-based ACL using the `Group:` principal prefix

## Prerequisites

- OIDC authentication must be configured and enabled on your cluster.
- Superuser access to configure cluster properties and manage ACLs.
- Enterprise Edition license on your cluster.

## Assign groups to roles

Assigning a group to an RBAC role is the recommended pattern for managing permissions at scale. All users in the group inherit the role's ACLs automatically.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="interface">
  <TabItem value="rpk" label="rpk">

To assign a group to a role:

```bash
rpk security role assign <role-name> --group <group-name>
```

For example, to assign the `engineering` group to the `DataEngineers` role:

```bash
rpk security role assign DataEngineers --group engineering
```

To remove a group from a role:

```bash
rpk security role unassign <role-name> --group <group-name>
```

For example:

```bash
rpk security role unassign DataEngineers --group engineering
```

  </TabItem>
  <TabItem value="console" label="Redpanda Console">

To assign a group to a role in Redpanda Console:

1. From **Security** on the left navigation menu, select the **Roles** tab.
2. Select the role you want to assign the group to.
3. Click **Edit**.
4. In the **Principals** section, enter the group name using the `Group:<name>` format. For example, `Group:engineering`.
5. Click **Update**.

To remove a group from a role:

1. From **Security** on the left navigation menu, select the **Roles** tab.
2. Select the role that has the group assignment you want to remove.
3. Click **Edit**.
4. In the **Principals** section, remove the `Group:<name>` entry.
5. Click **Update**.

  </TabItem>
  <TabItem value="api" label="Admin API">

These operations use the Admin API v2 `SecurityService`. Send all requests as `POST` with a JSON body.

To assign a group to a role, call `AddRoleMembers`:

```bash
curl -u <user>:<password> \
  --request POST 'http://localhost:9644/redpanda.core.admin.v2.SecurityService/AddRoleMembers' \
  --header 'Content-Type: application/json' \
  --data '{
    "roleName": "DataEngineers",
    "members": [{"group": {"name": "engineering"}}]
  }'
```

To remove a group from a role, call `RemoveRoleMembers`:

```bash
curl -u <user>:<password> \
  --request POST 'http://localhost:9644/redpanda.core.admin.v2.SecurityService/RemoveRoleMembers' \
  --header 'Content-Type: application/json' \
  --data '{
    "roleName": "DataEngineers",
    "members": [{"group": {"name": "engineering"}}]
  }'
```

  </TabItem>
</Tabs>

## Create group-based ACLs

You can grant permissions directly to a group by creating an ACL with a `Group:<name>` principal. This works the same as creating an ACL for a user, but uses the `Group:` prefix instead of `User:`.

<Tabs groupId="interface">
  <TabItem value="rpk" label="rpk">

To grant cluster-level access to the `engineering` group:

```bash
rpk security acl create --allow-principal Group:engineering --operation describe --cluster
```

To grant topic-level access:

```bash
rpk security acl create \
  --allow-principal Group:engineering \
  --operation read,describe \
  --topic 'analytics-' \
  --resource-pattern-type prefixed
```

If your groups use path-style names (with `nested_group_behavior` set to `none`), use the full path as the principal name:

```bash
rpk security acl create --allow-principal 'Group:/departments/eng/platform' --operation read --topic platform-data
```

  </TabItem>
  <TabItem value="console" label="Redpanda Console">

To create an ACL for an OIDC group in Redpanda Console:

1. From **Security** on the left navigation menu, select the **Roles** tab.
2. Click **Create role** to open the role creation form, or select an existing role and click **Edit**.
3. In the **Principals** field, enter the group principal using the `Group:<name>` format. For example, `Group:engineering`.
4. Define the permissions (ACLs) you want to grant to users in the group. You can configure ACLs for clusters, topics, consumer groups, transactional IDs, Schema Registry subjects, and Schema Registry operations.
5. Click **Create** (or **Update** if editing an existing role).

:::note
Redpanda Console assigns ACLs through roles. To grant permissions to a group, create a role for that group, add the group as a principal, and define the ACLs on the role. To create ACLs with a `Group:` principal directly (without creating a role), use `rpk`.
:::

  </TabItem>
</Tabs>

## View groups and roles

### List groups assigned to a role

<Tabs groupId="interface">
  <TabItem value="rpk" label="rpk">

To see which groups are assigned to a role, use `--print-groups`:

```bash
rpk security role describe <role-name> --print-groups
```

For example:

```bash
rpk security role describe DataEngineers --print-groups
```

To list all roles assigned to a specific group:

```bash
rpk security role list --group <group-name>
```

For example:

```bash
rpk security role list --group engineering
```

  </TabItem>
  <TabItem value="api" label="Admin API">

These operations use the Admin API v2 `SecurityService`. Send all requests as `POST` with a JSON body.

To retrieve a role's details including all members (users and groups), call `GetRole`:

```bash
curl -u <user>:<password> \
  --request POST 'http://localhost:9644/redpanda.core.admin.v2.SecurityService/GetRole' \
  --header 'Content-Type: application/json' \
  --data '{"name": "DataEngineers"}'
```

The response includes a `members` array with both `user` and `group` entries.

To list all roles, call `ListRoles`:

```bash
curl -u <user>:<password> \
  --request POST 'http://localhost:9644/redpanda.core.admin.v2.SecurityService/ListRoles' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

To verify how Redpanda resolves groups from an OIDC token, call `ResolveOidcIdentity`. Pass the token in the `Authorization` header. The response includes the resolved `principal`, token expiry, and a `groups` field listing all groups extracted from the token:

```bash
curl \
  --request POST 'http://localhost:9644/redpanda.core.admin.v2.SecurityService/ResolveOidcIdentity' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <jwt-access-token>' \
  --data '{}'
```

  </TabItem>
</Tabs>
