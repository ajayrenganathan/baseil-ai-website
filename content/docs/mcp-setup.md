---
title: "MCP Setup Guide"
description: "Expose your Baseil instance as an MCP server. Connect from Claude Desktop, Claude API, or any MCP-compatible client."
order: 4
category: "guides"
---

The [Model Context Protocol](https://modelcontextprotocol.io/) is how AI agents discover and use tools. Baseil speaks MCP natively. Every database you connect becomes a set of MCP tools that any MCP-compatible client can call. This guide covers generating a key, wiring it into Claude Desktop and the Claude API, and verifying the connection works.

## What you get out of the box

When Baseil is running with one or more connections, these tools are live on the MCP endpoint:

- **`baseil__query`** — Ask a natural-language question. Baseil picks the right tool, runs the query, returns structured results.
- **`baseil__describe`** — Enumerate schemas, tables, columns. Good for agents that want to look around before asking.
- **`baseil__execute`** — Run a specific named tool with explicit arguments. Useful when the agent already knows what it wants.
- **`baseil__setup`** — Add a new connection programmatically. Scoped to admin keys only.
- **`baseil__status`** — Check background tasks (ongoing onboarding, index rebuilds, etc.).
- **`baseil__rules`** — Create, list, update rules.
- **`baseil__ack`** — Acknowledge tool results, used for multi-step reasoning.
- **`baseil__help`** — List every available tool with descriptions. Agents use this to discover capabilities.

Every tool has a machine-readable description and typed parameters. Agents that speak MCP don't need any out-of-band knowledge to use them.

## Generate an API key

Sign in to Baseil, go to **Settings → API Keys**, and click **Create key**. Give it a name so you remember what it's for. The key is shown once. Copy it somewhere safe.

Keys are scoped. You can create a key that only has access to specific connections, or to a subset of tools. For agent integrations, create a new key per agent or per use case so you can rotate them independently.

## Connect from Claude Desktop

[Claude Desktop](https://claude.ai/download) reads MCP servers from a config file. Open Claude Desktop's settings, find the MCP section, and add Baseil:

```json
{
  "mcpServers": {
    "baseil": {
      "url": "http://localhost:8451/api/v1/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_API_KEY` with the key you just generated. If you're running Baseil on a server, swap `localhost:8451` for the public URL.

Save the config and restart Claude Desktop. In a new conversation, Claude should surface the Baseil tools automatically. You can verify by asking "what tools do you have?" and Claude will list them.

More detail in the [Claude Desktop MCP docs](https://docs.claude.com/en/docs/claude-code/mcp).

## Connect from the Claude API

For programmatic use, the Anthropic SDK supports MCP servers as a first-class concept. Point it at Baseil's MCP endpoint and pass the auth header. Each SDK has its own configuration shape, so check [Anthropic's MCP guide](https://docs.claude.com/en/docs/claude-code/mcp) for the exact form.

Baseil's endpoint uses Server-Sent Events for streaming. The URL pattern is:

```
http://<your-baseil-host>:8451/api/v1/mcp/sse
```

and auth is a bearer token in the `Authorization` header.

## Verify the connection

Once wired up, verify end-to-end:

1. Start a new conversation with your agent.
2. Ask: "what databases can I query?"
3. Expected behavior: the agent calls `baseil__describe`, gets back the list of your connections and their schemas, and responds with a human-readable summary.

If that works, try a real question: "how many users signed up last week in the production database?" The agent should call `baseil__query`, and Baseil picks the right tool, runs the query, and returns results.

## Example agent workflow

A concrete scenario, a customer support agent handling a ticket:

> User: "Customer foo@example.com is asking about their recent orders."

The agent's reasoning goes something like:

1. Parse the user's intent: "look up recent orders for customer foo@example.com".
2. Call `baseil__query` with `"orders for customer foo@example.com in the last 30 days"`.
3. Baseil routes to the appropriate tool, runs the query, returns a structured list of orders.
4. The agent summarizes for the human, maybe fetches more detail with a follow-up `baseil__query` call.

The important part: the agent never needed schema details in advance. Baseil's MCP tools expose everything the agent needs at runtime.

## Cross-database queries

If you've connected more than one database, Baseil can answer questions that span them. An agent doesn't have to know which database has what. It just asks, and Baseil figures out the join.

Example: "Show me total revenue from customers who contacted support last week." Customer data might be in Postgres, support tickets in Elasticsearch. Baseil's query planner joins across them transparently.

The agent uses the same `baseil__query` tool. All the cross-database complexity is absorbed on Baseil's side.

## Security considerations

A few things worth knowing:

- **API keys are scoped.** Create narrow keys per agent. Rotate via Settings → API Keys. Revoked keys stop working immediately.
- **All queries are read-only by default.** Baseil enforces this at the SQL level. Write access is a separate, opt-in capability that most deployments don't enable.
- **SQL injection protection is at the connector level.** Every generated tool uses parameterized queries. User input never gets concatenated into SQL.
- **Full audit log.** Every tool call, the parameters used, the query that ran, and the result metadata. Visible in the Activities panel and exportable.

If you're running Baseil in production, put it behind your normal auth and network boundaries. The MCP endpoint is standard HTTPS; all the usual WAF and rate-limiting tools apply.

## Next

- Blog: [Expose Your Database as MCP Tools — No Code Required](/blog/expose-database-as-mcp-no-code)
- Blog: [Building the Agentic Data Layer](/blog/building-agentic-data-layer-mcp-a2a)
- Blog: [Why Agent Experience Is the New Developer Experience](/blog/agent-experience-ax-new-developer-experience)
