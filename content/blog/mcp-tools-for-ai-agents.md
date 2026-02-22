 ---
title: "Using Baseil's MCP Tools with AI Agents"
description: "How to connect your AI agents to any database through Baseil's automatically generated MCP tools."
date: "2026-02-14"
author: "Baseil Team"
tags: ["mcp", "agents", "integration", "workflow"]
---

## Why MCP?

The Model Context Protocol (MCP) is becoming the standard way AI agents interact with tools and data sources. Baseil automatically exposes every connected database as MCP tools — no custom integration code needed.

## How It Works

When you connect a database to Baseil, it automatically generates MCP tool definitions:

```json
{
  "tools": [
    {
      "name": "query_customers_db",
      "description": "Query the customers database using natural language",
      "parameters": {
        "query": "Natural language question about customer data"
      }
    },
    {
      "name": "query_analytics_db",
      "description": "Query the analytics database using natural language",
      "parameters": {
        "query": "Natural language question about analytics data"
      }
    }
  ]
}
```

Your AI agents can now query any database just by calling these tools.

## Setting Up Agent Access

### 1. Start Baseil with MCP Server

```bash
baseil serve --mcp --port 3100
```

### 2. Point Your Agent to Baseil

Configure your AI agent's MCP client to connect:

```json
{
  "mcp_servers": [
    {
      "name": "baseil",
      "url": "http://localhost:3100/mcp"
    }
  ]
}
```

### 3. Let Your Agent Query

Your agent can now make calls like:

```
Tool: query_customers_db
Input: { "query": "How many new signups this week?" }
```

And get structured results back instantly.

## Cross-Database Queries

The real power comes when agents need data from multiple sources. Instead of building custom connectors for each database, your agent just asks:

```
Tool: query_all
Input: { "query": "Compare customer growth in our PostgreSQL CRM with event data in our analytics DB" }
```

Baseil handles the cross-database join automatically.

## Workflow: Customer Support Agent

Here's a practical workflow for a customer support AI agent:

1. Customer asks: *"Why was I charged twice?"*
2. Agent calls Baseil: `query_billing_db` → "Show recent charges for customer ID 12345"
3. Agent calls Baseil: `query_payments_db` → "Show payment processor logs for customer 12345 in the last 7 days"
4. Agent synthesizes both results and responds to the customer

No custom code. No database drivers. Just natural language through MCP tools.

## Best Practices

- **Scope your tools** — expose only the databases each agent needs
- **Use rules** — pre-define business terms so agents get consistent results
- **Monitor usage** — Baseil logs every query for audit trails
- **Cache hot queries** — pin frequently-asked agent queries for instant responses
