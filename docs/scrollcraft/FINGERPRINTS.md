# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| schema-walk (Baseil `/scroll`) | Live surface | App chrome: a sidebar (Connections, Activities, Chat, Serve, Install) and a status bar carrying connection state and the walk receipt; a top tab strip on phones | The Connections view already in a state: real table list and a read-only connection form, no media | flow > pin 2.4 > flow > pin 3.6 (peak) > pan 2.6 > flow; 6 acts, 11.5vh | An actual input: the install command in a selectable field, carrying the visitor's chosen question | The question walks the schema: a computed join path lights hop by hop, each hop writes its SQL clause, and the status bar keeps the receipt | Product UI as live markup plus a Beck-style SVG schema map; no photography, no video | 3100 |
| data-bloom (Baseil `/scroll`, replaces schema-walk) | Filmic one-shot | Minimal bar: wordmark and one Install button | A tunnel of real rows the camera flies into; near rows blur in front of the headline; scroll speed becomes light trails | pin 2.2 > pin 2.4 > pin 1.4 > pin 3.6 (peak) > pin 1.4 over one persistent particle film; 5 acts, 11.0vh | Every row converges into the brand mark; magnetic Install and the copyable command; holds | The rows become the answer: returns leap onto their order lines, then about 580 rows fly into the chart | Data as light: 1,817 row strips with additive glow, no photography, no video | 3100 |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Live surface with app-chrome navigation and a status-bar receipt** (schema-walk).
- **Scroll as the playhead of a computed path that writes its own code** (schema-walk). A later build needs a different signature, not this one on new data.
- **A close that is the install command as an input, carrying the visitor's earlier selection** (schema-walk).
- **schema-walk was rejected** on 2026-10-03 ("not good. Not impressed": motion too subtle, no wow moment, the concept fell flat). Its row stays; the lesson is that a live surface can bury the spectacle a marketing page needs.
- **Rows as particles that physically become the answer** (data-bloom).
- **A camera fly-through with scroll-speed light trails** (data-bloom).
- **A close where everything converges into the brand mark** (data-bloom).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
