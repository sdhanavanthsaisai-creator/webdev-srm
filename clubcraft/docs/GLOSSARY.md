# Plain-English glossary

- **Repo:** the folder (with its history) that git tracks — ours is `webdev-srm`.
- **Branch:** a parallel copy of the code so you can't break `main` while you work.
- **Commit:** a saved snapshot of changes, with a message describing them.
- **Push / Pull:** push sends your commits to GitHub; pull downloads everyone else's.
- **Merge conflict:** two people changed the same line — git asks which to keep.
- **Environment variable:** a secret setting (key/URL) kept outside the code.
- **Deploy:** publishing the app to a public URL — Vercel does it from the repo.
- **API key:** a password that lets our app talk to a service like Supabase.
- **Endpoint:** an address our server answers, like `/api/workshops`.
- **PERN:** Postgres + Express + React + Node — our flavor swaps in Supabase's Postgres.
- **RLS (Row Level Security):** database rules that decide who may read/write each row,
  enforced by Supabase even if the app code has a bug.
