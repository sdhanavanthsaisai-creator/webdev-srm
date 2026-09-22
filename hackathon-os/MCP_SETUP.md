# MCP_SETUP.md

How to install **and verify** every MCP server. Verification is the point: an MCP server
that installs but fails to authenticate looks exactly like one that works — until you
call a tool at the worst possible moment.

> **The 10-minute rule.** If a server is not green within 10 minutes, take the fallback in
> §7 and tell the team it's red. Do not debug MCP plumbing for half an hour; that time
> belongs to the demo.

- **Run the automated checks first:** `bash hackathon-os/scripts/mcp-healthcheck.sh`
  (add `--deep` to also prove each package actually resolves).
- **Then run the manual tool-call smoke test** in §3 for each server. Both are required:
  the script proves the prerequisites, the tool call proves the auth.

---

## 1. Config files — get the right shape

⚠️ **The two clients use different JSON keys.** Copying a snippet into the wrong file is
the #1 setup failure.

| Client | File | Top-level key | Secrets |
| --- | --- | --- | --- |
| **VS Code** (Copilot) | `.vscode/mcp.json` | `servers` (+ `inputs`) | `${input:...}` prompt, or `env` |
| **Cursor** | `.cursor/mcp.json` | `mcpServers` | `env` |
| Claude Code / Codex | `.mcp.json` / `~/.codex/config.toml` | `mcpServers` / TOML | `env` |

**VS Code** — `.vscode/mcp.json`:

```json
{
  "servers": {
    "example": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "some-mcp-server"]
    }
  },
  "inputs": []
}
```

Servers with `"type": "http"` take a `url` instead of `command`/`args`.

**Cursor** — `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "example": {
      "command": "npx",
      "args": ["-y", "some-mcp-server"]
    }
  }
}
```

**After editing either file: reload the window.** `Ctrl+Shift+P` →
`Developer: Reload Window`. Most "it's not showing up" problems are this.

**Don't want to hand-write it?** Ready-to-use starting points ship with this folder:

```bash
cp hackathon-os/mcp.vscode.example.json .vscode/mcp.json     # VS Code
cp hackathon-os/mcp.cursor.example.json .cursor/mcp.json     # Cursor
```

Then replace `YOUR_PROJECT_REF` (Supabase) and `YOUR_MAGIC_KEY` (21st.dev) and reload.
These files contain **no secrets** — the GitHub and Supabase servers use OAuth, so there
is nothing in them worth leaking.

---

## 2. Which servers to install

Install these. In VS Code the fastest path is the Extensions view: `Ctrl+Shift+X` → type
`@mcp` → Install. For the rest, use the JSON below.

| Server | Needed? | Auth | Fallback if red |
| --- | --- | --- | --- |
| Playwright | **Essential** | none | Manual browser testing |
| shadcn | **Essential** for UI | none | `npx shadcn@latest add <name>` in the terminal |
| Supabase | **Essential** | OAuth (browser) | Supabase dashboard + `psql` |
| Context7 | Strongly recommended | optional key | Read the provider's docs in a browser |
| GitHub | Recommended | OAuth or PAT | `git` + `gh` CLI |
| Magic (21st.dev) | Nice to have | API key | shadcn, or hand-written UI |
| Filesystem | Usually redundant | none | Your agent's built-in file tools |

---

## 3. The full config + smoke test for each

### Playwright — drive a real browser

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"]
}
```

⚠️ **Verified:** the package is `@playwright/mcp` (current version `0.0.82`). VS Code's own
docs show `@microsoft/mcp-server-playwright`, **which does not exist on npm** — using it
fails with a resolve error. If you install from the Extensions view instead
(`@mcp playwright`), you don't have to care.

- **Prove it runs:** `npx -y @playwright/mcp@latest --help`
- **Prove it authenticates:** in chat — *"Use Playwright to open `https://example.com` and give me the page title."*
  ✅ Expect: the title `Example Domain`. If the chat returns a browser error instead, it's red.
- **First run is slow** — it may download a browser. Run this once *before* the clock starts.

### shadcn — install UI components by asking

```json
"shadcn": {
  "command": "npx",
  "args": ["shadcn@latest", "mcp"]
}
```

**Prerequisite:** the project must be shadcn-initialized (`components.json` must exist):

```bash
npx shadcn@latest init          # once, by the frontend owner, on main
```

Or let the CLI write the config for you:

```bash
npx shadcn@latest mcp init --client vscode    # or: --client cursor
```

- **Prove it authenticates:** *"Show me all available components in the shadcn registry."*
  ✅ Expect: a real list (button, dialog, card…). A "No tools or prompts" reply means red:
  run `npx clear-npx-cache`, then reload the window.
- ⚠️ **Requires a React/Next + Tailwind project.** On a plain HTML/CSS project this will
  never work — initialise the framework first (that's task `T-01`), or use the fallback.

### Supabase — schema and queries, no dashboard clicking

The hosted server is **remote and OAuth-based — you do not create a personal access
token.** Scope it to your project from the start.

```json
"supabase": {
  "type": "http",
  "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&read_only=true"
}
```

Add feature groups as needed, e.g. `&features=database,docs,development`. Parameters can
be combined. Known-good groups: `database` (list/create tables, run SQL, migrations),
`docs` (search Supabase docs), `development` (project URL, publishable keys, generate
TypeScript types), `debugging` (logs, advisors), `functions`, `account`, `branching`.

⚠️ **Start with `read_only=true`.** Remove it only when you deliberately need writes, and
then be aware you are one prompt-injection away from a destructive query. Never point it
at anything production-like.

- **Auth:** on first start you're redirected to a browser to sign in and grant access.
  Pick the organization that owns the project.
- **Prove it authenticates:** *"What tables are there in the database? Use MCP tools."*
  ✅ Expect: your real table list (or "no tables" — still green, the *connection* worked).
  ❌ A 401/403 or an auth prompt that never completes = red.

### Context7 — current docs for any library, before it guesses

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

Works without a key at a lower rate limit; add `--api-key YOUR_KEY` (or the
`CONTEXT7_API_KEY` env var) if you hit limits.

- **Prove it authenticates:** *"Use Context7 to look up the current Next.js route handler signature."*
  ✅ Expect: versioned, current API details. This is the server that stops your agent from
  confidently writing a deprecated API.

### GitHub — branches, issues, PRs

**Preferred: the remote server with OAuth. No token to create or leak.**

```json
"github": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/"
}
```

With a PAT instead (VS Code prompts for it, so **no secret lands in the file**):

```json
"github": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": { "Authorization": "Bearer ${input:github_mcp_pat}" }
},
"inputs": [
  { "type": "promptString", "id": "github_mcp_pat", "description": "GitHub Personal Access Token", "password": true }
]
```

⚠️ **Do not use `@modelcontextprotocol/server-github`** for new setups — it is
superseded by the official server above. Also note: `inputs` is a VS Code mechanism; in
Cursor use `"headers"` with the literal token, and **gitignore that file** (see §6).

- **Prove it authenticates:** *"List the open issues in my hackathon repo."*
  ✅ Expect: a real list (empty is fine). ❌ An auth error = red.
- PAT scopes needed: `repo`, plus `read:org` if you touch org repos.

### Magic (21st.dev) — designed UI sections

```json
"magic": {
  "command": "npx",
  "args": ["-y", "@21st-dev/magic@latest", "API_KEY=\"YOUR_MAGIC_KEY\""]
}
```

⚠️ **This is the one command in this document I could not verify against primary docs —
verify it yourself before relying on it:** `npx -y @21st-dev/magic@latest --help`.
The `API_KEY="..."` positional form is what 21st.dev documents, but if the CLI prints a
different flag, use what it prints.

The shipped example configs use the placeholder `YOUR_MAGIC_KEY`, so if the form is wrong
you get a loud auth failure rather than silently generated nonsense. Magic is the most
disposable server here — if it fights you, drop it and use shadcn (no key required).

- **Prove it authenticates:** *"Use Magic to generate a pricing card with three tiers."*
  ✅ Expect: real component code. ❌ An auth/quota error = red — check your remaining free
  quota before burning it.
- **Fallback:** shadcn MCP needs no key at all.

### Filesystem — usually redundant

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/absolute/path/to/project"]
}
```

Most agents already read and write the workspace. Only add this if yours doesn't, and
**scope it to one project directory** — never your home folder or a drive root.

---

## 4. Record the result

Fill this in as a team in the first 20 minutes and copy it into the `TASK_BOARD.md`
sprint log. Timestamp it.

| Server | Installed | Tool call OK | Owner | Fallback in use? |
| --- | --- | --- | --- | --- |
| Playwright | ☐ | ☐ | | |
| shadcn | ☐ | ☐ | | |
| Supabase | ☐ | ☐ | | |
| Context7 | ☐ | ☐ | | |
| GitHub | ☐ | ☐ | | |
| Magic | ☐ | ☐ | | |
| Filesystem | ☐ | ☐ | | |

**Rule:** a server nobody proved with a real tool call is marked red and everyone uses
its fallback. "It looked installed" is not a green.

---

## 5. Troubleshooting, in order of likelihood

| Symptom | Cause / fix |
| --- | --- |
| Server doesn't appear at all | Wrong JSON key (`servers` vs `mcpServers`) or wrong filename. Compare against §1. |
| Appears but shows no tools | `npx` hasn't cached the package yet, or a version pin is wrong. Run the **prove it runs** command from your terminal; the error will be obvious there. |
| "No tools or prompts" (shadcn) | `npx clear-npx-cache`, then reload the window. |
| Starts, then immediately errors | Almost always a missing/expired credential. Read the server output — VS Code: `MCP: List Servers` → **Show Output**. |
| Auth prompt loops forever | Try a different browser, and finish the OAuth flow in a *normal* window, not the IDE's embedded one. |
| Works for one teammate, not another | Node version. Run `node -v` on both. Align on LTS. |
| Timeouts on the first call | Redownloading a package (or a browser, for Playwright). Retry once; it's usually warm after. |
| Everything is slow / hangs | Too many servers running at once. Disable the ones you aren't using for this task. |

**Escalation:** if a server is still red after 10 minutes, mark it red, take the
fallback, and keep building. Revisit it only if you're ahead of schedule.

---

## 6. Keeping secrets out of committed MCP config

`.vscode/mcp.json` and `.cursor/mcp.json` are usually **committed so the team shares
config** — so a hardcoded token in them is a committed secret.

- **VS Code:** use `${input:...}` (as in the GitHub example). The token is prompted for at
  runtime and never written to the file. **This is the recommended pattern.**
- **Cursor:** if your client doesn't support variable substitution, put the file in
  `.gitignore` and commit a `mcp.json.example` with placeholders instead. The `.gitignore`
  shipped with this kit **already ignores `.cursor/mcp.json` and `.mcp.json`** — so by
  default your Cursor config stays local and unshared. If you'd rather commit a sanitized,
  token-free config so the team shares one setup, delete those two lines from `.gitignore`
  and confirm with `git check-ignore -v .cursor/mcp.json` that it prints nothing.
- Sanity check before you trust any of it:
  ```bash
  git check-ignore -v .env.local .cursor/mcp.json
  git grep -nE "(sk-|ghp_|eyJ|pat-)" -- '*.json' '*.md'
  ```

---

## 7. Fallbacks — decide these now, not at hour 9

| If this is red | Do this instead |
| --- | --- |
| Playwright MCP | Test manually in your own browser. Screenshot into the PR. |
| shadcn MCP | `npx shadcn@latest add button dialog card` from the terminal, then import. |
| Supabase MCP | Use the Supabase dashboard's SQL editor; paste the SQL into a committed `.sql` file so it's repeatable. |
| Context7 | Read the provider's docs in a browser tab and paste the relevant snippet to your agent. |
| GitHub MCP | `git` + the `gh` CLI: `gh pr create`, `gh issue create`. |
| Magic MCP | shadcn components + a hand-written section. Ugly-but-working beats blocked. |
| Filesystem MCP | Your agent's built-in file reading/writing. |

**Write the fallback into your PR description** when you use one, so the next person
doesn't rediscover the same broken server.
