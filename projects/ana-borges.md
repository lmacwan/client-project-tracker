# Dr Ana Borges — WordPress Site ("FConnor")

- **Repo**: [lmacwan/client-ana-borges-website](https://github.com/lmacwan/client-ana-borges-website)
- **Client**: Dr Ana Borges, plastic/reconstructive surgeon
- **Status**: 🟢 Active — static site is the current dev target; WordPress version is frozen pending a one-pass port
- **Stack**: Custom WordPress theme `fconnor` (Local by WP Engine/Flywheel) **+** a parity static HTML/CSS/JS crawl (`static-site/`) that is where all current work actually happens
- **Started**: 2026-07-27
- **Design reference**: fitzgeraldoconnor.com (layout/structure only; content is Dr Borges' own)

## What's been built so far

1. **2026-07-27** — Homepage and About page fully built (content-complete). FAQs, contact, all-procedures, and blog pages also built.
2. **2026-07-28** — `ldevs-acf-toolkit` (in-house ACF Pro substitute plugin) built from scratch after discovering the original was a dead symlink. Same day, split out into its own reusable sibling repo — see [common-acf-ldev](acf-ldev.md).
3. **2026-07-28** — DIEP Flap became the first fully-built procedure page (all flexible-content sections), then its design was finalized as the standard template for all 24 procedure pages after a multi-round section-by-section comparison process.
4. **2026-07-28** — All remaining 22 procedure pages built (24 total), using 4 parallel content-drafting passes plus a single WP-CLI import script. Sourcing is deliberately uneven: only 4 of 22 had real client-docx content to adapt; the other 18 were researched from reference sites + standard clinical knowledge — logged per-page in `Documents/Procedure Content Sourcing.md` for pre-launch review.
5. **2026-07-28** — Fixed broken procedures navigation (dropdown + footer links were dead anchors left over from before the pages existed).
6. **2026-08-06** — Added `static-site/` (a static HTML/CSS/JS crawl of the WordPress build, confirmed at parity) and made it **the active dev target** — all further work happens here first, with the plan to port accumulated changes back to WordPress in one pass later, not continuously.
7. **2026-08-06 → 2026-08-14** — On the static site: built out Blog Landing + Blog Item pages (from a claude.ai/design import) with search, pagination, and post navigation (1 of 7 real posts currently written); added real client headshot photos; built two competing About-hero designs (`/about-me/` full-bleed vs `/about-me-2/` medallion mix) awaiting the client's pick.

## Pending / next up

- [ ] **Client sign-off**: which About-hero version (`/about-me/` vs `/about-me-2/`) to keep — both are currently live as a client-facing comparison, one is throwaway
- [ ] Write and build the remaining 6 of 7 blog posts (only 1 is a real page today)
- [ ] **Port static-site's accumulated changes back into the real WordPress build**, in one pass, once the client stops requesting static-site changes — every static-site change has been logged in memory specifically so this port has a checklist to follow
- [ ] **Clinical review/sign-off from Dr Borges** on the 18 agent-researched procedure pages before launch — check `Documents/Procedure Content Sourcing.md` for exactly which pages/sections need it
- [ ] Real contact info, real photography beyond the headshots, testimonials, and Instagram feed — currently placeholders
- [ ] Aesthetic Surgery, Body Contouring, Lower Limb Reconstruction, and General Plastics/Skin Cancer categories still only have bare procedure-name copy in the client's own source doc (`Website ANA.docx`) — worth getting real client copy for these eventually, even though pages are already built from research

## Key decisions & things to remember

- If a procedure page ever renders a header but no content sections, check `acf_get_field_type('ldevs_flexible_content')` isn't null before assuming content is missing — this exact failure mode already happened once (dead plugin symlink).
- `ldevs-acf-toolkit` now lives in its own repo (`common-acf-ldev`) and is junctioned in, not copied — see that project's doc for the recreate-the-junction command if it's ever missing after a fresh clone/machine move.
- `db-backups/` holds occasional content-only SQL dumps (posts/postmeta/terms), deliberately excluding users/usermeta/options to avoid committing credentials.
- `.claude/memory/` in the repo is the sole source of truth for project memory — read `MEMORY.md` there before starting any session of work on this project.

## Links

- [Repo memory index](https://github.com/lmacwan/client-ana-borges-website/blob/main/.claude/memory/MEMORY.md)
- [Procedure Content Sourcing log](https://github.com/lmacwan/client-ana-borges-website/blob/main/Documents/Procedure%20Content%20Sourcing.md)
