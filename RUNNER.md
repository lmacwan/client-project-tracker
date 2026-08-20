# Project Runner — Cross-Project Build Log & Decision Reference

This is the doc to read before starting or scoping a **new** project. It's not per-project status (that's in `projects/`) — it's the accumulated "how we build things here" knowledge: conventions that have proven themselves, reusable components that already exist, and mistakes worth not repeating. Update it whenever a pattern shows up on a second project (i.e. it's stopped being a one-off).

## Standing conventions across client (WordPress) projects

These conventions now appear consistently across `client-ana-borges-website`, `client-ps-joel`, and (partially) `client-james-young-website`. Treat them as the default for the next WordPress client project unless there's a specific reason not to:

1. **Folder layout**: `Local/` (WP install via Local by WP Engine/Flywheel), `static-site/` (active dev target, see below), `Documents/` (client-supplied source material + reconstructed spec docs), a memory folder (see below).
2. **Static-first / static-parity workflow**: build or crawl a static HTML/CSS/JS copy of the site and make *that* the active dev target, not the live WordPress install. Rationale that's held up twice now: it's dramatically faster to iterate and share for client review than a full WP+DB stack, and changes get ported back to WordPress in one deliberate batch later rather than continuously. **Cost**: this creates a real, growing porting debt — track every static-site change in memory as it happens specifically so the port has a checklist, and don't let it grow indefinitely before paying it down.
3. **Persistent memory lives in the repo, not in Claude's own memory system**: either `.claude/memory/` (Ana Borges, James Young) or a plain `memory/` + root `MEMORY.md` (Ps. Joel) — a source-controlled `MEMORY.md` index pointing to topic files, read at the start of every session. This is deliberate per-project isolation: default Claude memory is explicitly left unused so project knowledge travels with the repo, not with a particular machine or Claude account.
4. **In-house ACF Pro substitute** (`common-acf-ldev`) for flexible-content/repeater fields when a project needs ACF-Pro-style flexible content but doesn't have (or want to pay for) real ACF PRO. Storage-compatible with real ACF PRO, so switching later is a type-rename, not a migration.
5. **Shared client-preview hosting** (`common-hosting-encryptor`) — a single password-gated Hostinger domain serves static-site previews for every client, rather than provisioning separate hosting per client during the build phase. New clients are just a new `protected-content/<name>/v1/` folder + config entry.
6. **Big redesigns get a preview page first**: build major visual changes as a standalone page (`/home-N/` pattern) and only promote to the real route after client approval — don't redesign a live page in place.
7. **Reconstructing missing spec docs is normal and OK, but must say so**: on Ps. Joel, two "spec" docs were rebuilt from client PDFs + the live build rather than being originals. This worked fine, but every reconstructed doc carries a provenance note flagging it as reconstructed and its confidence level — do this on any future project where the brief exists only as PDFs/screenshots/verbal notes rather than a structured doc.

## Reusable components inventory

| Component | Repo | Reuse it when... |
|---|---|---|
| ACF Pro substitute plugin | [common-acf-ldev](projects/acf-ldev.md) | A WP project needs flexible-content/repeater fields and doesn't have real ACF PRO. Storage-format-compatible, so upgrading later is trivial. |
| Multi-client preview gate | [common-hosting-encryptor](projects/hosting-encryptor.md) | Any new client needs a password-protected static preview before their own hosting/domain is ready. Optional at-rest encryption available if the content is sensitive. |

Before building new shared infrastructure for a client project, check this table first — there's a real cost to a 3rd near-duplicate of something that already exists twice.

## Lessons learned / gotchas worth not repeating

- **Dead symlinks/junctions fail silently.** The ACF substitute plugin has now broken once as a symlink to a nonexistent path (silently killed all flexible-content rendering, no error). Always verify a junction/symlink target actually exists before assuming a linked-in dependency works — don't just trust that it's wired up.
- **WordPress slug reassignment**: renaming a post to a slug still held by another (not-yet-deleted) post silently appends `-2` instead of erroring. Delete/free the old slug first, or do a follow-up `wp post update --post_name=` pass after deleting the collision.
- **A shared `<label>` around a radio group is a real bug, not a style choice** — ambiguous label association makes a browser resolve any click in the group to the *first* radio. Use a heading element instead and wire click-to-select in JS if a pill-style selector is wanted.
- **CSS descendant vs. direct-child selectors matter for "is-current" nav states** — a descendant selector bleeds an active/underline style onto every link inside a dropdown submenu, not just the parent item. Use a direct-child combinator for this pattern.
- **Don't mistake a dummy/demo build for real backend progress.** Ps. Joel's E-Courses demo (fake login, `localStorage` session) is useful for client review of the *design*, but is zero progress toward the real DB-backed sign-in/course system — flag this explicitly in memory so a future session doesn't assume otherwise.
- **Local dev environment quirks don't transfer to production** — PHP extensions (sodium, openssl) that need manual enabling locally often need the *same* manual enabling on the actual host (e.g. via Hostinger hPanel), not just once at setup. Don't assume parity.

## Recommended defaults for the next new project

Starting a brand-new client project from scratch, apply by default:
1. Folder layout + memory-folder convention above.
2. Static-first build (crawl or hand-build static HTML, iterate there, defer full WP+DB work).
3. Check the reusable-components table before writing new plugin/infra code.
4. Register the new client on `common-hosting-encryptor` instead of standing up separate preview hosting.
5. Add the project to `../README.md`'s dashboard table and give it a `projects/<slug>.md` file the first time real work happens, not retroactively.

## Decision log

Dated, one-line entries for cross-project decisions worth remembering later (append here, don't rewrite history):

- **2026-07-28** — `ldevs-acf-toolkit` promoted from single-project code to shared infra (`common-acf-ldev`), after the dead-symlink incident on Ana Borges' project made clear it needed its own repo/history rather than living inside one client's project.
- **2026-08-06** — Hosting/preview gate promoted from Ps. Joel-specific code to shared infra (`common-hosting-encryptor`), for the same reason: it was never really project-specific.
- **2026-08-06** — Static-first workflow (build/crawl a static site, defer WP porting) adopted as standard on Ps. Joel, mirroring the pattern already in use on Ana Borges' project.
