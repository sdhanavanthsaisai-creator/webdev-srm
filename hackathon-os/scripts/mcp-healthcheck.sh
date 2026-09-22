#!/usr/bin/env bash
# mcp-healthcheck.sh — prove your toolchain BEFORE you depend on it.
#
# What this does:  verifies prerequisites and local config (fast, offline, no installs).
# What this does NOT do: prove an MCP server actually AUTHENTICATED. Only a real tool
#   call can do that, so this script prints the exact manual smoke tests at the end.
#
# Usage:
#   bash hackathon-os/scripts/mcp-healthcheck.sh          # safe checks only
#   bash hackathon-os/scripts/mcp-healthcheck.sh --deep    # also resolve each MCP package
#
# --deep runs `npx -y <pkg> --help`, which DOWNLOADS packages into the npx cache.
# It installs nothing globally and changes no files, but it needs network. Run it once
# before the clock starts, never mid-demo.

set -u

DEEP=0
[ "${1:-}" = "--deep" ] && DEEP=1

PASS=0
FAIL=0
WARN=0
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

ok()   { printf "  ${GREEN}PASS${NC}  %s\n" "$1"; PASS=$((PASS+1)); }
bad()  { printf "  ${RED}FAIL${NC}  %s\n" "$1"; FAIL=$((FAIL+1)); }
warn() { printf "  ${YELLOW}WARN${NC}  %s\n" "$1"; WARN=$((WARN+1)); }
info() { printf "  ${DIM}info${NC}  %s\n" "$1"; }
# NOTE: deliberately named `section`, not `head` — defining a function called `head`
# shadows the `head` command and silently breaks every `| head -1` pipeline below.
section() { printf "\n${BOLD}%s${NC}\n" "$1"; }

have() { command -v "$1" >/dev/null 2>&1; }

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
cd "$REPO_ROOT" 2>/dev/null || true

printf "${BOLD}MCP / toolchain health check${NC}\n"
info "repo root: $REPO_ROOT"
info "mode: $([ "$DEEP" -eq 1 ] && echo 'deep (resolves packages, needs network)' || echo 'safe (local checks only)')"
info "time: $(date '+%H:%M:%S')"

# ─────────────────────────────────────────────────────────── 1. Runtimes
section "1. Runtimes"

if have node; then
  NODE_V="$(node -v 2>/dev/null)"
  NODE_MAJOR="$(printf '%s' "$NODE_V" | sed 's/^v//' | cut -d. -f1)"
  if [ "${NODE_MAJOR:-0}" -ge 18 ] 2>/dev/null; then
    ok "node $NODE_V"
  else
    warn "node $NODE_V — MCP servers generally want Node 18+ (LTS preferred)"
  fi
else
  bad "node not found — install Node.js LTS from nodejs.org (breaks nearly every MCP server)"
fi

have npx  && ok "npx present"  || bad "npx not found — comes with Node.js; reinstall it"
have git  && ok "$(git --version)" || bad "git not found"

if have docker; then
  if docker info >/dev/null 2>&1; then ok "docker running (needed only for the local GitHub MCP server)"
  else warn "docker installed but the daemon isn't running — only matters if you chose the Docker GitHub MCP"; fi
else
  info "docker not installed — fine, you only need it for the local GitHub MCP server"
fi

have python3 && ok "$(python3 --version 2>&1)" || info "python3 not found — only needed by some MCP servers"

# ─────────────────────────────────────────────────────────── 2. Git state
section "2. Git state (is your work safe?)"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  BRANCH="$(git branch --show-current 2>/dev/null)"
  if [ -n "$BRANCH" ]; then
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
      warn "on '$BRANCH' — branch before you start: git checkout -b feat/T-NN-slug"
    else
      ok "on branch '$BRANCH'"
    fi
  else
    warn "not on a branch (detached HEAD?) — check with: git status"
  fi

  if git rev-parse --verify HEAD >/dev/null 2>&1; then
    ok "history exists ($(git rev-list --count HEAD) commits)"
  else
    warn "no commits yet — commit an initial state so work can't be lost"
  fi

  DIRTY="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  if [ "$DIRTY" = "0" ]; then ok "working tree clean"
  else warn "$DIRTY uncommitted change(s) — commit or push so they survive a bad merge"; fi

  REMOTE="$(git remote -v 2>/dev/null | head -1)"
  if [ -n "$REMOTE" ]; then ok "remote: $(printf '%s' "$REMOTE" | awk '{print $2}')"
  else bad "no git remote — nobody else can clone your work"; fi
else
  bad "not inside a git repository — run: git init"
fi

# ─────────────────────────────────────────────────────────── 3. Tooling auth
section "3. Tooling credentials (presence only — values are never printed)"

if have gh; then
  if gh auth status >/dev/null 2>&1; then ok "gh CLI authenticated"
  else warn "gh CLI installed but not authenticated — run: gh auth login"; fi
else
  info "gh CLI not installed — optional; GitHub Desktop is enough"
fi

if have supabase; then
  if timeout 15 supabase projects list >/dev/null 2>&1; then ok "supabase CLI authenticated"
  else warn "supabase CLI present but not logged in — run: supabase login"; fi
else
  info "supabase CLI not installed — optional; the MCP server uses browser OAuth"
fi

if have vercel; then
  if vercel whoami >/dev/null 2>&1; then ok "vercel CLI authenticated"
  else warn "vercel CLI present but not logged in — run: vercel login"; fi
else
  info "vercel CLI not installed — optional; Vercel's GitHub integration needs no token"
fi

# ─────────────────────────────────────────────────────────── 4. Secrets hygiene
section "4. Secrets hygiene"

if [ -f .gitignore ]; then
  ok ".gitignore exists"
else
  bad ".gitignore missing — CREATE IT before anyone runs npm install or adds a key"
fi

IGNORED_ALL=1
for f in .env .env.local .env.production.local; do
  if [ -e "$f" ]; then
    if git check-ignore -q "$f" 2>/dev/null; then
      ok "$f is gitignored"
    else
      bad "$f EXISTS and is NOT gitignored — it will be committed. Fix .gitignore NOW."
      IGNORED_ALL=0
    fi
  fi
done
[ "$IGNORED_ALL" -eq 1 ] && [ ! -e .env.local ] && info "no .env.local yet — copy .env.example to .env.local before running the app"

if [ -f .env.local ]; then
  # NOTE: no `|| echo 0` here - grep -c already prints "0" on no match, and adding
  # `||` would append a second line, making N_VARS read "0\n0".
  N_VARS="$(grep -cE '^[A-Za-z_][A-Za-z0-9_]*=' .env.local 2>/dev/null)"
  ok ".env.local present with ${N_VARS:-0} variable(s)"
  if [ -f .env.example ]; then
    MISSING=""
    # compare NAMES only; never read or print values
    while IFS= read -r name; do
      [ -z "$name" ] && continue
      grep -qE "^[[:space:]]*${name}=" .env.local 2>/dev/null || MISSING="$MISSING $name"
    done < <(grep -oE '^[A-Za-z_][A-Za-z0-9_]*' .env.example 2>/dev/null)
    if [ -n "$MISSING" ]; then
      # WARN, not FAIL: a variable may be intentionally unset (an unused integration,
      # an optional override). Mirror that by commenting it out in BOTH files.
      warn ".env.local is missing variable(s) named in .env.example:$MISSING"
      info "if a variable is intentionally unused, comment it out in .env.example too"
    else
      ok "every variable named in .env.example is set in .env.local"
    fi
  else
    warn ".env.example missing — create it listing every variable by NAME (never values)"
  fi
fi

if find . -maxdepth 3 -name ".env*" -not -name "*.example" -not -path "./node_modules/*" 2>/dev/null \
   | grep -qE '\.env(\.|$)'; then
  LEAK="$(git ls-files 2>/dev/null | grep -E '(^|/)\.env(\.|$)' | grep -v '\.example$' || true)"
  if [ -n "$LEAK" ]; then
    bad "SECRET FILE(S) TRACKED BY GIT: $LEAK — revoke those keys and remove them from git"
  fi
fi

# ─────────────────────────────────────────────────────────── 5. MCP config
section "5. MCP configuration files"

FOUND_CONFIG=0
[ -f .vscode/mcp.json ] && { ok "found .vscode/mcp.json (VS Code — top-level key must be \"servers\")"; FOUND_CONFIG=1; }
[ -f .cursor/mcp.json ] && { ok "found .cursor/mcp.json (Cursor — top-level key must be \"mcpServers\")"; FOUND_CONFIG=1; }
[ -f .mcp.json ]        && { ok "found .mcp.json"; FOUND_CONFIG=1; }
[ "$FOUND_CONFIG" -eq 0 ] && warn "no MCP config found (checked .vscode/mcp.json, .cursor/mcp.json, .mcp.json)"

for cfg in .vscode/mcp.json .cursor/mcp.json .mcp.json; do
  [ -f "$cfg" ] || continue
  if have node; then
    if node -e "JSON.parse(require('fs').readFileSync('$cfg','utf8'))" 2>/dev/null; then
      ok "$cfg is valid JSON"
    else
      bad "$cfg is INVALID JSON — this stops every server in the file from starting"
    fi
  fi
  if grep -qE '"servers"|"mcpServers"' "$cfg" 2>/dev/null; then
    ok "$cfg declares a servers block"
  else
    bad "$cfg has no \"servers\"/\"mcpServers\" key — the client will ignore the whole file"
  fi
  if grep -qE '(sk-|ghp_|pat-|eyJ[A-Za-z0-9_-]{10,})' "$cfg" 2>/dev/null; then
    if git ls-files --error-unmatch "$cfg" >/dev/null 2>&1; then
      bad "$cfg is COMMITTED and appears to contain a raw credential"
    else
      warn "$cfg contains a raw credential — it is untracked, so keep it gitignored"
    fi
  fi
done

# Hardcoded-token sweep across tracked text config/docs
if have git && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  # `git grep` searches tracked files only, and fails fatally with no commits.
  # Distinguish "checked and clean" from "could not check" - a false PASS on a
  # secrets check is worse than no check at all.
  if git rev-parse --verify HEAD >/dev/null 2>&1; then
    HITS="$(git grep -nIE '(ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|pat-[A-Za-z0-9]{20,})' -- . 2>/dev/null | head -5)"
    if [ -n "$HITS" ]; then
      bad "possible credential committed in tracked files:"
      printf '        %s\n' "$HITS"
    else
      ok "no credential-looking strings in tracked files"
    fi
  else
    warn "cannot scan for committed secrets: this repo has no commits yet"
    info "run this again after your first commit, and check .gitignore first"
  fi
fi

# ─────────────────────────────────────────────────────────── 6. Package reachability
section "6. MCP package reachability"

PKGS="@playwright/mcp @upstash/context7-mcp @21st-dev/magic shadcn"
if [ "$DEEP" -eq 1 ]; then
  for p in $PKGS; do
    if timeout 120 npx -y "$p"@latest --help >/dev/null 2>&1; then
      ok "$p resolves and runs"
    else
      warn "$p did not run with --help (some CLIs exit non-zero on --help; verify in your client)"
    fi
  done
  if timeout 120 npx -y @supabase/mcp-server-supabase@latest --help >/dev/null 2>&1; then
    ok "supabase MCP package resolves (you use the hosted remote server, so this is optional)"
  else
    info "supabase local package not resolved — fine, the hosted server is remote + OAuth"
  fi
else
  info "skipped (safe mode). Re-run with --deep to resolve each package."
  for p in $PKGS; do info "would check: $p"; done
fi

# ─────────────────────────────────────────────────────────── Manual part
cat <<'EOF'

────────────────────────────────────────────────────────────────
 MANUAL STEP — REQUIRED. The checks above prove prerequisites only.
 None of them prove an MCP server AUTHENTICATED.
 Paste each of these into your AI agent, one at a time:

   Playwright : Use Playwright to open https://example.com and give me the page title.
                -> expect: "Example Domain"

   shadcn     : Show me all available components in the shadcn registry.
                -> expect: a real component list

   Supabase   : What tables are there in the database? Use MCP tools.
                -> expect: your table list (empty is still GREEN)

   Context7   : Use Context7 to look up the current Next.js route handler signature.
                -> expect: current, versioned API docs

   GitHub     : List the open issues in my repo.
                -> expect: a real issue list (empty is still GREEN)

   Magic      : Use Magic to generate a pricing card with three tiers.
                -> expect: real component code (watch your free quota)

 Record each result in TASK_BOARD.md's sprint log.
 RED for more than 10 minutes? Take the fallback in MCP_SETUP.md section 7
 and move on. Do not debug plumbing while the clock runs.
────────────────────────────────────────────────────────────────
EOF

printf "\n${BOLD}Summary:${NC} ${GREEN}%d passed${NC}, ${YELLOW}%d warned${NC}, ${RED}%d failed${NC}\n" "$PASS" "$WARN" "$FAIL"
if [ "$FAIL" -gt 0 ]; then
  printf "${RED}Fix the failures above before you start building.${NC}\n"
  exit 1
fi
printf "${GREEN}Prerequisites look good. Now run the manual smoke tests above.${NC}\n"
exit 0
