---
title: "Chat Interface Guide"
description: "Ask your data questions in plain English. Read the transparency panel. Train Baseil with feedback and rules."
order: 3
category: "guides"
---

This guide is for the person who wants answers from a database without learning SQL. If you've ever copy-pasted a question into the #data channel on Slack and waited for someone to run it, you'll feel at home here. Same questions, same answers, minus the wait.

## Asking questions

The chat takes natural language. That's the whole point. A few patterns that work well:

- "How many users signed up last week?"
- "What's the top product by revenue this quarter?"
- "Show me orders over $500 in the last 30 days."
- "Compare new customers in March to February."

Specificity helps. "Last month" is ambiguous, and Baseil will usually ask what you mean. "In October 2026" is not. The more concrete your reference points (dates, thresholds, specific entities), the more confident the answer.

You don't need to mention table names. Baseil already knows the schema. But if you want to, it works.

## Using @mentions to target a database

When you have multiple databases connected, you can disambiguate by mentioning the connection:

```
@analytics.orders show me yesterday's revenue
```

Without the mention, Baseil picks the connection it thinks is most relevant. With the mention, you pin the query to a specific place. Useful when you have similar tables in multiple systems, or when you want to be explicit about what you're asking.

You can also mention just the connection:

```
@warehouse what do you have?
```

That nudges Baseil to describe the schema of that connection specifically.

## Reading the response

Every response has four parts:

- **The natural-language answer.** A human-readable summary at the top.
- **The tool that ran.** The name of the query template Baseil picked (e.g. `list_orders_with_filters`). Useful for understanding why you got the answer you did.
- **The query.** The actual SQL (or Elasticsearch DSL, or API call) that was executed. You can copy it and run it yourself.
- **Metadata.** Row count, execution time, timestamp.

The transparency matters. You don't have to trust that Baseil got it right, you can verify. If the number looks wrong, check the SQL. Nine times out of ten the issue is clear from reading the query.

## Giving feedback

Every response has thumbs up and thumbs down. Use them liberally.

- **Thumbs up** reinforces the pattern. Similar questions in the future get more weight toward the same tool, the same shape of answer.
- **Thumbs down** flags the response. You can add a short note explaining what was wrong, and optionally convert it into a rule on the spot.

Feedback doesn't replace rules for systematic behavior changes, but it's a fast signal. Over time, the thumbs shape how Baseil reads your team's questions.

## Pinning queries to the golden cache

Some questions get asked over and over. Weekly revenue, daily active users, monthly churn. When you get an answer you want to reuse, pin it to the **golden cache**.

Pinned queries:

- Get reused instantly for semantically similar questions (matched via embeddings)
- Skip tool selection (the cached tool is used directly)
- Show up in an audit view so you can see what's being pinned

Pin reports you run frequently. Pin canonical answers you want the team to align on. Don't pin one-offs, they just clutter the cache.

## Rules quick tour

Rules are how you teach Baseil things that aren't in the schema. A quick example:

> "Revenue" means the `net_revenue` column in `orders`, not `gross_revenue`.

That's a synonym rule. Once it's in place, any question with "revenue" in it preferentially looks at `net_revenue`. Rules also cover join hints, table priority, data type interpretations, and routing between connections.

Full rule reference is on the docs roadmap. For now, the **Rules** tab in the web UI has the main rule types with inline descriptions.

## When the answer is wrong

Baseil is wrong sometimes. The important thing is that you can tell, quickly, when it is.

Troubleshooting checklist:

1. **Read the SQL.** Does it target the right tables? Does the filter match your question?
2. **Check the tool.** Maybe the wrong tool was picked. A different question phrasing might route to the right one.
3. **Add a rule.** If a specific word or phrase keeps getting misinterpreted, a rule fixes it everywhere.
4. **Pin a golden query.** For canonical reports, pin the right answer so future similar questions use it.

If the SQL is correct but the number still looks off, the data is the problem, not the query. Happens.

## Next

- [MCP setup for agents](/docs/mcp-setup)
- Blog: [Writing Better Natural Language Queries](/blog/natural-language-queries-best-practices)
- Blog: [Ask Your Database Anything Without Writing SQL](/blog/ask-your-database-without-sql)
