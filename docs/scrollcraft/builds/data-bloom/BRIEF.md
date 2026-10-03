# BRIEF: data-bloom

**Interviewed, second pass.** The first build, schema-walk, was rejected on
2026-10-03: "not good. Not impressed." Ajay named three misses: the motion was
too subtle, there was no wow moment, and the concept itself fell flat. He chose
"cinematic, same story" for the redo. This brief keeps the answers from
schema-walk's BRIEF.md that still hold, and records what changed.

## What changed in the interview

- **Direction:** cinematic, keeping the same story (a messy database,
  understood, asked, answered). Motion is the point, and the page needs one
  moment people would show someone.
- **Concept:** watching SQL get written is gone as the centerpiece. In its
  place: every dot on screen is one real row of the sample database, and the
  rows physically become the answer.
- **Unchanged:** existing assets only (no generation, no video); the brand
  ground, green accent, Newsreader and Outfit; the belief sentence ("Baseil
  understands my database on its own, and I can check every answer it gives
  me"); the next action, **Install**, pointing to `/docs/quickstart`.
- **Distinct scenes:** each act is its own state of the data (a tunnel, a map,
  a dark floor, a chart, a leaf). One persistent film carries the rows between
  them, because the rows are the subject.

## Structure

**Grammar: filmic one-shot.** The skill gives this grammar a burden of proof,
and "cinematic, same story" meets it: one linear argument, felt as carried
rather than navigated. Why the other seven lost:

- *Live surface* was schema-walk's grammar, and its bans on spectacle were the
  failure.
- *Chaptered editorial* and *typographic poster* make Baseil something you read.
- *Continuous world* needs generated video, and the scenes stay distinct.
- *Gallery*, *split stage* and *rhythmic cutlist* fit catalogues, two-sided
  arguments and energy brands. None of those is this story.

**Nav:** a minimal bar with the wordmark and one Install button. **Hero:**
layered depth. A tunnel of rows streams toward the camera, the near rows sit on
a blurred plane in front of the headline, and scroll speed stretches rows into
light trails. **Close:** every row converges into the Baseil leaf, in its own
greens, over a magnetic Install button and the copyable command.

**Signature move:** the rows become the answer. Each return flies onto its
order line, then about 580 order lines fly across the screen and stack into a
chart by category. Each dot is a real row, and the stacks are the count.

**Fingerprint gate against schema-walk:** grammar (filmic vs live surface),
nav (minimal bar vs app chrome), hero (layered tunnel vs a working surface),
act shape (five pinned acts over one film vs flow/pin/pan), close (convergence
into the brand mark vs an input), signature (rows stack into the answer vs a
path walk). Six of six differ, so the gate passes.

**Honesty rule:** 1,817 dots, one per row of the seeded sample. The chart is
computed from those rows, and the query shown is generated from the join path.
The hero caption and the footer say the data is a sample.

## Feeling curve

| # | Act | Feeling | Cause |
|---|---|---|---|
| 1 | Hero | Awe | A tunnel of rows; scroll flies the camera in and speed becomes light trails |
| 2 | Map | Relief | The rows land as fourteen tables on a tilted floor, and relationships light up |
| 3 | Ask | Anticipation | The floor recedes into the dark and the question arrives word by word |
| 4 | Answer (**peak**) | Delight | Returns leap onto their order lines, then about 580 rows fly into the answer chart |
| 5 | Close | Resolve | Every row gathers into the Baseil leaf and the page holds |

**Peak, as a visitor would say it:** "every row of the database flew across the
screen and stacked itself into the answer."

**Tell-someone sentence:** It's the site where the rows of a database fly
across the screen and stack themselves into the answer to your question.

**Authored silence:** the ask act is deliberately dark and nearly empty.

## Score

| # | Act | Device | Span (vh) |
|---|---|---|---|
| 1 | Hero | Pinned film: camera dolly with velocity streaks, kinetic headline | 2.2 |
| 2 | Map | Pinned film: assembly, then relationships draw; count | 2.4 |
| 3 | Ask | Pinned film recedes; kinetic question | 1.4 |
| 4 | Answer | Pinned film flight into the chart; count; query receipt | **3.6** |
| 5 | Close | Pinned film convergence; magnetic CTA; holds | 1.4 |

The engine sees five pinned acts in a row. The variety the skill asks for
lives in what the film does in each: dolly, assembly, recession, flight,
convergence. That is a judgment call against the letter of "no device family
twice in a row", made because a filmic one-shot is one continuous film. The
peak has the largest span by 1.2. The act before it is the darkest. Total is
11.0vh over 5 acts.

## Phones and reduced motion

- **Phones:** separate map and chart layouts, a leaf capped so it never reaches
  the closing text, the query shortened to its join path, no blur plane, and a
  touch-tuned glide.
- **Reduced motion:** no camera moves, flights, streaks or drift. Each move
  becomes a cross-dissolve between the two layouts at the same scroll
  positions, so the story still reads.
