# ClubCraft — app workspace

The ClubCraft app lives here (Next.js App Router + Supabase + Vercel — see
[`../hackathon-os/PLAN.md`](../hackathon-os/PLAN.md) §5). Nothing is scaffolded yet;
**T-01** (`create-next-app`, Tailwind, shadcn) happens in this folder, and paths like
`app/`, `components/`, `lib/`, `supabase/` resolve from here.

## `landing/` — the Surface lane prototype (works right now)

`landing/index.html` is a single-file, zero-build implementation of the workshop floor:
the demo path (floor → session details → claim a seat → my seats) with loading, empty,
error, and success states, optimistic registration, and 409 handling. Open it by
double-clicking — no server, no install, no build.

### How it talks to the app (the integration seams)

| Seam | Behavior |
| --- | --- |
| `GET /api/workshops` | Called on load when served over HTTP. Answers → the page renders **your real sessions** (soonest first, as sent) and flips to live mode. No answer (no server, 404, bad payload, 1.5s timeout) → the 6 built-in demo sessions. |
| `POST /api/register` | In live mode, claiming a seat flips the button **first**, then posts `{ workshop_id }`. `200`/`409` → kept (409 = already registered, not an error). Anything else → the flip is reverted and a retry toast appears. In demo mode there is no round-trip; seats persist locally. |
| `registered: true` per item | Optional extra on `GET /api/workshops`; if Core includes it, already-registered state is correct on **first paint** (FR-11) with no localStorage cache. |
| `role` / `dur` per item | Optional extras used on the ring plates and detail panel; the page degrades gracefully without them. |
| `<meta name="cc-api">` | Override the API origin (e.g. `http://localhost:3000`) when the page is served from somewhere else. Empty = same origin. |

The 6 demo sessions are the **canonical seed list** for `supabase/seed.sql` — keep the
two in sync so the prototype and the seeded database tell the same story.

### Why keep it

It is the backup demo. If the deployed app or the venue wifi fails on stage, this file
still runs the golden path from disk — and it is the design/behavior reference when
porting the floor into `app/`.
