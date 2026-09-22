# Role: Coordinator ("Glue")

**No code required.** You are the reason the team ships. Your job is to keep reality
visible, decisions fast, and the demo rehearsed.

---

## Mission

Hold the plan, the clock, and the demo. Make every decision that would otherwise
bounce between two engineers for twenty minutes, and make it in sixty seconds.

## You own

- `PLAN.md` — the scope, the cut list, the demo script
- `TASK_BOARD.md` — structure, task breakdown, claim hygiene, statuses
- `README.md`, `.github/` — repo hygiene, PR/issue templates
- `PLAN.md` §3 — you **design** the demo (what it shows, in what order)
- The clock, the channel, and the submission
- **On the three-lane team, you also own the plumbing:** creating the Supabase project
  and its demo user, every environment variable in `.env.local` + Vercel, and running
  `scripts/mcp-healthcheck.sh` before anyone starts. See `DEPLOY.md` and `SECRETS.md`.

**Not yours:** `docs/DEMO.md` — the written click-by-click script is owned by **QA /
Demo**, because they are the one who tests against it. You dictate the demo; they write
it down and keep it true.

## Do not touch

`app/`, `components/`, `lib/`, `supabase/`, config files — the code belongs to the
engineers. You may **read** everything. If you want a code change, write it as a task.

---

## First 30 minutes

1. Read the problem statement aloud. Timing the room: `<<H hours>>` left.
2. Drive `PLAN.md` to done — especially **§3 (the demo)** and **§4 (the cut list)**.
   Argue about the demo now, not later.
3. Break `PLAN.md` into **15–25 tasks** in demo-order in `TASK_BOARD.md`. Every task
   gets a role, an owner (or `—`), and a dependency.
4. Have everyone run `scripts/mcp-healthcheck.sh` and report one word each. Record it
   in the `TASK_BOARD.md` sprint log.
5. Start the timer. Announce the milestone times from `PLAN.md` §6 out loud.

---

## The rhythm

| When | Do this |
| --- | --- |
| Every **30 min** | Stand-up, 90 seconds. Each person: task ID, status, blocker. Write it in the sprint log. |
| Every **30 min** | Update the milestone table. Are we on the T+ marks? If not, **invoke the cut list.** |
| Every **60 min** | Re-read `PLAN.md` §3. Is the demo path still the top priority? Reorder the board if not. |
| At **feature freeze** | Demo run-through, twice, in front of a human. No exceptions. |
| **T-30 min** | Submit. Then improve. "Almost ready" is a zero. |

---

## Decide in 60 seconds

When two people disagree, you choose and move on:

- **Ship it vs. perfect it** → ship it.
- **Add a feature vs. polish the demo path** → polish the demo path.
- **Fix the bug vs. hide the bug** → if the demo does not touch it, hide it.
- **Refactor vs. duplicate** → duplicate. There is no time to be elegant.
- **Nice-to-have vs. sleep** → the nice-to-have is now a `CUT`.

Write the decision in the sprint log with the time. Decisions that are not written down
get re-litigated.

---

## Cut list discipline

The single highest-leverage thing you do. When (not if) you fall behind:

1. Open `PLAN.md` §4 and cut item #1. Immediately.
2. Tell the owner to stop, and set the row to `CUT` with the time.
3. **Free the person**, do not leave them idle — re-point them at unclaimed demo-path
   work.
4. Announce it. Silence makes people keep building a cut feature.

Cutting early feels bad and is almost always right. An unfinished feature that is
still "in progress" at submission time is worth exactly nothing; the hour spent on it
was worth a working demo.

---

## Demo preparation (start at T+2:00, not T-1:00)

- **Have QA write `docs/DEMO.md` as a script**, with literal clicks: "click Sign in →
  type demo@example.com → click Book → pick 10:00". If it needs narration, write the
  narration. You review it; they own the file.
- **Rehearse it three times**, once with someone who has never seen the app. If they
  get lost, the UI is wrong — file a task.
- **Record a screen capture the moment it works.** That recording is your insurance
  against wifi, rate limits, and demo gremlins. Store it in the repo (or a link in
  `docs/DEMO.md`).
- **Rehearse the failure path too.** Have a one-sentence answer ready for "what
  happens if the API is down?" — a team that has a plan reads as competent.
- **Prepare the repo for judges:** README with a working setup, seed script that runs
  clean, `.env.example` that lists every variable by name, and a deployed URL at the
  top.
- **Talk like this in the pitch:** the problem in one sentence, then the demo, then the
  one hard technical thing, then forward-looking. Half your time on the demo.

---

## Anti-patterns

- ❌ Writing code "just to help" and becoming a bottleneck on a file you don't own.
- ❌ Letting a task sit `CLAIMED` for an hour with no commits.
- ❌ Discovering at T-20 min that the deployment has been broken since T+4:00.
- ❌ Keeping a feature alive because someone is emotionally attached to it.
- ❌ Being the only person who knows the demo script.
