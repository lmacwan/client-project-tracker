# Tracker Web UI (`site/`, this repo)

- **Repo**: [lmacwan/client-project-tracker](https://github.com/lmacwan/client-project-tracker) (this repo, `site/` subfolder)
- **Type**: Internal tool — a viewer for this repo's own docs, not a client project
- **Status**: 🟡 Built, not yet deployed — waiting on GitHub Pages to be switched on
- **Stack**: Zero-dependency Node build script + vanilla HTML/CSS/JS, no framework
- **Started**: 2026-08-20

## What it does

A small static, password-gated web UI over `README.md`, `RUNNER.md`, and `projects/*.md` in this same repo. `site/build.js` converts the markdown to HTML at build time, bundles it into one JSON manifest, and encrypts that manifest with AES-256-GCM (key derived via PBKDF2 from a `TRACKER_PASSWORD` set at build time). The browser decrypts it locally after a password prompt via the Web Crypto API — no backend, no database, nothing sent over the network. That makes it safe to deploy to a fully public static host, since the deployed files are unreadable without the password.

Because the build reads straight from this repo's own docs, any host connected to auto-deploy on push keeps the site current automatically — including future runs of "update the project tracker."

## What's been built so far

1. **2026-08-20** — `site/build.js` (markdown→HTML conversion covering headings, bold/italic, inline code, links, ordered/unordered lists, checkboxes, and tables — the exact subset this repo's docs use — plus AES-256-GCM encryption of the bundled manifest), the runtime (`site/public/app.js` — PBKDF2 key derivation, decrypt, hash-routed sidebar nav), and styling. Build tested end-to-end locally (build → decrypt → verify rendered HTML, including internal cross-doc links rewritten from raw `.md` paths to the app's hash routes).
2. **2026-08-20** — Deploy configs added: `.github/workflows/deploy-pages.yml` (GitHub Pages, no external account needed), `netlify.toml` (Netlify), plus Vercel steps documented in `site/README.md`. All three auto-rebuild on push to `main`.
3. **2026-08-20** — `TRACKER_PASSWORD` GitHub Actions secret set up; hit a first-run error (`Get Pages site failed` from `actions/configure-pages`) because GitHub Pages had never been switched on for the repo — fixed by setting Settings → Pages → Source to "GitHub Actions" (a one-time toggle; it doesn't need a branch/folder picked since Actions handles deployment).

## Pending / next up

- [ ] Confirm the GitHub Actions workflow run succeeds after the Pages source fix and the site is reachable at `https://lmacwan.github.io/client-project-tracker/`
- [ ] Decide on a Hostinger deploy path if wanted instead of/alongside GitHub Pages — Hostinger has no native git-based auto-deploy (confirmed via `common-hosting-encryptor`'s own manual zip-deploy process), so this would need a GitHub Actions step added to push the built `site/dist/` output to Hostinger via FTP or SSH/rsync. Deferred — revisit if/when Hostinger is the preferred host.

## Key decisions & things to remember

- The password is never stored anywhere retrievable — it only ever exists as a build-time secret used to derive the encryption key. Changing it means updating the host's `TRACKER_PASSWORD` secret/env var and triggering a rebuild; there's no reset flow because there's no server-side account system.
- This is a shared-password deterrent, not real per-user access control — anyone with the password can see everything, and there's no way to revoke one person's access without changing the password for everyone. For real per-client access control, `common-hosting-encryptor` is the existing pattern to extend instead — noted in `site/README.md` too.
- Full setup/deploy walkthrough lives in `site/README.md`, not duplicated here — check there first.

## Links

- [site/README.md](https://github.com/lmacwan/client-project-tracker/blob/main/site/README.md)
