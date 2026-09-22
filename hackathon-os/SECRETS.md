# SECRETS.md

Every key the team needs: where it comes from, exactly where it goes, and what to do
when one leaks.

**The one rule:** values live in `.env.local` and nowhere else. Not in chat, not in the
README, not in a screenshot, not in a commit. `.env.example` holds **names only**.

---

## 0. Ground rules

| Rule | Why |
| --- | --- |
| Never paste a key into the team chat | Chat history is searchable forever and often gets shared |
| Never commit a key | Even deleted in a later commit, it stays in git history |
| Never screenshot a dashboard with a visible key | Same problem, harder to notice |
| Never put a key in client-side code | The browser bundle is public. Proxy it through your own API route. |
| One key per person where possible | Easier to revoke one without breaking everyone |

**Set up tonight.** A key you request at hour 2 might need email verification, org
approval, or a billing card. Finding that out tomorrow is expensive.

Checklist of accounts: ☐ GitHub ☐ Vercel ☐ Supabase ☐ Context7 ☐ 21st.dev Magic
☐ any other API in `PLAN.md` §5

---

## 1. GitHub (Personal Access Token)

**Only needed if** your AI agent uses token auth, or you push from a terminal. If you
use GitHub Desktop + OAuth (recommended), you can skip this entirely tonight.

1. Sign in at `github.com`.
2. Click your avatar (top-right) → **Settings**.
3. Left sidebar, scroll to the bottom → **Developer settings**.
4. **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
5. Name: `hackathon-<team>` · Expiration: **7 days** (never "no expiration").
6. Repository access: **Only select repositories** → pick your team repo.
7. Permissions → Repository permissions:
   - **Contents: Read and write** (push code)
   - **Pull requests: Read and write** (open/merge PRs)
   - **Issues: Read and write** (the task board fallback)
   - **Metadata: Read-only** (added automatically)
8. **Generate token** → **copy it immediately** (you cannot see it again).

→ Goes in `.env.local` as `GITHUB_TOKEN=...`, or into your MCP config (see
`MCP_SETUP.md`). ⚠️ **Prefer the remote GitHub MCP with OAuth** — no token to leak.

---

## 2. Supabase

You need three different things from the same dashboard. Don't mix them up.

**Create the project** (one person does this, then shares the values):
1. `supabase.com` → sign in with GitHub → **New project**.
2. Name it, pick a region **near your teammates**, and set a database password.
   ⚠️ Save that password somewhere — you'll need it for direct connections.
3. Wait ~2 minutes for it to finish provisioning.

**A. Project URL + API keys** (the app needs these)

4. Project → **Settings** (gear) → **API**.
5. Copy **Project URL** → `.env.local` as `NEXT_PUBLIC_SUPABASE_URL=...`
6. Copy **anon / publishable** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   ✅ The anon key is *designed* to be public. But `NEXT_PUBLIC_*` variables still end up
   in the browser bundle, so **never** put the service-role key in one.
7. Copy **service_role / secret** key → `SUPABASE_SERVICE_ROLE_KEY=...`
   ⚠️ **This one bypasses all security rules.** Server-side only. Never `NEXT_PUBLIC_`.

**B. The MCP server** (your AI agent needs this — no key required)

8. The hosted Supabase MCP server authenticates with **OAuth in the browser** — you do
   **not** need to create a personal access token for normal use. Config is in
   `MCP_SETUP.md`. Keep **read-only** mode on while exploring.

**C. Access token** (only for CI or non-browser auth)

9. `supabase.com/dashboard/account/tokens` → **Generate new token** → copy.
   ⚠️ This is an *account* token, not a project key. Different thing. Rarely needed at a
   hackathon — skip unless something requires it.

**D. The demo user** (the pitch logs in with this — nothing typed live)

10. Project → **Authentication** → **Users** → **Add user** → create new user.
    Email `demo@clubcraft.test` + a password you choose. **Auto-confirm user: on.**
11. Put the same values in `.env.local` as `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`,
    and on Vercel. Share them **in person or via the env file — never in chat**.

---

## 3. Vercel

**Recommended: no manual token at all.**
1. `vercel.com` → sign in with GitHub.
2. Import your repo → Vercel deploys on every push. Nothing to copy. ✅

**Environment variables on Vercel (required for the deployed app to work):**
3. Project → **Settings** → **Environment Variables**.
4. Add each variable from your `.env.local`, with the same names.
   ☐ Tick **Production**, **Preview**, and **Development**.
5. **Redeploy** after adding them. ⚠️ Env vars only apply to new deployments — the
   classic "works locally, not on Vercel" cause.

**Only if you need the CLI or a CI token:**
6. `vercel.com/account/tokens` → **Create Token** → scope to the team → copy.
   → `VERCEL_TOKEN=...`

---

## 4. Context7 (documentation lookups for your AI agent)

Free tier available; works without a key at a lower rate limit.

1. `context7.com` → sign up.
2. Dashboard → **API key** → copy.
3. → `CONTEXT7_API_KEY=...`, and into your MCP config.

**No key?** The MCP server still works without one. If it starts getting rate-limited,
add the key.

---

## 5. 21st.dev Magic (AI-generated UI components)

1. `21st.dev` → sign in.
2. Go to the **Magic** console / API keys page (`21st.dev/magic/console`).
3. Create a key → copy.
4. → `MAGIC_API_KEY=...`, and into your MCP config as the `API_KEY` argument/env var
   (exact form in `MCP_SETUP.md`).

⚠️ **The free tier is capped.** Check your remaining quota *before* you ask it to
generate a whole dashboard, and don't burn it on experiments. If it runs out, fall back
to the shadcn MCP (which needs no key).

---

## 6. Other APIs named in `PLAN.md` §5

☐ For each one, tonight: sign up, **check whether it needs a card**, and confirm the free
quota. The two things that kill hackathon integrations are (a) email/org verification
taking hours, and (b) a free tier that's 50 requests/month.

☐ Add the variable name to `.env.example`, add the value to `.env.local`, and add the
value to Vercel's environment variables.

---

## 7. Where keys go (the layout)

```
<app project root>/.env.example     ← COMMITTED. Names only, placeholder values.
<app project root>/.env.local       ← NEVER COMMITTED. Real values. One per developer.
Vercel dashboard                    ← Real values for the deployed app. Prod + preview.
```

⚠️ **Both files must sit at the app's project root — the folder containing `package.json`.**
This kit ships `.env.example` inside `hackathon-os/` for tidiness; that copy is a
*reference*, not the live file. Copy it up to the project root before filling it in, or the
framework will never read it and every key will be silently `undefined`.

`.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CONTEXT7_API_KEY=your_context7_api_key
MAGIC_API_KEY=your_21st_dev_magic_api_key
GITHUB_TOKEN=your_github_personal_access_token
DEMO_USER_EMAIL=demo@clubcraft.test
DEMO_USER_PASSWORD=your_demo_password
```

**Name variables to match what the provider's current docs say.** Do not invent a name —
if you guess `OPENAI_KEY` when the SDK wants `OPENAI_API_KEY`, you get a silent
`undefined`. Check with Context7 or the provider's docs.

---

## 8. Sharing keys with teammates

**Do not use the team chat.** Use one of:

- **Best:** each person creates their **own** key where the provider allows it (Supabase
  anon key and Vercel env vars are shared; personal tokens are per-person).
- **Shared values (Supabase URL/keys):** send via a disappearing message, or read them
  aloud in a huddle. Then have each teammate paste them straight into `.env.local`.
- **Shared secret manager** if your team has one.

⚠️ If a key is ever pasted in chat: **assume it is public** and rotate it (§9).

---

## 9. If a secret leaks

Do this immediately. Speed matters more than tidiness.

1. **Revoke the key at the provider.** Not "change it later" — revoke it now. A revoked
   key cannot be abused.
   - GitHub: Settings → Developer settings → Tokens → **Delete**
   - Supabase: Settings → API → **Rotate** the key
   - Vercel: Account → Tokens → **Delete**
   - Context7 / Magic: dashboard → revoke, create a new one
2. **Generate a replacement** and put it in `.env.local` and Vercel.
3. **Remove it from the code**, and confirm it's ignored:
   ```bash
   git check-ignore -v .env.local
   ```
4. **If it was committed**, deleting it in a new commit is **not enough** — it stays in
   history. Assume it is compromised and rely on step 1. (Rewriting git history mid-
   hackathon is not worth the risk; revocation is the actual fix.)
5. **Tell the team.** Nobody is angry; everyone has done it. The cost is entirely in
   *not* saying it.
6. **Rotate at the end of the hackathon anyway.** Every key the team created goes away
   when the event ends.

### Confirm `.gitignore` covers your secrets

```bash
git check-ignore -v .env.local .env .env.production.local
```

Each line that prints a `.gitignore` rule is safe. **No output for a file means it will
be committed.** Also check in an emergency:

```bash
git log --all --full-history -- .env .env.local    # any commits touching them?
git grep -n -I -E "(sk-|ghp_|eyJ|SERVICE_ROLE|service_role)" $(git rev-list --all) -- . | head
```

If either prints results, treat it as a leak and go to step 1.
