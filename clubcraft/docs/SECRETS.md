# Secrets — where every key comes from, where it goes

**Never type a real key into a chat message, a code file, or a commit. Only
`.env.local`, which is git-ignored.**

## 1. Supabase (10 clicks)
1. supabase.com → **New project** → name it `clubcraft`, set a DB password, wait for it.
2. Dashboard → **Authentication → Sign In / Providers** → make sure **Email** is ON.
3. Optional demo login: **Authentication → Users → Add user** →
   email `demo@clubcraft.test`, password `demo12345`, auto-confirm ON.
4. **SQL Editor → New query** → paste all of `supabase/migration.sql` → **Run**.
   (Creates tables, RLS, trigger, and the six seeded sessions.)
5. **Project Settings (gear) → API** → copy three values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only — treat like a root password)

## 2. Where the keys go
- **Locally:** tell your agent: "Create .env.local from .env.example and confirm it's
  git-ignored." The agent types the values; you never touch a terminal.
- **Vercel:** dashboard → your project → **Settings → Environment Variables** → add the
  three keys above (+ optional `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`) → **Save** →
  **Deployments → ⋯ → Redeploy** (vars only apply to new deployments).

## 3. Leak? Do this immediately
Supabase → **Settings → API → Reset** the leaked key → update `.env.local` and Vercel →
redeploy. Then tell the team in the channel (not the key — just that it rotated).
