# Flucto Landing

Marketing landing page for **Flucto** — a 100% TypeScript CLI that turns any video/audio/article URL into transcripts, clips, and Markdown notes.

- **Live:** https://flucto.ponslink.com
- **Product repo:** https://github.com/DeclanJeon/flucto
- **Releases:** https://github.com/DeclanJeon/flucto/releases

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion. Lint via Oxlint.

```bash
npm ci
npm run dev      # localhost:5173
npm run build    # outputs dist/
npm run preview  # serve the build
npm run lint
```

## Internationalization

UI strings live in `src/i18n.ts` (`dict.ko` / `dict.en`). On load, `detectLang()` picks the language from the browser (`navigator.languages` → `ko` if any lang starts with `ko-`, otherwise `en`). The `<html lang>` attribute and a `languagechange` listener keep it in sync.

The manual **KO / EN** toggle is hidden by default. Append `?i18n=1` to the URL (e.g. `https://flucto.ponslink.com/?i18n=1`) to reveal it for QA.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: it bakes the latest Flucto release tag into `public/version.json`, builds with Vite, then `scp`s `dist/*` to the ponslink host. The footer fetches `/version.json` at runtime and displays `v{version}`.

## Notes

- Static SPA only — meta tags don't swap per language (SEO/SSR not implemented).
- `appleboy/scp-action@v1` was replaced with raw `ssh`/`scp` in the workflow due to a silent deploy failure.
