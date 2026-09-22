# GLOSSARY.md — plain-English tech glossary

For the non-coders on the team. If someone uses a word you don't recognize, it should
be here. Ask anyway — nobody minds.

- **Repo:** The main folder where all project code and files live on GitHub.
- **Branch:** A parallel copy of the project so people can work without breaking the main code.
- **Commit:** A saved snapshot of changes made to files.
- **Push / Pull:** Push sends your saved changes up to GitHub; Pull downloads the newest changes from GitHub to your computer.
- **Merge conflict:** When two people change the exact same line and GitHub asks which one to keep.
- **Environment variable:** A secret setting (like a password or API key) stored *outside* the code, in `.env.local`.
- **Deploy:** Publishing the website live to the internet so anyone can open it via URL.
- **API key:** A secret digital password that lets our app talk to external services like Supabase.
- **Endpoint:** A web address route in our app for sending or retrieving data (e.g. `/api/register`).
- **Auth:** Sign-in. Proving to the app *who you are* so it can show you your own data.
- **Session:** The app remembering that you're logged in as you move between pages.
- **Schema:** The structure of the database — which tables exist and what columns they have.
- **Seed data:** Realistic example rows pre-loaded into the database so the app looks alive and the demo never depends on typing data live.
- **RLS (Row-Level Security):** Database rules about *which rows* each signed-in user may read or write.
- **SSR (Server-Side Rendering):** Pages built on the server before they reach the browser — how our app checks "are you logged in?" before showing the dashboard.
