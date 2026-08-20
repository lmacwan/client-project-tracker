# LDEVS ACF Toolkit (`common-acf-ldev`)

- **Repo**: [lmacwan/common-acf-ldev](https://github.com/lmacwan/common-acf-ldev)
- **Type**: Internal shared library, not a client project
- **Status**: 🔵 Stable, in active use (currently by `client-ana-borges-website`)
- **Stack**: WordPress plugin, PHP
- **Started**: 2026-07-27 (as part of the Ana Borges project); split into its own repo 2026-07-28

## What it does

A free stand-in for two ACF PRO field types — `flexible_content` and `repeater` — registered as `ldevs_flexible_content`/`ldevs_repeater`. Stores data in the exact flat postmeta format ACF PRO itself uses, so:

- `get_field()`/`update_field()` work identically whether this plugin or real ACF PRO is active.
- Swapping a project to real ACF PRO later is a type-value rename in the field group definitions, not a data migration.

**Known, deliberate limitation**: the admin editor is a raw JSON textarea, not a visual row/layout builder — acceptable because content on the projects it's used for is populated programmatically (via `update_field()` in provisioning scripts), not hand-edited in wp-admin.

## History

- Originally built inline in the Ana Borges (`fconnor`) project, 2026-07-27, as a rebuild after discovering the original was a dead symlink pointing at a path that no longer existed on the dev machine.
- Split out to its own repo 2026-07-28 so it can be reused across client projects without duplicating code. Consuming projects link it in as a Windows directory junction (`New-Item -ItemType Junction`), not a copy.

## Pending / next up

- [ ] Nothing currently flagged — usage-driven; revisit if a future project needs the visual row builder the JSON-textarea editor deliberately skips
- [ ] Consider wiring into `client-ps-joel` or `client-james-young-website` if/when either needs ACF-Pro-style flexible content and doesn't already have real ACF PRO

## Key decisions & things to remember

- **A dead symlink to this plugin silently broke every field read/write once already** (pointed at a path that didn't exist on the dev machine). If a project's flexible-content sections ever render a header but no content, check `acf_get_field_type('ldevs_flexible_content')` isn't null before assuming the content itself is missing — check the junction/symlink target actually resolves.
- Junctions don't support relative targets — always use absolute paths when recreating one.

## Links

- [README.md](https://github.com/lmacwan/common-acf-ldev/blob/main/README.md)
