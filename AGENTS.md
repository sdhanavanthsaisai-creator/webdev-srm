# AGENTS.md

If you are an AI coding agent working in this repository, read these before your first action:

1. **`hackathon-os/start.md`** — the rules, the work loop, and the Definition of Done.
2. **`hackathon-os/PLAN.md`** — what we are building (and what we are explicitly not).
3. **`hackathon-os/CONVENTIONS.md`** — branches, commits, PRs, and the **file ownership map**.
4. **Exactly one** file from **`hackathon-os/roles/`** — the role you were assigned. Do not read all of them.

   Lane map for this team (ClubCraft): **Surface** → `roles/frontend.md` · **Core** →
   `roles/backend.md` **and** `roles/data.md` · **Glue** (coordinator, non-coder) → `roles/coordinator.md`.

Then find your task in `hackathon-os/TASK_BOARD.md`, claim it by editing your own row only,
and start.

**Hard rules:** never commit secrets · never `git add -A` · never force-push a shared branch ·
edit only files your role owns · use Context7 before writing against a library API · click UI
through a real browser (Playwright) before calling it done · if a tool is broken for more than
10 minutes, take the fallback in `hackathon-os/MCP_SETUP.md` and move on.
