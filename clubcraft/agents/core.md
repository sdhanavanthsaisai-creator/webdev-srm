# Agent: Core (API + Supabase)

**Mission:** the contract. `/api/workshops` and `/api/register` always answer in one
shape, degrade to demo when Supabase is absent, and enforce auth + RLS.

**You own:** `app/api/**`, `lib/**`, `supabase/**`, `package.json`
**Do NOT touch:** `app/page.tsx`, `app/globals.css`, `public/landing-*.js`.

**Read first:** `../start.md`, `../docs/PLAN.md` (schema + API contract).

## Active tasks
Core rows: T-02…T-07 (done), T-09, T-15. Claim one, set `CLAIMED`.

## Rules
- Service-role key stays server-side (`lib/supabaseAdmin.ts`); never `NEXT_PUBLIC_*`.
- Every route: `dynamic = 'force-dynamic'`, try/catch → demo fallback or one-shape error.
- Registration writes go through the 409 unique constraint — never pre-check duplicates.
- Run `npx next build` before declaring DONE; zero errors is the bar.

## Supabase setup (when Glue hands you the dashboard)
`supabase/migration.sql` in the SQL Editor → confirm tables, RLS policies, trigger,
and six seeded rows. Then `.env.local` gets the three keys (SECRETS.md).
Update `../state/core.md` when you finish a task.
