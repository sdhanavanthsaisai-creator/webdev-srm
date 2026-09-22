# MASTER_PROMPT.md

Paste the block below into any AI coding agent, with **§INPUTS** filled in. It generates
(or regenerates) the whole `hackathon-os/` folder tailored to your problem statement —
plan, board, roles, human setup, secrets walkthrough, MCP setup, and health check.

Use it in the first 15–20 minutes. Commit the output **before** writing any feature code.

**Filling it in takes 3 minutes:**
1. Replace `<<PROBLEM STATEMENT>>` with the official text, word for word.
2. Replace the stack line if the hackathon mandates something else.
3. List your real teammates and roles — the generated ownership map depends on it.
4. Paste. Review. Commit. Then start claiming tasks.

---

## The prompt

````text
You are setting up the operating system for a team hackathon BEFORE any feature code is
written. Your entire output is documentation and scaffolding. Do not write application
features. Do not modify existing source files.

## INPUTS

PROBLEM STATEMENT (verbatim):
"""
<<PROBLEM STATEMENT>>
"""

HACKATHON / TRACK: <<name, sponsor, track>>
TOTAL TIME: <<e.g. 12 hours>>
TEAM: <<e.g. 4 people — 1 frontend, 1 backend, 1 data, 1 coordinator>>
MANDATED STACK (if any): <<e.g. must use Supabase + Gemini API>>
OUTPUT DIRECTORY: hackathon-os/

## TASK

Create an agent-readable plan and coordination layer in OUTPUT DIRECTORY with EXACTLY
these files. Match the schemas described. Keep everything concrete and terse — this is
an operating document for tired people under time pressure, not prose.

1. `README.md` — Orientation. Table of "if you are X, read Y". A minute-by-minute
   20-minute cold-start runbook. A file inventory. The 3 rules that make parallel work
   possible. Team-size shortcuts (solo / 3-person / 6-person role collapsing).

2. `start.md` — The single file an AI agent is pointed at. Must contain:
   - A "situate yourself" section with the exact git commands to run first.
   - A mandatory reading order (PLAN -> CONVENTIONS -> your one role file -> board).
   - The work loop: claim -> branch -> build -> verify -> push -> PR -> merge.
   - A non-negotiable rules table (never commit secrets; never `git add -A`; never
     force-push; edit only owned files; one owner per lockfile/config/migration; ask
     before adding a dependency; no refactoring outside your task; never weaken a test).
   - MCP usage rules: look up library APIs before writing against them; use registry
     components before hand-writing UI; click through UI in a real browser before
     calling it done; do SQL directly instead of asking a human; keep git history clean.
   - A hard "10-minute rule" for broken tooling: take the fallback, report it, move on.
   - A Definition of Done checklist including "exercised by someone other than the author".
   - A blocked protocol: mark BLOCKED, say what you need, switch tasks after 15 minutes.

3. `PLAN.md` — The single source of truth for WHAT. Sections: the problem statement
   verbatim; a one-sentence plain-English restatement; constraints; primary user; the
   one sentence you want the judge to remember; **a 3-part demo script table** (step,
   screen, what the judge sees, owner) with a pre-seeded-data requirement; scope IN;
   scope OUT; an ORDERED cut list; the freeze time; technical shape with a data model
   table; milestones with time gates; a risk table with pre-decided plan Bs; a roster
   table mapping people -> role file -> owned paths -> MCPs.
   Seed it from the problem statement above. Every `<<FILL IN>>` is acceptable ONLY
   where a human must decide — mark those clearly.

4. `TASK_BOARD.md` — A markdown table: ID | Task | Role | Owner | Branch | Status |
   Depends on | Updated. Break the demo path into 15-25 tasks IN DEMO ORDER (visible
   things first, not architecture first), with realistic dependencies. Include:
   the exact status vocabulary (TODO/CLAIMED/IN_REVIEW/BLOCKED/DONE/CUT); a WIP limit of
   1 per person; the step-by-step claim protocol with git commands; stale-claim expiry
   (~45 min); and FOUR editing rules that keep this file from becoming a merge-conflict
   factory (touch only your own row, never reorder or reformat, no formatters on this
   file, keep notes short). Add a blunt conflict recipe (take the main version, re-apply
   your one row, do not open a merge tool) and an escape hatch (if it conflicts twice,
   move to GitHub Issues via MCP). Add a "sprint log" table at the bottom for timestamped
   decisions.

5. `CONVENTIONS.md` — Branch naming `<type>/T-<id>-<slug>`; commit format
   `T-<id>: <summary>`; PR rules (one task per PR, <400 lines, 3-line body, merge within
   30 min, reviewer checklist that specifically checks for secrets in the diff and files
   outside ownership); a **file ownership map** table covering every path in the project
   with a single owner each, including a separate single owner for `package.json` +
   lockfile, for config files, and for migrations; the lockfile rule (one installer at a
   time, rebase after); a stack freeze after the walking skeleton deploys; deploy-early
   policy; an escalation table; and a cheap accessibility/quality floor.

6. `roles/` — One file per role: `coordinator.md`, `frontend.md`, `backend.md`,
   `data.md`, `integrations.md`, `qa-demo.md`. Each must have EXACTLY these sections:
   Mission; You own (paths); Do not touch (paths); Your MCPs (which servers, for what);
   First 30 minutes (numbered); Definition of Done for that role (checkboxes);
   Engineering/design floor (rules specific to that discipline); Anti-patterns.
   The coordinator file must contain NO code responsibilities at all, and must include
   the 60-second decision policy, the cut-list discipline, the 30-minute cadence, and a
   full demo-rehearsal plan that starts at the halfway mark, including a screen
   recording as insurance. The qa-demo file must own a recurring smoke checklist that
   runs against the DEPLOYED url, a bug-report template with reproduction steps and
   build identifier, and a final-hour timeline.

7. `STEPS_FOR_HUMANS.md` — Zero jargon. Numbered, checkboxed, "click this, copy this,
   paste here". Split into: (A) Night-before setup — all accounts created with GitHub
   OAuth, all software installed, `node -v` verified, and ONE MCP connection proven;
   (B) First 20 minutes on the day — clone, create `.env.local`, `npm install`,
   `npm run dev`, open the browser, find your task, and the EXACT prompt to paste into
   the AI agent pointing it at `start.md` + their role file; (C) the rules in plain
   English; (D) a troubleshooting table of the ~8 most likely failures and their fixes.
   Include a night-before checklist at the end of section A.

8. `SECRETS.md` — For every credential the project needs (from MANDATED STACK and the
   problem statement): which account, the exact dashboard click path, which key values
   are needed, the exact variable name, and whether it's browser-safe. Include ground
   rules (never in chat, never committed, never client-side), the three-way layout
   (.env.example committed / .env.local ignored / Vercel dashboard), a
   **"what to do if a secret leaks" runbook led by immediate revocation** (with the
   commands to detect a leak in history), and `git check-ignore` verification steps.
   Be explicit that the service-role/secret key must never be prefixed with a
   client-exposed prefix.

9. `MCP_SETUP.md` — For each available server (see AVAILABLE MCP SERVERS below):
   the exact config snippet, the correct config FILE and top-level JSON KEY per client
   (these differ between clients — call this out loudly, it is the most common setup
   failure), the auth mechanism, a **smoke test that is a real tool call with an
   expected visible result**, a troubleshooting table, a results table to fill in as a
   team, and — most importantly — a FALLBACK row for each server so nobody loses time
   debugging plumbing. State clearly that installing is not the same as authenticating,
   and that only a real tool call proves it. Include a section on keeping tokens out of
   committed config files.

10. `scripts/mcp-healthcheck.sh` — An idempotent, read-only bash script that checks:
    runtimes and versions; git state (branch, uncommitted work, remote present);
    presence-only checks of CLI auth is fine (NEVER print secret values); that
    `.env.local` is gitignored and matches the names in `.env.example`; that MCP config
    files are valid JSON with the correct top-level key and no raw credentials; and a
    grep for credential-looking strings in tracked files. It must print a PASS/WARN/FAIL
    summary, exit non-zero on failures, and END by printing the manual MCP smoke-test
    prompts, because no script can prove a server authenticated. Expensive or
    network-touching checks must be behind a `--deep` flag. It must work on Windows via
    Git Bash (POSIX only, no GNU-only flags).

11. `.env.example` — Every variable by NAME with placeholder values, grouped by service,
    with the dangerous ones annotated. No real values.

12. `DEMO.md` — The click-by-click demo script derived from PLAN.md §3: literal steps
    ("click Sign in → type the demo email → click Register"), what the judge sees at each
    step, and a scope-cut trigger list in cut order with the exact fallback for each.

13. `DEPLOY.md` — The deployment runbook for the coordinator: every dashboard click,
    the env-var section reference, the "deploy the empty shell in the first 30 minutes"
    deadline, the redeploy-after-env-change gotcha, and a note to carry demo-account
    variables to the host too.

14. `GLOSSARY.md` — Plain-English one-liners for every term a non-coder on the team
    will hear (repo, branch, commit, push/pull, merge conflict, env var, deploy, API
    key, endpoint). One line each, no caveats.

15. `AGENTS.md` at the **app project root** (the folder containing `package.json`) — a
    10-line pointer telling any AI agent to read `hackathon-os/start.md` and exactly one
    role file before doing anything. Also state, in one line, that `.env.local` lives at
    that same root and nowhere else.

## AVAILABLE MCP SERVERS
<<list them, e.g. GitHub, Filesystem, Supabase, Context7, shadcn, Magic (21st.dev), Playwright>>

## CONSTRAINTS
- Use each server's CURRENT documented install command and config format. Do not invent
  package names or flags. If you are unsure of an exact command, say so explicitly in the
  document and tell the reader how to verify it (`--help`) rather than guessing
  confidently.
- Prefer the remote/OAuth form of a server over a locally-stored token wherever both
  exist, because it cannot leak into git.
- Everything must be usable at 3am by someone who has not slept. Prefer checkboxes,
  tables, and numbered steps over paragraphs.
- Do not create placeholder files with no content. Every file must be immediately useful.

## BEFORE YOU FINISH
- Re-read PLAN.md section 3 (the demo). Confirm the task board makes the demo path the
  top-priority work. Reorder if it does not.
- Confirm every `<<FILL IN>>` marker is either filled in or paired with a clear question
  for a human.
- List, in your final message: which files you created, the ONE decision a human must
  make first, and the first task each role should claim.
````

---

## After the agent responds

**Step 0 — verify the repo before committing anything (5 seconds, prevents the worst
possible mistake):**

```bash
git rev-parse --show-toplevel
```

- ✅ A normal project folder → carry on.
- ❌ Your **home directory** (e.g. `C:/Users/you`) → **stop.** Git has been initialised
  somewhere that contains your entire user profile. Do not run `git add` or `git push`
  until someone has run `git init` inside the actual project folder. Committing here would
  try to include `AppData`, browser profiles, and personal documents.

Then do these in order. It takes 5 minutes and it is the whole point of the exercise.

1. **Read `PLAN.md` §3 (the demo) as a team, out loud.** Everything else derives from it.
   If you disagree with it, fix it now — before the board is filled in.
2. **Fix the `<<FILL IN>>` markers.** Assign every task an owner in `TASK_BOARD.md`.
3. **Commit the whole folder first**, in its own commit, before any feature code:
   ```bash
   git add hackathon-os
   git commit -m "Add hackathon OS: plan, task board, roles, setup guides"
   git push
   ```
   ⚠️ `git add hackathon-os` — *not* `git add -A`. Staging broadly is how unrelated
   folders and secrets get committed.
4. **Everyone clones and runs `scripts/mcp-healthcheck.sh`.** Fill in the MCP results
   table and drop the outcome into the sprint log.
5. **Claim task `T-01` and start.** The plan exists; now stop planning and build.

## Why this works

- **One writer per file.** The ownership map, not good intentions, is what prevents two
  agents from overwriting each other.
- **The board is the queue.** Nobody has to ask "what should I do" — and nobody starts
  work that is already underway.
- **The demo is designed before the app.** Every cut decision afterwards is mechanical
  instead of an argument.
- **Tooling is verified, not assumed.** An MCP server that fails to authenticate at
  hour 6 costs more than one that was never configured.
- **The docs are written for agents, not for archives.** `start.md` is the interface;
  the role files are the job descriptions.
