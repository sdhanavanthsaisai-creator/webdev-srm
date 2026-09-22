# STEPS_FOR_HUMANS.md

No jargon. If a step says *click this, copy this, paste here*, do exactly that.
Do the "Night before" section at home — it saves 30+ minutes on the clock.

**Legend:** ☐ = you do it · 📋 = copy/paste something · ⚠️ = easy to get wrong

---

# PART A — Night before (do this at home)

## A1. Make the accounts

Do all four. Do them tonight, while you're not under a clock.

☐ **GitHub** — go to `github.com` → Sign up. Use an email you actually read.
  Then confirm your email (GitHub will block you from things otherwise).

☐ **Vercel** — go to `vercel.com` → Sign up → **"Continue with GitHub"**.
  ⚠️ Use GitHub sign-in, not email. It's one less password and it auto-connects your repos.

☐ **Supabase** — go to `supabase.com` → Start your project → **"Continue with GitHub"**.
  ⚠️ Same reason. Also: once you're in, it creates a free "organization" for you. That's
  fine, leave it.

☐ **An AI coding agent** — pick one and sign in. Both are fine; pick based on which
  account you already have:
  - **GitHub Copilot** (in VS Code, free tier exists) — `github.com/features/copilot`
  - **Cursor** — `cursor.com`

📋 **Sign in to all four right now and close the tabs.** A login screen you've never seen
before is a 15-minute detour tomorrow.

## A2. Install the software

☐ **VS Code** — `code.visualstudio.com` → Download for Windows → install with all defaults.

☐ **GitHub Desktop** — `desktop.github.com` → install.
  Then open it → **Sign in to GitHub.com** → authorize in the browser.
  ⚠️ This is what makes pushing code a button instead of a command. Do not skip it.

☐ **Node.js** — `nodejs.org` → download the **LTS** version → install with all defaults.
  This is required for almost every command below.

☐ Check it worked. Open a terminal:
  - Windows: press `Win`, type `cmd`, press Enter
  - 📋 Type: `node -v` and press Enter
  - You should see something like `v22.x.x`. **If you see an error, install Node.js again
    before continuing.** Nothing else works without this.

☐ **Your AI agent extension**, if you chose Copilot:
  In VS Code press `Ctrl+Shift+X` → search `GitHub Copilot` → Install → sign in with GitHub.

## A3. Test one MCP connection (yes, really)

An AI tool that's *installed* but can't *log in* is worse than not having it — you'll
burn 20 minutes discovering that mid-hackathon. So prove one works tonight.

☐ In your AI agent's chat, ask it: **"What files are in this folder?"**
  If it lists real files, your agent is connected and working. ✅

That's the only test you need tonight. The full set is in `MCP_SETUP.md`, and you'll
run it as a team in the first 20 minutes — but doing one now proves your agent itself
isn't broken.

## A4. The night-before checklist

- ☐ GitHub account created **and email confirmed**
- ☐ Vercel signed in **with GitHub**
- ☐ Supabase signed in **with GitHub**
- ☐ AI agent installed and signed in, and it answered "what files are in this folder?"
- ☐ VS Code installed
- ☐ GitHub Desktop installed and signed in
- ☐ Node.js installed, `node -v` prints a version
- ☐ Charger **and** a phone hotspot tested (hackathon wifi will disappoint you)

---

# PART B — On the day: first 20 minutes

## B1. Get the code onto your machine

☐ Get the repo URL from the team channel (looks like `github.com/someone/something`).

☐ Open **GitHub Desktop** → **File → Clone repository** → paste the URL → Choose a local
  folder you can find again → **Clone**.

☐ In GitHub Desktop: **Repository → Open in Visual Studio Code**. VS Code opens the
  project. Leave it open.

☐ ⚠️ **Before anything else — sanity-check where the repo lives.** In the VS Code
  terminal (`` Ctrl+` ``) run:

  📋 `git rev-parse --show-toplevel`

  - ✅ It printed a folder like `C:/Users/you/Projects/our-team-repo` → perfect, carry on.
  - ❌ It printed your **home folder** (`C:/Users/you`) or a `Desktop` folder → **stop**.
    You have accidentally initialised git in a folder that contains your whole user
    profile. Nothing is broken, but do not run `git add -A` or `git push` here — you would
    try to commit `AppData`, browser profiles, and personal files. Tell the team and have
    someone `git init` inside the actual project folder instead.

  This check takes 5 seconds and prevents the worst possible first commit.

## B2. Put the secret keys in (the one fiddly bit)

☐ In VS Code's file list, find `.env.example` (it ships inside `hackathon-os/`).
  Right-click → **Copy**.

☐ **Paste it at the project root** — the folder that contains `package.json`, *not* inside
  `hackathon-os/` — and rename it to **`.env.local`** (starting with a dot).

  ⚠️ **Location matters.** App frameworks look for `.env.local` next to `package.json`. A
  file at `hackathon-os/.env.local` is never read, and you'll spend an hour wondering why
  every key is `undefined`.

☐ You'll get the actual key values from a teammate or from `SECRETS.md`. For each line in
  `.env.local`, replace `your_key_here` with the real value. Keep the part before `=` exactly
  as it is.

☐ Confirm the file is ignored before you trust it — in the terminal:

  📋 `git check-ignore -v .env.local`

  - ✅ It printed a line mentioning `.gitignore` → you're safe.
  - ❌ It printed **nothing** → `.env.local` **will be committed**. Copy the `.gitignore`
    file from the project root to your repo root and run the command again.

  ⚠️ `.env.local` must **never** be committed or pasted into chat. `SECRETS.md` §9 shows
  what to do if one leaks.

☐ Two lines in `.env.local` are the **demo account** — `DEMO_USER_EMAIL` and
  `DEMO_USER_PASSWORD`. The Coordinator creates that user in Supabase (Authentication →
  Users → **Add user**) *tonight or at T+0*, and tells you the values in person — never
  in chat. The demo logs in with these; nobody types a real password on stage.

## B3. Run the app

☐ In VS Code press `` Ctrl+` `` (the key left of `1`) to open the terminal.

☐ 📋 Type: `npm install` → Enter. Wait for it to finish. (First time takes a few minutes.)

☐ 📋 Type: `npm run dev` → Enter. You'll see a `localhost:3000` (or similar) link.

☐ Hold `Ctrl` and click that link. The app opens in your browser. ✅ **You're set up.**

☐ To stop the app later: click in the terminal and press `Ctrl+C`.

## B4. Get on the board

☐ Open the project's `TASK_BOARD.md` in VS Code.

☐ Find your name in the `Owner` column. That's your task. If you have no task, ask the
  Coordinator for one — do not start something that isn't on the board.

☐ Read `PLAN.md` first. It's the answer to "wait, what are we building?"

☐ Read `CONVENTIONS.md` — specifically the **ownership map**. It tells you which files
  are yours. Don't edit files that aren't.

☐ Read your role file in the `roles/` folder. That's the one that matches what you're
  doing (frontend / backend / data / integrations / QA). It tells you your first 30
  minutes, step by step.

## B5. Point your AI agent at the right files

This is the trick that makes the whole thing work.

☐ Open your AI agent's chat panel in VS Code.

☐ 📋 Paste this and send it (replace the last line with your actual role file):

```
Read hackathon-os/start.md and hackathon-os/roles/frontend.md in full.
Then read hackathon-os/PLAN.md and hackathon-os/CONVENTIONS.md.
You are my teammate on this project. Follow the rules in those files exactly.
Do not edit any file outside my ownership map.
Report back with: the task you think I should work on, and your first 3 concrete steps.
```

☐ Read what it says back. **Correct it if it's wrong.** It is a teammate, not an oracle —
  it will occasionally reach for files that aren't yours.

☐ From now on, your loop is: **claim a task → tell the AI → build → click through it
  yourself → push → open a PR → next task.**

---

# PART C — The rules that matter, in plain English

1. **Take one job at a time**, and write your name on it in `TASK_BOARD.md` first.
2. **Don't edit files that belong to someone else.** Ask them. It's a 10-second message.
3. **Never paste a key into a file that gets committed.** Only `.env.local`.
4. **Click through your own feature in a browser** before you call it done. "It compiles"
   is not done.
5. **Push at least every 30 minutes.** Ugly commits beat lost work.
6. **If you're stuck for 15 minutes, say so.** Silent struggling is the single biggest
   time-waster on a hackathon team.
7. **Never run `git add -A`.** Add your specific files. There are unrelated folders in
   this repo you do not want to commit.
8. **Ask for help before you ask for a rewrite.** Your AI agent can explain unfamiliar
   code faster than you can guess at it.

---

# PART D — When something goes wrong

| Symptom | Fix |
| --- | --- |
| `node -v` prints an error | Node.js isn't installed. Redo Part A2. |
| `npm install` fails | Check you're in the folder with `package.json`. If it still fails, ask in the channel — don't retry 10 times. |
| `npm run dev` starts then dies | Port already in use — another teammate's server is on it. Ask the AI to use a different port. |
| The app loads but shows nothing | Your `.env.local` is missing or has a typo. Check the variable **names** match `.env.example`. |
| AI agent can't see my files | You opened the wrong folder in VS Code. It must be the folder containing `package.json`. |
| GitHub Desktop says "conflict" | Stop. Do not guess. Ask in the channel and paste what it says. |
| I pushed and my teammate's work vanished | Tell everyone immediately. Do not push again. This is fixable if we know fast. |
| **AI suggests deleting a file to fix something** | Stop and read what it wants to delete. Ask before accepting. |
