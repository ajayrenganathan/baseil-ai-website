---
title: "Getting Started with Baseil"
description: "A step-by-step guide to connecting your first database and running your first natural language query with Baseil."
date: "2026-02-10"
author: "Baseil Team"
tags: ["getting-started", "tutorial", "setup"]
---

## What is Baseil?

Baseil is a data retrieval AI that crawls into your databases, maps every schema, and serves up answers — no config, no connectors, no drama. Whether you're a human asking questions in plain English or an AI agent calling through MCP tools, Baseil figures out where your data lives and gets it for you.

## Step 1: Install Baseil

Getting started is dead simple. Pull the latest version and run it locally:

```bash
# Clone the repository
git clone https://github.com/baseil-ai/baseil.git
cd baseil

# Install dependencies
npm install

# Start Baseil
npm run start
```

## Step 2: Connect Your Database

Point Baseil at your database. Currently, PostgreSQL is fully supported — more databases are coming soon.

```bash
# Add your connection string
baseil connect "postgresql://user:password@localhost:5432/mydb"
```

That's it. Baseil shakes hands with your database and starts crawling.

## Step 3: Auto-Discovery

Once connected, Baseil automatically:

- **Maps every table** in your database
- **Discovers columns** and their types
- **Identifies relationships** between tables (foreign keys, join paths)
- **Builds a semantic index** so it understands what your data *means*, not just its structure

You don't have to configure anything. Just wait a few seconds and Baseil has a complete map of your data.

## Step 4: Ask Questions

Now the fun part. Just ask:

```
> What were our top 10 customers by revenue last quarter?
```

Baseil will:
1. Parse your natural language query
2. Figure out which tables contain the relevant data
3. Write the SQL query
4. Execute it and return clean, structured results

```json
{
  "results": [
    { "customer": "Acme Corp", "revenue": 145200 },
    { "customer": "TechStart Inc", "revenue": 98400 },
    ...
  ],
  "query_time": "0.34s",
  "tables_used": ["customers", "orders", "order_items"]
}
```

## What's Next?

- **Add rules** to customize how Baseil interprets your data
- **Pin golden queries** to cache for instant results
- **Connect more databases** and query across them seamlessly
- **Expose MCP tools** for your AI agents

Welcome to the future of data retrieval.
