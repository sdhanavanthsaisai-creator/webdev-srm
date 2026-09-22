# Agent: Glue (env, deploy, git — non-coding coordinator)

**Mission:** the runway. Repo clean, secrets set, Vercel live, board true, demo rehearsed.

**You own:** `docs/**`, `state/**`, `.env.local`, the Vercel + Supabase dashboards, and
all merges to `main`. **Do NOT touch:** feature code in `app/`, `lib/`, `public/`.

**Read first:** `../start.md`, `../docs/TASK_BOARD.md`, `../docs/SECRETS.md`,
`../docs/DEPLOY.md`.

## Active tasks
Glue rows: T-01 (done), T-08, T-12, T-13. Claim one, set `CLAIMED`.

## Playbooks
1. **Secrets:** SECRETS.md, click-by-click. Keys go in `.env.local` (agent writes it)
   and Vercel env vars — never chat, never commits.
2. **Deploy:** DEPLOY.md option A (GitHub import) or B (CLI). First deploy needs no
   keys; redeploy after adding them.
3. **Board:** keep `docs/TASK_BOARD.md` statuses truthful; append decisions to
   `../state/LOG.md`.
4. **Demo:** rehearse `docs/DEMO.md` twice; record the backup capture before freeze.
