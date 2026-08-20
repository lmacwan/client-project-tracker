# Hostinger Preview Gate (`common-hosting-encryptor`)

- **Repo**: [lmacwan/common-hosting-encryptor](https://github.com/lmacwan/common-hosting-encryptor)
- **Type**: Internal shared infrastructure, not a client project
- **Status**: 🟢 Live in production at `dev-leon.genesiswebservices.co.uk`
- **Stack**: Plain PHP, no framework/build step. Deployed manually (zip → Hostinger hPanel → extract), no CI/CD.
- **Started**: split out from the Ps. Joel workspace on 2026-08-06 once it became clear it was shared infra, not project-specific

## What it does

A small PHP login gate sitting in front of `public_html` on shared Hostinger hosting, used to host password-protected static-site previews for multiple clients under one domain.

- `.htaccess` routes every request through `_gate/index.php`, disables directory listing.
- Login maps username → client folder (`_gate/config.php`), serves from `protected-content/<folder>/` — kept outside `public_html` so it's never directly web-reachable.
- Sessions expire after 30 min idle. Passwords stored as bcrypt hashes.
- Content resolved by session, not URL path, so client static exports using root-relative links work unmodified.
- **Admin encryption panel** (`_gate/admin.php`, added 2026-08-06): optional per-client at-rest encryption, AES-256-GCM per file, key wrapped with a server-side master secret. Protects against partial leaks of `protected-content/`, not a full server compromise.

## What's been built so far

1. **2026-08-06** — Initial gate: login, session handling, per-client config.
2. **2026-08-06** — Admin panel for at-rest content encryption.
3. **2026-08-20** — Clean `/logout` route added.

## Clients currently configured

- `psjoel` → `ps-joel/v1`
- `ana` → `ana/v1`
- `james` → `james/v1`

(Passwords/admin hash not recorded anywhere in git — generated directly via `_gate/hash-helper.php`.)

## Pending / next up

- [ ] No CI/CD — deploys are manual zip-and-extract; worth automating if this becomes higher-traffic or multi-person
- [ ] Add new client entries here as they're onboarded (`protected-content/<name>/v1/` + config entry) — keep this list and `_gate/config.php` in sync

## Key decisions & things to remember

- This repo intentionally holds *no* client content — only the gate mechanism. Client static exports live on the server, not in this repo.
- Threat model is explicitly partial-leak protection, not a defense against full server compromise — documented in `crypto.php`'s header comment.
- Hostinger's `sodium` PHP extension isn't on by default — had to be separately enabled via hPanel; don't assume local dev behavior (where it also needs manual enabling) matches production without checking.

## Links

- [README.md](https://github.com/lmacwan/common-hosting-encryptor/blob/main/README.md) — full deploy steps, security rationale, troubleshooting
