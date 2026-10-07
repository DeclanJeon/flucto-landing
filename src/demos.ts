/**
 * Canonical demo catalog. Every entry maps to real captured media under
 * `public/demos/` (mirrored into the product repo at `assets/demo/features/`):
 *
 *   video  — /demos/<id>.mp4   (click-to-play, native controls)
 *   poster — /demos/<id>.png   (lazy-loaded still)
 *   gif    — /demos/<id>.gif   (downloadable fallback)
 *
 * Captions describe the actual action and result recorded on screen — they are
 * written to match what the capture shows, not aspirational features.
 */

export type DemoKind = 'desktop' | 'cli'

export interface DemoDef {
  /** Stable media id — also the filename stem under /demos/. */
  id: string
  kind: DemoKind
  /** Filterable capability grouping. */
  caps: readonly string[]
  /** Representative command for CLI clips (shown mono under the title). */
  cmd?: string
  en: { title: string; caption: string }
  ko: { title: string; caption: string }
}

export const demoMedia = (id: string) => ({
  video: `/demos/${id}.mp4`,
  poster: `/demos/${id}.png`,
  gif: `/demos/${id}.gif`,
})

export const DEMOS: readonly DemoDef[] = [
  {
    id: '01-video-download',
    kind: 'desktop',
    caps: ['capture'],
    en: {
      title: 'Video URL → MP4',
      caption: 'Paste a video link, preview the metadata, pick MP4 — the file lands in the job folder.',
    },
    ko: {
      title: '영상 URL → MP4',
      caption: '링크를 붙여넣고, 메타데이터를 확인하고, MP4를 고른다 — 파일이 작업 폴더에 저장된다.',
    },
  },
  {
    id: '02-audio-extraction',
    kind: 'desktop',
    caps: ['audio'],
    en: {
      title: 'Audio extraction → MP3',
      caption: 'Same paste flow with MP3 output — reference audio and timing tracks without the video payload.',
    },
    ko: {
      title: '오디오 추출 → MP3',
      caption: '같은 흐름에서 MP3 출력 — 영상 없이 레퍼런스 오디오와 타이밍 트랙만 남긴다.',
    },
  },
  {
    id: '03-search-and-queue',
    kind: 'desktop',
    caps: ['search'],
    en: {
      title: 'Search → queue',
      caption: 'Real YouTube search → Add → grid/list queue views, followed by an integrated search across 12 registered sources. Native/index attribution and blocked sources remain visible.',
    },
    ko: {
      title: '검색 → 큐',
      caption: '실제 YouTube 검색 → 추가 → 그리드/목록 큐를 보여준 뒤, 등록된 12개 출처를 통합 검색한다. native/index 구분과 차단된 출처도 그대로 표시한다.',
    },
  },
  {
    id: '04-batch-and-playlist',
    kind: 'desktop',
    caps: ['capture', 'batch'],
    en: {
      title: 'Batch & playlist queues',
      caption: 'Import a real .txt list, download two original clips to the selected folder, then expand an official Blender Studio playlist and remove a queue item. The playlist segment shows metadata only.',
    },
    ko: {
      title: '배치 · 플레이리스트 큐',
      caption: '실제 .txt 목록에서 직접 만든 두 영상을 선택한 폴더에 저장한 뒤, 공식 Blender Studio 플레이리스트를 펼치고 큐 항목을 삭제한다. 플레이리스트 구간은 메타데이터만 보여준다.',
    },
  },
  {
    id: '05-captions-to-markdown',
    kind: 'desktop',
    caps: ['notes'],
    en: {
      title: 'Captions → Markdown',
      caption: 'The transcript panel: caption language, metadata and timestamp toggles, Save .md / Copy-to-clipboard checkboxes — then a completion status with the real file path. No captions means an explicit unavailable result, never silent speech-to-text.',
    },
    ko: {
      title: '자막 → Markdown',
      caption: '전사 패널: 자막 언어·메타데이터·타임스탬프 토글과 Save .md / 클립보드 복사 체크박스 — 완료되면 실제 파일 경로가 표시된다. 자막이 없으면 없다고 표시한다 — 음성인식 대체 없음.',
    },
  },
  {
    id: '06-settings-and-history',
    kind: 'desktop',
    caps: ['manage'],
    en: {
      title: 'Settings & history',
      caption: 'Select an output folder, change quality and notification preferences, run an individual download and clear the isolated history. Then exercise real video/audio format-ID selectors on HLS sources and save an MP4.',
    },
    ko: {
      title: '설정 & 히스토리',
      caption: '저장 폴더·품질·알림을 설정하고 개별 다운로드 후 촬영용 이력만 비운다. 이어 HLS 소스에서 실제 영상/오디오 포맷 ID 선택자를 실행하고 MP4를 저장한다.',
    },
  },
  {
    id: '07-update-center',
    kind: 'desktop',
    caps: ['manage'],
    en: {
      title: 'Update center',
      caption: 'The published Windows v1.18.0 app checks the live release, confirms it is current, saves a check interval, and checks yt-dlp/FFmpeg status. No available update is fabricated; unsigned macOS updates use a verified DMG.',
    },
    ko: {
      title: '업데이트 센터',
      caption: '공개된 Windows v1.18.0 앱이 실제 릴리스를 조회해 최신 상태를 확인하고, 확인 주기를 저장하고, yt-dlp/FFmpeg 상태를 점검한다. 새 업데이트를 꾸며내지 않는다. 미서명 macOS 업데이트는 검증된 DMG를 사용한다.',
    },
  },
  {
    id: '08-cli-inspect',
    kind: 'cli',
    caps: ['capture'],
    cmd: 'flucto info · search · languages · formats',
    en: {
      title: 'Inspect before download',
      caption: 'Metadata, formats, caption languages and real keyword search — inspect sources before downloading.',
    },
    ko: {
      title: '다운로드 전 점검',
      caption: '메타데이터·포맷·자막 언어와 실제 키워드 검색 — 다운로드 전에 출처를 점검한다.',
    },
  },
  {
    id: '09-cli-batch-json',
    kind: 'cli',
    caps: ['batch'],
    cmd: 'flucto download · batch urls.txt -f mp3 -c 2 -p -j',
    en: {
      title: 'fl batch --json',
      caption: 'A URL list becomes a timestamped job folder. Result JSON on stdout, progress NDJSON on stderr, and two real MP3 extractions — agent- and CI-parseable.',
    },
    ko: {
      title: 'fl batch --json',
      caption: 'URL 목록이 타임스탬프 작업 폴더가 된다. 결과 JSON은 stdout, 진행 NDJSON은 stderr, 실제 MP3 두 개 — 에이전트·CI에서 바로 파싱.',
    },
  },
  {
    id: '10-cli-media-markdown',
    kind: 'cli',
    caps: ['notes'],
    cmd: 'flucto md <url> -l ko --stdout · -l en -o notes',
    en: {
      title: 'fl transcript / md',
      caption: 'Captions → frontmatter Markdown in Korean on stdout, then saved English notes. The clip shows the generated file name — real output, piped or written by --stdout/-o.',
    },
    ko: {
      title: 'fl transcript / md',
      caption: '자막 → stdout의 한국어 프론트매터 Markdown, 이어 저장되는 영문 노트. 클립에 생성 파일명이 보인다 — --stdout/-o가 만든 실제 출력.',
    },
  },
  {
    id: '11-cli-channel-archive',
    kind: 'cli',
    caps: ['notes', 'batch'],
    cmd: 'flucto channel to-md "@BlenderOfficial" --limit 2 -o notes',
    en: {
      title: 'fl channel to-md',
      caption: 'A real YouTube channel resolves to a dedicated Blender-channel-md-* folder with two ordered caption notes — capped by --limit 2. No video is downloaded.',
    },
    ko: {
      title: 'fl channel to-md',
      caption: '실제 YouTube 채널이 Blender-channel-md-* 전용 폴더로 변환되어 자막 노트 2개가 순서대로 저장된다 — --limit 2 제한. 영상은 받지 않는다.',
    },
  },
  {
    id: '12-cli-setup-update',
    kind: 'cli',
    caps: ['manage'],
    cmd: 'install.ps1 -NoProfile · flucto doctor · update apply',
    en: {
      title: 'fl setup & update',
      caption: 'Verify the release ZIP SHA-256, install the bundled CLI into a private prefix with managed Node/yt-dlp/FFmpeg, run doctor, then update in place. The Node download wait is labeled time-compressed.',
    },
    ko: {
      title: 'fl setup & update',
      caption: '릴리스 ZIP SHA-256 검증 후 번들 CLI를 관리형 Node/yt-dlp/FFmpeg와 함께 전용 접두어에 설치하고 doctor·in-place 업데이트를 실행한다. Node 다운로드 대기는 시간압축 표시됨.',
    },
  },
]

export const CAP_ORDER = ['capture', 'audio', 'search', 'batch', 'notes', 'manage'] as const
export type DemoCap = (typeof CAP_ORDER)[number]

