# DEMO.md — click-by-click demo runbook

The demo is *designed* in `PLAN.md` §3 (by Glue); this file is the *literal script* —
on this team Glue also owns it. Update it the moment a click changes. Rehearse from
this file, not from memory.

---

## Before you demo (checklist)

- [ ] Deployed URL loads, and a logged-out visit to `/dashboard` bounces to `/login`
- [ ] Seed data present: 5–6 future workshops visible on the dashboard (re-run
      `supabase/seed.sql` beforehand if needed — **never mid-demo**)
- [ ] Demo account `demo@clubcraft.test` logs in; credentials already saved in the
      browser profile so nothing is typed live
- [ ] Backup screen recording of the full demo exists and plays
- [ ] Browser zoom ≥ 100%, notifications silenced, one tab open, second monitor if available

## The 60 seconds

1. **(10s) Intro.** "Clubs struggle to manage workshop signups — spreadsheets and group
   chats lose people. Meet ClubCraft."
2. **(15s) Auth.** Open `/login`. The demo credentials are pre-filled. Click **Log in**.
3. **(15s) Dashboard.** Point at the auto-redirect, the personalized greeting, and the
   workshop grid — title, speaker, date, location.
4. **(20s) The money moment.** Click **Register** on a workshop → the button flips to
   **Registered** instantly. If a second browser is handy, refresh it there: the
   registration is in the database, not just the UI.

## Narration notes

- Talk over the app, not over slides. Half the pitch time is this demo.
- The one hard technical thing to name out loud: "real authentication and an idempotent,
  RLS-scoped database write — the registration is actually persisted, not faked."
- If asked "what if the API is down?" — have ONE sentence ready. A team with a plan
  reads as competent.

## If it breaks live

- Refresh once. Still broken → switch to the backup recording **without apologizing**
  and keep narrating over the video.
- Nuclear option: open `clubcraft/landing/index.html` — the same floor on demo data, no
  server and no network needed. Bookmark it before the pitch; it is the last line of defence.
- Never debug live. Never reseed mid-demo. Never say "it worked five minutes ago."

## Scope-cut triggers (mirror of PLAN §4)

If the Golden Path is not 100% operational by T+180 (hour 3), cut in this order:

1. Full-name capture → email-only login
2. DB-persisted registration → local UI state (button still flips)
3. Multiple workshops → one featured workshop

Never cut: the demo path itself, the deployment, working auth.
