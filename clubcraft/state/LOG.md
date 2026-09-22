# ClubCraft event log (newest at the bottom)

- [T+00] Git hazard resolved: repo initialized at webdev-srm (branch main), .gitignore re-scoped, scaffold + prototype committed (afc1704).
- [T+00] Next.js 15 + React 19 + Tailwind v4 scaffold created in clubcraft/; vercel.json pinned to the nextjs framework preset.
- [T+00] 3D landing ported to the app: globals.css design system, page.tsx, public/landing-ui.js (data + auth layer), public/landing-3d.js (ring module).
- [T+00] Express-style API routes shipped: /api/config, /api/workshops (demo fallback), /api/register (409 on duplicate, auth-scoped).
- [T+00] Supabase Auth modal added (sign in / join, full-name capture, demo fill); live when /api/config reports authEnabled.
- [T+00] supabase/migration.sql written: 3 tables, RLS, profile trigger, six-session seed.
- [T+00] `next build` passes with zero errors (page + 3 API routes). OS docs + agents + state files created.
