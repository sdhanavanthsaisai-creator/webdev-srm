# start.md — AI agent entry point

You are one agent on a team of humans and agents building something in a few hours.
Read this whole file before your first action. Then read **exactly one** file from
`roles/` — the role you were assigned. Do not read every role file; you will act on
the wrong one.

**This project: ClubCraft — club workshop hub.** Golden Path: `/login` → Supabase auth
→ `/dashboard` → click **Register** on a workshop → see it flip to **Registered**,
saved to the database. Three lanes:

| Lane | Who | Role file(s) |
| --- | --- | --- |
| **Surface** | Coder A | `roles/frontend.md` |
| **Core** | Coder B | `roles/backend.md` **and** `roles/data.md` (one person, two hats) |
| **Glue** | Coordinator, non-coder | `roles/coordinator.md` |

The demo is designed in `PLAN.md` §3; the click-by-click script is `DEMO.md`.

---

## 0. Situate yourself (do this before anything else)

```bash
git rev-parse --show-toplevel    # confirm you are in the right repo
git status --short               # see what is uncommitted
git log --oneline -5             # see what shipped recently
```

Then read, in this order:

1. `PLAN.md` — what we are building and what we are explicitly NOT building.
2. `CONVENTIONS.md` — the rules, and the **file ownership map**.
3. Your file in `roles/`.
4. `TASK_BOARD.md` — find a task assigned to you / unclaimed.
5. The source files you own. Not the whole repo.

If `PLAN.md` still contains `<<FILL IN>>`, stop. The plan is not ready. Ask a human.

---

## 1. The loop

```
claim one task  →  branch  →  build  →  verify  →  commit  →  push  →  PR  →  merge
      ↑                                                                        │
      └──────────────────────  next task, same loop  ──────────────────────┘
```

Never work on two tasks at once. Never start a task someone else owns. Never push to
`main`.

---

## 2. Claiming a task

A task is claimed when your name is on its row in `TASK_BOARD.md`. No row edit, no
claim. The full protocol, conflict recipe, and status vocabulary are in
[`TASK_BOARD.md`](TASK_BOARD.md) — read it before your first edit. The short version:

1. Pick the oldest unblocked `TODO` task you own, or ask for one.
2. Change its `Status` to `CLAIMED` and put your handle in `Owner`. **Touch only that
   one row.** Do not reformat the table.
3. Commit that single-line change immediately: `git commit -am "T-07: claim"` (after
   branching). A board change sitting unstaged is how two people end up on one task.
4. Branch: `feat/T-07-short-slug` (see `CONVENTIONS.md` for naming).

---

## 3. Rules that are not negotiable

| # | Rule | Why |
| --- | --- | --- |
| 1 | **Never commit secrets.** No keys, tokens, or connection strings in any tracked file. `.env.local` only. | A leaked key mid-hackathon is unrecoverable. |
| 2 | **Never `git add -A` or `git add .`.** Add the specific files you changed. | This repo has nested/unrelated directories. Staging broadly leaks them. |
| 3 | **Never force-push a shared branch.** | Someone else's work disappears and you can't get it back in time. |
| 4 | **Edit only files you own.** | Two agents editing one file = a conflict nobody has time to resolve. |
| 5 | **`package.json`, `package-lock.json`, `*.config.js`, DB migrations, and `components.json` have exactly one owner.** | Lockfile conflicts from parallel `npm install` are the #1 time sink. |
| 6 | **Ask before adding a dependency.** | Half-installed libraries at hour 8 are fatal. |
| 7 | **Do not refactor outside your task.** | Note it as a new task instead. |
| 8 | **Do not weaken a test or a type to make something pass.** | Fix it, or leave it failing and flag it. |

---

## 4. MCP usage rules

These servers exist so you do not guess. Use them in this order of preference.

- **Context7 — before you write against any library API.** Do not write Stripe /
  Supabase / Next.js / any-SDK code from memory. Look up the current API first.
  Treat your training data as stale.
- **shadcn MCP and Magic MCP — for UI.** Build interfaces from real registry
  components instead of hand-rolling markup. Do not hand-write a component that the
  registry already has.
- **Playwright MCP — before you mark any UI task DONE.** Click the real feature in a
  real browser. If you cannot click it, it is not done.
- **Supabase MCP — for all schema work and queries.** Do not ask a human to run SQL in
  a dashboard. Do it, or read it, yourself.
- **GitHub MCP — for branches, issues, and PRs.** Keep history clean without hand-typing
  git commands.

**If an MCP server is not responding, do not debug it for more than 10 minutes.**
Fall back immediately (manual `git`, manual SQL in the dashboard, hand-written JSX),
say so in the PR description, and tell a human. `MCP_SETUP.md` has a fallback for each.
A broken tool must never become the reason the demo doesn't happen.

---

## 5. Definition of Done

A task is DONE when **all** of these are true. Not before.

- [ ] It runs on the deployed/preview URL or `localhost` — the real thing, not a mock.
- [ ] The happy path works, **and** you know what happens on the obvious bad input.
- [ ] Someone other than the author exercised it (Playwright click-through, a real
      query, or a real request). Author-only testing does not count.
- [ ] No new console errors and no new failed network requests.
- [ ] `TASK_BOARD.md` row is set to `DONE` with a timestamp.
- [ ] PR is merged, or explicitly waiting on a reviewer, with a one-line note on how
      to verify it.
- [ ] Any secret it needs is in `.env.local` **and** documented by *name* in `.env.example`.

If it works on your machine but not on the preview URL, it is not done. Deployment is
part of the feature.

---

## 6. When you are blocked

Do not spin. Do not silently pick up a different task. Do not "fix" someone else's file.

1. Set your board row to `BLOCKED` and write the blocker in one line: who or what you
   need. Commit that.
2. Post it in the team channel.
3. If the blocker will outlive 15 minutes, start your **next** unblocked task and say
   which one you picked up.
4. If you are blocked on a *decision*, the Coordinator decides in 60 seconds. Shipping
   beats being right.

---

## 7. Communicating

- **PR description is your status report.** What changed, how to verify it, what you
  did not do. Write it for a tired teammate at 3am, not for a reviewer.
- **Commit messages are terse and prefixed with the task ID:** `T-12: add booking form validation`.
- **Do not summarize this file back to anyone.** It is a spec, not a conversation
  starter. Act on it.
- **Report what actually happened.** If a test failed, say so. If you skipped a check,
  say so. An accurate "not done yet" is worth more than a confident "done".
