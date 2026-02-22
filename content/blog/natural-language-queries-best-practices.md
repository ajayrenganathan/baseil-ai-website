---
title: "Writing Better Natural Language Queries"
description: "Tips and patterns for getting the most accurate results from Baseil's natural language query engine."
date: "2026-02-12"
author: "Baseil Team"
tags: ["tips", "queries", "best-practices"]
---

## The Art of Asking

Baseil is remarkably good at understanding what you mean, but like any tool, there are ways to get even better results. Here are patterns we've seen work well.

## Be Specific About Time

Instead of vague time references, be explicit:

| Less Effective | More Effective |
|---|---|
| "recent orders" | "orders from the last 30 days" |
| "old customers" | "customers who signed up before 2024" |
| "this month's data" | "data from February 2026" |

## Name Your Entities

If you know the table or column names in your database, mentioning them helps Baseil route queries faster:

```
> Show me the `users` table joined with `subscriptions` where plan is premium
```

You don't *have* to do this — Baseil figures it out — but it speeds things up.

## Use Aggregation Words

Baseil understands common aggregation patterns:

- **"total"** → SUM
- **"average"** → AVG
- **"count"** or **"how many"** → COUNT
- **"highest"** or **"top"** → ORDER BY DESC LIMIT
- **"lowest"** or **"bottom"** → ORDER BY ASC LIMIT
- **"group by"** → GROUP BY

```
> What's the average order value grouped by country for the last quarter?
```

## Leverage Rules

Rules let you teach Baseil your business logic:

```
> Add rule: "active customer" means a customer with at least one order in the last 90 days
```

Now every query that mentions "active customers" uses this definition automatically.

## Chain Questions

Baseil remembers context within a session. You can refine:

```
> Show me all orders over $1000
> Now filter those to just premium customers
> What's the total revenue from that set?
```

Each question builds on the last.

## Golden Cache

Found a query you run often? Pin it:

```
> Pin this query as "daily-revenue-report"
```

Next time, just ask for your "daily revenue report" and get instant cached results.

## Common Pitfalls

1. **Don't over-specify the SQL** — let Baseil figure out the joins
2. **Don't assume column names** — ask "what columns does the users table have?" first
3. **Use feedback** — thumbs up/down helps Baseil learn your preferences
