import { useState } from 'react'
import { Check, Copy, Download, Languages, Star } from 'lucide-react'
import { dict } from './i18n'
import type { Lang } from './i18n'

const REPO_URL = 'https://github.com/DeclanJeon/flucto'
const RELEASES_URL = 'https://github.com/DeclanJeon/flucto/releases'

export type DocBlock =
  | { type: 'p'; text: string }
  | { type: 'code'; lines: string[] }
  | { type: 'options'; rows: [string, string][] }
  | { type: 'list'; items: string[] }

export interface DocSection {
  id: string
  title: string
  blocks: DocBlock[]
}

const commandBlock = (lines: string[]): DocBlock => ({ type: 'code', lines })

const ko: DocSection[] = [
  {
    id: 'quickstart',
    title: '빠른 시작',
    blocks: [
      { type: 'p', text: 'npm 한 줄로 설치한다. 바이너리(yt-dlp/ffmpeg)는 첫 실행 때 자동으로 구성되므로 사전 준비는 Node.js 20+뿐이다.' },
      commandBlock(['npm i -g flucto', 'fl doc -j                  # 설치 점검', 'fl s -j                    # 바이너리 수동 설치/갱신', 'fl t "https://www.youtube.com/watch?v=…" -l en -o ./notes -j']),
      { type: 'p', text: '`fl` 과 `flucto` 두 이름 모두 등록된다. 자막 전용으로 쓸 거면 `fl s --yt-dlp-only -j` 로 ffmpeg 다운로드를 생략할 수 있다.' },
    ],
  },
  {
    id: 'commands',
    title: '명령어 레퍼런스',
    blocks: [
      { type: 'p', text: '모든 명령은 `-j`(`--json`)를 지원하며, 사람이 읽는 출력과 기계가 파싱하는 출력이 같은 엔진에서 나온다.' },
      commandBlock([
        'flucto download <url>            # MP4/MP3 다운로드 (d)',
        'flucto batch <file>              # URL 목록 일괄 처리 (b)',
        'flucto transcript <url>          # 자막 → Markdown (t)',
        'flucto md <url>                  # 프론트매터 포함 Markdown (m)',
        'flucto channel to-md <@handle>   # 채널 전체 → Markdown 폴더',
        'flucto info <url>                # 메타데이터 (i)',
        'flucto formats <url>             # 사용 가능한 포맷 (f)',
        'flucto languages <url>           # 자막 언어 목록 (l)',
        'flucto doctor                    # 바이너리 건강 점검 (doc)',
        'flucto setup                     # yt-dlp/ffmpeg 구성 (s)',
        'flucto update check|download|apply',
      ]),
      { type: 'p', text: '`batch` 와 `channel to-md` 는 `--out` 기준으로 전용 하위 폴더를 만든다(예: `notes/handle-channel-md-20260829-…/`). 파일이 섞일 일이 없다.' },
      { type: 'h3', text: 'fl transcript vs fl md' },
      { type: 'list', items: [
        '`t`(transcript) — 데스크톱 앱과 같은 포맷. 제목/메타데이터/타임스탬프 문단.',
        '`m`(md) — YAML 프론트매터 + 썸네일이 붙은 문서 지향 포맷. 옵시디언·블로그 파이프라인에 적합.',
      ] },
    ],
  },
  {
    id: 'options',
    title: '글로벌 옵션',
    blocks: [
      { type: 'options', rows: [
        ['--json, -j', '최종 결과를 stdout에 JSON으로 출력'],
        ['--progress-json, -p', '진행 이벤트를 stderr에 NDJSON으로 스트리밍'],
        ['--format, -f', '출력 포맷: mp4 | mp3 | md (지원 명령 한정)'],
        ['--quality, -q', '영상 화질 프리셋 (4k … worst)'],
        ['--audio-quality, -a', '오디오 품질 프리셋 (320kbps … worst)'],
        ['--language, -l', '자막 언어 코드 또는 auto'],
        ['--stdout, -s', 'Markdown을 파일 대신 stdout으로'],
        ['--output-dir, -o', '출력 베이스 디렉터리 (기본: cwd)'],
        ['--limit N', 'channel to-md 최대 영상 수 (기본 100, 최대 5000)'],
        ['--concurrency, -c', '동시 처리 수 (1–16)'],
        ['--cookies PATH', 'Netscape cookies.txt (bot-check 우회)'],
        ['--cookies-from-browser B', '브라우저에서 쿠키 추출 (chrome[:profile] 등)'],
        ['--proxy URL', '요청 프록시 (http/socks5)'],
        ['--impersonate T', 'yt-dlp 위장 대상 (예: chrome)'],
        ['--bin-dir / --yt-dlp / --ffmpeg', '바이너리 경로 수동 지정'],
        ['--force / --check-only / --yt-dlp-only', 'setup 옵션: 재다운로드 / 점검만 / yt-dlp만'],
      ] },
    ],
  },
  {
    id: 'markdown',
    title: 'Markdown 변환',
    blocks: [
      { type: 'p', text: '자막은 JSON3·XML/SRV3·VTT 포맷을 모두 파싱하고, HTML 태그·엔티티를 제거한 뒤 공백 구간(`--paragraph-gap`)으로 문단을 나눈다. 요청 언어 자막이 없으면 기반 언어 → 원본 ASR → 대체 트랙 순으로 폴백하되 최대 3개까지만 시도하고, 없으면 없다고 정확히 말한다.' },
      commandBlock([
        '# 자막 언어 목록 확인',
        'fl l "https://youtu.be/…" -j',
        '',
        '# 한국어 자막을 stdout으로',
        'fl t "https://youtu.be/…" -l ko -s',
        '',
        '# 채널 100개를 노트 폴더로',
        'fl channel to-md "@handle" --limit 100 -o ./notes -l ko',
      ]),
      { type: 'p', text: 'rate limit(429)에는 지수 백오프로 저항하고, 반복 실패 시 서킷브레이커가 60초간 열려 `SERVICE_UNAVAILABLE`을 반환한다. 이때는 쿠키나 프록시를 붙이는 것이 정답이다.' },
    ],
  },
  {
    id: 'network',
    title: '쿠키 · 프록시 · 환경변수',
    blocks: [
      { type: 'p', text: 'YouTube가 "sign in to confirm you\'re not a bot" 검사를 걸면 쿠키 또는 프록시가 필요하다. 플래그가 환경변수보다 우선한다.' },
      { type: 'options', rows: [
        ['--cookies / FLUCTO_COOKIES', 'Netscape cookies.txt 경로 (권장)'],
        ['--cookies-from-browser', '브라우저에서 직접 추출 — 플랫폼 키체인에 따라 실패 가능'],
        ['--proxy / FLUCTO_PROXY / HTTPS_PROXY', '요청 프록시'],
        ['FLUCTO_IMPERSONATE', 'curl-impersonate 대상'],
        ['FLUCTO_OUTPUT_DIR', '기본 출력 디렉터리'],
        ['FLUCTO_BIN_DIR / FLUCTO_YT_DLP_PATH / FLUCTO_FFMPEG_PATH', '바이너리 위치 제어'],
        ['FLUCTO_SKIP_BINARIES=1', '설치 시 바이너리 자동 다운로드 생략'],
        ['NO_COLOR=1', 'ANSI 색상 비활성화'],
      ] },
    ],
  },
  {
    id: 'agents',
    title: 'AI 에이전트 연동',
    blocks: [
      { type: 'p', text: 'Flucto CLI는 처음부터 에이전트를 전제로 설계됐다. 결과 JSON은 stdout, 진행 이벤트 NDJSON은 stderr — 파이프로 정확히 분리된다.' },
      commandBlock([
        '# 최종 결과만 파싱',
        'fl t "URL" -j 2>/dev/null | jq .filePath',
        '',
        '# 진행률 표시하며 실행',
        'fl channel to-md "@handle" -o ./notes --progress-json',
      ]),
      { type: 'h3', text: '종료 코드' },
      { type: 'options', rows: [
        ['0', '성공'],
        ['1', '잘못된 사용법'],
        ['3', 'doctor/setup — 바이너리 문제'],
        ['4', '다운로드/업데이트 실패'],
        ['5', 'transcript/md 실패 (자막 없음, rate limit 등)'],
        ['7', '배치 — 일부 항목 실패 (결과 JSON에 개수 포함)'],
      ] },
      { type: 'p', text: '에이전트에 이렇게 시켜라: "npm으로 Flucto CLI(fl)를 설치하고, 이 채널의 최근 영상 자막을 Markdown 노트로 ./notes에 정리해줘: https://youtube.com/@handle"' },
    ],
  },
  {
    id: 'desktop',
    title: '데스크톱 앱',
    blocks: [
      { type: 'p', text: 'CLI와 같은 TypeScript 엔진을 GUI로 감싼 것이다. 배치 큐, 포맷 프리셋, 다운로드 히스토리, 자막→Markdown 패널을 제공하며 Windows·macOS·Linux 인스톨러는 GitHub Releases에 있다.' },
      { type: 'list', items: [
        '앱 내 GitHub Star 버튼 — 토큰을 등록하면 클릭 한 번으로 별표시',
        '고급 네트워크 설정 — cookies.txt/프록시를 UI에서 지정 (CLI의 --cookies와 동일 엔진)',
        'yt-dlp 자동 갱신 — 24시간마다 최신 추출기를 확인해 스스로 치유한다',
        '앱 업데이트 — electron-updater 내장, 인스톨러는 Releases에서',
      ] },
      { type: 'p', text: 'CLI만 필요하면 앱을 설치할 필요가 없다. 반대로 앱 유저도 `fl` 을 쓰고 싶다면 `npm i -g flucto` — 같은 설정·같은 엔진이다.' },
    ],
  },
  {
    id: 'troubleshooting',
    title: '문제 해결',
    blocks: [
      { type: 'options', rows: [
        ['RATE_LIMITED / 429', 'YouTube bot-check. cookies.txt 또는 프록시를 붙인다. 서킷브레이커가 열렸다면 60초 후 재시도'],
        ['TRANSCRIPT_UNAVAILABLE', '해당 영상에 자막이 없다. `fl l URL -j` 로 확인'],
        ['yt-dlp 추출 실패', '`fl s -j` 로 yt-dlp를 최신본으로 갱신 — YouTube 변화 대응은 대부분 여기서 끝난다'],
        ['ffmpeg 관련 오류', '자막 작업은 ffmpeg가 불필요하다. 다운로드가 필요하면 `fl s -j`'],
        ['설치 후 명령을 못 찾음', 'npm 전역 bin 경로를 PATH에 추가 (`npm config get prefix`)'],
      ] },
    ],
  },
]

const en: DocSection[] = [
  {
    id: 'quickstart',
    title: 'Quick start',
    blocks: [
      { type: 'p', text: 'Install with one npm command. Binaries (yt-dlp/ffmpeg) are provisioned automatically on first run — all you need is Node.js 20+.' },
      commandBlock(['npm i -g flucto', 'fl doc -j                  # verify install', 'fl s -j                    # install/refresh binaries manually', 'fl t "https://www.youtube.com/watch?v=…" -l en -o ./notes -j']),
      { type: 'p', text: 'Both `fl` and `flucto` are registered. Transcripts only? Skip the ffmpeg download with `fl s --yt-dlp-only -j`.' },
    ],
  },
  {
    id: 'commands',
    title: 'Commands',
    blocks: [
      { type: 'p', text: 'Every command supports `-j` (`--json`). Human output and machine output come from the same engine.' },
      commandBlock([
        'flucto download <url>            # MP4/MP3 download (d)',
        'flucto batch <file>              # batch from a URL list (b)',
        'flucto transcript <url>          # captions → Markdown (t)',
        'flucto md <url>                  # Markdown with frontmatter (m)',
        'flucto channel to-md <@handle>   # whole channel → Markdown folder',
        'flucto info <url>                # metadata (i)',
        'flucto formats <url>             # available formats (f)',
        'flucto languages <url>           # caption language list (l)',
        'flucto doctor                    # binary health check (doc)',
        'flucto setup                     # provision yt-dlp/ffmpeg (s)',
        'flucto update check|download|apply',
      ]),
      { type: 'p', text: '`batch` and `channel to-md` always create a dedicated subfolder under `--out` (e.g. `notes/handle-channel-md-20260829-…/`) — files never mix.' },
      { type: 'h3', text: 'fl transcript vs fl md' },
      { type: 'list', items: [
        '`t` (transcript) — same format as the desktop app: title, metadata, timestamped paragraphs.',
        '`m` (md) — document-oriented: YAML frontmatter + thumbnail. Great for Obsidian/blog pipelines.',
      ] },
    ],
  },
  {
    id: 'options',
    title: 'Global options',
    blocks: [
      { type: 'options', rows: [
        ['--json, -j', 'Final result as JSON on stdout'],
        ['--progress-json, -p', 'Progress events as NDJSON on stderr'],
        ['--format, -f', 'Output format: mp4 | mp3 | md (where supported)'],
        ['--quality, -q', 'Video quality preset (4k … worst)'],
        ['--audio-quality, -a', 'Audio quality preset (320kbps … worst)'],
        ['--language, -l', 'Caption language code or auto'],
        ['--stdout, -s', 'Markdown to stdout instead of a file'],
        ['--output-dir, -o', 'Base output directory (default: cwd)'],
        ['--limit N', 'Max videos for channel to-md (default 100, max 5000)'],
        ['--concurrency, -c', 'Concurrent jobs (1–16)'],
        ['--cookies PATH', 'Netscape cookies.txt (bot-check workaround)'],
        ['--cookies-from-browser B', 'Extract cookies from a browser (chrome[:profile] …)'],
        ['--proxy URL', 'Request proxy (http/socks5)'],
        ['--impersonate T', 'yt-dlp impersonation target (e.g. chrome)'],
        ['--bin-dir / --yt-dlp / --ffmpeg', 'Manual binary paths'],
        ['--force / --check-only / --yt-dlp-only', 'Setup: re-download / check only / yt-dlp only'],
      ] },
    ],
  },
  {
    id: 'markdown',
    title: 'Markdown conversion',
    blocks: [
      { type: 'p', text: 'Captions are parsed from JSON3, XML/SRV3 and VTT, stripped of markup, and grouped into paragraphs by silence gaps. If the requested language is missing, Flucto falls back (base language → original ASR → alternates) up to 3 candidates — and says unavailable when there is truly nothing.' },
      commandBlock([
        '# list caption languages',
        'fl l "https://youtu.be/…" -j',
        '',
        '# Korean captions to stdout',
        'fl t "https://youtu.be/…" -l ko -s',
        '',
        '# a channel into a notes folder',
        'fl channel to-md "@handle" --limit 100 -o ./notes -l ko',
      ]),
      { type: 'p', text: 'Rate limits (429) meet exponential backoff; repeated failures open a circuit breaker for 60s and return `SERVICE_UNAVAILABLE`. That is your cue to add cookies or a proxy.' },
    ],
  },
  {
    id: 'network',
    title: 'Cookies · proxy · env',
    blocks: [
      { type: 'p', text: 'When YouTube asks to "sign in to confirm you\'re not a bot", attach cookies or a proxy. Flags take precedence over environment variables.' },
      { type: 'options', rows: [
        ['--cookies / FLUCTO_COOKIES', 'Netscape cookies.txt path (recommended)'],
        ['--cookies-from-browser', 'Extract from a local browser — may fail on platform keychains'],
        ['--proxy / FLUCTO_PROXY / HTTPS_PROXY', 'Request proxy'],
        ['FLUCTO_IMPERSONATE', 'curl-impersonate target'],
        ['FLUCTO_OUTPUT_DIR', 'Default output directory'],
        ['FLUCTO_BIN_DIR / FLUCTO_YT_DLP_PATH / FLUCTO_FFMPEG_PATH', 'Binary location control'],
        ['FLUCTO_SKIP_BINARIES=1', 'Skip automatic binary download during install'],
        ['NO_COLOR=1', 'Disable ANSI colors'],
      ] },
    ],
  },
  {
    id: 'agents',
    title: 'AI agents',
    blocks: [
      { type: 'p', text: 'The CLI was designed for agents from day one: result JSON on stdout, progress NDJSON on stderr — cleanly separated for pipes.' },
      commandBlock([
        '# parse just the final result',
        'fl t "URL" -j 2>/dev/null | jq .filePath',
        '',
        '# watch progress while it runs',
        'fl channel to-md "@handle" -o ./notes --progress-json',
      ]),
      { type: 'h3', text: 'Exit codes' },
      { type: 'options', rows: [
        ['0', 'success'],
        ['1', 'usage error'],
        ['3', 'doctor/setup — binary problem'],
        ['4', 'download/update failure'],
        ['5', 'transcript/md failure (no captions, rate limit …)'],
        ['7', 'batch — some items failed (counts in the result JSON)'],
      ] },
      { type: 'p', text: 'Just tell your agent: "Install the Flucto CLI (fl) via npm, then turn this channel\'s recent captions into Markdown notes in ./notes: https://youtube.com/@handle"' },
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop app',
    blocks: [
      { type: 'p', text: 'The same TypeScript engine behind a GUI: batch queue, format presets, download history, and a captions→Markdown panel. Installers for Windows, macOS and Linux live on GitHub Releases.' },
      { type: 'list', items: [
        'In-app GitHub Star button — register a token and star with one click',
        'Advanced network settings — cookies.txt/proxy from the UI (same engine as --cookies)',
        'yt-dlp auto-refresh — checks for a fresh extractor every 24h and self-heals',
        'App updates — electron-updater built in; installers on Releases',
      ] },
      { type: 'p', text: 'Only need the CLI? Skip the app entirely. Want `fl` alongside the app? `npm i -g flucto` — same settings, same engine.' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    blocks: [
      { type: 'options', rows: [
        ['RATE_LIMITED / 429', 'YouTube bot-check. Attach cookies.txt or a proxy. If the circuit breaker opened, retry after 60s'],
        ['TRANSCRIPT_UNAVAILABLE', 'This media has no captions. Check with `fl l URL -j`'],
        ['yt-dlp extraction failures', '`fl s -j` refreshes yt-dlp — most YouTube breakage ends here'],
        ['ffmpeg errors', 'Transcripts do not need ffmpeg. Downloads do — `fl s -j`'],
        ['command not found after install', 'Add the npm global bin dir to PATH (`npm config get prefix`)'],
      ] },
    ],
  },
]

const docsContent: Record<Lang, DocSection[]> = { ko, en }

// ---------- render helpers ----------

const Inline = ({ text }: { text: string }) => (
  <>
    {text.split(/(`[^`]+`)/g).map((part, index) =>
      part.startsWith('`') && part.endsWith('`')
        ? <code key={index} className="inline-code">{part.slice(1, -1)}</code>
        : <span key={index}>{part}</span>,
    )}
  </>
)

const CodeBlock = ({ lines }: { lines: string[] }) => {
  const [copied, setCopied] = useState(false)
  const text = lines.join('\n')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* ignore */ }
  }
  return (
    <div className="group relative rounded-xl border border-white/8 bg-black/40">
      <button
        onClick={() => void copy()}
        aria-label="copy"
        className="absolute right-2.5 top-2.5 rounded-lg border border-white/10 bg-white/[.04] p-1.5 text-white/40 opacity-0 transition group-hover:opacity-100 hover:text-white"
      >
        {copied ? <Check size={12} className="accent" /> : <Copy size={12} />}
      </button>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-white/75">{text}</pre>
    </div>
  )
}

// ---------- page ----------

export function DocsPage({ lang }: { lang: Lang }) {
  const sections = docsContent[lang]
  const t = dict[lang]
  const [active, setActive] = useState(sections[0]?.id)

  const go = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative min-h-screen bg-[#04060c] text-[#eef2ff]">
      <div className="grain" />
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04060c]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="#/" className="flex items-center gap-2.5">
            <BrandMarkSmall />
            <span className="display text-lg leading-none">Flucto</span>
            <span className="eyebrow ml-1 hidden sm:inline">DOCS</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('flucto:toggle-lang'))}
              className="pill inline-flex items-center gap-1 bg-white/5 px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/10"
              title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            >
              <Languages size={12} /> {lang === 'ko' ? 'EN' : 'KO'}
            </button>
            <a href={REPO_URL} target="_blank" rel="noopener" className="pill inline-flex items-center gap-1.5 bg-white/[.04] px-3 py-1.5 text-sm text-white/75 hover:border-[#3ee0ff]/40">
              <Star size={14} className="accent" /> GitHub
            </a>
            <a href={RELEASES_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-[#3ee0ff] px-3.5 py-1.5 text-sm font-semibold text-[#04060c] hover:bg-[#7deaff]">
              {t.ctaDownload}
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-6xl gap-10 px-5 pb-24 pt-28">
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-24 space-y-1">
            <p className="eyebrow mb-3">{lang === 'ko' ? '문서' : 'DOCUMENTATION'}</p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => go(section.id)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  active === section.id ? 'bg-[#3ee0ff]/10 text-[#3ee0ff]' : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 max-w-3xl flex-1">
          <h1 className="display text-[clamp(2.4rem,6vw,4.5rem)]">
            Flucto <span className="serif-italic accent text-glow">{lang === 'ko' ? '문서' : 'docs'}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            {lang === 'ko'
              ? 'CLI · 데스크톱 앱 · AI 에이전트 연동까지의 전체 레퍼런스. 모든 예제는 v1.16 이상 기준이다.'
              : 'The complete reference for the CLI, the desktop app, and AI-agent workflows. All examples assume v1.16+.'}
          </p>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="hairline mt-14 scroll-mt-24 border-t border-white/5 pt-10 first:mt-12">
              <h2 className="display text-3xl">{section.title}</h2>
              {section.blocks.map((block, index) => {
                switch (block.type) {
                  case 'p':
                    return <p key={index} className="mt-4 text-sm leading-relaxed text-white/65"><Inline text={block.text} /></p>
                  case 'h3':
                    return <h3 key={index} className="display mt-8 text-xl">{block.text}</h3>
                  case 'code':
                    return <div key={index} className="mt-4"><CodeBlock lines={block.lines} /></div>
                  case 'list':
                    return (
                      <ul key={index} className="mt-4 space-y-2">
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex gap-2 text-sm leading-relaxed text-white/65">
                            <span className="accent mt-0.5">/</span><span><Inline text={item} /></span>
                          </li>
                        ))}
                      </ul>
                    )
                  case 'options':
                    return (
                      <div key={index} className="mt-5 divide-y divide-white/5 rounded-xl border border-white/8 bg-white/[.02]">
                        {block.rows.map(([flag, desc]) => (
                          <div key={flag} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(11rem,auto)_1fr] sm:gap-4">
                            <code className="font-mono text-[12px] leading-relaxed accent">{flag}</code>
                            <span className="text-[13px] leading-relaxed text-white/60"><Inline text={desc} /></span>
                          </div>
                        ))}
                      </div>
                    )
                  default:
                    return null
                }
              })}
            </section>
          ))}

          <div className="mt-16 rounded-2xl border border-[#3ee0ff]/20 bg-gradient-to-br from-[#3ee0ff]/10 via-transparent to-[#0e7490]/10 p-6 text-center">
            <p className="display text-xl">{lang === 'ko' ? '준비됐나?' : 'Ready to flow?'}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <a href={RELEASES_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[#3ee0ff] px-6 py-3 text-sm font-bold text-[#04060c] hover:bg-[#7deaff]">
                {t.ctaDownload} <Download size={15} />
              </a>
              <a href="#/" className="pill inline-flex items-center gap-2 bg-white/[.04] px-6 py-3 text-sm text-white/75 hover:border-[#3ee0ff]/40">
                ← {lang === 'ko' ? '메인으로' : 'Back home'}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const BrandMarkSmall = () => (
  <svg width={26} height={26} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="gd" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#3ee0ff" /><stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
    </defs>
    <rect x={7} y={7} width={50} height={50} rx={16} fill="url(#gd)" />
    <path d="M20 18L20 48L31 48L31 28L38 28L38 48L49 48L49 18L38 18L32 18L26 18L20 18Z" fill="#04060c" />
    <path d="M24.5 34.5C24.5 28.4 29.6 23.8 36 23.8H39V28.5H36C33.1 28.5 31 30.7 31 33.5C31 36.4 33.4 38 36 38H46V46H36C29.6 46 24.5 40.6 24.5 34.5Z" fill="#eef2ff" />
  </svg>
)
