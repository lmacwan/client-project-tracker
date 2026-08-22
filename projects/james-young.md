# Mr James Young — Orthopaedic Site ("Jamie")

- **Repo**: [lmacwan/client-james-young-website](https://github.com/lmacwan/client-james-young-website)
- **Client**: Mr James Young, knee/orthopaedic surgeon
- **Status**: 🟢 Active — two full designs built and compared; client has settled on the original ("v1") as the working copy going forward
- **Stack**: Plain HTML/CSS/JS static site (no build tooling). WordPress install (`Local/`) planned but intentionally not started.
- **Started**: 2026-08-08

## Why this one is different from the other two client sites

Unlike Ana Borges and Ps. Joel, there's no existing WordPress site to crawl/port from — this is designed from scratch, static-first, with WordPress deliberately deferred until the client says otherwise.

## What's been built so far

1. **2026-08-08** — Repo scaffolded, content sourced from invictaorthopaedics.com (bio/conditions/treatments), layout/IA reference locked to kneesurgeryclinic.co.uk (later also approved for its colour palette). Inter locked in as the typeface.
2. **2026-08-08 → 2026-08-10** — Desktop-only homepage mockup built through several header/hero rounds (v1–v4); **v4 confirmed** (editorial hero + floating pill nav) as the direction to fold into the real homepage.
3. **2026-08-14** — About, Contact, and ACL Reconstruction treatment pages built out on the v4-based design (the "mauve/plum" look) — this became the site's original build, now called **v1**.
4. **2026-08-17 — Design reset.** Client asked for genuinely new directions rather than iterating on the mauve/plum line: 3 fresh homepage concepts pitched (Clinical Precision — navy/teal technical; Warm Human — terracotta/sage recovery-journey; Bold Editorial — ink/cobalt magazine layout). Client picked **Concept A, "Clinical Precision"**, and it was built out fully (homepage + primary nav, responsive), then About/Contact/ACL Reconstruction were rebuilt into it too. A follow-up navy/terracotta/gold palette mockup was tried and **rejected** — client preferred Clinical Precision's original navy/teal.
5. **2026-08-18 — Two-version split.** Rather than replace the original design, the client asked to keep **both live side by side**: the site root became **v1 "Original"** (restored mauve/plum) and Clinical Precision moved to **`static-site/v2/`**, with a sticky on-page banner on every page of both letting a viewer switch between them.
6. **2026-08-20** — v2 polish (locations map, real professional-society logos with sourcing documented, path-handling bugfix for servers that don't redirect directory URLs without a trailing slash) and a v1/v2 colour experiment (tried v2's navy/teal on v1's layout) — **reverted** per client request, with the experiment saved as a non-live CSS file rather than lost.
7. **2026-08-20 (latest)** — **Client decision: v1 (site root, original design) is the working copy going forward.** v2 stays live and switchable for reference but is now hands-off unless the client names it specifically. `CLAUDE.md` and memory updated so this is the first thing read in any future session on this project.

## Pending / next up

- [ ] Build out remaining condition/treatment pages beyond ACL Reconstruction, on **v1** (the current default target) — content already sourced from invictaorthopaedics.com's Knee section
- [ ] Mobile/tablet responsive pass — build has been desktop-only throughout
- [ ] Real photography — Mr Young's own photo is still a placeholder on both v1 and v2 (deliberately not filled with a stock substitute; see below)
- [ ] A stray remote branch (`claude/jamie-project-new-designs-jvow8y`) may still exist on GitHub — deletion failed from this environment (proxy 403), safe to delete manually via the GitHub UI, already merged so nothing is lost
- [ ] WordPress install (`Local/`) — explicitly deferred, do not start until the client asks

## Key decisions & things to remember

- **v1 = original/mauve-plum (site root), v2 = Clinical Precision/navy-teal (`static-site/v2/`) — both live, v1 is default, v2 is hands-off unless named.** This reverses the assumption in earlier notes that Clinical Precision had "won."
- **Never reuse a reference site's own photography of its own named professionals** — when sourcing images for v2, the team explicitly avoided pulling photos of other real surgeons from reference sites, and asked the client for direction instead of guessing. Applies to any project pulling visual reference from a competitor/peer site.
- **Directory-relative paths break on servers that don't redirect bare directory URLs to their trailing-slash form** (e.g. `/v2` vs `/v2/`) — this silently loaded the wrong version's stylesheet in exactly that scenario. Both versions now use root-absolute paths throughout. Worth checking on any future project with more than one version/environment served from the same static root.
- Two references serve two different purposes — don't conflate them: kneesurgeryclinic.co.uk for layout/IA + colour palette; invictaorthopaedics.com for content only.
- `.claude/memory/` in the repo is the sole source of truth for project memory — no external mirror. Read `MEMORY.md` there before starting any session of work on this project.

## Links

- [Repo memory index](https://github.com/lmacwan/client-james-young-website/blob/main/.claude/memory/MEMORY.md)
