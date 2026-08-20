# Mr James Young — Orthopaedic Site ("Jamie")

- **Repo**: [lmacwan/client-james-young-website](https://github.com/lmacwan/client-james-young-website)
- **Client**: Mr James Young, knee/orthopaedic surgeon
- **Status**: 🟡 Early build — static site under construction, homepage design direction awaiting client review
- **Stack**: Plain HTML/CSS/JS static site (no build tooling). WordPress install (`Local/`) planned but intentionally not started.
- **Started**: 2026-08-08

## Why this one is different from the other two client sites

Unlike Ana Borges and Ps. Joel, there's no existing WordPress site to crawl/port from — this is designed from scratch, static-first, with WordPress deliberately deferred until the client says otherwise.

## What's been built so far

1. **2026-08-08** — Repo scaffolded (`static-site/`, `Local/` placeholder, `Documents/` for content sourcing), matching the folder conventions of the sibling client projects.
2. **2026-08-08** — Content sourcing pass: crawled invictaorthopaedics.com (Mr Young's own bio page, Knee sections under Conditions/Treatments) to source what his bio/conditions/treatments copy should cover. Locations, contact, and specialty scope confirmed as-is with the client.
3. **2026-08-08** — Layout/structure reference locked: kneesurgeryclinic.co.uk, for page layout and IA only — explicitly *not* for colour or typography (client said they'd specify those separately, then same day approved reusing the reference's colour palette as swappable CSS tokens, plus mega-nav + 60/40 layout split). Typography uses free equivalents, not the reference's licensed font.
4. **2026-08-08** — Desktop-only homepage mockup built: mega nav, colour tokens, a 3-way font-switcher for client review. Went through several header/hero variants (v2/v3/v4); hero-v4 (v3's editorial hero + v2's floating pill nav) was confirmed as the chosen direction, other mockups retired. Inter locked in as the typeface.
5. **2026-08-20** (latest commit) — Added About, Contact, and ACL Reconstruction treatment pages.

## Pending / next up

- [ ] Client sign-off on the confirmed hero-v4 direction reaching production pages (currently confirmed at mockup stage — verify it's actually been carried into the built pages)
- [ ] Build out remaining treatment/condition pages beyond ACL Reconstruction (site is content-sourced from invictaorthopaedics.com's Knee section — use that as the map of what's still missing)
- [ ] Mobile/tablet responsive pass — homepage mockup so far is desktop-only
- [ ] Real photography, contact form wiring, and any remaining placeholder content
- [ ] WordPress install (`Local/`) — explicitly deferred, do not start until the client asks

## Key decisions & things to remember

- Two references serve two different purposes — don't conflate them: kneesurgeryclinic.co.uk for layout/IA + (as of 2026-08-08) colour palette; invictaorthopaedics.com for content only.
- `.claude/memory/` in the repo is the sole source of truth for project memory — no external mirror. Read `MEMORY.md` there before starting any session of work on this project.

## Links

- [Repo memory index](https://github.com/lmacwan/client-james-young-website/blob/main/.claude/memory/MEMORY.md)
