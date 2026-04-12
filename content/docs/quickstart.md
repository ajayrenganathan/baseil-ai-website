---
title: "Quickstart"
description: "Install Baseil, connect your first database, and run your first natural-language query in under 5 minutes."
order: 1
category: "getting-started"
---

This is the fastest path from zero to a working Baseil instance with one database connected and chat responding to your questions. Budget around five minutes if you already have a database handy, a bit longer if you need to spin one up.

## Prerequisites

You'll want these in place before you start:

- Python 3.12 or newer
- Node.js 18+ (only needed if you plan to build the web UI from source)
- Docker, optional, makes spinning up a local Postgres trivial. You can skip it if you already have a database to point Baseil at
- An [Anthropic API key](https://console.anthropic.com/) for Claude, which is the default LLM

Auth for local development runs through Clerk, and the setup wizard provisions everything you need. You don't have to create a Clerk account first.

## Install the CLI

The simplest install is the published shell script:

```bash
curl -sSL https://releases.baseil.ai/install.sh | bash
```

This drops the `baseil` binary into your path and nothing else. No database changes, no system services. Uninstalling is just removing the binary.

## Run setup

```bash
baseil setup
```

The setup wizard walks through six prompts. Each has a sensible default if you just hit enter:

1. **Postgres detection.** Baseil needs a Postgres instance for its own metadata (connections, rules, golden cache, audit logs). It looks for a local one first, then offers to start one via Docker if you have it. BYO connection string also works.
2. **Database schema creation.** Baseil creates its schema in the database you pointed it at. Tables are namespaced so this is safe to run on a shared database.
3. **Admin account.** Email and password for the first admin user. This is separate from the Clerk session and is what you'll use to sign into the web UI.
4. **Clerk keys.** For local dev the wizard can auto-provision a Clerk development instance. If you already have Clerk credentials, paste them in. See [Clerk's docs](https://clerk.com/docs) if you want to manage this manually.
5. **LLM provider.** Anthropic (default) or OpenAI. Paste your API key here. This key never leaves your machine in local dev.
6. **Embedding model.** Used for the golden cache. Default is `text-embedding-3-small` on OpenAI, with a local fallback available.

A successful run looks like this:

```
> baseil setup

[1/6] Detected Postgres at localhost:5432 - OK
[2/6] Creating baseil schema... done
[3/6] Admin account: admin@example.com created
[4/6] Clerk dev instance provisioned
[5/6] Anthropic key validated
[6/6] Embeddings: text-embedding-3-small

Setup complete. Run `baseil start` to launch the server.
```

## Start the server

```bash
baseil start
```

This launches the backend API on port 8451 and serves the web UI from the same process. When it's up, you'll see:

```
Baseil is running at http://localhost:8451
```

Open that URL in a browser and sign in with the admin account you just created.

## Your first query

You're one connection away from asking questions.

1. Click **Connections** in the sidebar.
2. Hit **Add Connection** and walk through the form. Any Postgres, MySQL, SQLite, or Elasticsearch will do. (If you need more detail, see [Connecting Databases](/docs/connecting-databases).)
3. Wait for onboarding to finish. Usually 30-60 seconds. The progress panel shows each stage of the pipeline.
4. Open **Chat** and ask something.

Good first questions to try:

- "How many rows are in the users table?"
- "Show me the most recent 10 orders"
- "What's the schema of the products table?"

Each response comes back with the natural-language answer up top, the tool that ran, the actual SQL, and a small metadata footer with row count and execution time. If the number looks wrong, you can verify it right there against the query.

## What happened under the hood

When you added a connection, Baseil ran a five-agent pipeline: Discovery mapped your schema, ToolBuilder generated parameterized query templates, Reviewer checked them for injection risks and read-only enforcement, Tester ran them against your real data with safe parameters, and Deploy registered everything as tools the chat can use. The whole thing takes less than a minute for a typical schema.

For a deeper look, read [Inside Baseil's 5-Agent Pipeline](/blog/inside-baseil-5-agent-pipeline).

## Next

- [Connecting more databases](/docs/connecting-databases)
- [Chat Interface Guide](/docs/chat-interface)
- [MCP setup for Claude and other agents](/docs/mcp-setup)
