/** Live GitHub metrics for the landing page (client-side, no backend). */

export interface GitHubStats {
  stars: number | null
  downloads: number | null
  latestVersion: string | null
  /** Resolved browser_download_url per installer kind, null until fetched. */
  assets: {
    exe: string | null
    dmg: string | null
    appimage: string | null
    cli: string | null
    checksums: string | null
  }
}

const RELEASES_URL = 'https://api.github.com/repos/DeclanJeon/flucto/releases?per_page=100'
const REPO_URL = 'https://api.github.com/repos/DeclanJeon/flucto'

const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'flucto-landing',
}

const cache: { data: GitHubStats | null; fetchedAt: number } = { data: null, fetchedAt: 0 }
const TTL_MS = 10 * 60 * 1000

/**
 * Stars + latest tag from the repo endpoint, total asset downloads summed
 * across all releases (an honest proxy for how many people actually use
 * Flucto — every install ship in a release asset).
 */
export async function fetchGitHubStats(): Promise<GitHubStats> {
  if (cache.data && Date.now() - cache.fetchedAt < TTL_MS) return cache.data

  const stats: GitHubStats = {
    stars: null,
    downloads: null,
    latestVersion: null,
    assets: { exe: null, dmg: null, appimage: null, cli: null, checksums: null },
  }

  const [repoResult, releasesResult] = await Promise.allSettled([
    fetch(REPO_URL, { headers }),
    fetch(RELEASES_URL, { headers }),
  ])

  if (repoResult.status === 'fulfilled' && repoResult.value.ok) {
    const repo = (await repoResult.value.json()) as { stargazers_count?: number; tag_name?: string }
    if (typeof repo.stargazers_count === 'number') stats.stars = repo.stargazers_count
  }

  if (releasesResult.status === 'fulfilled' && releasesResult.value.ok) {
    const releases = (await releasesResult.value.json()) as Array<{
      tag_name?: string
      draft?: boolean
      prerelease?: boolean
      assets?: Array<{ name?: string; download_count?: number; browser_download_url?: string }>
    }>
    if (Array.isArray(releases)) {
      let total = 0
      for (const release of releases) {
        for (const asset of release.assets ?? []) {
          if (typeof asset.download_count === 'number') total += asset.download_count
        }
      }
      const latest = releases.find((r) => !r.draft && !r.prerelease && r.assets?.length)
      if (latest) {
        stats.downloads = total
        stats.latestVersion = latest.tag_name?.replace(/^v/, '') ?? null
        for (const asset of latest.assets ?? []) {
          const name = asset.name ?? ''
          const url = asset.browser_download_url ?? null
          if (name.endsWith('-x64-setup.exe')) stats.assets.exe = url
          else if (name.endsWith('-universal.dmg')) stats.assets.dmg = url
          else if (name.endsWith('-x86_64.AppImage')) stats.assets.appimage = url
          else if (name.endsWith('-cli-setup.zip')) stats.assets.cli = url
          else if (name === 'checksums-sha256.txt') stats.assets.checksums = url
        }
      }
    }
  }

  if (stats.stars !== null || stats.downloads !== null) {
    cache.data = stats
    cache.fetchedAt = Date.now()
  }
  return stats
}

/** Animated count-up for stat numbers; respects reduced motion. */
export function animateCount(
  from: number,
  to: number,
  durationMs: number,
  onTick: (value: number) => void,
): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || durationMs <= 0) {
    onTick(to)
    return () => {}
  }
  const start = performance.now()
  let frame = 0
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs)
    const eased = 1 - Math.pow(1 - t, 4)
    onTick(Math.round(from + (to - from) * eased))
    if (t < 1) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export const formatCompact = (value: number): string =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
