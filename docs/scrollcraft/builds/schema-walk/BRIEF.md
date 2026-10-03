# BRIEF: schema-walk

**Interviewed.** Ajay chose the route in a first round (preview route `/scroll`,
distinct scenes, existing assets only). He then asked for help with the other
answers: Claude drafted them from the site's copy, the published docs, and a
reference study, and Ajay approved them unchanged on 2026-10-03 ("go"). The
answers below are those approved drafts. Where a fact in the docs forced a
change during planning, it is listed under **Authored adjustments**.

## The interview

1. **Vibe.** "Calm, exact, quietly alive." References: Harry Beck's 1933
   Underground diagram (a tangle made legible), *Her Story* (type into a
   database and answers surface), Ramón y Cajal's neuron drawings (structure
   surfacing out of dense tissue).
2. **Journey.** (1) You land on a database as it really is: a long list of
   table names nobody fully remembers. (2) You hand Baseil one connection, and
   the tables, columns, and relationships draw themselves into a map. (3) One
   plain-English question sits there, waiting. (4) The question walks the map,
   and the answer lands with its SQL showing. (5) The same answer goes out
   through more than one door. (6) The page ends on the install command.
3. **Energy.** Calm and sparse at the open, building as the map draws, near
   silence for one screen before the question, most intense at the peak, then
   a still, quiet close.
4. **Feeling, stage by stage.** Recognition ("that's my database"), curiosity
   turning to relief, anticipation, trust plus delight, breadth, resolve.
   **The one moment:** "I asked a question and watched it walk through a map
   of the database, table by table, writing the SQL as it went. Then the
   answer landed with the query right there."
5. **Something no other site does.** The question walks the schema. Scroll is
   the playhead of a real join path computed over a labelled sample schema.
   Each hop writes its SQL clause, and a receipt of the tables touched
   accumulates at the edge. The visitor picks one of three questions, and the
   chosen question follows them to the close.
6. **Range.** Dense, on the current dark ground with the green accent, using
   Newsreader and Outfit. Small mono labels for real data. No gradient text and
   no glow. The mascot appears as Baseil's avatar in the answer, not as a
   marketing hero.
7. **World or scenes.** Distinct scenes.
8. **Assets.** Existing only: the mascot PNGs, the product's real vocabulary
   rebuilt as live markup, SVG, and type. No generation, no video.

**Step 1.** *What it is:* Baseil, a local AI data harness that maps a database
on its own and answers people and agents in plain English, showing the SQL
behind every answer. *Believe by the end:* "Baseil understands my database on
its own, and I can check every answer it gives me." *Next action:* **Install**,
pointing to `/docs/quickstart`. The close shows the real command from
`src/lib/install.ts` in a field the visitor can copy.

## Authored adjustments

- **No invented API.** Beat 5 was drafted as chat, MCP, and an API. The docs
  document no query API endpoint, so the third door is the **Activities** log
  (documented: every tool call, its parameters, the query that ran, the result
  metadata). That also serves the belief sentence better. Restore an API door
  only once an endpoint is documented.
- **No display headline.** The live surface grammar forbids 6rem section
  headings. The serif becomes the page's plain-English voice (questions,
  answers, narration) at moderate sizes, mono is the machine's voice (tables,
  SQL, JSON), and Outfit is the app chrome.
- **One connection, not one string.** The documented Add Connection form asks
  for name, type, host, database, and a read-only user. The page shows that
  form state rather than claiming a single connection string.

## Structure

**Grammar: live surface.** The honest pitch is "watch what it does", and the
peak is the product working. Why the other seven lost:

- *Filmic one-shot* needs scrubbed video (no ffmpeg, no generation key) and
  carries a burden of proof this brief does not meet.
- *Chaptered editorial* would make Baseil something you read about. The brief
  is about watching it work.
- *Continuous world* was ruled out by the interview (distinct scenes).
- *Typographic poster* has type for imagery and no room to show the product
  operating.
- *Gallery / catalog* has no collection of objects to walk.
- *Split stage* was the closest rival. But "raw database versus Baseil" would
  be a straw man, and the peak is a process, not a balance tipping.
- *Rhythmic cutlist* is for energy brands. The vibe is calm and exact.

**Nav:** app chrome. A sidebar (Connections, Activities, Chat, Serve, then
Install) is the navigation. A status bar carries the connection state and the
walk receipt. On phones the sidebar becomes a top tab strip. **Hero:** the
Connections view, already in a state. Per hero-depth.md, a working surface
needs no invented marketing hero. **Close:** an actual input, the install
command in a selectable field, with the visitor's question carried into it.

**Signature move:** the question walks the schema (interview answer 5).

**Fingerprint gate:** the registry was empty, so this first build clears it
vacuously. Its row is appended after shipping.

**Honesty rule:** every panel computes from data arrays in the page. Paths
come from a breadth-first search over the sample foreign keys, SQL is
assembled from that path, and answers are computed from seeded sample rows in
the browser. The surface says "Sample data" on its face throughout.

## Feeling curve

| # | Act | Feeling | Cause |
|---|---|---|---|
| 1 | Connections | Recognition, a small wince | 14 tables in mono, three of them obvious cruft, nothing onboarded |
| 2 | Activities | Curiosity turning to relief | the map draws itself while the documented onboarding stages tick to done and real counts climb |
| 3 | Ask | Anticipation | one screen of near silence: a darker ground, one input, three questions to pick from |
| 4 | Walk (**peak**) | Trust plus delight | the chosen question lights a path hop by hop, each hop writes its JOIN, and the answer wipes in under the finished SQL |
| 5 | Serve | Breadth | the same answer slides past as chat, an MCP call, and an Activities entry |
| 6 | Install | Resolve | the page stops moving, and the input holds your question and the install command |

**The peak** lives in act 4. A visitor would tell a friend: "I picked a
question and watched it walk across a map of the database, writing the SQL as
it went, and the answer showed up with the query right there."

**Tell-someone sentence:** It's the site where you pick a question and watch it
walk through the database, table by table, until the answer lands with its SQL
attached.

**Authored silence:** act 3 is deliberately sparse. A near-empty screen there is
intended, not dead scroll.

## Score

| # | Beat | Device | Span (vh) | Why this one |
|---|---|---|---|---|
| 1 | Recognition | `flow` (surface present at first paint) | ~1.0 natural | The hero must be a surface already in a state, so nothing fades in |
| 2 | Discovery | `pin` + `count` + bespoke line draw | 2.4 | The frame holds while the structure assembles. Counts are real totals of the sample schema |
| 3 | Anticipation | `flow` + `in` | ~0.9 natural | Quiet before the peak. Real controls, not a pinned stage |
| 4 | The walk (peak) | `pin` + bespoke walk + `reveal` | **3.6** | The largest span by a full viewport. The reveal is the change of state from question to answer |
| 5 | Breadth | `pan` | 2.6 | Lateral travel reads as options, and these are three doors to one answer |
| 6 | Resolve | `flow` + `in` | ~1.0 natural | The close is an input, and it holds |

Checks: five device families (flow, pin, count, reveal, pan), no family twice
in a row, no scrub, the peak's span is the largest by 1.0, and the act before
the peak is the quietest. Drift uses two stops (the canvas, then a darker
ground for ask and walk). Total is about 11.5vh over 6 acts, outside the
13.6 to 13.8vh band.

## Mobile and reduced motion

- **Phones.** The map has its own three-column layout, and every edge stays a
  straight run, as on Beck's diagram. In the walk, the answer takes the map's
  slot when it lands, so the SQL stays visible above it. Chrome becomes a top
  tab strip plus a one-line status bar.
- **Reduced motion.** No line drawing, rises, or wipes. Edges, path hops, and
  SQL lines step in by opacity at the same scroll positions, so the sequence
  still reads. The pan rail falls back to the engine's scroll region.
