/** Live GitHub metrics for the landing page (client-side, no backend). */

export interface GitHubStats {
  stars: number | null
  downloads: number | null
  latestVersion: string | null
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

  const stats: GitHubStats = { stars: null, downloads: null, latestVersion: null }

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
      assets?: Array<{ download_count?: number }>
    }>
    if (Array.isArray(releases)) {
      let total = 0
      for (const release of releases) {
        for (const asset of release.assets ?? []) {
          if (typeof asset.download_count === 'number') total += asset.download_count
        }
      }
      if (releases.length > 0) {
        stats.downloads = total
        stats.latestVersion = releases[0]?.tag_name?.replace(/^v/, '') ?? null
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
