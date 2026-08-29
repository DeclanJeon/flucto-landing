export type Lang = 'ko' | 'en'

export const defaultLang: Lang = 'en'

export const detectLang = (): Lang => {
  if (typeof navigator === 'undefined' || !navigator.languages) return defaultLang
  for (const l of navigator.languages) {
    if (l.toLowerCase().startsWith('ko')) return 'ko'
  }
  return defaultLang
}

type Dict = {
  navTag: string
  heroKicker: string
  heroLine1: string
  heroLine2: string
  heroSerif: string
  heroLead: string
  heroNote: string
  ctaDownload: string
  ctaGithub: string
  ctaScroll: string
  starCta: string
  starTip: string
  statsStars: string
  statsDownloads: string
  statsPlatforms: string
  statsRelease: string
  statsFootnote: string
  manifestoKicker: string
  manifesto1: string
  manifesto1Accent: string
  manifesto2: string
  manifesto2Accent: string
  bentoKicker: string
  bentoTitle: string
  bento1Title: string
  bento1Desc: string
  bento2Title: string
  bento2Desc: string
  bento3Title: string
  bento3Desc: string
  bento4Title: string
  bento4Desc: string
  bento5Title: string
  bento5Desc: string
  bento6Title: string
  bento6Desc: string
  demoKicker: string
  demoTitle: string
  demoCaption: string
  cliNote: string
  howKicker: string
  howTitle: string
  howStep1Title: string
  howStep1Desc: string
  howStep2Title: string
  howStep2Desc: string
  howStep3Title: string
  howStep3Desc: string
  cliGuideKicker: string
  cliGuideTitle: string
  cliGuideSub: string
  cliGuideStep1Title: string
  cliGuideStep1Note: string
  cliGuideStep2Title: string
  cliGuideStep2Note: string
  cliGuideStep3Title: string
  cliGuideStep3Note: string
  cliGuideSourceAlt: string
  agentTitle: string
  agentDesc: string
  agentPrompt: string
  agentHint: string
  personaKicker: string
  personaTitle: string
  personaA: string
  personaB: string
  personaC: string
  bottomTitleA: string
  bottomTitleSerif: string
  bottomTitleB: string
  bottomDesc: string
  bottomCtaA: string
  footerRights: string
  footerVersion: string
}

const platforms = 'YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo'

export const dict: Record<Lang, Dict> = {
  ko: {
    navTag: '캡처 · 전사 · 아카이브',
    heroKicker: 'CREATORS · RESEARCHERS · CURATORS',
    heroLine1: '링크는 썩어도,',
    heroLine2: '기록은',
    heroSerif: '남는다.',
    heroLead: 'Flucto는 흩어진 미디어를 한 번에 담고, 자막을 검색 가능한 Markdown으로 바꾼다. 데스크톱 앱과 fl CLI가 같은 엔진 — 수집부터 아카이브까지, 한 흐름으로.',
    heroNote: '로컬 우선 · 추적 없음 · yt-dlp / ffmpeg 자동 구성 · MIT 라이선스',
    ctaDownload: '무료로 받기',
    ctaGithub: 'GitHub에서 보기',
    ctaScroll: '아래로 스크롤',
    starCta: 'Star',
    starTip: 'GitHub에서 별을 누르면 개발에 큰 힘이 됩니다',
    statsStars: 'GitHub Stars',
    statsDownloads: '누적 다운로드',
    statsPlatforms: '지원 플랫폼',
    statsRelease: '최신 릴리스',
    statsFootnote: '다운로드 수는 모든 GitHub 릴리스 자산의 실제 집계값입니다 — 10분마다 갱신',
    manifestoKicker: 'WHY FLUCTO',
    manifesto1: '영상 링크는 계정이 사라지고, 시청 제한이 걸리고, 플랫폼이 사라지면 함께 증발한다.',
    manifesto1Accent: '당신의 시간은 자산이다.',
    manifesto2: 'Flucto는 자막을 문단과 타임스탬프가 살아있는 Markdown으로 바꿔, 검색하고 인용하고 다시 쓸 수 있는 지식으로 만든다.',
    manifesto2Accent: '그래서 기록은 남는다.',
    bentoKicker: 'CAPABILITIES',
    bentoTitle: '하나의 흐름, 여덟 개의 문',
    bento1Title: '8개 플랫폼, 하나의 앱',
    bento1Desc: 'YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo. 어댑터 구조라 새 플랫폼은 파일 하나로 추가된다.',
    bento2Title: '흩어지지 않는 큐',
    bento2Desc: 'URL 하나, 플레이리스트, .txt 목록, 채널 전체 — 수백 개도 bounded concurrency로 안정적으로.',
    bento3Title: '자막 → 검색되는 Markdown',
    bento3Desc: 'JSON3·XML·VTT 파싱, HTML 제거, 문단화, 타임스탬프. 자막이 없으면 없다고 정확히 말한다.',
    bento4Title: '프라이버시 첫 번째',
    bento4Desc: '전부 로컬 처리. 추적 없음, 클라우드 업로드 없음. 내 폴더에서 끝난다.',
    bento5Title: '데스크톱 + CLI, 같은 엔진',
    bento5Desc: 'Electron UI와 fl CLI가 같은 TypeScript 서비스 레이어를 공유한다. AI 에이전트·CI에 그대로 붙는다.',
    bento6Title: '30초 셋업',
    bento6Desc: 'fl s 한 줄로 yt-dlp·ffmpeg 자동 구성. 시스템 패키지 매니저는 건드리지 않는다.',
    demoKicker: 'SEE IT WORK',
    demoTitle: '채널 하나가 폴더 하나로',
    demoCaption: 'channel to-md · 타임스탬프 전용 폴더 · 노트는 즉시 검색 가능',
    cliNote: 'AI 에이전트·CI·배치를 위한 머신 친화 출력 — --json / --progress-json',
    howKicker: 'HOW IT WORKS',
    howTitle: '붙여넣고, 고르고, 모은다',
    howStep1Title: 'Paste',
    howStep1Desc: '링크, 리스트, 채널 핸들 — 붙여넣으면 미리보기와 포맷이 확인된다.',
    howStep2Title: 'Choose',
    howStep2Desc: 'MP4 · MP3 · MD(자막→Markdown) — 목적에 맞는 출력을 고른다.',
    howStep3Title: 'Collect',
    howStep3Desc: '영상은 Captures, 노트는 Notes — 작업 단위 폴더로 정리 완료.',
    cliGuideKicker: 'CLI ONLY',
    cliGuideTitle: '앱 없이, CLI만 설치해서 쓴다',
    cliGuideSub: '데스크톱 앱 없이 fl 한 줄이면 충분하다. Node.js 20+면 끝.',
    cliGuideStep1Title: '설치',
    cliGuideStep1Note: 'npm에서 전역 설치 (수 초)',
    cliGuideStep2Title: '점검',
    cliGuideStep2Note: 'yt-dlp 자동 구성 — 자막 작업만 할 거면 ffmpeg는 생략 가능',
    cliGuideStep3Title: '실행',
    cliGuideStep3Note: '자막 → Markdown. --json은 stdout, 진행률은 stderr',
    cliGuideSourceAlt: '소스 선호? git clone … && npm link',
    agentTitle: 'AI 에이전트에게 그냥 시켜라',
    agentDesc: 'Claude Code, Codex, Cursor에 이 프롬프트를 붙여넣어라. 머신 친화 출력(--json / --progress-json)이라 에이전트가 그대로 파싱한다.',
    agentPrompt: 'npm으로 Flucto CLI(fl)를 설치하고, 이 채널의 최근 영상 자막을 타임스탬프가 있는 Markdown 노트로 ./notes 폴더에 정리해줘: https://www.youtube.com/@handle',
    agentHint: '에이전트가 설치부터 정리까지 알아서 한다 — 사람은 결과만 읽는다',
    personaKicker: 'WHO IT IS FOR',
    personaTitle: '기록이 자산인 사람들',
    personaA: '<b>크리에이터</b> — 숏폼·릴스 소스를 보관하고 재편집 레퍼런스로',
    personaB: '<b>리서처</b> — 강의·인터뷰 자막을 검색 가능한 노트로',
    personaC: '<b>큐레이터</b> — 채널·리스트를 주제별 Markdown 아카이브로',
    bottomTitleA: '영상은 흐르고,',
    bottomTitleSerif: '자막은 자산이 된다',
    bottomTitleB: '',
    bottomDesc: '툴을 옮겨 다니지 마라. 한 번 담고, Markdown으로 남겨라. Flucto가 수집부터 아카이브까지의 마지막 변환을 맡는다.',
    bottomCtaA: '무료로 시작하기',
    footerRights: 'Independent project · MIT License',
    footerVersion: '최신 안정 버전',
  },
  en: {
    navTag: 'Capture · Transcript · Archive',
    heroKicker: 'CREATORS · RESEARCHERS · CURATORS',
    heroLine1: 'LINKS ROT.',
    heroLine2: 'ARCHIVES',
    heroSerif: 'don’t.',
    heroLead: 'Flucto captures scattered media in one flow and turns captions into searchable Markdown. The desktop app and the fl CLI share the same engine — from capture to archive.',
    heroNote: 'Local-first · No tracking · Auto yt-dlp / ffmpeg · MIT licensed',
    ctaDownload: 'Download free',
    ctaGithub: 'View on GitHub',
    ctaScroll: 'Scroll to explore',
    starCta: 'Star',
    starTip: 'A star on GitHub keeps this project alive',
    statsStars: 'GitHub Stars',
    statsDownloads: 'Total downloads',
    statsPlatforms: 'Platforms',
    statsRelease: 'Latest release',
    statsFootnote: 'Download counts are real aggregates across all GitHub release assets — refreshed every 10 minutes',
    manifestoKicker: 'WHY FLUCTO',
    manifesto1: 'Video links evaporate — accounts vanish, embeds break, platforms shut down and take your library with them.',
    manifesto1Accent: 'Your attention is an asset.',
    manifesto2: 'Flucto converts captions into Markdown with living paragraphs and timestamps — knowledge you can search, quote, and rewrite.',
    manifesto2Accent: 'That is what stays.',
    bentoKicker: 'CAPABILITIES',
    bentoTitle: 'One flow. Eight doors.',
    bento1Title: '8 platforms, one app',
    bento1Desc: 'YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo. Adapter architecture — a new platform is one file away.',
    bento2Title: 'A queue that never scatters',
    bento2Desc: 'One URL, a playlist, a .txt list, an entire channel — hundreds stay stable on bounded concurrency.',
    bento3Title: 'Captions → searchable Markdown',
    bento3Desc: 'JSON3·XML·VTT parsing, markup cleanup, paragraphing, timestamps. When captions are missing, it says so — no silent fallback.',
    bento4Title: 'Privacy, first',
    bento4Desc: 'Everything runs locally. No tracking, no cloud upload. It ends in your folders.',
    bento5Title: 'Desktop + CLI, one engine',
    bento5Desc: 'The Electron UI and fl CLI share the same TypeScript service layer — plug straight into agents and CI.',
    bento6Title: '30-second setup',
    bento6Desc: 'fl s provisions yt-dlp and ffmpeg automatically. No system package manager touched.',
    demoKicker: 'SEE IT WORK',
    demoTitle: 'A channel in, one folder out',
    demoCaption: 'channel to-md · dedicated timestamped folder · notes are instantly searchable',
    cliNote: 'Machine-friendly output for AI agents, CI, and batch jobs — --json / --progress-json',
    howKicker: 'HOW IT WORKS',
    howTitle: 'Paste. Choose. Collect.',
    howStep1Title: 'Paste',
    howStep1Desc: 'A link, a list, or a channel handle — paste to preview and verify formats.',
    howStep2Title: 'Choose',
    howStep2Desc: 'MP4 · MP3 · MD (captions → Markdown) — pick the output the job needs.',
    howStep3Title: 'Collect',
    howStep3Desc: 'Videos land in Captures, notes in Notes — every job in its own tidy folder.',
    cliGuideKicker: 'CLI ONLY',
    cliGuideTitle: 'No app. Just the CLI.',
    cliGuideSub: 'One fl command is enough — no desktop app required. Node.js 20+ and you are done.',
    cliGuideStep1Title: 'Install',
    cliGuideStep1Note: 'One global npm install (seconds)',
    cliGuideStep2Title: 'Verify',
    cliGuideStep2Note: 'yt-dlp is provisioned automatically — skip ffmpeg if you only transcribe',
    cliGuideStep3Title: 'Run',
    cliGuideStep3Note: 'Captions → Markdown. --json on stdout, progress on stderr',
    cliGuideSourceAlt: 'Prefer source? git clone … && npm link',
    agentTitle: 'Just tell your AI agent.',
    agentDesc: 'Paste this prompt into Claude Code, Codex, or Cursor. Machine-friendly output (--json / --progress-json) parses as-is.',
    agentPrompt: 'Install the Flucto CLI (fl) via npm, then turn this channel\'s recent captions into timestamped Markdown notes in ./notes: https://www.youtube.com/@handle',
    agentHint: 'The agent handles everything from install to the final notes — you just read the result',
    personaKicker: 'WHO IT IS FOR',
    personaTitle: 'People whose records are assets',
    personaA: '<b>Creators</b> — archive Shorts/Reels sources as re-edit references',
    personaB: '<b>Researchers</b> — turn lecture & interview captions into searchable notes',
    personaC: '<b>Curators</b> — channels & playlists into topic-based Markdown archives',
    bottomTitleA: 'Video flows.',
    bottomTitleSerif: 'Captions compound.',
    bottomTitleB: '',
    bottomDesc: 'Stop switching tools. Capture once, keep clean Markdown — Flucto owns the last transform from collection to archive.',
    bottomCtaA: 'Start free',
    footerRights: 'Independent project · MIT License',
    footerVersion: 'Latest stable',
  },
}

export const marqueePlatforms = ['YouTube', 'X', 'Reddit', 'Bilibili', 'Instagram', 'Threads', 'TikTok', 'Vimeo', platforms]
