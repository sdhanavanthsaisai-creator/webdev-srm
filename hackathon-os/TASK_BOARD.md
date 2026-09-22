# TASK_BOARD.md

The board is the contract. If it is not on the board, it is not being worked on.

**Owner of this file (structure):** Glue (Coordinator). **Everyone else:** you may edit
**exactly one row** — your own.

---

## Board

| ID | Task | Role | Owner | Branch | Status | Depends on | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-01 | Scaffold Next.js (App Router) + Tailwind + shadcn; empty shell deployed to Vercel | Surface | — | — | TODO | — | — |
| T-02 | Supabase project: email auth on; schema per PLAN §5 (profiles, workshops, registrations + unique constraint); RLS policies | Core | — | — | TODO | — | — |
| T-03 | Env vars named in `.env.example`, set in `.env.local` AND on Vercel; redeploy placeholder | Glue | — | — | TODO | T-01, T-02 | — |
| T-04 | Supabase SSR auth client + `/auth/callback` + session helpers; publish typed interface in the channel | Core | — | — | TODO | T-02 | — |
| T-05 | Login/signup page (name, email, password) with error + loading states | Surface | — | — | TODO | T-01, T-04 | — |
| T-06 | Auth gate: `/dashboard` bounces to `/login` when signed out; personalized greeting | Surface | — | — | TODO | T-04, T-05 | — |
| T-07 | `GET /api/workshops` — active workshops, soonest first | Core | — | — | TODO | T-02, T-03 | — |
| T-08 | Workshop grid on `/dashboard`: title, speaker, date, location from `/api/workshops` | Surface | — | — | TODO | T-06, T-07 | — |
| T-09 | `POST /api/register` — idempotent, `409` on duplicate, auth-scoped | Core | — | — | TODO | T-02 | — |
| T-10 | Register button flips to **Registered** instantly; error toast if the write fails | Surface | — | — | TODO | T-08, T-09 | — |
| T-11 | "My registrations" filter/tab on the dashboard | Surface | — | — | TODO | T-10 | — |
| T-12 | Demo account `demo@clubcraft.test`; `supabase/seed.sql` runs clean twice; end-to-end verified | Core | — | — | TODO | T-02, T-09 | — |
| T-13 | Empty/loading/error states + 375px pass on the demo path | Surface | — | — | TODO | T-08 | — |
| T-14 | `DEMO.md` rehearsed twice; backup screen recording captured; pitch prepped | Glue | — | — | TODO | T-10 | — |
| T-15 | Final deploy + smoke test on the deployed URL + submit | Glue | — | — | TODO | all | — |

> Written in **demo-order**: the Golden Path (`/login` → auth → `/dashboard` →
> Register → Registered) is the spine — T-05 → T-06 → T-08 → T-10. Everything else
> hangs off it. T-01 and T-02 are independent: Surface and Core claim them in parallel
> and do **not** wait for each other.

---

## Status vocabulary

Use exactly these words. No synonyms, no emoji, no "wip".

| Status | Means | Who sets it |
| --- | --- | --- |
| `TODO` | Not started, available | Anyone |
| `CLAIMED` | I own it, I am on it now | The owner, before starting |
| `IN_REVIEW` | PR open, waiting on a reviewer | The owner |
| `BLOCKED` | Cannot proceed; the `Note` column says on what | The owner |
| `DONE` | Merged **and** exercised by someone other than the author | The reviewer or owner |
| `CUT` | Decided out of scope. Stays on the board as a record. | Coordinator |

**WIP limit: 1 per person.** At most one row per person may be `CLAIMED` or
`IN_REVIEW`. Overwrite with `--` when you release it.

---

## Claiming, in full

1. **Check you are not stealing it.** The `Owner` cell must be `—` or you.
2. **Branch first, then edit the board** (so the board edit lands on your branch):
   ```bash
   git checkout main && git pull
   git checkout -b feat/T-07-fix-typo-in-chart
   ```
3. **Edit exactly one row**: add your handle to `Owner`, set `Status` to `CLAIMED`,
   fill `Branch`, add the current time to `Updated`.
4. **Commit the claim on its own**, so the claim is visible in `main` history fast:
   ```bash
   git add TASK_BOARD.md
   git commit -m "T-07: claim"
   ```
5. **Start work.** If you have not started within ~10 minutes of claiming, release it.

### Refreshing a claim

A claim older than **~45 minutes with no commits on its branch** is stale. Anyone may
take it — post a message, set the old owner to `—`, claim it. No hard feelings; the
clock does not care about feelings.

---

## Editing rules (this is where parallel work breaks)

This table is the only file *everyone* edits, so it is the only file that conflicts.
Four rules keep conflicts trivially resolvable:

1. **Touch only your own row.** Never fix a typo in someone else's row.
2. **Never reorder, never reformat, never re-align the table.** Append new tasks to the
   **bottom**. (Reordering = conflicts across the whole file.)
3. **No markdown formatters / no Prettier on this file.** Add `TASK_BOARD.md` to
   `.prettierignore`.
4. **Append long notes in the `Note` column, or in a new `tasks/T-XX.md` file** — do
   not paste paragraphs into the table.

### If the board conflicts anyway

Do not open a merge tool. Do this:

```bash
git checkout main -- TASK_BOARD.md      # keep the version already on main
```

⚠️ **Use `git checkout main -- <file>`, not `git checkout --theirs`.** During a *merge*,
`--theirs` means main — but during a *rebase* the meaning flips, and `--theirs` would
restore **your own** version instead. Since `CONVENTIONS.md` tells you to rebase stale
branches, the rebase case is the common one. Naming the branch (`main`) is correct in
both.

...then re-apply **only your own row** by hand and commit `"T-07: re-apply claim after
board conflict"`. Losing your one-line edit costs 20 seconds; resolving fifteen
interleaved rows costs twenty minutes.

### Second conflict in the same hour?

The board has outgrown a markdown file. Switch the source of truth to **GitHub Issues**
via the GitHub MCP server — one issue per task, labels for role, assignee for owner,
`in-progress` / `blocked` labels for status. GitHub merge-conflicts nothing. Keep this
file as a read-only index.

---

## Task writing guide

A task is well-written if a teammate could start it without asking a question.

**Good:**
> `T-04 | Booking form that writes a row and shows the confirmation with the real slot time | frontend | @riya | feat/T-04-booking-form | TODO | T-01 | — | —`

**Bad:**
> `T-04 | Do the booking stuff`

Include: the **user-visible outcome**, not the implementation; the **owner role**; the
**dependency**. If you cannot name the outcome, the task is really a spike — call it
`T-XX (spike): investigate X for 20 min` and timebox it.

### Task IDs

`T-NN`, sequential, never reused. Task IDs appear in branch names, commit messages, PR
titles, and the board. Grep the ID to see everything about a task:

```bash
git log --oneline --all --grep="T-07"
```

---

## Sprint log (newest first)

Append one line per swap or decision. Newest at the top. This is the team's memory.

| Time | Event |
| --- | --- |
| T+00 | Surface prototype on disk: `clubcraft/landing/index.html` — demo path standalone, switches to `GET /api/workshops` when Core's API answers; also the backup demo (`DEMO.md`) |
| T+00 | Team set: **Surface** (Coder A), **Core** (Coder B), **Glue** (Coordinator, non-coder) |
| T+00 | ClubCraft plan materialized from MASTER_PROMPT output; stack frozen: Next.js + Supabase + Vercel |
| T+00 | Next: everyone runs `scripts/mcp-healthcheck.sh`; Surface claims T-01, Core claims T-02 in parallel |
