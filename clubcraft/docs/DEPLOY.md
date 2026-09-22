# Deploy to Vercel (zero-config)

The repo already contains `vercel.json` (`framework: nextjs`) — Vercel auto-detects
everything. `next build` passes locally with zero errors; it will on Vercel too.

## Option A — GitHub (recommended, auto-redeploys)
1. GitHub.com → **New repository** → name `clubcraft` → **Create** (keep it empty).
2. GitHub Desktop → **Repository → Push** → **Repository → Create a repository…** if the
   folder isn't linked yet → publish `webdev-srm` to the new repo.
3. vercel.com → **Add New… → Project** → **Import** the `clubcraft` repo.
4. Vercel shows *Next.js* detected → click **Deploy**. First deploy works with NO env
   vars (the app runs in demo mode).
5. **Add secrets** (only once): Project → **Settings → Environment Variables** → add
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (see `SECRETS.md`) → **Save**.
6. **Deployments → ⋯ → Redeploy**. The floor now serves live Supabase data.

## Option B — Vercel CLI (Glue only)
```bash
cd clubcraft
npx vercel login          # browser opens, click Confirm
npx vercel --prod         # accept defaults; prints the live URL
```

## Share
Copy the URL from the dashboard (or the CLI output) → post it in the group chat with
one line: "ClubCraft — claim a seat: <url>".
