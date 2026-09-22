# Workflow rules

## Branches
- Name: `feat/<lane>/<task-id>` → e.g. `feat/surface/T-11`.
- Merge to `main` at least every 45 minutes, even if incomplete.
- **Only Glue merges to `main`.** Everyone else opens PRs.

## Folder ownership (binding)
| Lane | Owns | Must not touch |
| --- | --- | --- |
| Surface | `app/page.tsx`, `app/globals.css`, `public/landing-ui.js`, `public/landing-3d.js` | `app/api/**`, `lib/**` |
| Core | `app/api/**`, `lib/**`, `supabase/**`, `package.json` | UI files above |
| Glue | `docs/**`, `state/**`, `.env.local`, Vercel + Supabase dashboards, merges | feature code |

## Conflicts
Owner fixes within 10 minutes, else the branch is dropped and re-cut from clean `main`.
On a board conflict: `git checkout main -- docs/TASK_BOARD.md`, then re-apply only your row.

## Pushing
One agent per human pushes at a time. Never force-push. Push every ~30 minutes —
lost work is the only unrecoverable bug.
