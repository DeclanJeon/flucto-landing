import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Check, Copy, Download, FileArchive, FileText, Languages,
  MonitorDown, Package, Play, ShieldCheck, Star, Terminal,
} from 'lucide-react'
import { Head } from 'vite-react-ssg'
import { defaultLang, dict, detectLang, marqueePlatforms, type Lang } from './i18n'
import { CAP_ORDER, DEMOS, demoMedia, type DemoDef } from './demos'
import { DocsPage } from './docs'
import { animateCount, fetchGitHubStats, formatCompact, type GitHubStats } from './github'

const REPO_URL = 'https://github.com/DeclanJeon/flucto'
const RELEASES_URL = 'https://github.com/DeclanJeon/flucto/releases'
const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`

const BrandMark = () => (
  <svg width={34} height={34} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#3ee0ff" /><stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
    </defs>
    <rect x={7} y={7} width={50} height={50} rx={16} fill="url(#g)" />
    <path d="M20 18L20 48L31 48L31 28L38 28L38 48L49 48L49 18L38 18L32 18L26 18L20 18Z" fill="#04060c" />
    <path d="M24.5 34.5C24.5 28.4 29.6 23.8 36 23.8H39V28.5H36C33.1 28.5 31 30.7 31 33.5C31 36.4 33.4 38 36 38H46V46H36C29.6 46 24.5 40.6 24.5 34.5Z" fill="#eef2ff" />
  </svg>
)

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
} as const

/** Pointer-tracked specular sheen for cards. */
const sheen = (event: React.MouseEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

const Stat = ({ value, label, suffix = '' }: { value: number | string | null; label: string; suffix?: string }) => {
  const isNumber = typeof value === 'number'
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isNumber) return
    return animateCount(0, value as number, 900, setCount)
  }, [isNumber, value])
  return (
    <div>
      <div className="display num-tab text-3xl md:text-4xl">
        {isNumber ? formatCompact(count) : value ?? '—'}
        {isNumber && suffix}
      </div>
      <div className="mt-1.5 text-xs text-white/40">{label}</div>
    </div>
  )
}

const routeFromPath = (pathname: string): 'home' | 'docs' =>
  pathname.replace(/\/+$/, '') === '/docs' || pathname.replace(/\/+$/, '').endsWith('/docs')
    ? 'docs'
    : 'home'

const navigate = (path: string) => {
  if (window.location.pathname + window.location.search === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/**
 * Click-to-play media: only a lazy-loaded poster renders until the user
 * activates the frame, then the real <video controls autoplay> mounts.
 * No autoplay, no offscreen fetches — reduced-motion users get the same
 * explicit poster + play button. The .gif is a downloadable fallback.
 */
const DemoMedia = ({
  id,
  title,
  playLabel,
  hero = false,
}: {
  id: string
  title: string
  playLabel: string
  hero?: boolean
}) => {
  const [playing, setPlaying] = useState(false)
  const media = demoMedia(id)
  if (playing) {
    return (
      <video
        src={media.video}
        poster={media.poster}
        controls
        autoPlay
        playsInline
        className="aspect-video w-full bg-black object-contain"
        aria-label={title}
      />
    )
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-[#3ee0ff] focus-visible:outline-offset-2"
      aria-label={`${playLabel}: ${title}`}
    >
      <img
        src={media.poster}
        alt={title}
        loading={hero ? 'eager' : 'lazy'}
        className="aspect-video w-full bg-[#080c16] object-contain transition group-hover:opacity-90"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className={`flex items-center justify-center rounded-full border border-[#3ee0ff]/40 bg-[#04060c]/80 text-[#3ee0ff] shadow-[0_0_30px_rgba(62,224,255,.25)] backdrop-blur transition group-hover:bg-[#3ee0ff] group-hover:text-[#04060c] ${hero ? 'h-16 w-16' : 'h-11 w-11'}`}>
          <Play size={hero ? 22 : 16} fill="currentColor" />
        </span>
      </span>
      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-1 font-mono text-[10px] text-white/60 backdrop-blur">
        {playLabel}
      </span>
    </button>
  )
}

const DemoCard = ({
  demo,
  lang,
  gifLabel,
}: {
  demo: DemoDef
  lang: Lang
  gifLabel: string
}) => {
  const t = dict[lang]
  const text = demo[lang]
  const media = demoMedia(demo.id)
  return (
    <article className="card card-sheen flex flex-col overflow-hidden p-0" onMouseMove={sheen}>
      <DemoMedia id={demo.id} title={text.title} playLabel={t.playDemo} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className={`pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${demo.kind === 'cli' ? 'border-[#3ee0ff]/25 text-[#3ee0ff]' : 'text-white/45'}`}>
            {demo.kind === 'cli' ? 'CLI' : 'App'}
          </span>
          <h3 className="display text-base leading-snug">{text.title}</h3>
        </div>
        <p className="flex-1 text-xs leading-relaxed text-white/55">{text.caption}</p>
        {demo.cmd && (
          <code className="block overflow-x-auto whitespace-nowrap rounded-lg border border-white/5 bg-black/40 px-2.5 py-1.5 font-mono text-[10.5px] text-white/60">
            {demo.cmd}
          </code>
        )}
        <a
          href={media.gif}
          download
          className="mt-1 inline-flex items-center gap-1.5 self-start text-[11px] text-white/40 transition hover:text-[#3ee0ff]"
        >
          <FileText size={11} /> {gifLabel} · {demo.id}.gif
        </a>
      </div>
    </article>
  )
}

type CopyState = 'idle' | 'ok' | 'fail'

const CopyChip = ({
  state,
  onCopy,
  t,
}: {
  state: CopyState
  onCopy: () => void
  t: { copyLabel: string; copiedLabel: string; copyFailedLabel: string }
}) => (
  <button
    type="button"
    onClick={onCopy}
    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#3ee0ff] px-3 py-1.5 text-xs font-bold text-[#04060c] transition hover:bg-[#7deaff]"
  >
    {state === 'ok' ? <Check size={12} /> : <Copy size={12} />}
    {state === 'ok' ? t.copiedLabel : state === 'fail' ? t.copyFailedLabel : t.copyLabel}
  </button>
)

export default function App({
  initialRoute,
  initialLang,
}: {
  initialRoute?: 'home' | 'docs'
  initialLang?: Lang
}) {
  const [lang, setLang] = useState<Lang>(() => {
    if (initialLang) return initialLang
    if (typeof window !== 'undefined') return detectLang()
    return defaultLang
  })
  // The KO/EN toggle is hidden in production. Append `?i18n=1` to reveal it
  // (handy for QA / debugging without polluting the public UI). Because the
  // query string only exists on the client, the prerendered HTML always ships
  // without the toggle. Lazy init reads the URL once on the first client
  // render — matches the server-rendered output when `?i18n=1` is absent
  // (no hydration mismatch in production), and reveals the toggle in one
  // render when the query string opts in.
  const [showToggle] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('i18n') === '1'
  })
  const [route, setRoute] = useState<'home' | 'docs'>(() => {
    if (initialRoute) return initialRoute
    if (typeof window !== 'undefined') return routeFromPath(window.location.pathname)
    return 'home'
  })
  const t = dict[lang]
  const [copied, setCopied] = useState<Record<string, CopyState>>({})
  const [version, setVersion] = useState<string | null>(null)
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [capFilter, setCapFilter] = useState<string>('all')
  const heroRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onPop = () => {
      setRoute(routeFromPath(window.location.pathname))
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const onLang = (e: Event) => {
      const next = (e as CustomEvent<Lang>).detail
      if (next === 'ko' || next === 'en') setLang(next)
    }
    window.addEventListener('flucto:set-lang', onLang as EventListener)
    return () => window.removeEventListener('flucto:set-lang', onLang as EventListener)
  }, [])

  useEffect(() => {
    const onToggleLang = () => setLang((l) => (l === 'ko' ? 'en' : 'ko'))
    window.addEventListener('flucto:toggle-lang', onToggleLang)
    return () => window.removeEventListener('flucto:toggle-lang', onToggleLang)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // SEO: per-route, per-language title/description. Updates on the client when the
  // user toggles language; at build time <Head> below renders language-correct meta
  // into each prerendered HTML shell.
  const homeTitle = lang === 'ko'
    ? 'Flucto — 레퍼런스. 프로덕션 준비 완료.'
    : 'Flucto — Your references. Ready for production.'
  const docsTitle = lang === 'ko' ? '문서 — Flucto' : 'Docs — Flucto'
  const pageTitle = route === 'docs' ? docsTitle : homeTitle
  const pageDescription = route === 'docs'
    ? (lang === 'ko'
        ? 'Flucto CLI & 데스크탑 레퍼런스 — 설치, 명령어, 플래그, 검색, AI 에이전트 연동.'
        : 'Flucto CLI & desktop reference — install, commands, flags, search, and AI-agent integration.')
    : t.heroLead
  const pageUrl = (() => {
    const base = 'https://flucto.ponslink.com'
    if (route === 'docs') return lang === 'ko' ? `${base}/ko/docs` : `${base}/docs`
    return lang === 'ko' ? `${base}/ko` : base
  })()

  useEffect(() => {
    fetch('/version.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.version) setVersion(d.version) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchGitHubStats()
      .then((s) => { if (!cancelled) setStats(s) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied((c) => ({ ...c, [key]: 'ok' }))
      setTimeout(() => setCopied((c) => ({ ...c, [key]: 'idle' })), 1400)
    } catch {
      // Clipboard API can be unavailable (insecure context, permissions) —
      // surface the failure instead of silently swallowing it.
      setCopied((c) => ({ ...c, [key]: 'fail' }))
      setTimeout(() => setCopied((c) => ({ ...c, [key]: 'idle' })), 2400)
    }
  }

  /**
   * Installer links resolve to the exact versioned asset once GitHub answers;
   * before that, the filename pattern and the deploy-baked version give a
   * deterministic URL; last resort is the latest-release page. No invented
   * version numbers — the patterns come from the product README.
   */
  const assetVersion = stats?.latestVersion ?? version
  const assetUrl = (kind: keyof NonNullable<GitHubStats['assets']>, file: (v: string) => string) =>
    stats?.assets[kind]
    ?? (assetVersion ? `${RELEASES_URL}/download/v${assetVersion}/${file(assetVersion)}` : LATEST_RELEASE_URL)

  const downloads = [
    {
      key: 'exe' as const,
      icon: MonitorDown,
      title: t.installWindows,
      file: (v: string) => `Flucto-${v}-x64-setup.exe`,
      note: t.installWindowsNote,
    },
    {
      key: 'dmg' as const,
      icon: MonitorDown,
      title: t.installMac,
      file: (v: string) => `Flucto-${v}-universal.dmg`,
      note: t.installMacNote,
    },
    {
      key: 'appimage' as const,
      icon: MonitorDown,
      title: t.installLinux,
      file: (v: string) => `Flucto-${v}-x86_64.AppImage`,
      note: t.installLinuxNote,
    },
    {
      key: 'cli' as const,
      icon: FileArchive,
      title: t.installCli,
      file: (v: string) => `Flucto-${v}-cli-setup.zip`,
      note: t.installCliNote,
    },
  ]

  const visibleDemos = DEMOS.filter(
    (d) => capFilter === 'all'
      || (capFilter === 'desktop' && d.kind === 'desktop')
      || (capFilter === 'cli' && d.kind === 'cli')
      || d.caps.includes(capFilter),
  )

  const heroDemo = DEMOS[2]

  const motionProps = (delay = 0) =>
    reduceMotion ? {} : { ...reveal, transition: { duration: 0.7, delay } }

  if (route === 'docs') {
    return (
      <>
        <Head>
          <html lang={lang} />
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:type" content="website" />
          <link rel="canonical" href={pageUrl} />
        </Head>
        <DocsPage lang={lang} />
      </>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#04060c] text-[#eef2ff]">
      <Head>
        <html lang={lang} />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={pageUrl} />
      </Head>
      <div className="grain" />

      {/* ---------- nav ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04060c]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="#top" className="flex items-center gap-2.5">
            <BrandMark />
            <div>
              <div className="display text-lg leading-none">Flucto</div>
              <div className="text-[11px] text-white/40">{t.navTag}</div>
            </div>
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="sections">
            <a href="#demos" className="rounded-full px-3 py-1.5 text-sm text-white/55 transition hover:text-white">{t.navDemos}</a>
            <a href="#install" className="rounded-full px-3 py-1.5 text-sm text-white/55 transition hover:text-white">{t.navInstall}</a>
            <a
              href={lang === 'ko' ? '/ko/docs' : '/docs'}
              onClick={(e) => {
                e.preventDefault()
                navigate(lang === 'ko' ? '/ko/docs' : '/docs')
              }}
              className="rounded-full px-3 py-1.5 text-sm text-white/55 transition hover:text-white"
            >
              {t.navDocs}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {showToggle && (
              <button
                onClick={() => {
                  const next: Lang = lang === 'ko' ? 'en' : 'ko'
                  setLang(next)
                  // Sync URL prefix to the new language (e.g. / → /ko, /docs → /ko/docs)
                  const here = window.location.pathname
                  if (next === 'ko') {
                    if (here === '/') navigate('/ko')
                    else if (here === '/docs') navigate('/ko/docs')
                  } else {
                    if (here === '/ko') navigate('/')
                    else if (here === '/ko/docs') navigate('/docs')
                  }
                }}
                className="pill inline-flex items-center gap-1 bg-white/5 px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/10"
                title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
              >
                <Languages size={12} /> {lang === 'ko' ? 'EN' : 'KO'}
              </button>
            )}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener"
              className="pill group inline-flex items-center gap-2 bg-white/[.04] px-3 py-1.5 text-sm text-white/75 transition hover:border-[#3ee0ff]/40 hover:text-white"
              title={t.starTip}
            >
              <Star size={14} className="text-[#3ee0ff]" />
              <span className="num-tab font-semibold">{stats?.stars !== null && stats?.stars !== undefined ? formatCompact(stats.stars) : '★'}</span>
              <span className="hidden sm:inline text-white/40">{t.starCta}</span>
            </a>
            <a
              href="#install"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#3ee0ff] px-3.5 py-1.5 text-sm font-semibold text-[#04060c] transition hover:bg-[#7deaff]"
            >
              {t.ctaDownload} <Download size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <div id="top" ref={heroRef} className="relative overflow-hidden">
        <div className="aurora" />
        <div className="beam" />
        <motion.div
          style={reduceMotion ? {} : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:pb-24"
        >
          <div>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="eyebrow inline-flex items-center gap-2"
            >
              <ShieldCheck size={11} className="accent" /> {t.heroKicker}
            </motion.p>

            <h1 className="display mt-6 text-[clamp(2.6rem,6.5vw,5.6rem)] leading-[1.04]">
              <motion.span initial={reduceMotion ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }} className="block">
                {t.heroTitle}
              </motion.span>
              <motion.span initial={reduceMotion ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block">
                <span className="serif-italic accent text-glow">{t.heroTitleAccent}</span>
              </motion.span>
            </h1>

            <motion.p initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-base">
              {t.heroLead}
            </motion.p>

            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.46 }} className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#install" className="inline-flex items-center gap-2 rounded-full bg-[#3ee0ff] px-7 py-3.5 text-sm font-bold text-[#04060c] shadow-[0_0_44px_rgba(62,224,255,.35)] transition hover:bg-[#7deaff]">
                {t.ctaDownload} <Download size={16} />
              </a>
              <a href={REPO_URL} target="_blank" rel="noopener" className="pill inline-flex items-center gap-2 bg-white/[.04] px-7 py-3.5 text-sm text-white/80 transition hover:border-[#3ee0ff]/40 hover:bg-white/[.08]">
                <Star size={15} className="accent" /> {t.ctaGithub}
              </a>
            </motion.div>

            <motion.ul initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/35">
              {[t.heroTrustLocal, t.heroTrustEngine, t.heroTrustOs, t.heroTrustLicense].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[#3ee0ff]/60" /> {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* actual product media, not a decorative mock */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="card card-edge overflow-hidden p-0"
          >
            <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/[.03] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3ee0ff]/60" />
              <span className="ml-3 font-mono text-[11px] text-white/35">{t.heroMediaLabel}</span>
            </div>
            <DemoMedia id={heroDemo.id} title={heroDemo[lang].title} playLabel={t.playDemo} hero />
            <p className="border-t border-white/5 px-4 py-3 text-xs text-white/45">{t.heroMediaCaption}</p>
          </motion.div>
        </motion.div>

        {/* platform marquee */}
        <div className="hairline relative z-10 border-t border-white/5 py-5">
          <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">{t.marqueeLabel}</p>
          <div className="marquee">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="marquee-track" aria-hidden={copyIndex === 1}>
                {marqueePlatforms.map((platform, index) => (
                  <span key={`${copyIndex}-${index}`} className="display text-2xl text-white/25 md:text-3xl">
                    {platform}
                    <span className="accent ml-14 text-lg">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- live stats ---------- */}
      <section className="hairline relative z-10 mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-3 gap-6 md:gap-10">
          <Stat value={stats?.stars ?? null} label={t.statsStars} />
          <Stat value={stats?.downloads ?? null} label={t.statsDownloads} />
          <Stat value={stats?.latestVersion ?? version ?? null} label={t.statsRelease} />
        </div>
        <p className="mt-8 text-[11px] leading-relaxed text-white/30">{t.statsFootnote}</p>
      </section>

      {/* ---------- demo gallery ---------- */}
      <section id="demos" className="hairline relative z-10 mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <p className="eyebrow">{t.galleryKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.galleryTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{t.galleryLead}</p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t.galleryKicker}>
          {['all', 'desktop', 'cli', ...CAP_ORDER].map((cap) => {
            const label = cap === 'all' ? t.filterAll : cap === 'desktop' ? t.filterDesktop : cap === 'cli' ? t.filterCli : t.capLabels[cap]
            const active = capFilter === cap
            return (
              <button
                key={cap}
                type="button"
                onClick={() => setCapFilter(cap)}
                aria-pressed={active}
                className={`pill px-3.5 py-1.5 text-xs transition focus-visible:outline-2 focus-visible:outline-[#3ee0ff] focus-visible:outline-offset-1 ${
                  active
                    ? 'border-[#3ee0ff]/60 bg-[#3ee0ff]/15 text-[#3ee0ff]'
                    : 'bg-white/[.03] text-white/50 hover:border-[#3ee0ff]/30 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDemos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} lang={lang} gifLabel={t.gifFallback} />
          ))}
        </div>

        <p className="mt-8 text-[11px] leading-relaxed text-white/30">{t.demoFootnote}</p>
      </section>

      {/* ---------- install ---------- */}
      <section id="install" className="hairline relative z-10 mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <p className="eyebrow">{t.installKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.installTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{t.installLead}</p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {downloads.map((item) => (
            <a
              key={item.key}
              href={assetUrl(item.key, item.file)}
              target="_blank"
              rel="noopener"
              className="card card-sheen group flex flex-col gap-3 p-5 transition hover:border-[#3ee0ff]/40 focus-visible:outline-2 focus-visible:outline-[#3ee0ff] focus-visible:outline-offset-2"
              onMouseMove={sheen}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <item.icon size={17} className="accent" />
                  <span className="text-sm font-semibold">{item.title}</span>
                </span>
                <Download size={15} className="text-white/30 transition group-hover:text-[#3ee0ff]" />
              </div>
              <code className="font-mono text-[11px] leading-relaxed text-[#3ee0ff]/80">
                {assetVersion ? item.file(assetVersion) : item.file('<version>')}
              </code>
              <p className="text-xs leading-relaxed text-white/50">{item.note}</p>
            </a>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
          <a
            href={stats?.assets.checksums ?? (assetVersion ? `${RELEASES_URL}/download/v${assetVersion}/checksums-sha256.txt` : LATEST_RELEASE_URL)}
            target="_blank"
            rel="noopener"
            className="pill inline-flex items-center gap-1.5 bg-white/[.03] px-3 py-1.5 transition hover:border-[#3ee0ff]/30 hover:text-white"
          >
            <FileText size={12} className="accent" /> {t.installChecksums}
          </a>
          <a href={RELEASES_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 transition hover:text-[#3ee0ff]">
            {t.installAllReleases} <ArrowRight size={12} />
          </a>
        </div>

        {/* CLI quickstart + agent prompt */}
        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          <div className="card p-6 lg:col-span-3">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="accent" />
              <h3 className="display text-xl leading-tight">{t.installCliStepsTitle}</h3>
            </div>
            <ol className="mt-5 space-y-4">
              {[t.installCliStep1, t.installCliStep2, t.installCliStep3].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="display flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3ee0ff]/15 text-sm accent">{i + 1}</span>
                  <span className="pt-1 text-sm leading-relaxed text-white/65">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[11.5px] leading-relaxed text-white/70">
              <div><span className="accent">#</span> flucto doctor --json</div>
              <div><span className="accent">#</span> PowerShell → flucto / fl.cmd · cmd / POSIX → fl</div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-white/35">{t.installCliNote2}</p>
          </div>

          <div className="card card-edge p-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Package size={16} className="accent" />
              <h3 className="display text-xl leading-tight">{t.agentTitle}</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/55">{t.agentDesc}</p>
            <div className="relative mt-4 rounded-xl border border-[#3ee0ff]/20 bg-[#3ee0ff]/[.04] p-4">
              <p className="font-mono text-[11.5px] leading-relaxed text-white/80">“{t.agentPrompt}”</p>
              <div className="mt-3">
                <CopyChip
                  state={copied['agent-prompt'] ?? 'idle'}
                  onCopy={() => void copy(t.agentPrompt, 'agent-prompt')}
                  t={t}
                />
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-white/30">{t.agentHint}</p>
          </div>
        </div>
      </section>

      {/* ---------- honest limitations ---------- */}
      <section className="hairline relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">{t.limitsKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.limitsTitle}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {t.limits.map((item, i) => (
            <motion.div key={i} {...motionProps(i * 0.05)} className="card card-sheen p-5" onMouseMove={sheen}>
              <h3 className="text-sm font-semibold text-white/90">{item.q}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/55">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- final CTA ---------- */}
      <section className="relative z-10 overflow-hidden px-5 py-28">
        <div className="aurora opacity-70" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="display text-[clamp(2.4rem,7vw,5.5rem)]">
            {t.bottomTitle}<br />
            <span className="serif-italic accent text-glow">{t.bottomTitleAccent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">{t.bottomDesc}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#install" className="inline-flex items-center gap-2 rounded-full bg-[#3ee0ff] px-8 py-4 text-sm font-bold text-[#04060c] shadow-[0_0_54px_rgba(62,224,255,.4)] transition hover:bg-[#7deaff]">
              {t.bottomCta} <ArrowRight size={16} />
            </a>
            <a href={REPO_URL} target="_blank" rel="noopener" className="pill inline-flex items-center gap-2 bg-white/[.04] px-8 py-4 text-sm text-white/80 transition hover:border-[#3ee0ff]/40">
              <Star size={15} className="accent" /> {t.ctaGithub}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="hairline relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-xs text-white/35">
          <span className="inline-flex items-center gap-2">
            <BrandMark /> Flucto — {t.footerRights}
          </span>
          <span className="pill bg-white/[.03] px-3 py-1.5">
            {t.footerVersion} · <span className="accent num-tab">{version ? `v${version}` : '—'}</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
