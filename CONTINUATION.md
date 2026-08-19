# Flucto Landing — Work in Progress (handoff note)

State: **DONE** — `i18n.ts` created, `App.tsx` rewritten with language detection, committed + pushed + deployed.

## Context
- Branch: `main`
- Last commit: `feat: add i18n, browser-lang detection`
- Repo: `DeclanJeon/flucto-landing` (GitHub)
- Live: `https://flucto.ponslink.com`

## What's finished
- `src/i18n.ts` — `Lang = 'ko' | 'en'`, `detectLang()` (navigator.languages → `ko`/`en`), `dict[ko|en]` (all UI strings).
- `src/App.tsx` — replaced all Korean/English literals with `t` dict keys; `lang` from `detectLang()`; `html[lang]` side-effect; `languagechange` listener; manual KO/EN toggle (top-right `KO`/`EN` button — for testing/debug).
- Build: `npm run build` passes; deploy workflow `deploy.yml` already uses raw ssh/scp (appleboy removed — it was failing).

## What's NOT done (next)
1. **Auto-deploy toggle off for production** — the manual KO/EN toggle is handy for QA, but the *auto-detection-only* mode is what we want live (so Korean browsers see Korean, others see English, no toggle UI needed to distract). Decision: keep toggle but hide it unless `?i18n=1` query param is present. → Edit `App.tsx`: render toggle only if `useSearchParams` has `i18n`.
2. **SEO / SSR** — Vite static build only; meta tags won't swap with language. (Optional; can add `vite-plugin-html` + prerender later.)
3. **version.json auto-bump** — workflow bakes `flucto/releases/latest` → `public/version.json`; not reflected in landing footer yet. Wire footer to fetch `version.json` and display "v{ver}".
4. **README update** — mention `flucto.ponslink.com` + i18n behavior.
5. **Re-verify live** — after changes, `curl -s https://flucto.ponslink.com/version.json` should still be `{version:1.14.0}` and `index.html` should contain both `lang="ko"` / `lang="en"` toggles.

## How to resume
```bash
cd ~/Develop/Project/flucto_landing   # (or git clone https://github.com/DeclanJeon/flucto-landing)
npm ci
npm run dev           # localhost:5173
npm run build         # validate
git add -A && git commit -m "msg"
git push              # → CI auto-deploys to flucto.ponslink.com
```

## Notes / gotchas
- `appleboy/scp-action@v1` was failing silently on the first deploy — replaced with raw `scp`/`ssh` in `deploy.yml` (working now, 33s deploys).
- `flucto` repo `v1.15.0`/`v1.14.0-draft` tags were deleted (stale RAG experiments). Latest stable = `v1.14.0`.
- Portfolio `~/Develop/Project/portfolio/blog-source` (used by `ponslink.com`) — *not* affected by this task; `flucto_landing` is independent.
- If the `ko`/`en` dict grows, consider splitting into `i18n/ko.ts` + `i18n/en.ts`, but current single-file is fine for now.
