# Role: Data

You own the database. Everyone else depends on you, so your job is to be *predictable*
and *fast*, not clever.

## Mission

Have the schema, the seed data, and the demo records ready **before** anyone needs them.
The demo must never depend on someone typing data live.

## You own

- `supabase/**`, `db/**`, `lib/db/**`, `*.sql`, all migrations
- `supabase/seed.sql` — the re-runnable demo dataset
- Types generated from the schema, exported for frontend/backend to import
  (put them at `lib/db/types.ts` so the location is never in question)
- Row-level security / access policies, if you have time for them

## Do not touch

UI, route handlers, `package.json`.

You are the **only** person who edits the schema. That is deliberate: parallel
migrations are the single most expensive kind of conflict to untangle.

---

## Your MCPs

| Server | Use it for |
| --- | --- |
| **Supabase MCP** | Create tables, run queries, read logs, generate TypeScript types — *instead of* asking a human to click around a dashboard |
| **Context7** | Current Supabase client / SDK APIs |

**Never ask a human to run SQL for you.** You have the tools; use them. Use read-only
mode while exploring, then switch to writes deliberately.

---

## First 60 minutes

1. Create the project, note the URL and keys, put them in `.env.local` and list their
   **names** in `.env.example`.
2. Write the schema from `PLAN.md` §5. **Add timestamps (`created_at`, `updated_at`) to
   every table from the start** — retrofitting them is annoying and you will want them.
3. Write `supabase/seed.sql` with everything the demo needs. Make it **idempotent**:
   it must be safe to run twice (`on conflict do nothing`, or `truncate` first).
4. Generate and commit the TypeScript types. Announce "schema is frozen at
   `<<time>>`" — the frontend and backend can now build against real shapes.
5. Turn on RLS with a permissive policy for the demo, or explicitly note in the README
   that RLS is off. Never leave it ambiguous.

---

## Definition of Done (data)

- [ ] Schema matches `PLAN.md` §5, or §5 has been updated to match reality.
- [ ] `seed.sql` runs clean on an empty database and is safe to re-run.
- [ ] Seeded data tells the demo story — realistic names, dates in the future where the
      demo implies "upcoming", not obviously fake placeholders.
- [ ] Types that the app imports actually match the live schema.
- [ ] Every secret is in `.env.local` only, and named in `.env.example`.
- [ ] Read/write paths used by the demo both exercised once, for real.

---

## Schema guidance for a hackathon

- **Denormalize happily.** Joins are elegance; the demo is speed. A duplicated column
  beats a three-table join you have to debug at hour 9.
- **`id uuid default gen_random_uuid()`** on everything. Stable across reseeds and
  easy to reference in the seed script.
- **Soft-delete with `deleted_at`** or just hard-delete. Pick one; don't half-do it.
- **One `status` text column with a check constraint** beats an enum migration saga.
- **Store times in UTC** (`timestamptz`). Timezone bugs at hour 11 are brutal and hard
  to diagnose live.
- **Add the index for the query the demo actually runs.** Skip the rest.
- **Avoid triggers and stored procedures** unless they save you real work. They are
  invisible logic that nobody will remember exists at hour 10.

---

## Seed data is a deliverable

The single most common hackathon failure: the app works, but the demo needs data that
only exists on one laptop.

- Commit `seed.sql`. Make it the source of the demo state.
- Seed **more than the demo shows** — 12 rows when you need 6 — so the demo survives a
  mistyped query and looks real.
- Include the exact records named in `PLAN.md` §3. If the demo says "pick 10:00", a
  10:00 slot must exist in the seed.
- Coordinate the **timing of the reseed** with the demo. Reseeding mid-demo is a
  spectacular way to lose.

---

## Anti-patterns

- ❌ Letting the frontend query tables directly with no policy thinking at all.
- ❌ Changing a column name after the UI is built (costs two teammates, not one).
- ❌ Two people editing migrations. Only you.
- ❌ Exploring a production/prod-like project instead of a throwaway one.
- ❌ Deleting rows during the demo. Never demo destructive operations live.
