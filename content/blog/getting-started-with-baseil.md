---
title: "Getting Started with Baseil"
description: "A step-by-step guide to installing Baseil, connecting your first database, and running your first natural language query."
date: "2026-02-10"
author: "Baseil Team"
tags: ["getting-started", "tutorial", "setup"]
---

## What is Baseil?

Baseil connects to your databases, maps the schema, and generates tested read-only query tools from what it finds. Those tools answer questions from humans in chat and from agents over MCP or the API, so the same tested path serves both. It runs on your machine.

## Step 1: Install

```bash
curl -fsSL https://releases.baseil.ai/install.sh | sh
```

The installer downloads about 300 MB into `~/.baseil`, registers a background service, and runs the setup wizard. The wizard asks for:

- A Postgres for Baseil's own metadata. It can use a local Postgres, start one in Docker, or install one with apt.
- An admin email and password. This is the account you sign in with.
- An Anthropic or OpenAI key, validated before it is saved.
- A couple of server settings.

macOS Apple Silicon and Linux x64 only for now.

## Step 2: Start the server

```bash
baseil start
```

Open `http://localhost:8451` and sign in with the admin account you just created.

Two commands worth remembering: `baseil status` tells you whether the server is running, and `baseil logs` shows you what it is doing.

## Step 3: Connect a database

Connections are added in the web UI. Go to Connections, then Add Connection, and fill in the form for your database type.

Use a read-only database user. Baseil validates its own SQL as read-only, but a read-only user is the layer you control.

PostgreSQL is fully supported. MySQL, SQLite, and Elasticsearch are in beta.

Click Test Connection to confirm the credentials work, then Onboard.

## Step 4: Onboarding

Onboarding is a five-stage pipeline over the connection you just added:

- **Discovery** reads the schema, the relationships between tables, and a sample of rows.
- **Tool generation** writes parameterized query templates against what Discovery found.
- **Security review** statically checks each template for injection and for anything that is not read-only.
- **Testing** runs every tool against your real data with parameters drawn from the sampled rows.
- **Deploy** registers the tools that pass for chat, the API, and MCP.

For a typical schema this takes about a minute.

## Step 5: Ask a question

Open the chat and ask something concrete:

```
How many orders shipped last month?
```

The answer comes back with the tool that ran, the SQL it executed, and the row count:

| Tool | Rows | Answer |
|---|---|---|
| `orders_by_status_and_month` | 1 | 4,182 orders shipped in January |

```sql
SELECT COUNT(*) FROM orders
WHERE status = 'shipped'
  AND shipped_at >= $1 AND shipped_at < $2
```

You can read the query and check the number against it. Every answer shows its SQL, so nothing has to be taken on trust.

## What's next?

- **Add rules** to customize how Baseil interprets your data
- **Pin golden queries** to cache for instant results
- **Connect more databases** and query across them
- **Expose MCP tools** to your agents with the [MCP setup guide](/docs/mcp-setup)

The [quickstart](/docs/quickstart) covers the same ground in condensed form.
