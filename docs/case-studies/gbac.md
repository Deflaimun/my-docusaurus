---
sidebar_position: 2
title: "Case Study: Group-Based Access Control (GBAC)"
description: How I authored documentation for Redpanda's GBAC security feature from scratch.
---

# Case Study: Group-Based Access Control (GBAC)

**Project**: Security Documentation — GBAC
**Company**: Redpanda
**Year**: 2025–2026
**Role**: Technical Writer / Documentation Engineer

---

## What is GBAC?

Group-Based Access Control (GBAC) is a Redpanda security feature that extends OIDC authentication to allow permissions to be assigned at the group level rather than per-user. When a user authenticates via OIDC, Redpanda reads their group memberships from the JWT token and grants permissions inherited from those groups — eliminating the need to manage individual user ACLs as teams grow.

The feature works across all Redpanda APIs (Kafka, Admin, Schema Registry, HTTP Proxy) and integrates with major identity providers including Auth0, Okta, and Microsoft Entra ID.

## My Role

I authored the GBAC documentation **from scratch** — no prior documentation existed for this feature. My responsibilities included:

- Working with the security engineering team to understand the authorization evaluation model and token claim extraction behavior
- Authoring the full documentation set: conceptual overview, configuration procedures, and reference content
- Designing the **learning-objective-based structure** — each page opens with a checkbox list of what the reader will accomplish, a pattern borrowed from course design that improves scanability
- Creating reusable partials for the UI procedures (Redpanda Console), which are shared across multiple docs pages
- Coordinating with the cloud team to ensure cloud-specific behaviors (contact support for cluster property changes) were clearly documented
- Simultaneously **rewriting existing ACL and RBAC reference pages** to incorporate GBAC context and ensure consistency across the security documentation section

## Challenges

**Novel authorization model**: GBAC introduces a unified evaluation flow that checks user ACLs, role ACLs, group ACLs, and group-to-role ACLs together. This required clear conceptual writing to explain the deny-first precedence model without overwhelming readers who just want to configure their groups.

**Identity provider variability**: Every IdP structures group claims differently in the JWT token. Auth0, Okta, and Azure AD each use different JSON paths and formats (flat arrays, nested objects, path-style strings, CSV). I had to document the `oidc_group_claim_path` configuration in a way that served all these cases without creating four separate guides.

**Mermaid diagram**: The authorization evaluation flow benefited from a visual representation. I wrote a Mermaid flowchart showing the deny-check-then-allow-check logic with source labels (User ACLs, Role ACLs, Group ACLs, Group→Role ACLs), which was added to the page.

**Partial reuse architecture**: The UI procedures for assigning group roles and creating group ACLs are reused as Antora partials in other pages. I designed them to work both standalone and as included content.

## Approach & Decisions

**Learning objectives up front**: Each page starts with a checklist of what the reader will be able to do after reading. This is a documentation pattern borrowed from instructional design — it sets expectations, helps readers determine if they're on the right page, and serves as a scannable summary.

**Concept before procedure**: The overview page explains the authorization model (how GBAC works, what gets evaluated, in what order) before jumping to configuration steps. Enterprise security engineers need to understand the security model before they configure it.

**Single source for dual audiences**: Cloud and self-managed Redpanda have slightly different procedures. I used Antora conditional blocks to serve the right content to each audience from the same source file, rather than duplicating pages.

**Limitations as first-class content**: GBAC has real limitations (Azure AD group limit, no wildcard ACLs, nested group handling). Rather than burying these at the bottom of the page, I positioned them prominently so users can assess compatibility before investing in configuration.

## Outcome

The documentation covers:

- Conceptual explanation of the unified authorization evaluation flow
- Configuration procedures for three interfaces: `rpk`, Redpanda Console, and Admin API v2
- Token structure examples for four JWT claim formats (flat array, nested, path-style, CSV)
- Identity provider setup guidance for Auth0, Okta, and Microsoft Entra ID
- Limitations section covering five known constraints
- Reusable UI partials for Console procedures

## Read the Full Documentation

- [GBAC Overview](../writing-samples/gbac/overview) — Concept, authorization model, limitations, and token claim extraction
- [Configure GBAC](../writing-samples/gbac/configure) — Assign groups to roles, create group ACLs, view role assignments
