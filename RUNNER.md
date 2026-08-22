# Project Runner — Cross-Project Build Log & Decision Reference

This is the doc to read before starting or scoping a **new** project. It's not per-project status (that's in `projects/`) — it's the accumulated "how we build things here" knowledge: conventions that have proven themselves, reusable components that already exist, and mistakes worth not repeating. Update it whenever a pattern shows up on a second project (i.e. it's stopped being a one-off).

## Standing conventions across client (WordPress) projects

These conventions now appear consistently across `client-ana-borges-website`, `client-ps-joel`, `client-james-young-website`, and (as of 2026-08-22) `client-alison-avery-clinic` — all four now use the `.claude/memory/` + `MEMORY.md` convention. Treat them as the default for the next WordPress client project unless there's a specific reason not to.

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
| Encrypted static-site viewer pattern | [client-project-tracker's `site/`](projects/tracker-site.md) | Any internal tool needs a lightweight, deploy-anywhere password gate with real confidentiality (not just a hidden div) and no backend — AES-256-GCM with a PBKDF2-derived key, decrypted client-side via Web Crypto. Same idea as `common-hosting-encryptor`'s at-rest encryption, but self-contained in a static bundle instead of needing a PHP host. |

Before building new shared infrastructure for a client project, check this table first — there's a real cost to a 3rd near-duplicate of something that already exists twice.

## Lessons learned / gotchas worth not repeating

- **Dead symlinks/junctions fail silently.** The ACF substitute plugin has now broken once as a symlink to a nonexistent path (silently killed all flexible-content rendering, no error). Always verify a junction/symlink target actually exists before assuming a linked-in dependency works — don't just trust that it's wired up.
- **WordPress slug reassignment**: renaming a post to a slug still held by another (not-yet-deleted) post silently appends `-2` instead of erroring. Delete/free the old slug first, or do a follow-up `wp post update --post_name=` pass after deleting the collision.
- **A shared `<label>` around a radio group is a real bug, not a style choice** — ambiguous label association makes a browser resolve any click in the group to the *first* radio. Use a heading element instead and wire click-to-select in JS if a pill-style selector is wanted.
- **CSS descendant vs. direct-child selectors matter for "is-current" nav states** — a descendant selector bleeds an active/underline style onto every link inside a dropdown submenu, not just the parent item. Use a direct-child combinator for this pattern.
- **Don't mistake a dummy/demo build for real backend progress.** Ps. Joel's E-Courses demo (fake login, `localStorage` session) is useful for client review of the *design*, but is zero progress toward the real DB-backed sign-in/course system — flag this explicitly in memory so a future session doesn't assume otherwise.
- **Local dev environment quirks don't transfer to production** — PHP extensions (sodium, openssl) that need manual enabling locally often need the *same* manual enabling on the actual host (e.g. via Hostinger hPanel), not just once at setup. Don't assume parity.
- **Directory-relative asset/link paths break depending on server behaviour.** James Young's v2 build looked completely unstyled on the client's dev server (but fine on ours) because their server doesn't 301-redirect a bare directory URL to its trailing-slash form the way `python -m http.server` does — so `href="assets/css/tokens.css"` resolved against the wrong base. Root-absolute paths (`/assets/...`) don't have this failure mode. Worth defaulting to root-absolute paths on any project that might be served from more than one environment, or that has multiple version folders (like James Young's v1/v2 split).
- **Don't source images of real, named people from a reference/competitor site**, even for a mockup — James Young's v2 build needed practice photography and explicitly avoided pulling another surgeon's actual photo from a reference site (it would misrepresent who the client is). Ask the client for real assets or use clearly-labeled placeholders instead of guessing with someone else's likeness. Generic stock/location photography is a different, lower-risk case, but check licensing before reusing anything scraped rather than client-supplied.
- **Hostinger has no native git-based auto-deploy** — confirmed via `common-hosting-encryptor`'s own manual zip/hPanel deploy process. If a project needs "push to deploy" behaviour on Hostinger, it has to be built (e.g. a GitHub Actions step that FTPs/rsyncs a build's output to Hostinger) — it doesn't come for free the way it does with Netlify/Vercel/GitHub Pages.
- **Review a client-supplied code diff before applying it, the same as any other change.** Ps. Joel's client sent an exact CSS diff for a hero-sizing fix; its selector would have applied a fixed height to the sitewide shared container rule (every LaunchKit page's nav/footer/sections) instead of just the one hero it was meant to fix. Caught before applying, scoped down to the specific component instead. Getting literal code from a client is a starting point, not a reason to skip review.
- **A rename/cleanup done on one tree doesn't propagate to a parallel tree automatically.** Ps. Joel's `home-4.css`→`home.css` rename only touched the WordPress theme; `static-site/` (the separate active-dev-target copy) kept the old filename and nobody noticed until unrelated work months later touched that file again. Any project keeping two parallel trees (WP + static-site, or v1/v2) needs an explicit step — or a checklist — to keep renames/structural changes in sync, not just content changes.

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
- **2026-08-18** — James Young project moved from "one design replaces another" to "keep two full versions live side by side, switchable on-page" per client request — the first project here to do this. If another project asks for the same thing, the version-switch-banner approach (shared CSS, both versions get root-absolute paths) is the precedent to reuse.
- **2026-08-20** — James Young client settled on the *original* design (v1) as the working copy after fully building and comparing an alternative (v2) — a reminder that "fully build the alternative to compare" is sometimes what it takes to confirm the original was right, not wasted work.
- **2026-08-20** — Built a password-gated static web UI for this tracker itself (`site/`), using AES-256-GCM + PBKDF2 client-side decryption so it's safe to deploy to a fully public host. Added to the reusable-components table above as a pattern, not just a one-off.
- **2026-08-22** — `client-alison-avery-clinic` added to tracking. Its memory was deliberately cleared in a "clean slate" reset (2026-08-21) and not reinstated — flagged as a deviation from the standard memory-folder convention rather than silently treated as compliant.
- **2026-08-22** — Ps. Joel client polish round (photo swap, hero sizing, E-Courses margin fix) surfaced that the 2026-08-06 `home-4.css`→`home.css` rename never made it into `static-site/` — the two trees have been silently diverged in filenames for over two weeks. No fix applied yet beyond flagging it; needs reconciling whenever the WordPress port happens.
- **2026-08-22** — `client-alison-avery-clinic`'s memory-folder deviation (flagged the same day, above) was closed the same day: `.claude/memory/` + `CLAUDE.md` rebuilt to match the other three client projects, with an explicit note on where pre-reset context still lives in git history if ever needed.
