// postbuild runs after `vite-react-ssg build`. Two jobs:
//
// 1. Inject a `<link rel="stylesheet">` for our single CSS bundle into
//    every prerendered HTML. Without it, vite-react-ssg ships the CSS
//    only via the JS bundle, which means the first paint shows
//    unstyled HTML (a brief "skeleton" flash) until the JS loads and
//    inserts the styles. Pushing the stylesheet into <head> makes the
//    first paint the styled page directly — important for both visual
//    polish and SEO (the layout is correct before any JS runs).
//
// 2. Mirror every prerendered /path/index.html to /path.html so the
//    deployed site works against either nginx pattern:
//      * `try_files $uri $uri/ =404` then SPA fallback → nested dir
//        hits (e.g. /ko/ → dist/ko/index.html)
//      * `try_files $uri $uri.html $uri/ =404` (custom config) → flat
//        .html hits (e.g. /ko → dist/ko.html)
//
// Either form resolves to the same language-correct HTML.

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

// 1. Find the hashed CSS bundle vite emitted.
const assetsDir = 'dist/assets'
const cssFile = readdirSync(assetsDir).find((f) => f.startsWith('src-') && f.endsWith('.css'))
if (!cssFile) {
  console.error('[postbuild] no src-*.css found in dist/assets/ — skipping stylesheet injection')
  process.exit(1)
}
const cssHref = `/assets/${cssFile}`
const cssLinkTag = `    <link rel="stylesheet" crossorigin href="${cssHref}">`

// 2. Inject the stylesheet into every prerendered HTML, just before the
//    app's <script type="module"> so it loads in parallel with the JS.
const targets = [
  'dist/index.html',
  'dist/ko/index.html',
  'dist/docs/index.html',
  'dist/ko/docs/index.html',
]
for (const t of targets) {
  if (!existsSync(t)) {
    console.warn(`[postbuild] skip ${t} (not found)`)
    continue
  }
  let html = readFileSync(t, 'utf8')
  if (html.includes(cssHref)) {
    console.log(`[postbuild] ${t} already has ${cssHref}`)
    continue
  }
  // Place the <link> right after the existing favicon link so it
  // groups with other head assets. If favicon isn't there, fall back
  // to the first <script>.
  const link = `    <link rel="icon" type="image/svg+xml" href="/favicon.svg">`
  if (html.includes(link)) {
    html = html.replace(link, `${link}\n${cssLinkTag}`)
  } else {
    html = html.replace('<script', `${cssLinkTag}\n    <script`)
  }
  writeFileSync(t, html)
  console.log(`[postbuild] ${t} +<link rel="stylesheet" href="${cssHref}">`)
}

// 3. Mirror nested HTML to flat .html for nginx-friendly URL serving.
const pairs = [
  ['dist/ko/index.html',         'dist/ko.html'],
  ['dist/docs/index.html',       'dist/docs.html'],
  ['dist/ko/docs/index.html',    'dist/ko/docs.html'],
]
for (const [src, dst] of pairs) {
  if (!existsSync(src)) {
    console.warn(`[postbuild] skip ${dst} (${src} not found)`)
    continue
  }
  mkdirSync(dirname(dst), { recursive: true })
  copyFileSync(src, dst)
  console.log(`[postbuild] ${src} -> ${dst}`)
}
