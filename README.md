# Project Tracker

A plain-git, no-external-tool tracker for lmacwan's active projects. No Jira/Asana/Azure DevOps — just markdown files in this repo that get read and updated directly (by you or by Claude) whenever a project moves forward.

**How this works:**
- Each active project has its own file in [`projects/`](projects/) — status, what's built, what's pending, key decisions.
- [`RUNNER.md`](RUNNER.md) is the cross-project reference doc: reusable components, conventions, and lessons learned across all projects, meant to inform decisions on the *next* project before it starts.
- To refresh: ask Claude to "update the project tracker" — it re-reads each repo's actual commit history and memory files (not just this doc, which can drift) and reconciles.

## Dashboard

| Project | Client | Status | Last activity | Doc |
|---|---|---|---|---|
| [client-james-young-website](https://github.com/lmacwan/client-james-young-website) | Mr James Young (knee/orthopaedic surgeon) | 🟡 Early build — static site, homepage design under client review | 2026-08-20 | [projects/james-young.md](projects/james-young.md) |
| [client-ana-borges-website](https://github.com/lmacwan/client-ana-borges-website) | Dr Ana Borges (plastic/reconstructive surgeon) | 🟢 Active — static site build, WP port pending | 2026-08-14 | [projects/ana-borges.md](projects/ana-borges.md) |
| [client-ps-joel](https://github.com/lmacwan/client-ps-joel) | Ps. Joel (joelsuchith.com, ministry site) | 🟢 Active — Phase 1 prototype, E-Courses demo just shipped | 2026-08-08 | [projects/ps-joel.md](projects/ps-joel.md) |
| [common-hosting-encryptor](https://github.com/lmacwan/common-hosting-encryptor) | Internal (shared infra) | 🟢 Live in production | 2026-08-06 | [projects/hosting-encryptor.md](projects/hosting-encryptor.md) |
| [common-acf-ldev](https://github.com/lmacwan/common-acf-ldev) | Internal (shared library) | 🔵 Stable, in use | 2026-07-28 | [projects/acf-ldev.md](projects/acf-ldev.md) |

Status legend: 🟢 active build · 🟡 waiting on client input · 🔵 stable/maintenance · 🔴 blocked

## Cross-project pending items worth knowing about

These recur across more than one project doc — listed here so they don't get missed:

- **WordPress porting debt**: both `client-ana-borges-website` and `client-ps-joel` are being built "static-first" (static HTML/CSS/JS as the active dev target) with the plan to port all accumulated static-site changes back into their real WordPress installs *in one pass* later. Neither port has happened yet — this is a growing chunk of deferred work on both projects, not a one-off task.
- **Pre-launch content review**: Ana Borges' 18 agent-researched procedure pages need clinical sign-off from the client before launch (documented per-page in that repo's `Documents/Procedure Content Sourcing.md`).
- **Real assets still placeholder** on more than one site: contact info, real photography, testimonials, Instagram/social feeds.

## Repos deliberately excluded

Everything else under `lmacwan/*` on GitHub is either a old personal/learning repo (last touched 2013–2021) or a fork, and isn't tracked here. If a new client project starts, add it to the dashboard table and give it a file in `projects/`.
