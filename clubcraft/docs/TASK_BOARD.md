# ClubCraft task board

One owner per row. Claim by editing **only your row**: Owner ← you, Status ← `CLAIMED`,
commit `claim: <ID>`, push. WIP limit: 1 per person.

| ID | Task | Lane | Owner | Status | Depends on | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| T-01 | Git repo initialized at webdev-srm, .gitignore hardened, scaffold committed | Glue | Glue | DONE | — | commit afc1704 |
| T-02 | Next.js 15 + React 19 + Tailwind scaffold; vercel.json; .env.example | Core | Core | DONE | T-01 | builds clean |
| T-03 | Port 3D landing (globals.css, page.tsx, landing-ui.js, landing-3d.js) | Surface | Surface | DONE | T-02 | ring + floor + overlay live |
| T-04 | `/api/workshops` + `/api/config` with Supabase/demo fallback | Core | Core | DONE | T-02 | demo mode verified |
| T-05 | `/api/register` — auth-scoped, 409 on duplicate | Core | Core | DONE | T-04 | contract in PLAN.md |
| T-06 | Supabase Auth modal (sign in / join, name capture, demo fill) | Surface | Surface | DONE | T-03 | live via /api/config |
| T-07 | `supabase/migration.sql` — tables, RLS, trigger, seed | Core | Core | DONE | T-02 | paste into SQL Editor |
| T-08 | Supabase project + keys into `.env.local` + Vercel | Glue | — | TODO | T-07 | docs/SECRETS.md |
| T-09 | Live end-to-end: sign in → claim seat → row in Supabase | Core | — | TODO | T-04, T-05, T-08 | verify with Playwright |
| T-10 | MY SEATS from server truth on first paint (FR-11) | Surface | — | TODO | T-08 | uses `registered` flag |
| T-11 | 375px + keyboard + contrast pass on the demo path | Surface | — | TODO | T-03 | role file checklist |
| T-12 | Vercel deploy → live URL shared in group chat | Glue | — | TODO | T-02, T-08 | docs/DEPLOY.md |
| T-13 | DEMO.md rehearsed ×2; backup screen recording captured | Glue | — | TODO | T-09, T-12 | narrate over the app |
| T-14 | P2: QR code on registered seats | Surface | — | TODO | T-09 | cut if past hour 3 |
| T-15 | P2: organizer admin panel | Core | — | TODO | T-09 | cut if past hour 3 |

**Golden Path spine:** T-08 → T-09 → T-12. Everything else hangs off it.
T-01…T-07 are already DONE — claim from T-08 down.
