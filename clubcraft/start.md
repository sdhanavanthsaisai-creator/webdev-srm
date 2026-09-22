# ClubCraft — start here

**The Golden Path (the only thing that must work):**
land on the 3D floor → **Sign in / Join** (Supabase Auth) → the floor loads live
workshops from `/api/workshops` → tap a plate → **Claim my seat** → the badge flips to
**Registered** and the write lands in Supabase → **MY SEATS** shows it.

**Stack:** Next.js 15 (App Router) · React 19 · Express-style API routes ·
Supabase Postgres + Auth · three.js r160 · Vercel.

**Roles:** Surface (frontend/3D UI) · Core (API + Supabase) · Glue (env, deploy, git).

- **Agents:** read [`agents/surface.md`](agents/surface.md), [`agents/core.md`](agents/core.md),
  or [`agents/glue.md`](agents/glue.md) — exactly the one for your lane.
- **Humans:** read [`STEPS_FOR_HUMANS.md`](STEPS_FOR_HUMANS.md) first. Zero jargon.
- **Board:** [`docs/TASK_BOARD.md`](docs/TASK_BOARD.md) — claim a row before working.

Non-negotiables: secrets only in `.env.local` (never chat, never git) · one task at a
time · nothing is DONE until someone else clicked it on the deployed URL.
