---
title: "Using Baseil's MCP Tools with AI Agents"
description: "How to connect your AI agents to any database through Baseil's automatically generated MCP tools."
date: "2026-02-14"
author: "Baseil Team"
tags: ["mcp", "agents", "integration", "workflow"]
---

## Why MCP?

The Model Context Protocol (MCP) is becoming the standard way AI agents interact with tools and data sources. Baseil automatically exposes every connected database as MCP tools, with no custom integration code needed.

## How It Works

When you connect a database to Baseil, it automatically generates MCP tool definitions:

```json
{
  "tools": [
    { "name": "baseil__query", "description": "Ask a natural-language question across your connected databases" },
    { "name": "baseil__describe", "description": "List connections, schemas, tables, and columns" },
    { "name": "baseil__execute", "description": "Run a specific generated tool with explicit arguments" }
  ]
}
```

Your agents query any connected database through these tools; the full list of eight is in the [MCP setup guide](/docs/mcp-setup).

## Setting Up Agent Access

### 1. Start Baseil

```bash
baseil start
```

The MCP endpoint is served by the same process at `http://localhost:8451/api/v1/mcp/sse` and needs an API key (Settings, then API Keys).

### 2. Point Your Agent to Baseil

Configure your AI agent's MCP client to connect:

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

### 3. Let Your Agent Query

Your agent can now make calls like:

```
Tool: baseil__query
Input: { "question": "How many new signups this week?" }
```

And get structured results back instantly.

## Cross-Database Queries

The real power comes when agents need data from multiple sources. Instead of building custom connectors for each database, your agent just asks:

```
Tool: baseil__query
Input: { "question": "Compare customer growth in our PostgreSQL CRM with event data in our analytics DB" }
```

Baseil handles the cross-database join automatically.

## Workflow: Customer Support Agent

Here's a practical workflow for a customer support AI agent:

1. Customer asks: *"Why was I charged twice?"*
2. Agent calls Baseil: `baseil__query` → "Show recent charges for customer ID 12345"
3. Agent calls Baseil: `baseil__query` → "Show payment processor logs for customer 12345 in the last 7 days"
4. Agent synthesizes both results and responds to the customer

No custom code. No database drivers. Just natural language through MCP tools.

## Best Practices

- **One API key per agent** so you can revoke access independently
- **Use rules**: pre-define business terms so agents get consistent results
- **Monitor usage**: Baseil logs every query for audit trails
- **Cache hot queries**: pin frequently-asked agent queries for instant responses
