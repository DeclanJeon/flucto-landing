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
  navDemos: string
  navInstall: string
  navDocs: string
  starCta: string
  starTip: string
  ctaDownload: string
  ctaGithub: string
  heroKicker: string
  heroTitle: string
  heroTitleAccent: string
  heroLead: string
  heroMediaLabel: string
  heroMediaCaption: string
  heroTrustLocal: string
  heroTrustEngine: string
  heroTrustOs: string
  heroTrustLicense: string
  marqueeLabel: string
  galleryKicker: string
  galleryTitle: string
  galleryLead: string
  filterAll: string
  filterDesktop: string
  filterCli: string
  capLabels: Record<string, string>
  playDemo: string
  gifFallback: string
  demoFootnote: string
  installKicker: string
  installTitle: string
  installLead: string
  installWindows: string
  installWindowsNote: string
  installMac: string
  installMacNote: string
  installLinux: string
  installLinuxNote: string
  installCli: string
  installCliNote: string
  installChecksums: string
  installAllReleases: string
  installCliStepsTitle: string
  installCliStep1: string
  installCliStep2: string
  installCliStep3: string
  installCliNote2: string
  agentTitle: string
  agentDesc: string
  agentPrompt: string
  agentHint: string
  copyLabel: string
  copiedLabel: string
  copyFailedLabel: string
  limitsKicker: string
  limitsTitle: string
  limits: { q: string; a: string }[]
  statsStars: string
  statsDownloads: string
  statsRelease: string
  statsFootnote: string
  bottomTitle: string
  bottomTitleAccent: string
  bottomDesc: string
  bottomCta: string
  footerRights: string
  footerVersion: string
}

const platforms = [
  'YouTube', 'X', 'Reddit', 'Bilibili', 'Dailymotion', 'Niconico',
  'OK.ru', 'VK Video', 'Instagram', 'Threads', 'TikTok', 'Vimeo',
]

export const dict: Record<Lang, Dict> = {
  ko: {
    navTag: 'AI 영상 제작을 위한 레퍼런스 준비',
    navDemos: '데모',
    navInstall: '설치',
    navDocs: 'Docs',
    starCta: 'Star',
    starTip: 'GitHub에서 별을 누르면 개발에 큰 힘이 됩니다',
    ctaDownload: '무료로 받기',
    ctaGithub: 'GitHub에서 보기',
    heroKicker: 'AI 영상 크리에이터를 위한 레퍼런스 워크스테이션',
    heroTitle: '레퍼런스.',
    heroTitleAccent: '프로덕션 준비 완료.',
    heroLead:
      '프롬프트를 쓰기 전에 필요한 소스부터 준비한다. 12개 등록 사이트를 검색하고, 허용된 영상을 MP4·MP3로 저장하고, 제공되는 자막을 타임스탬프가 있는 Markdown 노트로 정리한다. 데스크톱 앱과 fl CLI가 같은 엔진을 쓴다.',
    heroMediaLabel: '실제 데스크톱 앱 — 레퍼런스 검색과 큐',
    heroMediaCaption: 'v1.18.0의 실제 UI에서 녹화. 목업이나 재구성 화면이 아니다.',
    heroTrustLocal: '미디어 파일은 로컬에 저장',
    heroTrustEngine: 'yt-dlp + ffmpeg 자동 구성',
    heroTrustOs: 'Windows · macOS · Linux',
    heroTrustLicense: 'GitHub 공개 소스',
    marqueeLabel: '검색에 등록된 12개 사이트',
    galleryKicker: '기능 데모',
    galleryTitle: '전부 실제 화면. 전부 눌러서 재생.',
    galleryLead:
      '실제 앱과 CLI를 녹화한 열두 개의 짧은 클립. 각 캡션은 화면에서 벌어지는 입력과 결과를 설명한다 — 대본이 아니라 기록이다.',
    filterAll: '전체',
    filterDesktop: '데스크톱',
    filterCli: 'CLI',
    capLabels: {
      capture: '캡처',
      audio: '오디오',
      search: '검색',
      batch: '배치',
      notes: 'Markdown 노트',
      manage: '관리',
    },
    playDemo: '클립 재생',
    gifFallback: 'GIF로 받기',
    demoFootnote:
      '다운로드·추출 데모는 직접 만든 영상과 자막을 사용한다. 검색·플레이리스트는 공개 메타데이터를 보여준다. 대기 구간은 일부 편집했으며 재생 시간은 성능 측정이 아니다. 사이트별 접근·로그인·자막 유무는 다르며, 이용 권한은 직접 확인해야 한다.',
    installKicker: '설치',
    installTitle: '네 가지 방법. 하나의 엔진.',
    installLead:
      '최신 릴리스에서 인스톨러를 고른다. 모든 자산은 GitHub Releases에서 SHA256 체크섬과 함께 배포된다.',
    installWindows: 'Windows 데스크톱',
    installWindowsNote: 'x64 NSIS 인스톨러. 앱 내 자동 업데이트 포함.',
    installMac: 'macOS 데스크톱',
    installMacNote:
      'Intel + Apple Silicon 유니버설 DMG. 미서명 앱 — 첫 실행 때 개인정보 보호 및 보안에서 승인이 필요할 수 있다. 업데이트는 검증된 DMG를 받아 직접 교체.',
    installLinux: 'Linux 데스크톱',
    installLinuxNote: 'x86_64 AppImage. FUSE가 없으면 --appimage-extract-and-run으로 실행.',
    installCli: 'CLI — Windows · macOS · Linux',
    installCliNote:
      'flucto / fl 명령. 압축을 풀고 install.cmd(Windows) 또는 bash install.sh(macOS/Linux) 실행 — Node.js나 관리자 권한이 필요 없다. 부트스트랩이 비공개 Node.js 24 런타임을 다운로드하고 SHA256을 검증한 뒤 비공개 접두사에 yt-dlp/FFmpeg를 설치한다.',
    installChecksums: 'checksums-sha256.txt',
    installAllReleases: '모든 릴리스 보기',
    installCliStepsTitle: 'CLI는 세 단계',
    installCliStep1: 'ZIP을 다운로드하고 쓰기 가능한 폴더에 압축 해제',
    installCliStep2: 'install.cmd / bash install.sh — 비공개 Node·yt-dlp·ffmpeg 설치, PATH에 등록',
    installCliStep3: '새 셸을 열고 flucto doctor --json으로 점검',
    installCliNote2:
      'PowerShell은 fl을 Format-List로 예약한다 — PowerShell에서는 flucto 또는 fl.cmd를 쓰고, cmd.exe나 POSIX 셸에서는 fl이 그대로 동작한다. 격리 설치는 install.ps1 -InstallDir DIR -NoProfile 또는 install.sh --install-dir DIR --no-profile.',
    agentTitle: 'AI 에이전트에게 그냥 시켜라',
    agentDesc:
      '결과 JSON은 stdout, 진행 이벤트는 stderr의 NDJSON — Claude Code, Codex, Cursor가 그대로 파싱한다.',
    agentPrompt:
      'Flucto CLI를 GitHub 릴리스의 cli-setup.zip으로 설치하고(자체 Node 런타임 포함), 이 채널의 최근 영상 자막을 타임스탬프가 있는 Markdown 노트로 ./notes 폴더에 정리해줘: https://www.youtube.com/@handle',
    agentHint: '에이전트가 설치부터 정리까지 한다 — 당신은 결과 노트만 읽는다',
    copyLabel: '복사',
    copiedLabel: '복사됨',
    copyFailedLabel: '복사 불가 — 수동 선택',
    limitsKicker: '솔직한 경계',
    limitsTitle: 'Flucto가 하지 않는 것',
    limits: [
      {
        q: '영상 생성이나 편집은 하지 않는다',
        a: 'Flucto는 AI 영상 파이프라인의 준비 단계다: 레퍼런스 수집, 오디오 추출, 자막 노트. 렌더링, 업스케일, 편집은 당신의 도구가 한다.',
      },
      {
        q: '자막은 있는 것만',
        a: 'Markdown 변환은 자막 기반이다. yt-dlp가 자막을 제공하지 않으면 Flucto는 없다고 보고한다 — Whisper 같은 음성인식 폴백은 없다. fl l로 언어 목록을 먼저 확인할 수 있다.',
      },
      {
        q: '모든 영상의 다운로드를 보장하지 않는다',
        a: '검색 가능한 영상도 삭제·비공개·DRM·지역 제한이면 다운로드는 실패한다. 본인의 승인된 세션이 필요한 자료는 --cookies 또는 --cookies-from-browser를 쓴다. CAPTCHA 우회나 지역 제한 우회는 하지 않는다.',
      },
      {
        q: '검색은 로컬 Chrome이 필요한 경우가 있다',
        a: 'X·Instagram·TikTok·Vimeo 검색, OK.ru·Threads 브라우저 검색과 공개 인덱스 검색 경로는 로컬 Google Chrome(또는 FLUCTO_CHROME_PATH)이 필요하다. 다른 사이트도 Chrome 기반 폴백을 쓸 수 있다. 컨텍스트는 임시·익명이며 로그인 프로필을 읽지 않는다.',
      },
      {
        q: '인터넷이 필요하다',
        a: '다운로드·자막·검색·바이너리 프로비저닝·업데이트 확인은 모두 네트워크 요청이다. 처리 결과는 로컬 폴더에 남는다.',
      },
      {
        q: '권한은 당신의 책임',
        a: 'Flucto는 도구다. 저장한 콘텐츠의 라이선스·저작권·플랫폼 약관 준수는 사용자가 확인해야 한다.',
      },
    ],
    statsStars: 'GitHub Stars',
    statsDownloads: '누적 다운로드',
    statsRelease: '최신 릴리스',
    statsFootnote:
      '스타·다운로드 수는 GitHub API의 릴리스 자산 집계이며 10분 동안 캐시한다. 저장소 통계일 뿐, 사용자 수·작업 속도·제작 성과를 뜻하지 않는다.',
    bottomTitle: '먼저 모으고,',
    bottomTitleAccent: '그다음 만든다.',
    bottomDesc:
      '레퍼런스 영상을 저장하고, 오디오 트랙을 추출하고, 자막 노트를 소스 곁에 남긴다. 데스크톱에서는 저장 폴더를 고르고, CLI에서는 전용 작업 폴더를 만든 뒤 생성 도구로 넘어간다.',
    bottomCta: '무료로 받기',
    footerRights: 'Independent project · Source on GitHub',
    footerVersion: '최신 안정 버전',
  },
  en: {
    navTag: 'Reference prep for AI video work',
    navDemos: 'Demos',
    navInstall: 'Install',
    navDocs: 'Docs',
    starCta: 'Star',
    starTip: 'A star on GitHub keeps this project alive',
    ctaDownload: 'Download free',
    ctaGithub: 'View on GitHub',
    heroKicker: 'A REFERENCE WORKSTATION FOR AI VIDEO CREATORS',
    heroTitle: 'Your references.',
    heroTitleAccent: 'Ready for production.',
    heroLead:
      'Prepare the source before the prompt. Search 12 registered sites, save permitted video as MP4 or MP3, and turn available captions into timestamped Markdown notes. The desktop app and fl CLI share one engine.',
    heroMediaLabel: 'Actual desktop app — reference search & queue',
    heroMediaCaption: 'Recorded on the real v1.18.0 UI. Not a mockup, not a render.',
    heroTrustLocal: 'Media files save locally',
    heroTrustEngine: 'Auto-managed yt-dlp + ffmpeg',
    heroTrustOs: 'Windows · macOS · Linux',
    heroTrustLicense: 'Source on GitHub',
    marqueeLabel: '12 registered search sites',
    galleryKicker: 'FEATURE DEMOS',
    galleryTitle: 'Real screens. Press play.',
    galleryLead:
      'Twelve short clips recorded on the actual app and CLI. Each caption describes the inputs and results you will see — a record, not a script.',
    filterAll: 'All',
    filterDesktop: 'Desktop',
    filterCli: 'CLI',
    capLabels: {
      capture: 'Capture',
      audio: 'Audio',
      search: 'Search',
      batch: 'Batch',
      notes: 'Markdown notes',
      manage: 'Manage',
    },
    playDemo: 'Play clip',
    gifFallback: 'Download GIF',
    demoFootnote:
      'Download/extraction demos use original media and authored captions; search/playlist clips show public metadata. Some waits are edited out, so playback is not a speed benchmark. Site access, sessions and captions vary. Check rights before saving media.',
    installKicker: 'INSTALL',
    installTitle: 'Four ways in. One engine.',
    installLead:
      'Pick an installer from the latest release. Every asset ships on GitHub Releases with SHA256 checksums.',
    installWindows: 'Windows desktop',
    installWindowsNote: 'x64 NSIS installer. In-app auto-updates included.',
    installMac: 'macOS desktop',
    installMacNote:
      'Universal DMG for Intel + Apple Silicon. Unsigned — you may need to approve it in Privacy & Security on first run. Updates download a verified DMG for manual replacement.',
    installLinux: 'Linux desktop',
    installLinuxNote: 'x86_64 AppImage. No FUSE? Run with --appimage-extract-and-run.',
    installCli: 'CLI — Windows · macOS · Linux',
    installCliNote:
      'flucto / fl commands. Extract and run install.cmd (Windows) or bash install.sh (macOS/Linux) — no existing Node.js and no admin rights needed. The bootstrap downloads a private Node.js 24 runtime, verifies its SHA256, and provisions yt-dlp/FFmpeg under a private prefix.',
    installChecksums: 'checksums-sha256.txt',
    installAllReleases: 'Browse all releases',
    installCliStepsTitle: 'The CLI in three steps',
    installCliStep1: 'Download the ZIP and extract it into a writable folder',
    installCliStep2: 'Run install.cmd / bash install.sh — private Node, yt-dlp and ffmpeg, PATH registered',
    installCliStep3: 'Open a new shell and verify with flucto doctor --json',
    installCliNote2:
      'PowerShell reserves fl for Format-List — use flucto or fl.cmd there; fl works in cmd.exe and POSIX shells. For an isolated install: install.ps1 -InstallDir DIR -NoProfile, or install.sh --install-dir DIR --no-profile.',
    agentTitle: 'Just tell your AI agent.',
    agentDesc:
      'Result JSON lands on stdout, progress events stream as NDJSON on stderr — Claude Code, Codex, and Cursor parse it as-is.',
    agentPrompt:
      'Install the Flucto CLI from the GitHub release cli-setup.zip (it brings its own Node runtime), then turn this channel\'s recent captions into timestamped Markdown notes in ./notes: https://www.youtube.com/@handle',
    agentHint: 'The agent handles install through the final notes — you just read them',
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    copyFailedLabel: 'Copy unavailable — select manually',
    limitsKicker: 'HONEST EDGES',
    limitsTitle: 'What Flucto does not do',
    limits: [
      {
        q: 'It does not generate or edit video',
        a: 'Flucto is the preparation stage of an AI video pipeline: reference capture, audio extraction, caption notes. Rendering, upscaling, and editing stay in your other tools.',
      },
      {
        q: 'Captions only exist when they exist',
        a: 'Markdown conversion is caption-based. If yt-dlp exposes no captions, Flucto reports the transcript unavailable — no Whisper or speech-to-text fallback. Check first with fl l.',
      },
      {
        q: 'It cannot promise every video downloads',
        a: 'A searchable video can still be deleted, private, DRM-protected, or region-locked at download time. Media that needs your own authorized session uses --cookies or --cookies-from-browser. No CAPTCHA solving, no regional bypass.',
      },
      {
        q: 'Some searches need local Chrome',
        a: 'Search on X, Instagram, TikTok, and Vimeo, browser search on OK.ru and Threads, and public-index paths need local Google Chrome (or FLUCTO_CHROME_PATH). Other sites may use Chrome-based fallbacks. Contexts are temporary and anonymous; your logged-in profile is not read.',
      },
      {
        q: 'It needs the internet',
        a: 'Downloads, captions, search, binary provisioning, and update checks all make network requests. The results stay in your local folders.',
      },
      {
        q: 'Rights are yours to clear',
        a: 'Flucto is a tool. Licensing, copyright, and platform terms for anything you save remain your responsibility to check.',
      },
    ],
    statsStars: 'GitHub Stars',
    statsDownloads: 'Total downloads',
    statsRelease: 'Latest release',
    statsFootnote:
      'Stars and downloads come from the GitHub API (release asset counts summed and cached for 10 minutes). They are repository statistics, not a claim about users, speed or creator outcomes.',
    bottomTitle: 'Collect first.',
    bottomTitleAccent: 'Then create.',
    bottomDesc:
      'Save reference video, extract an audio track, and keep caption notes beside your sources. Choose a desktop output folder or use the CLI to create dedicated job folders before your generation tools take over.',
    bottomCta: 'Download free',
    footerRights: 'Independent project · Source on GitHub',
    footerVersion: 'Latest stable',
  },
}

export const marqueePlatforms = [...platforms, platforms.join(' · ')]
