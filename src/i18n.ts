export type Lang = 'ko' | 'en'

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'ko'
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  const primary = (langs[0] || '').toLowerCase()
  // ko, ko-KR, ko-KP -> ko; everything else -> en
  if (primary === 'ko' || primary.startsWith('ko-')) return 'ko'
  return 'en'
}

type Dict = {
  headerTag: string
  heroBadge: string
  heroTitleA: string
  heroTitleB: string
  heroLeadA: string
  heroLeadB: string
  heroNote: string
  ctaDownload: string
  ctaGithub: string
  ctaHow: string
  stat1: string
  quickTitle: string
  quickDesc: string
  inputPlaceholder: string
  modeCaptionMd: string
  modeMp3: string
  modeMp4: string
  featureUniversalTitle: string
  featureUniversalDesc: string
  featureBatchTitle: string
  featureBatchDesc: string
  featureTranscriptTitle: string
  featureTranscriptDesc: string
  howBadge: string
  howTitle: string
  howStep1Title: string
  howStep1Desc: string
  howStep2Title: string
  howStep2Desc: string
  howStep3Title: string
  howStep3Desc: string
  demoFxA: string
  demoFxB: string
  personaTitle: string
  personaA: string
  personaB: string
  personaC: string
  trust1Title: string
  trust1Desc: string
  trust2Title: string
  trust2Desc: string
  trust3Title: string
  trust3Desc: string
  cliTitle: string
  cliNote: string
  cliHint: string
  previewTitle: string
  previewHint: string
  previewEmpty: string
  previewQueued: string
  bottomTitle: string
  bottomDesc: string
  bottomCtaA: string
  bottomCtaB: string
}

export const dict: Record<Lang, Dict> = {
  ko: {
    headerTag: 'Capture · Transcript · Archive',
    heroBadge: 'FOR CREATORS · RESEARCHERS · CURATORS',
    heroTitleA: '링크는 흩어지고,',
    heroTitleB: '기록은 남아야 한다.',
    heroLeadA: 'Flucto는 YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo에서 미디어를 한 번에 받고, 가능한 자막을 타임스탬프가 있는 깔끔한 Markdown으로 바꿔준다.',
    heroLeadB: '데스크톱 앱과 fl CLI가 같은 엔진으로 동작하고, 자막이 없으면 “unavailable”로 정확히 알린다.',
    heroNote: '수백 개 URL도 큐로 쌓이고, 채널 전체도 폴더 하나로 정리된다. 로컬 우선 · 추적 없음 · yt-dlp / ffmpeg 자동 설치.',
    ctaDownload: 'Free download',
    ctaGithub: 'View on GitHub',
    ctaHow: 'How it works',
    stat1: 'Open source · MIT · ★ 5',
    quickTitle: 'Start in 30 seconds',
    quickDesc: '설치 후 fl doc -j 로 점검, fl s -j 로 바이너리 자동 설치',
    inputPlaceholder: 'Paste any link — YouTube, X, Reddit, Bilibili, Instagram…',
    modeCaptionMd: 'Captions → searchable Markdown',
    modeMp3: 'Audio extraction',
    modeMp4: 'Full video',
    featureUniversalTitle: 'One app for 8 platforms',
    featureUniversalDesc: 'YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo. PlatformAdapter 플러그인 — 새 플랫폼은 파일 하나로 추가.',
    featureBatchTitle: 'Queue that never scatters',
    featureBatchDesc: '단일 URL, 플레이리스트, .txt 리스트, 채널 전체까지 큐로. Bounded concurrency로 수백 개도 안정적.',
    featureTranscriptTitle: 'Caption → Markdown you can search',
    featureTranscriptDesc: 'JSON3/XML/VTT 파싱, 마크업 제거, 문단화, 언어 선택(en/auto), 타임스탬프·메타데이터 포함. 없으면 없다고 알린다.',
    howBadge: 'HOW IT WORKS',
    howTitle: '복사 · 선택 · 정리 — 세 단계로 끝',
    howStep1Title: 'Paste',
    howStep1Desc: '링크 하나, 리스트, 채널 핸들 — 붙여넣으면 미리보기와 포맷을 확인한다.',
    howStep2Title: 'Choose',
    howStep2Desc: 'MP4(영상) · MP3(오디오) · MD(자막→Markdown) 중 목적을 고른다.',
    howStep3Title: 'Collect',
    howStep3Desc: '다운로드는 Captures, 노트는 Notes — 작업 단위 전용 폴더로 깔끔히 정리된다.',
    demoFxA: '채널:',
    demoFxB: '배치:',
    personaTitle: '누가 쓰나',
    personaA: '<b>크리에이터</b> — 숏폼·릴스 소스 보관과 재편집 레퍼런스',
    personaB: '<b>리서처</b> — 강의·인터뷰 자막을 검색 가능한 노트로',
    personaC: '<b>큐레이터</b> — 채널/리스트를 주제별 Markdown 아카이브로',
    trust1Title: 'Privacy first',
    trust1Desc: '로컬 처리 · 추적 없음 · 썸네일 프록시. 클라우드 업로드 없이 내 폴더에서 끝난다.',
    trust2Title: 'Desktop + CLI same engine',
    trust2Desc: 'Electron UI와 fl/flucto CLI가 같은 TypeScript 서비스 레이어. 자동화에 바로 붙는다.',
    trust3Title: 'Zero-config setup',
    trust3Desc: 'fl s 로 yt-dlp/ffmpeg 자동 구성. 시스템 패키지 매니저를 건드리지 않는다.',
    cliTitle: 'CLI — 창 없이 흐르는 워크플로우',
    cliNote: 'AI 에이전트·CI·배치에 그대로 붙는 머신 친화 출력',
    cliHint: '--json stdout 최종 객체 · --progress-json stderr NDJSON · 다중 파일은 항상 전용 하위 폴더 생성',
    previewTitle: 'Try it — landing preview',
    previewHint: 'URL을 넣고 Enter',
    previewEmpty: '위 입력창에 URL을 넣고 Enter — 실제 앱의 MainDownloader 카드와 같은 흐름으로 쌓인다.',
    previewQueued: 'Queued · will resolve via yt-dlp in app',
    bottomTitle: '영상은 흐름, 자막은 자산',
    bottomDesc: '툴을 옮겨 다니지 말고, 한 흐름에서 받고 바로 Markdown으로 정리하라. Flucto는 수집부터 아카이브까지의 마지막 변환을 맡는다.',
    bottomCtaA: 'Download free',
    bottomCtaB: 'Star on GitHub',
  },
  en: {
    headerTag: 'Capture · Transcript · Archive',
    heroBadge: 'FOR CREATORS · RESEARCHERS · CURATORS',
    heroTitleA: 'Links scatter.',
    heroTitleB: 'Knowledge should stay.',
    heroLeadA: 'Flucto captures media from YouTube, X, Reddit, Bilibili, Instagram, Threads, TikTok, and Vimeo — and turns available captions into clean, timestamped Markdown.',
    heroLeadB: 'The desktop app and the fl CLI share the same engine. If captions are missing, it says unavailable — no silent fallback.',
    heroNote: 'Hundreds of URLs queue reliably; a whole channel lands in one job folder. Local-first · No tracking · Auto yt-dlp / ffmpeg.',
    ctaDownload: 'Free download',
    ctaGithub: 'View on GitHub',
    ctaHow: 'How it works',
    stat1: 'Open source · MIT · ★ 5',
    quickTitle: 'Start in 30 seconds',
    quickDesc: 'After install, verify with fl doc -j, then set up binaries with fl s -j',
    inputPlaceholder: 'Paste any link — YouTube, X, Reddit, Bilibili, Instagram…',
    modeCaptionMd: 'Captions → searchable Markdown',
    modeMp3: 'Audio extraction',
    modeMp4: 'Full video',
    featureUniversalTitle: 'One app for 8 platforms',
    featureUniversalDesc: 'YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo. PlatformAdapter plugin — add a platform with one file.',
    featureBatchTitle: 'A queue that never scatters',
    featureBatchDesc: 'Single URL, playlist, .txt lists, or an entire channel — all queued. Bounded concurrency keeps hundreds stable.',
    featureTranscriptTitle: 'Caption → Markdown you can search',
    featureTranscriptDesc: 'JSON3/XML/VTT parsing, markup cleanup, paragraph grouping, language pick (en/auto), timestamps & metadata. Honest when unavailable.',
    howBadge: 'HOW IT WORKS',
    howTitle: 'Paste · Choose · Collect — three steps',
    howStep1Title: 'Paste',
    howStep1Desc: 'A single link, a list, or a channel handle — paste to preview and verify formats.',
    howStep2Title: 'Choose',
    howStep2Desc: 'Pick MP4 (video), MP3 (audio), or MD (captions → Markdown) for the job.',
    howStep3Title: 'Collect',
    howStep3Desc: 'Videos go to Captures, notes to Notes — each job in its own tidy folder.',
    demoFxA: 'Channel:',
    demoFxB: 'Batch:',
    personaTitle: 'Who uses it',
    personaA: '<b>Creators</b> — archive Shorts/Reels sources and reference for re-edits',
    personaB: '<b>Researchers</b> — turn lecture & interview captions into searchable notes',
    personaC: '<b>Curators</b> — channel/playlists into topic-based Markdown archives',
    trust1Title: 'Privacy first',
    trust1Desc: 'Local processing · No tracking · Proxied thumbnails. No cloud upload — it stays in your folders.',
    trust2Title: 'Desktop + CLI same engine',
    trust2Desc: 'Electron UI and fl/flucto CLI share the same TypeScript service layer — plug straight into automation.',
    trust3Title: 'Zero-config setup',
    trust3Desc: 'fl s configures yt-dlp/ffmpeg automatically. No system package manager touched.',
    cliTitle: 'CLI — flow without a window',
    cliNote: 'Machine-friendly output for AI agents, CI, and batch jobs',
    cliHint: '--json emits the final object to stdout · --progress-json streams NDJSON to stderr · multi-file jobs always create a dedicated subfolder',
    previewTitle: 'Try it — landing preview',
    previewHint: 'Paste a URL and press Enter',
    previewEmpty: 'Paste a URL above and press Enter — it stacks just like the MainDownloader cards in the real app.',
    previewQueued: 'Queued · will resolve via yt-dlp in app',
    bottomTitle: 'Video flows. Captions compound.',
    bottomDesc: 'Stop switching tools. Capture once, collect clean Markdown — Flucto owns the last transform from collection to archive.',
    bottomCtaA: 'Download free',
    bottomCtaB: 'Star on GitHub',
  },
}
