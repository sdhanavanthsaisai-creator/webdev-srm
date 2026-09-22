# Steps for humans (zero jargon, click-by-click)

1. **Open the project.** In Cursor or VS Code, open the `clubcraft` folder. Click your
   AI agent's chat icon and paste:
   > "Read /start.md and /agents/<your-lane>.md. Acknowledge your role and state your first task from /docs/TASK_BOARD.md."

2. **Claim a task.** Open `docs/TASK_BOARD.md`, find a row whose Owner is `—`, change
   Owner to your name and Status to `CLAIMED`, save. That's it — that's claiming.

3. **Save your work (GitHub Desktop).** Open GitHub Desktop → select the
   `webdev-srm` repository → tick the files you changed → write a short title like
   "T-05: login modal" → click **Commit to main** → click **Push origin**.
   No terminal needed. (Rule: only one of your agents pushes at a time.)

4. **Secrets (Supabase + Vercel).** Follow `docs/SECRETS.md` click-by-click.
   Paste keys ONLY where it says: the `.env.local` file (your agent creates it) and the
   Vercel dashboard. **Never paste keys into any chat.**

5. **If your agent gets stuck,** paste exactly this:
   > "Explain what just happened in plain English and tell me exactly what to click or type next."

6. **Never do these:** paste a secret key into chat or a code file · edit another
   lane's files without asking · force-push in GitHub Desktop.

7. **Sync points (T+60/120/180/240):** stop 3 minutes. Each person answers:
   What's done? What's blocking me? Is the Golden Path still safe?

8. **Coordinator (Glue):** you own the board, the timer, the Vercel/Supabase
   dashboards, and rehearsing `docs/DEMO.md` — not code.
