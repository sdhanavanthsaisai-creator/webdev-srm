# Demo — the 60 seconds

1. **(10s) Intro.** "Every club tracks workshops in a group chat that eats them.
   ClubCraft is the room instead — watch this."
2. **(10s) The floor.** Land on the hero. Drag the ring once — plates glide, embers
   drift. "Every plate is a real session from our database."
3. **(15s) Auth.** Click **Sign in / Join** → the demo login is pre-filled → click
   **USE DEMO LOGIN** → **Sign in**. Header flips to "HI, <name>".
4. **(20s) The money moment.** Open any plate → **Claim my seat** → badge flips to
   **Registered** instantly → refresh the page: still claimed, because it's in Postgres.
5. **(5s) Close.** Click **MY SEATS** — "one tap, and the room remembers you."

## Before you demo
- [ ] Deployed URL loads; demo login works; console is clean
- [ ] Six future-dated sessions visible (re-run `supabase/migration.sql` seed if stale — never mid-demo)
- [ ] Backup screen recording of the full path exists and plays

## If it breaks live
Refresh once → still broken → play the backup recording **without apologizing** and keep
narrating. Nuclear option: open `landing/index.html` from disk — the same floor runs on
demo data with zero network. Never debug live.
