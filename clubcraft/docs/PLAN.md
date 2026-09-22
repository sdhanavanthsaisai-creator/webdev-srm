# ClubCraft — technical plan

## Architecture (PERN, serverless-flavored)
```
Browser (React 19 + three.js r160 ring)
   │  same-origin fetch
   ▼
Next.js on Vercel — one URL, one deploy
   ├─ /                  landing + floor (static shell, client hydration)
   ├─ /api/config        public: is Supabase wired? (+ anon key)
   ├─ /api/workshops     Express-style route → Supabase Postgres (demo fallback)
   └─ /api/register      Express-style route → registrations insert (409 on dupe)
                               ▲
Supabase: Postgres + Auth + RLS ┘  (service-role key server-side only)
```

## Database schema (full SQL in `supabase/migration.sql`)
| Table | Columns | Rules |
| --- | --- | --- |
| `profiles` | `id uuid PK → auth.users`, `full_name`, `created_at` | auto-created by trigger on signup |
| `workshops` | `id`, `title`, `description`, `speaker`, `role`, `location`, `dur`, `starts_at timestamptz`, `created_at` | public read |
| `registrations` | `id`, `user_id`, `workshop_id`, `created_at`, **`unique(user_id, workshop_id)`** | RLS: owner-only; 409 by construction |

## API contract (one shape, always)
- `GET /api/config` → `{ supabaseUrl, supabaseAnonKey, authEnabled }`
- `GET /api/workshops` → `200 [{ id, title, description, speaker, role, location, dur, starts_at }]`
  (soonest first; demo list when Supabase env is absent)
- `POST /api/register { workshop_id }` → `200 {registered:true}` · `409 {error:"already registered"}`
  · `401 {error:"unauthenticated"}` · `404` · `400`

## UI design system
Deep-slate ink `#0d0f17` + ember `#ff6a3d` + violet `#8b5cf6` auth glow + cyan accents.
Fraunces (display) / Space Grotesk (body) / JetBrains Mono (labels). Glass panels =
`rgba(13,15,23,.92)` + 1px `--hair` borders. The three.js ring is the hero; every async
view ships loading/empty/error/success states.

## Fallbacks (decided now)
No Supabase env → `/api/workshops` serves the demo six; auth runs in local demo mode.
Vercel deploy therefore works **before** keys exist, then goes live the moment they're set.
