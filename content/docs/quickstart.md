---
title: "Quickstart"
description: "Install Baseil, connect your first database, and run your first natural-language query in about ten minutes."
order: 1
category: "getting-started"
---

This is the fastest path from zero to a working Baseil instance with one database connected and chat responding to your questions. Budget about ten minutes the first time. The download is about 300 MB, and the setup wizard pulls down a small embedding model on top of that. The wizard itself is about two minutes of prompts; the rest is download time.

## Prerequisites

You'll want these in place before you start:

- macOS on Apple Silicon, or Linux on x64. There is no Windows build yet.
- An Anthropic or OpenAI API key.
- A PostgreSQL instance for Baseil's own metadata (connections, rules, golden cache, audit logs). The wizard can find a local one, start one in Docker, or install it with apt on Debian and Ubuntu. A connection URL to an existing Postgres works too.
- A database you want to ask questions about.

You do not need Python or Node. The CLI is a single frozen binary.

Sign-in uses baseil.ai accounts and the wizard creates yours, so there is no separate account setup.

## Install the CLI

The install is one command:

```bash
curl -fsSL https://releases.baseil.ai/install.sh | sh
```

This downloads about 300 MB into `~/.baseil`, adds `~/.baseil/bin` to your PATH, and registers a service without starting it: launchd on macOS, a systemd user service on Linux. The service step is skipped on Linux hosts without systemd. Then, if a terminal is attached, the installer runs `baseil setup` for you.

Set `BASEIL_SKIP_SETUP=1` to install without the wizard. To uninstall, remove `~/.baseil` and the service file.

## Run setup

```bash
baseil setup
```

The installer already started this for you. Run it again yourself whenever you want to redo the configuration.

The wizard walks through twelve steps:

1. **PostgreSQL.** Use a local instance, start one in Docker, install it with apt (Debian and Ubuntu), or paste a connection URL.
2. **Start PostgreSQL.** Only if you chose the Docker path.
3. **Metadata database.** Creates the database and the extensions Baseil needs.
4. **Migrations.** Brings the metadata database up to the current schema.
5. **Admin account.** Email and password for the web UI.
6. **Auth.** Configured automatically against baseil.ai, no prompt.
7. **LLM provider.** Anthropic (default) or OpenAI, plus the API key. The key is validated before it is saved, and a rejected key is refused.
8. **Embedding model.** Downloads a small local sentence-transformers model used for the golden cache.
9. **Server access.** On Linux, whether to bind to all interfaces or to localhost only.
10. **Root password.** Used by the `baseil admin` commands.
11. **Recovery keys.** Shown once, so store them somewhere safe.
12. **Ready.** Prints the MCP config for your client and offers to start the server.

## Start the server

```bash
baseil start
```

The server runs at `http://localhost:8451` and serves the web UI from the same process. `baseil status` shows whether it is running, and `baseil logs` tails the log.

Open that URL in a browser and sign in with the admin account you created in step 5.

## Your first query

You're one connection away from asking questions.

1. Click **Connections** in the sidebar.
2. Hit **Add Connection** and walk through the form. PostgreSQL is fully supported; MySQL, SQLite, and Elasticsearch are in beta. (If you need more detail, see [Connecting Databases](/docs/connecting-databases).)
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
