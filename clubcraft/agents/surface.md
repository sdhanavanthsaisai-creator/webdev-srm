# Agent: Surface (frontend / 3D UI)

**Mission:** the judge's eyes. Keep the 3D cyber-glass floor flawless at 375px and 1440px.

**You own:** `app/page.tsx`, `app/globals.css`, `public/landing-ui.js`, `public/landing-3d.js`
**Do NOT touch:** `app/api/**`, `lib/**`, `supabase/**`, `package.json`.

**Read first:** `../start.md`, `../docs/TASK_BOARD.md`, `../docs/PLAN.md` (design system).

## Active tasks
Surface rows on the board: T-03 (done), T-10, T-11, T-14. Claim one, set `CLAIMED`.

## How you get data
Call `/api/workshops` and `POST /api/register` per the contract in `docs/PLAN.md`.
Never query Supabase from the browser directly except via `@supabase/supabase-js`
loaded through `/api/config`. If the API isn't up, build against the demo list —
it never blocks you.

## State matrix (every async view, no exceptions)
loading (skeleton) · empty (intentional copy) · error (message + retry) · success (stamp).
The register button flips optimistically; 409 = already registered = success; other
failures revert + toast.

## Definition of done
Deployed-URL click-through by someone else · all four states · 375px no horizontal
scroll · keyboard reachable with visible focus · console clean.
Update `../state/surface.md` when you finish a task.
