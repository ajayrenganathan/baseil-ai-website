---
title: "Expose Your Database as MCP Tools — No Code Required"
description: "The Model Context Protocol is how AI agents discover and use tools. Writing MCP servers by hand is tedious. Here's how to skip that and turn any database into a live MCP server in a few minutes."
date: "2026-04-16"
author: "Baseil Team"
tags: ["mcp", "no-code", "agents", "integration"]
---

If you haven't looked at the Model Context Protocol yet, the short version: it's a standard for how AI agents discover and call tools. [Anthropic introduced it](https://www.anthropic.com/news/model-context-protocol) in late 2024, and the [spec](https://modelcontextprotocol.io/) has momentum. Clients like Claude Desktop pick up any MCP-compatible server and make the tools available to the model at runtime.

Writing an MCP server by hand for your database is doable but tedious. You define every tool: name, argument schema, behavior, return type. You handle connection pooling. You add safety (read-only, injection prevention). You keep the whole thing in sync as the schema changes. It's a well-understood pile of work, and if your data already lives in a database, most of it is boilerplate.

There's a way to skip it.

## The demo

Here's what the flow looks like end to end with Baseil.

**1. Add a Postgres connection.**

In the Connections tab, click Add Connection. Type the host, port, database name, and a read-only username. Hit Test Connection to verify, then Onboard.

**2. Wait about 30 seconds.**

The onboarding pipeline runs: Baseil reads your schema, generates parameterized query tools, reviews them for safety, tests them against the real database, deploys them. You can watch the progress panel if you're impatient.

**3. Generate an API key.**

Settings → API Keys → Create key. Copy it.

**4. Wire it into Claude Desktop.**

Drop this into Claude Desktop's MCP config:

```json
{
  "mcpServers": {
    "baseil": {
      "url": "http://localhost:8451/api/v1/mcp/sse",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    }
  }
}
```

Restart Claude. The Baseil tools show up in the available tools list automatically.

**5. Ask Claude about your data.**

"What's in this database?" is a good first probe. Claude calls `baseil__describe`, gets back the schema, and summarizes it. Try something more specific next: "how many orders were placed in the last 7 days?" Claude calls `baseil__query`, Baseil routes it to the right tool, runs the SQL, returns structured results.

You'll see the tool calls in Claude's UI (depending on settings), so you can confirm this isn't a hallucination. The tool call is real. The SQL is real. The number came from your database.

Total elapsed time: about 5 minutes, most of which is waiting for Claude to restart.

## What Baseil generates automatically

After onboarding, your database is exposed via a fixed set of MCP tools. Each has a machine-readable description, typed parameters, and built-in safety rails. You don't author them.

- `baseil__query` — Ask a natural-language question. Baseil picks the right template.
- `baseil__describe` — Return schema info, for agents that want to look around first.
- `baseil__execute` — Run a specific named tool with explicit arguments.
- `baseil__setup` — Add a new connection (admin keys only).
- `baseil__status` — Check background task status.
- `baseil__rules` — Manage rules programmatically.
- `baseil__ack` — Acknowledge results, for multi-step reasoning.
- `baseil__help` — Discover available tools.

Behind `baseil__query` is a toolkit of templates that were generated from your schema: listings with filters, counts, aggregations, joins across related tables. The agent doesn't see those directly; it sees the higher-level query tool and lets Baseil pick among them.

This means the tool surface stays constant no matter how many tables you have. Adding a database doesn't add MCP tools. It adds capabilities behind the existing tools.

## The value proposition

Rolling it yourself vs. using Baseil:

**Hand-rolled MCP server for your database:**

- Write a tool def for each meaningful query pattern per table.
- Build connection pooling and error handling.
- Add SQL injection protection.
- Keep definitions in sync as the schema evolves.
- Add a new batch of tool defs for every new database.
- Multiply all of that when you need cross-database joins.

**Baseil:**

- Connect once. Tools are generated, reviewed, tested, deployed.
- Schema changes trigger re-onboarding, tools update.
- Safety is built into the connector layer.
- New databases plug in the same way. Cross-database joins just work.

This isn't a universal trade-off. If you have exactly one database, a small schema, and you need very specific tool shapes, hand-rolling is fine. Past that, the math shifts fast.

## Try it

If you want to see your own database talking to Claude in 5 minutes, the [quickstart](/docs/quickstart) is the shortest path. The [MCP setup doc](/docs/mcp-setup) has more detail on the protocol-specific pieces.

Related reading:

- [Building the Agentic Data Layer](/blog/building-agentic-data-layer-mcp-a2a)
- [Why Agent Experience Is the New Developer Experience](/blog/agent-experience-ax-new-developer-experience)
