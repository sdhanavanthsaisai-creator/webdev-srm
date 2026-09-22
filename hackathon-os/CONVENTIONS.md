# CONVENTIONS.md

The rules that keep six people and their agents from overwriting each other.
Short, boring, and binding. Deviating needs a reason you can say out loud.

---

## 1. Branches

```
<<type>>/T-<<id>>-<<short-kebab-slug>>
```

`type` is one of `feat` `fix` `chore` `docs` `spike`.

| ✅ | ❌ |
| --- | --- |
| `feat/T-04-booking-form` | `my-branch` |
| `fix/T-09-seed-script-null-dates` | `fix-stuff` |
| `docs/T-13-readme` | `T-04` |

- Branch off **up-to-date `main`**: `git checkout main && git pull && git checkout -b ...`
- `main` is always deployable. Never commit to it directly, except the Coordinator
  merging PRs.
- Rebase your branch on `main` **once** when it goes stale; do not rebase after your PR
  has a reviewer. Never force-push `main`.
- Delete your branch after merge.

---

## 2. Commits

```
T-<<id>>: <<imperative summary, lowercase, no period>>
```

```
T-04: add booking form with slot validation
T-06: fix off-by-one in slot availability query
T-09: seed 12 demo bookings
```

- Prefix with the task ID, always. It is how we reconstruct what happened.
- Small and often. Push at least every ~30 minutes.
- **Never** in a commit: API keys, `.env.local`, tokens, connection strings, `*.pem`,
  test card numbers, personal data. If you commit a secret, see `SECRETS.md` §9.

---

## 3. Pull requests

- **Title:** `T-04: booking form`
- **Body:** three lines, no template theatre.
  ```
  What: booking form writes a row and shows the confirmed time
  Verify: /book → pick 10:00 → submit → confirmation shows 10:00  (or: the Vercel preview URL + path)
  Not done: no validation on past dates yet (T-12)
  ```
- **Size:** aim under ~400 changed lines. A PR nobody can read is a PR nobody reviews.
  If it's big, split it by task.
- **One task per PR.** Unrelated cleanup goes in its own PR or the trash.
- **At least one reviewer.** Solo/no-reviewer available? Self-review the diff out loud
  in the PR body, then merge. Do not let review become the bottleneck — 10 minutes
  maximum, then merge.
- **Merge within 30 minutes of opening**, or say why in the channel.
- Do not merge someone else's `BLOCKED` PR to "help".

### Reviewer checklist (60 seconds)

- [ ] Does it do what the task says — and only that?
- [ ] Any secret, credential, or `.env` content in the diff? (Check the *diff*, not the file.)
- [ ] Any file outside the author's ownership? (See §4.)
- [ ] Anything obviously broken on the preview URL?
- [ ] Was it actually exercised, or is the verification claim unproven?

---

## 4. File ownership map

**One owner per path.** The owner reviews changes to it. Need to change a file you do
not own? Ask its owner in the channel — it is a 10-second message, not a merge conflict.

> Fill this in at minute 8 of the cold start and keep it identical to `PLAN.md` §8.
>
> **Three-lane team (ClubCraft):** Surface = Frontend · Core = Backend **and** Data (one
> person, two hats — Core is still the single schema owner) · Glue = Coordinator +
> QA/Demo + Integrations. Concretely: Surface owns `app/`, `components/`, `styles/`;
> Core owns `app/api/`, `lib/`, `middleware.*`, `supabase/**`, `*.sql`; Glue owns every
> `*.md` in this kit, `.env.example`, the `package.json`/lockfile pair, and all secrets
> set through the Supabase/Vercel dashboards.

| Path / artifact | Owner | Notes |
| --- | --- | --- |
| `PLAN.md`, `TASK_BOARD.md` | Coordinator | Structure only; everyone owns their own row |
| `app/`, `components/`, `styles/` | Frontend | |
| `app/api/`, `lib/`, `middleware.*` | Backend | |
| `supabase/`, `db/`, `lib/db/`, `*.sql`, migrations | Data | **Single owner for all migrations** |
| `lib/integrations/`, `lib/env.ts` | Integrations | Backend reads env through it; only Integrations edits it |
| `e2e/`, `docs/DEMO.md` | QA / Demo | Coordinator designs the demo in `PLAN.md` §3; QA owns the script file |
| `package.json` | `<<one name>>` | **Owner approves every dependency addition** |
| `package-lock.json` / `pnpm-lock.yaml` | same as above | Never hand-edited, never merged by hand |
| `*.config.js`, `*.config.ts`, `tsconfig.json` | `<<one name>>` | |
| `components.json`, `tailwind.config.*` | Frontend | |
| `.env.example` | Integrations | Names only, never values |
| `README.md` | Coordinator | |
| `.github/` | Coordinator | |

### The lockfile rule

Parallel `npm install` runs produce conflicting lockfiles, and resolving them by hand
eats an hour. So:

1. `package.json` and the lockfile have **one owner**.
2. Want a dependency? Ask the owner. They install it on `main`, commit, push, and
   everyone rebases. One install at a time.
3. Never `npm install <pkg>` on your branch and never commit a lockfile change yourself.

### Generated files

Do not commit `node_modules/`, `.next/`, `dist/`, `build/`, `.env.local*`, coverage, or
editor state. See `.gitignore` at the project root.

⚠️ **The `.gitignore` that protects you must be at *your* repo root.** If your repo root
is not the folder containing `.gitignore`, copy it there before anyone runs
`npm install` or adds a key:

```bash
cp .gitignore "$(git rev-parse --show-toplevel)/.gitignore"
git check-ignore -v .env.local     # must print a rule
```

---

## 5. Stack freeze

**No new frameworks, languages, or major libraries after the walking skeleton is
deployed.** Adding a state manager at hour 8 is how teams ship nothing.

Adding a *small* utility library is allowed with the `package.json` owner's OK.
Everything else: write it yourself, or cut the feature.

---

## 6. Board discipline

Every change is preceded by a claim. Details and the conflict recipe are in
`TASK_BOARD.md`. Two things bear repeating:

- **One task at a time.** No `CLAIMED` rows you are not actively working.
- **Stale claims expire** after ~45 idle minutes. Someone else may take it.

---

## 7. Deploy early

Someone deploys the empty shell to a public URL in the **first 90 minutes**, and it
stays green. Reasons:

- You find out at hour 1 that the build fails on CI, not at hour 11.
- Every PR gets a preview URL, which makes verification costs ~zero.
- The demo URL is never a surprise.

Commit the deploy config; do not do it by hand in a dashboard at the end.

---

## 8. Escalation

| Situation | Do this |
| --- | --- |
| Blocked on a person | Board `BLOCKED`, ping them, switch tasks after 15 min |
| Blocked on a decision | Coordinator decides in 60 seconds. Shipping beats right. |
| Two people on a task | Whoever claimed first keeps it; the other picks the next task |
| Scope creep | Coordinator adds it to the board as `CUT` or a new task |
| Broken `main` | Fix-forward first. If >10 min, Coordinator reverts the offending PR |
| A teammate has gone quiet | Coordinator checks in; their row gets released after 45 min |

---

## 9. Accessibility and quality floor

Cheap to hold, expensive to retrofit. Non-negotiable even under time pressure:

- Real text in real elements (`<button>`, not a `<div>` with `onClick`).
- Every control reachable and operable by keyboard; visible focus ring.
- Every input has a visible label.
- Images have `alt`; decorative ones use `alt=""`.
- Text contrast ≥ 4.5:1 on the demo path.
- Works at 375px wide — someone will look at it on a phone, and mobile is often the
  chunk that gets cut last and hurts most.
