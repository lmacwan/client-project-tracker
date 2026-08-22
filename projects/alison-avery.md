# The Avery Clinic — Website Rebuild

- **Repo**: [lmacwan/client-alison-avery-clinic](https://github.com/lmacwan/client-alison-avery-clinic)
- **Client**: Dr Alison Colville, The Avery Clinic (Leamington Spa) — aesthetics/skincare clinic
- **Status**: 🟡 Early build — homepage rebuilt from a clean slate, desktop-only, no other pages yet
- **Stack**: Plain HTML/CSS/JS static site (no build tooling)
- **Started**: (pre-2026-08-21; full early history not available — project memory was deliberately cleared, see below)
- **Live site being replaced**: https://www.theaveryclinic.co.uk/
- **Design reference**: https://www.drhazel.co.uk/ — structural/trust-pattern reference only (trust badges near hero, hours-as-table, treatment cards), not copied content or styling

## What's been built so far

1. **(early)** — Research/context docs and a `memory/CLAUDE.md` set up; first full static-site pass built: Home, About, Treatments listing, one sample treatment detail page (Anti-Wrinkle Treatments), Prices, Contact, Skincare, and legal-page stubs, in a cream/charcoal/gold palette (Cormorant Garamond + Jost).
2. **(early)** — Homepage redesigned to a bento-grid "why choose us" layout with scroll-reveal micro-animations and a video-ready hero slot; palette replaced with the client-supplied sage/blush/charcoal/terracotta system; header/footer rebuilt as "Alabaster" (near-white, real logo with no background chip) after 6 client-reviewed palette mockups.
3. **2026-08-21 — Clean slate.** All context docs, project memory, and the multi-page static-site build were cleared and rebuilt from scratch, per the client. `assets/` (reference material — palette swatches, etc.) was deliberately kept.
4. **(post clean-slate)** — Homepage rebuilt on the new base per a locked design: centered-logo header (Concept 2) with social icons and a Book Now pill, full uncropped hero photo, awards banner, a philosophy section, "why choose" cards, an accreditation strip, a scroll-parallax clinic section, testimonials, newsletter signup, an auto-scrolling partner-logo marquee, and a footer with a bolded age notice. All copy verbatim from the client's live site; all imagery sourced from theaveryclinic.co.uk itself (their own real assets, not stock or reference-site photography). Desktop-only per instruction.
5. **(post clean-slate)** — Header shrink-on-scroll (compact fixed mini-header after ~100px), "why choose" section given a blush background so it reads as its own section, testimonials wired to a real working carousel (4 real testimonials, 5s autoplay, pauses on hover), and partner logos enlarged to 92px with baked-in white backgrounds stripped from most of them so they sit cleanly on the new blush background.
6. **2026-08-22 (latest)** — **Memory convention reinstated.** `.claude/memory/` + root `CLAUDE.md` rebuilt to match the James Young/Ana Borges convention, which this repo had lacked since the clean-slate reset. `project_overview.md` documents current build state and explicitly points at commits `7dd4eed`/`9ae625b` in git history if the pre-reset research docs are ever needed — this closes the gap flagged in this tracker's previous update.

## Pending / next up

- [ ] Build out remaining pages (About, Treatments listing + detail pages, Prices, Contact, Skincare, legal) on the new clean-slate base — the pre-clean-slate build had these, but they were cleared and haven't been rebuilt yet
- [ ] Mobile/tablet responsive pass — everything so far is desktop-only
- [ ] Real photography/logo assets beyond what's already sourced from the client's live site

## Key decisions & things to remember

- **Memory convention now matches the other client projects**: `.claude/memory/MEMORY.md` is the index, read it at the start of any session on this project. It explicitly documents the 2026-08-21 clean-slate reset and where to find pre-reset context in git history if genuinely needed — don't try to "restore" old context docs, that reset was deliberate.
- `assets/` holds reference material intentionally kept through the clean-slate wipe (e.g. the client-supplied colour palette image) — check there before re-deriving design tokens from scratch.
- Design reference (drhazel.co.uk) is for structural patterns only — copy and imagery are the client's own, sourced from their existing live site, not the reference site.
- Local preview: `python -m http.server --directory static-site` (per `.claude/launch.json`, though this predates the clean slate — verify it still applies before relying on it).

## Links

- [README.md](https://github.com/lmacwan/client-alison-avery-clinic/blob/main/README.md)
