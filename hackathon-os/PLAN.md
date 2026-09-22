# PLAN.md — ClubCraft (Club Workshop Hub)

> **This file is the single source of truth for *what* we are building.**
> Materialized from the MASTER_PROMPT output at kickoff. If it changes, announce it.
> Last updated: `T+00`, by the team.

---

## 1. The problem statement (verbatim)

Team-chosen idea — there is no official problem statement.

> "A centralized portal for college/tech club members and students to view upcoming
> workshops, register with their details, and manage workshop participation using
> Supabase Auth and Database."

**Source / track:** self-chosen — "ClubCraft" / Club Workshop Hub
**Judging criteria & weights:** `<<confirm at kickoff — typical: Impact / Technical / Design / Pitch>>`

### What is actually being asked

**One sentence:** Let a student sign in, see upcoming club workshops, and register for
one in a single click — with the registration actually saved.

**Deliverable noun:** a deployed web app.
**The verbs that matter:** **view → register → see it saved.** Everything else is decoration.

### Constraints

| Constraint | Value |
| --- | --- |
| Time remaining | `<<set at kickoff>>` — milestones in §6 assume a ~4–5 h sprint; stretch the middle ones if longer, keep T+30 and T+180 fixed |
| Team size | 3 — two coders (Surface, Core) + one non-coding Coordinator (Glue) |
| Required stack | Next.js (App Router) + Supabase (Auth + Postgres) + Vercel; Tailwind + shadcn/ui |
| Hard rules | deployed to a public URL; demo runs without typing live |

---

## 2. Who it is for and why it wins

**Primary user:** a college club member who wants to sign up for a workshop in under 30
seconds — and the club organizer who today tracks signups in a spreadsheet or group chat.

**The one sentence we want the judge to remember:**
"ClubCraft turns workshop signups from a group-chat mess into one click."

**Why this wins on the criteria:**
- Impact: every club on campus has this problem; the friction is real and visible in the demo.
- Technical: real auth + database persistence end-to-end (Supabase Auth, RLS-scoped
  writes, idempotent registration) — not a mock.
- Design: a clean, obvious dashboard. The demo IS the product.

---

## 3. THE DEMO — design the 3 minutes before you design the app

60-second demo script (Glue narrates throughout):

| Step | Screen | What the judge sees | Owner |
| --- | --- | --- | --- |
| 1 (10s) | `/login` | Intro line: "Clubs struggle to manage workshop signups — spreadsheets and group chats lose people. Meet ClubCraft." | Glue |
| 2 (15s) | `/login` | Pre-filled demo credentials, click **Log in** | Glue |
| 3 (15s) | `/dashboard` | Auto-redirect, personalized greeting, grid of upcoming workshops (title, speaker, date, location) | — |
| 4 (20s) | `/dashboard` | Click **Register** on a workshop → button flips to **Registered** instantly, saved to the database | — |

**The single most important screen:** the workshop card flipping to "Registered" — the money moment.
**Seed data required to demo (owned by Core):**
- demo account `demo@clubcraft.test` (credentials in `.env.local` as `DEMO_USER_*`, never in git)
- 5–6 workshops with **future dates**, realistic titles, speakers, locations — via `supabase/seed.sql`
- the 6 sessions inside `clubcraft/landing/index.html` are the **canonical seed list** — seed from them so the prototype and the database tell the same story

> Rule: the demo path must work **without network hiccups, without a fresh signup, and
> without typing live** (demo login excepted). Pre-seed everything. Record a screen
> capture as backup. The click-by-click runbook lives in [`DEMO.md`](DEMO.md).

---

## 4. Scope

### IN (build these)

1. **P0** Supabase Auth login + signup capturing full name
2. **P0** Auth-gated `/dashboard` (logged-out visit bounces to `/login`)
3. **P0** Workshop dashboard listing active workshops (title, date, description, speaker, location)
4. **P1** One-click **Register** writing a `registrations` row to Supabase
5. **P1** "My registered workshops" filter/tab

### OUT (explicitly not building — say no once, in writing)

- Admin mode for organizers to post workshops from the frontend (seed SQL is the "admin")
- Email confirmations / QR codes for entry
- Search and category filters
- Anything realtime — a refresh is fine

### The cut list — pre-decided, in this order

**Hard checkpoint: if the Golden Path is not 100% operational by T+180 (hour 3), cut from the top:**

1. Full-name capture → fall back to email-only login
2. DB-persisted registration → fall back to local UI state (button still flips)
3. Multiple workshops → single featured workshop

4. **Never cut:** the demo path in §3, deployment, and working auth.

### Frozen at T+240 (code freeze)

After the freeze: bug fixes only. Run the demo end-to-end every 30 minutes.
T+270: rehearse twice using `DEMO.md` and record the backup video.

---

## 5. Technical shape

**One-liner:** Next.js (App Router) on Vercel + Supabase (Auth + Postgres) + Tailwind/shadcn.

```
Browser → Next.js App Router (Vercel)
            ├─ /login, /dashboard          (pages; dashboard is auth-gated)
            ├─ /auth/callback              (Supabase SSR code exchange)
            ├─ GET  /api/workshops         → Supabase Postgres
            └─ POST /api/register          → Supabase Postgres (auth-scoped)
```

| Piece | Choice | Why this and not the alternative |
| --- | --- | --- |
| Framework | Next.js App Router | one codebase for pages + auth redirects + API routes; first-class Supabase SSR sessions |
| Styling / UI | shadcn/ui + Tailwind (via shadcn + Magic MCP) | the components exist; nobody hand-rolls |
| Database | Supabase Postgres | mandated; the Supabase MCP lets agents run schema/SQL directly |
| Auth | Supabase Auth (email + password) | mandated; capture full name at signup |
| Hosting | Vercel | zero-config Next.js; every PR gets a preview URL |
| External APIs | none | keeps the demo path unbreakable |

**Constraints we accept:** no realtime — refresh or simple refetch is fine; no admin UI.

### Data model (write this before writing any UI)

Corrected from the generated draft: `date_time TEXT` → **`starts_at timestamptz`** (text
dates break sorting and invite timezone bugs), and registrations get a **uniqueness
constraint** so double-clicks and retries cannot double-register.

| Table | Columns | Notes |
| --- | --- | --- |
| `profiles` | `id uuid PK → auth.users(id)`, `full_name text NOT NULL`, `created_at timestamptz` | row created on signup |
| `workshops` | `id uuid PK default gen_random_uuid()`, `title`, `description`, `speaker`, `location`, `starts_at timestamptz NOT NULL`, `created_at timestamptz` | seeded, future dates, sorted soonest-first |
| `registrations` | `id uuid PK`, `user_id uuid → auth.users`, `workshop_id uuid → workshops`, `created_at timestamptz`, **`unique (user_id, workshop_id)`** | idempotent by construction |

**RLS: ON**, with insert/read policies scoped to the authenticated user — or explicitly
noted OFF in the README. Never ambiguous.

**API surface (Core publishes these shapes before Surface builds against them):**
- `POST /auth/callback` — Supabase SSR code exchange
- `GET /api/workshops` — active workshops, soonest first
- `POST /api/register` — `{ workshop_id }` → `{ registered: true }`; `409` if already registered

**Prototype, already on disk (Surface):** `clubcraft/landing/index.html` implements the
whole demo path standalone — loading / empty / error / success states, optimistic
register, 409-aware. It calls `GET /api/workshops` when a server answers and falls back
to the 6 demo sessions when one does not, so it works **before** Core ships and becomes
a live client afterwards. Port its behavior into `app/`; keep it running as the fallback
demo (`DEMO.md`).

**Seed data lives in:** `supabase/seed.sql` — owned by Core, idempotent, committed.

---

## 6. Milestones

| Time | Milestone | Gate (how we know it's real) |
| --- | --- | --- |
| T+30 | Scaffold pushed to GitHub; Vercel placeholder live; Supabase project created | the placeholder URL loads for someone who never cloned it |
| T+60 | Login page built (Surface); auth helper + schema + seed done (Core) | schema matches §5; seed runs clean twice |
| T+120 | Login redirects to a dashboard showing real workshops | a teammate clicks it end-to-end |
| T+180 | **Hard checkpoint: Golden Path works end-to-end** | demo run by someone who didn't build it |
| T+240 | Feature freeze; backup screen recording captured | the recording exists and plays |
| T+270 | Pitch rehearsal ×2 using `DEMO.md` | on time, no dead air |

> Ship the walking skeleton absurdly early. A deployed ugly app at T+30 beats a
> beautiful unbuilt app at T+240.

---

## 7. Risks

| Risk | Likelihood | Plan B, decided now |
| --- | --- | --- |
| Supabase provisioning / auth config stalls | medium | Glue owns the dashboard setup at T+0; Surface builds against stub data meanwhile |
| An MCP server fails to auth | medium | take the manual fallback (`MCP_SETUP.md`); never debug tooling >10 min |
| Vercel env vars missing → deployed app broken | high if rushed | add vars before the first real deploy, then **redeploy** (vars apply only to new deployments) |
| Session/redirect bugs eat the auth lane | medium | Core ships stub auth (hardcoded demo user) behind the same interface; real auth lands under it |
| A teammate disappears | low | the ownership map says what they owned; Glue reassigns in one stand-up |
| Bad merge / lost work | low | push every ~30 min; only Glue merges; never force-push |

---

## 8. Roster

| Handle | Lane | Role file(s) | Owns (paths) | MCPs |
| --- | --- | --- | --- | --- |
| `<<@name>>` | **Glue** (Coordinator, non-coder) | `roles/coordinator.md` | `PLAN.md`, `TASK_BOARD.md`, `DEMO.md`, `DEPLOY.md`, secrets on the Supabase/Vercel dashboards | GitHub, Supabase (dashboard) |
| `<<@name>>` | **Surface** (Coder A) | `roles/frontend.md` | `app/**/page.tsx`, `app/**/layout.tsx`, `components/`, `public/` | shadcn, Magic, Playwright |
| `<<@name>>` | **Core** (Coder B) | `roles/backend.md` + `roles/data.md` | `app/api/`, `lib/`, `supabase/`, `types/`, `package.json` | Context7, Supabase, Playwright, GitHub |

**Lane → role mapping:** Surface = frontend; Core = backend **and** data hats (one
person, two files — they are complementary, and Core is the single migration owner);
Glue = coordinator. There is no separate QA or integrations lane on this team: QA
duties (clicking the deployed demo path, keeping `DEMO.md` true) fold into Glue.

(Keep this table in sync with the ownership map in `CONVENTIONS.md`.)
