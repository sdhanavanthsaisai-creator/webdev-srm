# Hackathon OS

A drop-in operating system for a team hackathon: everyone (and everyone's AI agent)
reads the same files, claims tasks the same way, and ships into the same repo without
colliding.

**The whole point:** decide *what* and *who* before anyone writes feature code. The
first 20 minutes of structure buys back hours of merge conflicts and duplicated work.

---

## Read this first

| If you are... | Read |
| --- | --- |
| A human on the team | [`STEPS_FOR_HUMANS.md`](STEPS_FOR_HUMANS.md) |
| Setting up API keys | [`SECRETS.md`](SECRETS.md) |
| Setting up your AI agent | [`MCP_SETUP.md`](MCP_SETUP.md) |
| An AI agent | [`start.md`](start.md), then your file in [`roles/`](roles/) |
| The Coordinator | [`roles/coordinator.md`](roles/coordinator.md) |
| Anyone, before writing code | [`PLAN.md`](PLAN.md) + [`CONVENTIONS.md`](CONVENTIONS.md) |

---

## The 20-minute cold start

| Min | What | Who | Artifact |
| --- | --- | --- | --- |
| 0–3 | Read the problem statement out loud. Highlight the verbs. Circle the deliverable. | All | — |
| 3–8 | Fill in `PLAN.md`: problem, demo script, scope IN, scope OUT, cut list | All | `PLAN.md` |
| 8–12 | Pick roles, write the roster into `CONVENTIONS.md` ownership map | All | `CONVENTIONS.md` |
| 12–16 | Coordinator breaks `PLAN.md` into 15–25 tasks in `TASK_BOARD.md` | Coordinator | `TASK_BOARD.md` |
| 16–20 | Each person runs the MCP health check and smoke-tests their servers | All | `scripts/mcp-healthcheck.sh` |
| 20 | **Commit the whole `hackathon-os/` folder before any feature code** | All | git |
| 20+ | Claim exactly one task, branch, build, PR | All | — |

Then the loop, forever: **claim → branch → build → verify → push → PR → review → merge → repeat.**

---

## Files

```
hackathon-os/
├── README.md              ← you are here
├── MASTER_PROMPT.md       ← paste the problem statement here to regenerate this OS
├── start.md               ← the ONLY file your AI agent needs to be pointed at
├── PLAN.md                ← problem, demo script, scope, cut list  (edit me first)
├── TASK_BOARD.md          ← the board; one row per task  (edit me constantly)
├── CONVENTIONS.md         ← branches, commits, PRs, file ownership  (avoids collisions)
├── STEPS_FOR_HUMANS.md    ← zero-jargon setup, click-by-click
├── SECRETS.md             ← where every key comes from, and where it goes
├── MCP_SETUP.md           ← install + AUTH + smoke-test every MCP server
├── DEMO.md                ← click-by-click demo script + scope-cut triggers
├── DEPLOY.md              ← Vercel runbook (deploy the empty shell at T+30)
├── GLOSSARY.md            ← plain-English tech terms for non-coders
├── mcp.vscode.example.json ← copy to .vscode/mcp.json (no secrets inside)
├── mcp.cursor.example.json ← copy to .cursor/mcp.json (no secrets inside)
├── .env.example           ← copy to .env.local and fill in
├── roles/                 ← one file per role; point your agent at exactly one
│   ├── coordinator.md
│   ├── frontend.md
│   ├── backend.md
│   ├── data.md
│   ├── integrations.md
│   └── qa-demo.md
└── scripts/
    └── mcp-healthcheck.sh ← proves what actually works, before you rely on it
```

Two files live at the **app project root**, next to `package.json` (not in this folder),
because that is where tools look for them:

| File | Why it must be at the project root |
| --- | --- |
| `AGENTS.md` | So any AI agent auto-discovers it and is pointed at `start.md` |
| `.gitignore` | So `.env.local` and build output are actually ignored |
| `.env.local` *(yours, never committed)* | Frameworks only read dotfiles from the app root |

If your project root is a different folder, copy those three files there.

The **ClubCraft app workspace** is a sibling folder: `clubcraft/`. It holds
`clubcraft/landing/index.html` — the Surface lane's zero-build prototype of the workshop
floor (demo path, all four states, Core-API integration seams). Open it directly for the
fallback demo; details in `clubcraft/README.md`.

---

## The three rules that make parallel work possible

1. **One task at a time, and it is claimed in writing.** Not "I'm working on auth" —
   a row on the board with your name on it. See [`TASK_BOARD.md`](TASK_BOARD.md).
2. **One owner per file.** The ownership map in [`CONVENTIONS.md`](CONVENTIONS.md) is
   binding. Need a file you don't own? Ask the owner; do not edit it.
3. **Nothing is done until it is exercised.** A task is DONE when someone other than
   the author clicked through it — Playwright for UI, a real query for data, a real
   `curl` for APIs. See "Definition of Done" in [`start.md`](start.md).

---

## Team-size shortcuts

- **1–2 people:** collapse to three files — `coordinator.md` (you also do QA/demo),
  `fullstack.md` (merge frontend + backend), `data.md` (merge data + integrations).
- **3 people — Surface / Core / Glue (this team):** Surface (Coder A) reads
  `roles/frontend.md` · Core (Coder B) reads `roles/backend.md` **and** `roles/data.md`
  · Glue (non-coder) reads `roles/coordinator.md` and also owns QA/demo, secrets, and
  the Supabase/Vercel dashboards. This is the ClubCraft layout; the board's owner
  column already uses these lane names.
- **4–6 people:** use the six roles as written.
- **Solo, no time:** skip the board, keep `PLAN.md` + `CONVENTIONS.md`. The plan and
  the ownership map are the parts that survive contact with reality.

---

## Regenerating this for a different hackathon

Open [`MASTER_PROMPT.md`](MASTER_PROMPT.md), paste the new problem statement, and hand
it to any AI coding agent. It reproduces this entire folder, tailored to the new
problem. Keep the folder in git so the next team starts warm.
