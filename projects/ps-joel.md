# Ps. Joel — WordPress Revamp (joelsuchith.com)

- **Repo**: [lmacwan/client-ps-joel](https://github.com/lmacwan/client-ps-joel)
- **Client**: Ps. Joel, institutional/ministry site
- **Status**: 🟢 Active — Phase 1 prototype; static site is the current dev target; recent round of client-requested polish fixes
- **Stack**: Custom WordPress theme `scripture-editorial` (Local by Flywheel), no build tooling — plain hand-written CSS/JS — plus a parity static crawl (`static-site/`) where current work happens
- **Started**: 2026-07-29
- **Budget/scope**: ₹35,000, approved 7-week compressed schedule (see `Documents/`); SEO explicitly out of scope

## What's been built so far

1. **2026-07-29 → 2026-08-01** — Original site audited and cloned locally as a reference; initial "Terracotta Rose" theme system built (main.css/main.js, header.php/footer.php) covering Teaching, Resources, Give, Shop, legal pages, blending pastorvlad.org structure with jamesclear.com's typographic restraint.
2. **2026-08-01** — Homepage reskinned from an approved Claude Design mockup ("LaunchKit" video-hero style) — replaced two earlier homepage exploration templates (`page-home-2/3.php`, since deleted).
3. **2026-08-04** — 2nd LaunchKit reskin wave: About, Blog archive, Youtube/Podcast resource archives, eBooks, Connect, and E-Courses (placeholder) all converted to the LaunchKit design system. Fixed a real Contact Form 7 bug (ambiguous shared `<label>` around a radio group caused the wrong "Reason" to be recorded on every submission).
4. **2026-08-06** — `static-site/` added (parity crawl of the WP build) and made the active dev target — same static-first strategy as Ana Borges' project, changes to port back to WP later in one pass. Interior pages (Blog/Youtube/Podcast/eBooks/Connect) made responsive for tablet/mobile.
5. **2026-08-06** — CSS/JS naming cleanup **on the WordPress theme only** (`Local/app/public/...`): `home-4.css`/`home-5.css`/`.se-h4-*` renamed to `home.css`/`home-hero.css`/`.se-home-*`, dead mockup CSS removed. (`static-site/` never picked this up — see "Key decisions" below.)
6. **2026-08-08** — E-Courses module designed (sign-in/sign-up/forgot-password + course catalog/lesson player, "Style A LaunchKit" approved) and, since it's inherently DB-backed and can't be real on a static site, built as a dummy-data/fake-login click-through demo. Same day, promoted from a separate preview silo to replace `static-site/courses/` outright (the real nav destination). Demo login: `demo@joelsuchith.com` / `demo1234` — fake session only, not real progress toward a backend.
7. **2026-08-22** — Client polish round on `static-site/`, all client-reviewed/approved: swapped Joel's avatar photo and the shared resources-family hero photo for crops from a new studio shoot (homepage hero and About-page family portrait deliberately left untouched — no matching new photo for either); fixed the resources-family hero's sizing/overflow per a client-supplied CSS diff (caught and fixed a scoping issue in the client's own snippet before applying it — see below); fixed a stray 8px page-edge gap on all 6 E-Courses demo pages (they're hand-authored, not WP-crawled, so they never got WordPress's usual body-margin reset).

## Pending / next up

- [ ] **Give/PayU payment integration** — flagged as an open gap with real risks in `Documents/Phase2_Gap_Resolution_Plan.md`, not yet resolved
- [ ] **eBooks** — deliberately deferred; planned as a WooCommerce product category once that plugin is installed. `/ebooks/` is still a static placeholder page, not a real CPT archive
- [ ] Social links decision (from the same Phase 2 gap-resolution plan) — not yet finalized
- [ ] **Port static-site's accumulated changes back into the real WordPress build**, in one pass, once client-requested static-site changes settle down — now includes the 2026-08-22 photo swaps (filenames noted in memory so the port is a straight copy)
- [ ] **Re-check the resources-family hero on tablet/mobile** — the 2026-08-22 sizing fix changed a base rule from `min-height` to `height`, which likely defeats the existing `@media` breakpoints that shrink the hero on smaller screens; flagged in memory but not yet verified in a real tablet/mobile viewport
- [ ] Don't confuse the E-Courses demo for real backend progress — a real sign-in/course-catalog backend is still fully unbuilt if/when the client wants it live

## Key decisions & things to remember

- **`static-site/` and the WordPress theme have drifted in CSS filenames.** The 2026-08-06 `home-4.css`→`home.css` rename only happened in `Local/app/public/.../assets/css/` — `static-site/` still uses the original `home-4.css`/`home-5.css`/`.se-h4-*` names (confirmed still true as of the 2026-08-22 photo/CSS work, which edited `home-4.css` directly). This is exactly the kind of divergence the eventual WordPress port needs to reconcile — don't assume the two trees use the same filenames when porting or cross-referencing older memory notes that predate the split.
- Two parallel design systems coexist by page — check which one (`main.css`/Terracotta Rose vs `home-4.css`/LaunchKit, see above) a page uses before touching styles; they don't share tokens.
- **Check a client-supplied CSS diff for over-broad selectors before applying it verbatim** — the 2026-08-22 hero sizing fix came as an exact diff from the client, but its selector (`.se-h4 .container`) was actually the sitewide container rule shared by every LaunchKit page's nav/footer/sections, not scoped to the one hero it was meant to fix. Caught before applying and narrowed to `.se-h4-res-hero .container` instead. A client handing over exact code doesn't mean the code is safe to paste in unreviewed.
- A photo slot needing to sit over a dark/gradient background needs an alpha-transparent cutout, not a flattened/white-background image — confirmed again on the resources-hero photo swap; check what a target `<img>` is composited over before choosing a source asset format.
- `teaching` CPT uses a `speaker` taxonomy (not `post_author`) so guest speakers don't need WP logins — deliberate.
- Big redesigns get built as a standalone `/home-N/`-style preview page first, promoted only after approval — don't skip the preview step for large changes.
- `Phase1_Audit_and_Sitemap.md` and `Phase1_HomePromotion_Plan.md` were both *reconstructed* (not originals) from client PDFs + the live build — check their provenance notes before treating any section as unquestionable, especially since the 2026-08-01 reskin superseded part of `Phase1_HomePromotion_Plan.md`.

## Links

- [Repo memory index](https://github.com/lmacwan/client-ps-joel/blob/main/MEMORY.md)
- [Phase 2 Gap Resolution Plan](https://github.com/lmacwan/client-ps-joel/blob/main/Documents/Phase2_Gap_Resolution_Plan.md)
