---
title: "Quickstart"
description: "Install Baseil, connect your first database, and run your first natural-language query in about 15 minutes."
order: 1
category: "getting-started"
---

This is the fastest path from zero to a working Baseil instance with one database connected and chat responding to your questions. Budget about 15 minutes the first time, more if Postgres has to be installed. The download is about 90 MB, and Baseil takes about 300 MB on disk once it is running. The wizard asks a handful of questions; onboarding a database then takes about a minute.

## Prerequisites

You'll want these in place before you start:

- macOS on Apple Silicon, or Linux on x64 or arm64. There is no Windows build yet.
- An API key from OpenRouter (recommended), Anthropic or OpenAI.
- A PostgreSQL instance for Baseil's own metadata (connections, rules, the golden cache of saved answers, audit logs). The wizard can find a local one, start one in Docker, or install it with apt on Debian and Ubuntu. A connection URL to an existing Postgres works too.
- A database you want to ask questions about.

You do not need Python or Node. The CLI is a single frozen binary.

You sign in to the web UI with the admin email and password you choose in the wizard. That account lives on your server. A free baseil.ai account is optional: link it from the status card in the web UI sidebar to add more than one connection, use MySQL, SQLite or Elasticsearch, and turn on MCP and the API. Without it, Baseil allows one PostgreSQL connection.

## Install the CLI

The install is one command:

```bash
curl -fsSL https://releases.baseil.ai/install.sh | sh
```

This downloads about 90 MB into `~/.baseil` (about 300 MB on disk once it is running), adds `~/.baseil/bin` to your PATH, and registers a service without starting it: launchd on macOS, a systemd user service on Linux. The service step is skipped on Linux hosts without systemd. Then, if a terminal is attached, the installer runs `baseil setup` for you.

Running the command on a machine that already has Baseil updates it in place: your settings are kept, setup does not run again, and a running server is stopped, so start it again with `baseil start`.

Set `BASEIL_SKIP_SETUP=1` to install without the wizard. To uninstall, remove `~/.baseil` and the service file.

## Run setup

```bash
baseil setup
```

The installer already started this for you. Run it again yourself whenever you want to redo the configuration.

The wizard asks only what it needs, in nine numbered steps:

1. **PostgreSQL.** Uses a PostgreSQL already running on this machine. If there is none, it asks whether to install one with apt (Debian and Ubuntu), run one in Docker, or paste a connection URL. A hosted PostgreSQL such as Neon or Supabase works too.
2. **Start PostgreSQL.** Reports the PostgreSQL it found, or starts the Docker one if you chose Docker.
3. **Metadata database.** Creates the database and the extensions Baseil needs.
4. **Migrations.** Brings the metadata database up to the current schema.
5. **Admin account.** The email and password you sign in to the web UI with. This is a local account on your server, not a baseil.ai account.
6. **Sign-in settings.** Configured automatically, no prompt.
7. **LLM provider.** OpenRouter (default), Anthropic, or OpenAI, then the API key. The key is not shown as you type. If it looks like a key for a different provider (say, an Anthropic key after you picked OpenRouter), the wizard says so and offers to switch. The key is checked before it is saved; a rejected key is refused, and you can paste another or press Enter to skip.
8. **Server access.** On Linux, and whenever you are connected over SSH, asks whether other machines may connect to the server (needed to open the web UI from another computer). The default is yes only over SSH. On a Mac at its own keyboard nothing is asked, and the server listens on this machine only. When it listens on all interfaces, the summary also prints the address to use from another machine.
9. **Ready.** Offers to start the server, then opens the web UI if this machine has a display, or prints its URL if not. The summary says where the admin API key is saved (`~/.baseil/api_key`) and that the MCP config for AI clients is in the web UI under **Settings → MCP Config**. Without a linked baseil.ai account it also says that the install runs in limited mode: one PostgreSQL connection, and no MCP server or API endpoints.

## Start the server

If you said yes at the end of setup, the server is already running: skip to "Your first query" below. Otherwise:

```bash
baseil start
```

The server runs at `http://localhost:8451` and serves the web UI from the same process. `baseil status` shows whether it is running, and `baseil logs` tails the log.

Open that URL in a browser and sign in with the admin email and password you chose in step 5.

## Your first query

You're one connection away from asking questions.

1. Click **Databases** in the sidebar.
2. Hit **Add Connection** and walk through the form. PostgreSQL is fully supported; MySQL, SQLite, and Elasticsearch are in beta. (If you need more detail, see [Connecting Databases](/docs/connecting-databases).) Without a linked baseil.ai account, Baseil allows one PostgreSQL connection.
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

## Updating

```bash
baseil upgrade
```

This downloads and installs the latest release and restarts the server.

On 1.0.0, `baseil upgrade` can stop at "Download failed" on newer Linux systems (Debian 13, Ubuntu 24.10 and later). Run the install command again instead; it updates Baseil in place and keeps your settings and data:

```bash
curl -fsSL https://releases.baseil.ai/install.sh | sh
```

From 1.0.1 on, `baseil upgrade` works on those systems too.

## Next

- [Connecting more databases](/docs/connecting-databases)
- [Chat Interface Guide](/docs/chat-interface)
- [MCP setup for Claude and other agents](/docs/mcp-setup)
