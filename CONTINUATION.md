# Flucto Landing — State / Handoff

State: **DONE** — history router + SSG migration shipped, deployed, verified live.

## Context
- Branch: `main`
- Live: `https://flucto.ponslink.com`
- Repo: `DeclanJeon/flucto-landing` (GitHub) — push to `main` auto-deploys

## What's finished (2026-08-29)

1. **History router** — `#/docs` hash replaced with path-based `/docs` (`pushState` + `popstate`). In-app links navigate client-side; direct hits are served as real static pages.
2. **SSG migration** — `vite-react-ssg` + `react-router-dom` v6. Four pages prerendered at build time:
   - `/` (en home) → `dist/index.html`
   - `/ko` (ko home) → `dist/ko/index.html`
   - `/docs` (en docs) → `dist/docs/index.html`
   - `/ko/docs` (ko docs) → `dist/ko/docs/index.html`
3. **Per-route, per-language SEO** — `<html lang>`, `<title>`, description, canonical, `og:*` baked into each HTML via the `<Head>` component. No client-side meta swap.
4. **`?i18n=1` toggle guard** — the KO/EN button is hidden in production; append `?i18n=1` to reveal it for QA.
5. **First-paint fix** — `scripts/postbuild.mjs` injects `<link rel="stylesheet">` into every prerendered HTML (vite-react-ssg otherwise ships CSS only via the JS bundle → unstyled skeleton flash on first paint).
6. **Deploy hardening** (`.github/workflows/deploy.yml`):
   - `sudo -n` on every sudo, `ssh -n` on every ssh (fail fast, no hangs)
   - wipe remote dist before scp (stale-file shadowing)
   - `touch` every file after scp (fresh mtime defeats nginx `open_file_cache`)
   - `sudo -n nginx -s reload`
   - build-stamp comment in every HTML → `curl -s https://flucto.ponslink.com/ | grep build-stamp` shows which build is live
7. **README** — rewritten to document routes, i18n behavior, postbuild, deploy pipeline.

## How to resume
```bash
cd ~/Develop/Project/flucto_landing
NODE_ENV=development npm ci     # NOTE: NODE_ENV=production is set in this shell env; npm skips devDependencies without this
npm run dev           # localhost:5173
npm run build         # SSG build + postbuild (stylesheet link, stamp, flat mirrors)
npm run lint
git add -A && git commit -m "msg"
git push              # → CI auto-deploys to flucto.ponslink.com
```

## Gotchas
- **`NODE_ENV=production` is exported in the local shell** — plain `npm install` / `npm ci` silently skips devDependencies (vite, tailwind, typescript...) and the build fails with confusing ENOENT errors. Always prefix with `NODE_ENV=development`.
- **Cloudflare caches the HTML** (cache-everything rule on the zone): after a deploy, `https://flucto.ponslink.com/` can keep serving the previous build with `cf-cache-status: HIT` even though the origin is already updated. Fix = the "Purge Cloudflare cache" step in deploy.yml, which needs `CF_ZONE_ID` + `CF_API_TOKEN` (Zone.Cache Purge permission) repo secrets. Until those are added, verify deploys with a cache-buster: `curl -s 'https://flucto.ponslink.com/?nocache=$(date +%s)' | grep build-stamp` — or purge manually from the CF dashboard.
- **nginx on the origin** was also observed serving stale fds after scp in one deploy; the deploy step already defends (wipe before scp, `touch` after scp, `sudo -n nginx -s reload`).
- Live sanity check: `curl -s 'https://flucto.ponslink.com/?nocache=1' | grep build-stamp` and `/version.json`'s `builtAt` should both be from the latest deploy.
- If the host's nginx config ever gains `try_files ... $uri.html`, the flat mirrors in `dist/` are already in place.

## Not done / possible next
- SEO/SSR is done for the four pages; if more routes are added, add them to `src/main.tsx` routes + `scripts/postbuild.mjs` targets + README table.
- The `flucto` product repo still has an operational task pending: NPM_TOKEN secret verification for the npm publish pipeline (see `flucto/docs/work-orders-2026-08.md`).
