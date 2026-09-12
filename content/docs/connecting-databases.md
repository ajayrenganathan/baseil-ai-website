---
title: "Connecting Databases"
description: "Add PostgreSQL connections, plus MySQL, SQLite, and Elasticsearch in beta. Understand what happens during onboarding."
order: 2
category: "getting-started"
---

Baseil supports several database types. Onboarding looks basically the same for all of them: point Baseil at a connection, wait under a minute, start asking questions. This page walks through the supported types and what the onboarding pipeline actually does with your data.

## Supported databases

- PostgreSQL 12+
- MySQL 5.7 and 8.0 (beta)
- SQLite, file-based or in-memory (beta)
- Elasticsearch 8.0+ (beta)

More connectors are on the roadmap. If you have a request, drop it on the waitlist form.

## Add a connection (Web UI)

From the left sidebar, click **Connections**, then **Add Connection**. The form asks for:

- **Name.** Just for display. `production-db`, `analytics-warehouse`, whatever helps you tell them apart.
- **Type.** Pick from the supported list.
- **Host / Port / Database.** Standard connection coordinates.
- **Username.** We strongly recommend a dedicated read-only user. Baseil enforces read-only at the SQL level too, but defense in depth matters.
- **Password.** Encrypted at rest with a key Baseil derives from your installation.
- **Extra options.** SSL mode, schema whitelist, sample row count for discovery, etc. Defaults are fine for most setups.

Before you click **Onboard**, there's a **Test Connection** button. Use it. It catches typos, bad credentials, firewall issues, and SSL mismatches in a few seconds.

## Adding connections from the CLI

Connections are managed in the web UI. There is no CLI command for adding connections yet.

## Connection string examples

Quick reference for filling in the form:

**PostgreSQL**

```
Host: db.example.com
Port: 5432
Database: production
Username: baseil_readonly
```

**MySQL**

```
Host: mysql.example.com
Port: 3306
Database: analytics
Username: analytics_ro
```

**SQLite**

For SQLite you just supply a path:

```
Path: /var/data/app.sqlite
```

In-memory databases work too. Handy for demos and tests.

**Elasticsearch**

```
Host: https://es.example.com
Port: 9200
Index pattern: logs-*
```

## The onboarding pipeline

Once you click **Onboard**, Baseil runs five specialized agents in sequence:

1. **Discovery.** Reads tables, columns, data types, foreign keys, inferred relationships, and a handful of sample rows per table. Builds a schema graph that the next stage uses as input.
2. **Tool generation.** Writes a set of parameterized query templates. Not one tool per table. Sparse, reusable templates like `list_entities_with_filters` that generalize across similar queries.
3. **Security review.** Every generated tool gets static analysis for injection patterns, parameter handling, and read-only enforcement. Anything the reviewer can't validate gets flagged or rejected.
4. **Testing.** Each tool runs against your real database with safe sample parameters. This catches broken SQL, wrong types, and schema assumptions that don't hold in practice.
5. **Deploy.** Approved and tested tools get registered in the tool registry, where chat, the API, and the MCP server immediately pick them up.

Visualized:

```mermaid
flowchart LR
  A[New connection] --> B[Discovery]
  B --> C[Tool generation]
  C --> D[Security review]
  D --> E[Testing]
  E --> F[Deploy]
  F --> G[Ready in chat, API, MCP]
```

The pipeline runs once per connection. If your schema changes, you re-onboard that connection and the affected tools get regenerated.

## Watching progress

The **Activities** panel shows the pipeline in real time. Each stage has its own line with a status (running, done, warning) and a short description of what it's doing. Warnings are usually benign: a table with zero rows, a column Baseil couldn't infer a type for, a relationship that looks ambiguous. Errors stop the pipeline and surface the cause.

Activities stick around after onboarding. You can scroll back to see what ran, when, and what happened.

## Re-onboarding and schema drift

Schemas change. New tables, dropped columns, renamed fields, changed types. When that happens you have two options:

- **Re-run onboarding** on the affected connection. This is a one-click operation from the Connections page. Baseil diffs the new schema against what it knows, and only regenerates tools for changed parts.
- **Update rules.** If the change is semantic rather than structural (e.g. you split `status` into `status` and `substatus`), a rule often handles it more cleanly than a full re-onboard.

Drift is computed when you re-onboard a connection. There is no scheduled drift check yet.

## Next

- [Chat Interface Guide](/docs/chat-interface)
- [MCP setup for agents](/docs/mcp-setup)
