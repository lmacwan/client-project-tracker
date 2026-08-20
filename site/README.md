# Tracker site

A small static, password-gated viewer for this repo's `README.md`, `RUNNER.md`, and everything in `projects/`. No backend, no database — the build step turns the markdown into HTML, encrypts it (AES-256-GCM, key derived from a password via PBKDF2), and ships a static bundle. The browser decrypts it locally with the password you give it; nothing is ever sent to a server, so this is safe to host anywhere, including a fully public static host.

Because the site is built straight from this repo's docs, redeploying after any change to `README.md`, `RUNNER.md`, or `projects/*.md` is all it takes to update it — connect a host to auto-build on push (below) and it just stays current.

## Local build/preview

```
export TRACKER_PASSWORD="pick-a-real-password"
cd site
npm run build          # no npm install needed — zero dependencies
open dist/index.html   # or just double-click it — no server required
```

`TRACKER_PASSWORD` must be set at build time — it's baked into the encrypted bundle, never committed to git. Anyone who has this password (and the URL, once deployed) can view the tracker's contents, so treat it like any shared credential — don't put it in the repo, a commit message, or a public Slack channel.

## Deploying

Pick whichever you already use — all three auto-rebuild on every push to `main`, so the deployed site tracks the repo automatically.

### GitHub Pages (no external account needed)

Already wired up via `.github/workflows/deploy-pages.yml`.

1. Repo **Settings → Secrets and variables → Actions → New repository secret**, name `TRACKER_PASSWORD`, value = your chosen password.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab). The site publishes to `https://<owner>.github.io/<repo>/`.

Note: GitHub Pages URLs are publicly reachable even from a private repo (unless you're on GitHub Enterprise with private Pages) — that's fine here specifically because the content is encrypted client-side, not because the URL is secret.

### Netlify

`netlify.toml` at the repo root already sets `base = "site"`, `command = "npm run build"`, `publish = "site/dist"`.

1. Netlify → **Add new site → Import an existing project** → pick this repo.
2. It should auto-detect the settings from `netlify.toml`; confirm and deploy.
3. Site settings → **Environment variables** → add `TRACKER_PASSWORD`.
4. Trigger a deploy (or just push to `main`).

### Vercel

1. Vercel → **Add New → Project** → pick this repo.
2. Set **Root Directory** to `site`, **Build Command** to `npm run build`, **Output Directory** to `dist`.
3. Project → **Settings → Environment Variables** → add `TRACKER_PASSWORD`.
4. Deploy.

## Changing the password

The password isn't stored anywhere retrievable — it's only ever used at build time to derive the encryption key. To change it, update the `TRACKER_PASSWORD` secret/env var on your host and trigger a rebuild; that re-encrypts the bundle with the new password. There's no "reset" flow because there's no server-side account system to reset.

## What this isn't

This is a lightweight deterrent (like a shared preview password), not an access-control system — anyone with the password can view everything, and there's no per-user login, audit log, or way to revoke one person's access without changing the password for everyone. For something closer to real per-client access control, this repo's `common-hosting-encryptor` project is the existing pattern to extend instead.
