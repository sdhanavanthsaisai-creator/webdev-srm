# DEPLOY.md — Vercel deployment runbook (owned by Glue)

Do this at **T+30 with the empty shell**, not at the end. A deployment that has never
been attempted is the most expensive surprise in the building.

1. Log into `vercel.com` (sign in with GitHub).
2. **Add New… → Project** → select the team repo → **Import**.
3. Framework preset: **Next.js** (auto-detected — leave it).
4. Before the first real deploy: **Settings → Environment Variables** → add every
   variable from `.env.local`, names identical, ticking **Production, Preview, and
   Development**. See [`SECRETS.md`](SECRETS.md) §3 for where each value comes from.
5. Click **Deploy**. Confirm the placeholder page is live within the first 30 minutes.
6. From now on, every PR gets its own preview URL — verify features there, not on
   localhost. "Works on my machine but not on the preview" means it is not done.
7. After adding or changing env vars: **Redeploy**. Env vars only apply to new
   deployments — the classic "works locally, not on Vercel" cause.
8. Don't forget `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` on Vercel too — the pitch logs
   in with them, and a missing variable there fails only on stage.

If the first deploy fails: read the build log, fix forward, and tell the channel. If it
is not green within 20 minutes, pair on it — do not let one person silently wrestle Vercel.
