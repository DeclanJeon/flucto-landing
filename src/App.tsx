import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown, ArrowRight, Boxes, Check, Copy, Download, FileText, FolderOpen,
  Globe, Languages, Play, ShieldCheck, Sparkles, Star, Terminal, Zap, Layers, BookOpen,
} from 'lucide-react'
import { defaultLang, dict, marqueePlatforms, type Lang } from './i18n'
import { animateCount, fetchGitHubStats, formatCompact, type GitHubStats } from './github'

const REPO_URL = 'https://github.com/DeclanJeon/flucto'
const RELEASES_URL = 'https://github.com/DeclanJeon/flucto/releases'

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

/** Pointer-tracked specular sheen for bento cards. */
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
    return animateCount(0, value, 1600, (v) => setCount(v))
  }, [isNumber, value])

  if (value === null || value === undefined) return null

  return (
    <div className="text-center md:text-left">
      <div className="display text-4xl md:text-5xl accent text-glow">
        {isNumber
          ? <><span className="num-tab">{formatCompact(count)}</span>{suffix}</>
          : value}
      </div>
      <div className="eyebrow mt-2">{label}</div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(defaultLang)
  const t = dict[lang]
  const [copied, setCopied] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

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
      setCopied(key)
      setTimeout(() => setCopied(null), 1400)
    } catch { /* ignore */ }
  }

  const cliLines = [
    'fl doc -j',
    'fl s -j',
    'fl t "https://youtube.com/watch?v=…" -l en -o ./notes -j',
    'fl channel to-md "@handle" --limit 100 -o ./notes',
    'fl b urls.txt -f md -c 2 -o ./notes -j',
  ]

  return (
    <div className="relative min-h-screen bg-[#04060c] text-[#eef2ff]">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang((l) => (l === 'ko' ? 'en' : 'ko'))}
              className="pill inline-flex items-center gap-1 bg-white/5 px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/10"
              title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            >
              <Languages size={12} /> {lang === 'ko' ? 'EN' : 'KO'}
            </button>
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
              href={RELEASES_URL}
              target="_blank"
              rel="noopener"
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
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-28 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="eyebrow inline-flex items-center gap-2"
          >
            <Sparkles size={11} className="accent" /> {t.heroKicker}
          </motion.p>

          <h1 className="display mt-6 text-[clamp(3.2rem,10.5vw,9rem)]">
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }} className="block">
              {t.heroLine1}
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block">
              <span className="outline-type">{t.heroLine2}</span>{' '}
              <span className="serif-italic accent text-glow">{t.heroSerif}</span>
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base">
            {t.heroLead}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.46 }} className="mt-8 flex flex-wrap items-center gap-3">
            <a href={RELEASES_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[#3ee0ff] px-7 py-3.5 text-sm font-bold text-[#04060c] shadow-[0_0_44px_rgba(62,224,255,.35)] transition hover:bg-[#7deaff]">
              {t.ctaDownload} <Download size={16} />
            </a>
            <a href={REPO_URL} target="_blank" rel="noopener" className="pill inline-flex items-center gap-2 bg-white/[.04] px-7 py-3.5 text-sm text-white/80 transition hover:border-[#3ee0ff]/40 hover:bg-white/[.08]">
              <Star size={15} className="accent" /> {t.ctaGithub}
            </a>
            <a href="#manifesto" className="inline-flex items-center gap-2 px-3 py-3.5 text-sm text-white/45 transition hover:text-white">
              {t.ctaScroll} <ArrowDown size={14} />
            </a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/35">
            <span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> Local-first</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="inline-flex items-center gap-1"><Zap size={12} /> Auto yt-dlp + ffmpeg</span>
            <span className="h-3 w-px bg-white/10" />
            <span>Windows · macOS · Linux</span>
            <span className="h-3 w-px bg-white/10" />
            <span>MIT</span>
          </motion.p>
        </motion.div>

        {/* platform marquee */}
        <div className="hairline relative z-10 border-t border-white/5 py-5">
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
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <Stat value={stats?.stars ?? null} label={t.statsStars} />
          <Stat value={stats?.downloads ?? null} label={t.statsDownloads} />
          <Stat value={8} label={t.statsPlatforms} />
          <Stat value={stats?.latestVersion ?? version ?? null} label={t.statsRelease} />
        </div>
        <p className="mt-8 text-[11px] leading-relaxed text-white/30">{t.statsFootnote}</p>
      </section>

      {/* ---------- manifesto ---------- */}
      <section id="manifesto" className="hairline relative z-10 mx-auto max-w-5xl px-5 py-24">
        <p className="eyebrow">{t.manifestoKicker}</p>
        <motion.p {...reveal} transition={{ duration: 0.8 }} className="display mt-8 text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[1.12] text-white/85">
          {t.manifesto1} <span className="serif-italic accent">{t.manifesto1Accent}</span>
        </motion.p>
        <motion.p {...reveal} transition={{ duration: 0.8, delay: 0.12 }} className="display mt-10 text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[1.12] text-white/85">
          {t.manifesto2} <span className="serif-italic accent text-glow">{t.manifesto2Accent}</span>
        </motion.p>
      </section>

      {/* ---------- bento ---------- */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">{t.bentoKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.bentoTitle}</h2>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {/* big tile — platforms */}
          <div onMouseMove={sheen} className="card card-sheen card-edge p-6 md:col-span-2 md:row-span-1">
            <div className="flex items-start justify-between">
              <Globe size={18} className="accent" />
              <span className="eyebrow">01</span>
            </div>
            <h3 className="display mt-6 text-2xl">{t.bento1Title}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{t.bento1Desc}</p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {['YouTube', 'X', 'Reddit', 'Bilibili', 'Instagram', 'Threads', 'TikTok', 'Vimeo'].map((p) => (
                <span key={p} className="pill bg-white/[.03] px-2.5 py-1 text-[11px] text-white/55">{p}</span>
              ))}
            </div>
          </div>

          {/* privacy */}
          <div onMouseMove={sheen} className="card card-sheen p-6">
            <div className="flex items-start justify-between">
              <ShieldCheck size={18} className="accent" />
              <span className="eyebrow">02</span>
            </div>
            <h3 className="display mt-6 text-xl">{t.bento4Title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{t.bento4Desc}</p>
          </div>

          {/* captions → md */}
          <div onMouseMove={sheen} className="card card-sheen card-edge p-6">
            <div className="flex items-start justify-between">
              <FileText size={18} className="accent" />
              <span className="eyebrow">03</span>
            </div>
            <h3 className="display mt-6 text-xl">{t.bento3Title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{t.bento3Desc}</p>
            <div className="mt-5 space-y-1.5 rounded-xl border border-white/5 bg-black/30 p-3">
              <div className="h-1.5 w-3/4 rounded bg-[#3ee0ff]/30" />
              <div className="h-1.5 w-full rounded bg-white/10" />
              <div className="h-1.5 w-1/2 rounded bg-white/10" />
              <div className="mt-2 font-mono text-[10px] accent">## [03:14]</div>
            </div>
          </div>

          {/* batch */}
          <div onMouseMove={sheen} className="card card-sheen p-6 md:col-span-2">
            <div className="flex items-start justify-between">
              <Boxes size={18} className="accent" />
              <span className="eyebrow">04</span>
            </div>
            <h3 className="display mt-6 text-xl">{t.bento2Title}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{t.bento2Desc}</p>
            <div className="mt-5 flex items-end gap-1.5">
              {[38, 72, 55, 90, 64, 44, 80, 58, 96, 70, 48, 84, 62, 76].map((h, i) => (
                <div key={i} className="w-3 rounded-t bg-gradient-to-t from-[#0e7490]/40 to-[#3ee0ff]/70" style={{ height: `${h * 0.5}px` }} />
              ))}
            </div>
          </div>

          {/* engine */}
          <div onMouseMove={sheen} className="card card-sheen p-6">
            <div className="flex items-start justify-between">
              <Layers size={18} className="accent" />
              <span className="eyebrow">05</span>
            </div>
            <h3 className="display mt-6 text-xl">{t.bento5Title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{t.bento5Desc}</p>
          </div>

          {/* setup */}
          <div onMouseMove={sheen} className="card card-sheen p-6 md:col-span-2">
            <div className="flex items-start justify-between">
              <Zap size={18} className="accent" />
              <span className="eyebrow">06</span>
            </div>
            <h3 className="display mt-6 text-xl">{t.bento6Title}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{t.bento6Desc}</p>
            <div className="mt-5 inline-flex items-center gap-2">
              <span className="kbd">fl s -j</span>
              <button onClick={() => copy('fl s -j', 'setup')} className="pill bg-white/[.03] p-1.5 text-white/50 hover:text-white" aria-label="copy">
                {copied === 'setup' ? <Check size={12} className="accent" /> : <Copy size={12} />}
              </button>
              <span className="text-xs text-white/35">yt-dlp · ffmpeg → ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- demo + cli ---------- */}
      <section className="hairline relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">{t.demoKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.demoTitle}</h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          <div className="card overflow-hidden p-0 lg:col-span-3">
            <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/[.03] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3ee0ff]/60" />
              <span className="ml-3 font-mono text-[11px] text-white/35">flucto — channel to-md</span>
            </div>
            <img src="/demo.gif" alt="channel to-md demo" className="h-auto w-full object-cover" loading="lazy" />
            <p className="border-t border-white/5 px-4 py-3 text-xs text-white/45">{t.demoCaption}</p>
          </div>

          <div className="card flex flex-col p-0 lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[.03] px-4 py-2.5">
              <Terminal size={13} className="accent" />
              <span className="font-mono text-[11px] text-white/35">zsh — fl</span>
            </div>
            <div className="flex-1 space-y-2.5 overflow-x-auto bg-black/40 p-4 font-mono text-[11.5px] leading-relaxed">
              {cliLines.map((line, index) => (
                <div key={line} className="whitespace-nowrap">
                  <span className="accent">❯</span>{' '}
                  <span className={index === 2 ? 'text-white' : 'text-white/55'}>{line}</span>
                </div>
              ))}
              <div className="pt-1 text-white/30">▌</div>
            </div>
            <p className="border-t border-white/5 px-4 py-3 text-xs text-white/45">{t.cliNote}</p>
          </div>
        </div>
      </section>

      {/* ---------- CLI-only install guide ---------- */}
      <section className="hairline relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">{t.cliGuideKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.cliGuideTitle}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">{t.cliGuideSub}</p>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {/* install steps */}
          <div className="space-y-3 lg:col-span-3">
            {[
              {
                n: '1',
                title: t.cliGuideStep1Title,
                note: t.cliGuideStep1Note,
                cmd: 'git clone https://github.com/DeclanJeon/flucto && cd flucto && npm install && npm run build:electron && npm link',
                key: 'cli-install',
              },
              {
                n: '2',
                title: t.cliGuideStep2Title,
                note: t.cliGuideStep2Note,
                cmd: 'fl doc -j && fl s --yt-dlp-only -j',
                key: 'cli-verify',
              },
              {
                n: '3',
                title: t.cliGuideStep3Title,
                note: t.cliGuideStep3Note,
                cmd: 'fl t "https://www.youtube.com/watch?v=…" -l en -o ./notes -j',
                key: 'cli-run',
              },
            ].map((step) => (
              <div key={step.n} className="card card-sheen p-5" onMouseMove={sheen}>
                <div className="flex items-center gap-3">
                  <span className="display flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3ee0ff]/15 text-sm accent">{step.n}</span>
                  <span className="text-sm font-semibold">{step.title}</span>
                  <span className="ml-auto hidden text-xs text-white/35 sm:inline">{step.note}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 px-3 py-2.5">
                  <span className="accent shrink-0 font-mono text-xs">❯</span>
                  <code className="min-w-0 flex-1 break-all font-mono text-[11.5px] leading-relaxed text-white/75">{step.cmd}</code>
                  <button
                    onClick={() => void copy(step.cmd, step.key)}
                    className="pill shrink-0 bg-white/[.03] p-1.5 text-white/50 hover:text-white"
                    aria-label={`copy ${step.title}`}
                  >
                    {copied === step.key ? <Check size={12} className="accent" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
            <p className="pill inline-flex bg-white/[.03] px-3 py-1.5 font-mono text-[11px] text-white/35">
              {t.cliGuideNpmSoon}
            </p>
          </div>

          {/* AI agent prompt card */}
          <motion.div {...reveal} transition={{ duration: 0.7 }} className="card card-edge p-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="accent" />
              <h3 className="display text-xl leading-tight">{t.agentTitle}</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/55">{t.agentDesc}</p>
            <div className="relative mt-4 rounded-xl border border-[#3ee0ff]/20 bg-[#3ee0ff]/[.04] p-4">
              <p className="font-mono text-[11.5px] leading-relaxed text-white/80">“{t.agentPrompt}”</p>
              <button
                onClick={() => void copy(t.agentPrompt, 'agent-prompt')}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#3ee0ff] px-3 py-1.5 text-xs font-bold text-[#04060c] transition hover:bg-[#7deaff]"
              >
                {copied === 'agent-prompt' ? <Check size={12} /> : <Copy size={12} />}
                {copied === 'agent-prompt' ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-white/30">{t.agentHint}</p>
          </motion.div>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="hairline relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">{t.howKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.howTitle}</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            { n: '01', i: Play, title: t.howStep1Title, desc: t.howStep1Desc },
            { n: '02', i: Layers, title: t.howStep2Title, desc: t.howStep2Desc },
            { n: '03', i: FolderOpen, title: t.howStep3Title, desc: t.howStep3Desc },
          ].map((step) => (
            <motion.div key={step.n} {...reveal} transition={{ duration: 0.7 }} className="border-t border-white/10 pt-6">
              <div className="display outline-type text-7xl md:text-8xl">{step.n}</div>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                <step.i size={15} className="accent" /> {step.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- personas ---------- */}
      <section className="hairline relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">{t.personaKicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{t.personaTitle}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[t.personaA, t.personaB, t.personaC].map((persona, index) => (
            <motion.div key={index} {...reveal} transition={{ duration: 0.7, delay: index * 0.08 }} className="card card-sheen p-6" onMouseMove={sheen}>
              <BookOpen size={16} className="accent" />
              <p className="mt-4 text-sm leading-relaxed text-white/70" dangerouslySetInnerHTML={{ __html: persona }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- final CTA ---------- */}
      <section className="relative z-10 overflow-hidden px-5 py-28">
        <div className="aurora opacity-70" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="display text-[clamp(2.4rem,7vw,5.5rem)]">
            {t.bottomTitleA}<br />
            <span className="serif-italic accent text-glow">{t.bottomTitleSerif}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">{t.bottomDesc}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={RELEASES_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[#3ee0ff] px-8 py-4 text-sm font-bold text-[#04060c] shadow-[0_0_54px_rgba(62,224,255,.4)] transition hover:bg-[#7deaff]">
              {t.bottomCtaA} <ArrowRight size={16} />
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
