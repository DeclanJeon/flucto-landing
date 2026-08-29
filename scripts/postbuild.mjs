// Mirror every prerendered /path/index.html to /path.html so the deployed
// site works against either nginx pattern:
//   * `try_files $uri $uri/ =404` then SPA fallback → nested dir hits
//     (e.g. /ko/ → dist/ko/index.html)
//   * `try_files $uri $uri.html $uri/ =404` (custom config) → flat .html
//     hits (e.g. /ko → dist/ko.html)
//
// Either form resolves to the same language-correct HTML.

import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const pairs = [
  // [source, destination]
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
