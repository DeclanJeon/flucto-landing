import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, FileText, Globe, Settings2, History, FolderOpen, Activity, BellRing,
  Plus, Loader2, ListVideo, Grid3X3, List, X, Copy, Check, ExternalLink, Terminal, Sparkles,
  Zap, ShieldCheck, Layers, Clock, Search, Boxes, Play, BookOpen, Users, ArrowRight,
} from 'lucide-react'

const BrandMark = () => (
  <svg width={36} height={36} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#6d5bff" /><stop offset="50%" stopColor="#44c3ff" /><stop offset="100%" stopColor="#14d6b2" />
      </linearGradient>
    </defs>
    <rect x={7} y={7} width={50} height={50} rx={16} fill="url(#g)" />
    <path d="M20 18L20 48L31 48L31 28L38 28L38 48L49 48L49 18L38 18L32 18L26 18L20 18Z" fill="#11182b" />
    <path d="M24.5 34.5C24.5 28.4 29.6 23.8 36 23.8H39V28.5H36C33.1 28.5 31 30.7 31 33.5C31 36.4 33.4 38 36 38H46V46H36C29.6 46 24.5 40.6 24.5 34.5Z" fill="#f3f5ff" />
  </svg>
)

type Mode = 'mp4' | 'mp3' | 'md'
const platforms = ['YouTube','X','Reddit','Bilibili','Instagram','Threads','TikTok','Vimeo']

export default function App(){
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<Mode>('md')
  const [viewMode, setViewMode] = useState<'grid'|'list'>('list')
  const [copied, setCopied] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoList, setDemoList] = useState<{id:string,title:string}[]>([])

  const handleAdd = async ()=>{
    if(!url.trim()) return
    setDemoLoading(true)
    await new Promise(r=>setTimeout(r, 900))
    setDemoList(v=>[
      { id: String(Date.now()), title: url.length>60 ? url.slice(0,60)+'…' : url || 'Untitled' },
      ...v,
    ].slice(0,6))
    setUrl('')
    setDemoLoading(false)
  }

  const copy = async (text:string, key:string)=>{
    try{ await navigator.clipboard.writeText(text); setCopied(key); setTimeout(()=>setCopied(null), 1400)}catch{ /* ignore */ }
  }

  const cliLine = mode==='md'
    ? 'fl t "https://www.youtube.com/watch?v=..." -l en -o ./notes -j'
    : `fl d "https://www.youtube.com/watch?v=..." -f ${mode} -o ./captures -j`

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] text-[#f4f7ff]">
      <div className="bg-noise" />

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#070b16]/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <BrandMark />
          <div>
            <div className="font-bold leading-none tracking-tight">Flucto</div>
            <div className="text-xs text-white/50">Capture · Transcript · Archive</div>
          </div>
          <span className="ml-2 hidden rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60 md:inline-flex">Open source · MIT · ★ 5</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/DeclanJeon/flucto" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1c1c1e] px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
            GitHub
          </a>
          <a href="https://github.com/DeclanJeon/flucto/releases" target="_blank" rel="noopener" className="hidden items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black hover:bg-white/90 md:inline-flex">
            Download <Download size={14}/>
          </a>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-32">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#44c3ff]/20 bg-[#44c3ff]/10 px-3 py-1 text-xs font-semibold tracking-widest text-[#44c3ff]">
            <Sparkles size={12}/> FOR CREATORS · RESEARCHERS · CURATORS
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            링크는 흩어지고,<br/>
            <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">기록은 남아야 한다.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Flucto는 <span className="text-white">YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo</span>에서
            미디어를 한 번에 받고, <span className="text-white">가능한 자막을 타임스탬프가 있는 깔끔한 Markdown</span>으로 바꿔준다.
            데스크톱 앱과 <span className="kbd">fl</span> CLI가 같은 엔진으로 동작하고, 자막이 없으면 “unavailable”로 정확히 알린다.
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-white/35">
            수백 개 URL도 큐로 쌓이고, 채널 전체도 폴더 하나로 정리된다. 로컬 우선 · 추적 없음 · yt-dlp / ffmpeg 자동 설치.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {platforms.map(p=>(
              <span key={p} className="rounded-full bg-white/[.06] border border-white/10 px-2.5 py-1 text-xs text-white/70">{p}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <a href="https://github.com/DeclanJeon/flucto/releases" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-white/10">Free download <Download size={16}/></a>
            <a href="https://github.com/DeclanJeon/flucto" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/85 hover:bg-white/10">View on GitHub <ExternalLink size={14}/></a>
            <a href="#how" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white/60 hover:bg-white/10">How it works <ArrowRight size={14}/></a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/40">
            <span className="inline-flex items-center gap-1"><ShieldCheck size={12}/> MIT</span>
            <span className="h-3 w-px bg-white/10"/>
            <span>100% TypeScript</span>
            <span className="h-3 w-px bg-white/10"/>
            <span>Windows · macOS · Linux</span>
            <span className="h-3 w-px bg-white/10"/>
            <span className="inline-flex items-center gap-1"><Zap size={12}/> Auto yt-dlp + ffmpeg</span>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.12}} className="mt-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1c1c1e]/85 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#44c3ff]/15 p-2 text-[#44c3ff]"><BellRing size={16}/></div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#44c3ff]">Start in 30 seconds</p>
                <p className="text-sm text-white/80">설치 후 <span className="kbd">fl doc -j</span> 로 점검, <span className="kbd">fl s -j</span> 로 바이너리 자동 설치</p>
              </div>
            </div>
            <button onClick={()=>copy('fl s -j','setup')} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
              {copied==='setup' ? <span className="inline-flex items-center gap-1"><Check size={12}/> copied</span> : 'Copy'}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{delay:.18}} className="relative z-10 mt-6 w-full max-w-2xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                value={url}
                onChange={e=>setUrl(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleAdd()}
                placeholder="Paste any link — YouTube, X, Reddit, Bilibili, Instagram…"
                className="w-full rounded-full border border-white/10 bg-[#1c1c1e] px-6 py-4 text-[15px] text-white placeholder:text-white/35 shadow-2xl outline-none focus:border-[#44c3ff]/40 focus:ring-4 focus:ring-[#44c3ff]/20"
              />
              <button onClick={handleAdd} disabled={!url.trim() || demoLoading} className="absolute bottom-2 right-2 top-2 flex aspect-square items-center justify-center rounded-full bg-[#44c3ff] text-white transition hover:bg-[#33b8ef] disabled:opacity-0 disabled:scale-75">
                {demoLoading ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18}/>}
              </button>
            </div>
            <button onClick={handleAdd} title="Demo add" className="hidden h-[58px] w-14 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1e] text-white/60 hover:bg-white/10 md:inline-flex">
              <FileText size={18}/>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center rounded-full border border-white/10 bg-[#1c1c1e] p-1">
              {(['mp4','mp3','md'] as const).map(m=>(
                <button key={m} onClick={()=>setMode(m)} className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${mode===m ? 'bg-white text-black shadow' : 'text-white/50 hover:text-white'}`}>{m.toUpperCase()}</button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/45"><Settings2 size={14}/>{mode==='md' ? 'Captions → searchable Markdown' : mode==='mp3' ? 'Audio extraction' : 'Full video' }</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="kbd">{cliLine}</span>
            <button onClick={()=>copy(cliLine,'cli')} className="rounded-full border border-white/10 px-2 py-1 text-white/60 hover:bg-white/10">{copied==='cli' ? <Check size={12}/> : <Copy size={12}/>}</button>
          </div>
        </motion.div>

        <section className="mt-10 grid w-full max-w-4xl gap-3 md:grid-cols-3">
          {[
            {icon: Globe, k:'One app for 8 platforms', d:'YouTube · X · Reddit · Bilibili · Instagram · Threads · TikTok · Vimeo. PlatformAdapter 플러그인 — 새 플랫폼은 파일 하나로 추가.', badge:'Universal'},
            {icon: Boxes, k:'Queue that never scatters', d:'단일 URL, 플레이리스트, .txt 리스트, 채널 전체까지 큐로. Bounded concurrency로 수백 개도 안정적.', badge:'Batch'},
            {icon: BookOpen, k:'Caption → Markdown you can search', d:'JSON3/XML/VTT 파싱, 마크업 제거, 문단화, 언어 선택(en/auto), 타임스탬프·메타데이터 포함. 없으면 없다고 알린다.', badge:'Transcript'},
          ].map(c=>(
            <div key={c.k} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
              <div className="flex items-center gap-2 text-xs tracking-widest text-[#44c3ff]"><c.icon size={14}/>{c.badge}</div>
              <p className="mt-2 text-[15px] font-semibold leading-tight">{c.k}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{c.d}</p>
            </div>
          ))}
        </section>

        <section id="how" className="mt-10 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#1c1c1e] p-6">
          <p className="text-xs tracking-widest text-[#44c3ff]">HOW IT WORKS</p>
          <h2 className="mt-1 text-2xl font-bold">복사 · 선택 · 정리 — 세 단계로 끝</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {n:'01', t:'Paste', d:'링크 하나, 리스트, 채널 핸들 — 붙여넣으면 미리보기와 포맷을 확인한다.', i: Play},
              {n:'02', t:'Choose', d:'MP4(영상) · MP3(오디오) · MD(자막→Markdown) 중 목적을 고른다.', i: Layers},
              {n:'03', t:'Collect', d:'다운로드는 Captures, 노트는 Notes — 작업 단위 전용 폴더로 깔끔히 정리된다.', i: FolderOpen},
            ].map(s=>(
              <div key={s.n} className="rounded-xl border border-white/10 bg-white/[.04] p-4">
                <div className="flex items-center gap-2 text-xs text-white/40"><span className="rounded-full bg-[#44c3ff] px-2 py-1 text-xs font-bold text-black">{s.n}</span> <s.i size={14}/></div>
                <p className="mt-3 text-sm font-semibold">{s.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/40">
            <span className="inline-flex items-center gap-1"><Clock size={12}/> 채널: <span className="kbd">fl channel to-md "@handle" --limit 100 -o ./notes</span></span>
            <span className="inline-flex items-center gap-1"><Search size={12}/> 배치: <span className="kbd">fl b urls.txt -f md -c 2 -o ./notes -j</span></span>
          </div>
        </section>

        <div className="mt-8 grid w-full max-w-4xl gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e]">
            <img src="/demo.gif" alt="channel to md demo" className="h-auto w-full object-cover" />
            <div className="flex items-center justify-between p-3 text-xs text-white/60">
              <span>Channel → Markdown · 전용 타임스탬프 폴더</span>
              <span className="kbd">notes/handle-channel-md-2026…/</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
            <p className="text-sm font-semibold inline-flex items-center gap-2"><Users size={16} className="text-[#44c3ff]"/> 누가 쓰나</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/60">
              <li><span className="text-white">크리에이터</span> — 숏폼·릴스 소스 보관과 재편집 레퍼런스</li>
              <li><span className="text-white">리서처</span> — 강의·인터뷰 자막을 검색 가능한 노트로</li>
              <li><span className="text-white">큐레이터</span> — 채널/리스트를 주제별 Markdown 아카이브로</li>
            </ul>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[#1c1c1e] border border-white/10 p-3"><p className="text-lg font-bold">MP4</p><p className="text-white/50">video</p><p className="mt-1 text-[11px] text-white/30">보관·편집</p></div>
              <div className="rounded-xl bg-[#1c1c1e] border border-white/10 p-3"><p className="text-lg font-bold">MP3</p><p className="text-white/50">audio</p><p className="mt-1 text-[11px] text-white/30">팟캐스트·강의</p></div>
              <div className="rounded-xl bg-white text-black p-3"><p className="text-lg font-bold">MD</p><p className="text-black/60">transcript</p><p className="mt-1 text-[11px] text-black/40">검색·인용</p></div>
            </div>
          </div>
        </div>

        <section className="mt-8 grid w-full max-w-4xl gap-3 md:grid-cols-3">
          {[
            {k:'Privacy first', d:'로컬 처리 · 추적 없음 · 썸네일 프록시. 클라우드 업로드 없이 내 폴더에서 끝난다.', i: ShieldCheck},
            {k:'Desktop + CLI same engine', d:'Electron UI와 fl/flucto CLI가 같은 TypeScript 서비스 레이어. 자동화에 바로 붙는다.', i: Terminal},
            {k:'Zero-config setup', d:'fl s 로 yt-dlp/ffmpeg 자동 구성. 시스템 패키지 매니저를 건드리지 않는다.', i: Zap},
          ].map(c=>(
            <div key={c.k} className="rounded-2xl border border-white/10 bg-[#1c1c1e] p-4">
              <p className="inline-flex items-center gap-1.5 text-xs tracking-widest text-[#44c3ff]"><c.i size={14}/>{c.k}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{c.d}</p>
            </div>
          ))}
        </section>

        <section id="cli" className="mt-8 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#1c1c1e] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Terminal size={16}/> CLI — 창 없이 흐르는 워크플로우</div>
          <p className="mt-1 text-xs text-white/50">AI 에이전트·CI·배치에 그대로 붙는 머신 친화 출력</p>
          <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-white/80">
{`fl doc -j
fl s -j
fl i "https://www.youtube.com/watch?v=..." -j
fl d "https://www.youtube.com/watch?v=..." -f mp4 -o ./captures -j
fl t "https://www.youtube.com/watch?v=..." -l en -o ./notes -j
fl channel to-md "@LIFECODEofficial" --limit 100 -o ./notes
fl b urls.txt -f md -c 2 -o ./notes -j
fl u check -j`}
          </pre>
          <p className="mt-2 text-xs text-white/50"><span className="kbd">--json</span> stdout 최종 객체 · <span className="kbd">--progress-json</span> stderr NDJSON · 다중 파일은 항상 전용 하위 폴더 생성</p>
        </section>

        <div className="mt-10 w-full max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ListVideo className="text-[#44c3ff]" size={20}/>
              <h3 className="text-lg font-semibold">Try it — landing preview <span className="ml-1 text-sm font-normal text-white/40">({demoList.length})</span></h3>
              <span className="hidden rounded-full bg-white/10 px-2 py-1 text-xs text-white/50 md:inline-flex">URL을 넣고 Enter</span>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#1c1c1e] p-1">
              <button onClick={()=>setViewMode('grid')} className={`rounded-full p-2 ${viewMode==='grid' ? 'bg-white/15 text-white' : 'text-white/40'}`}><Grid3X3 size={14}/></button>
              <button onClick={()=>setViewMode('list')} className={`rounded-full p-2 ${viewMode==='list' ? 'bg-white/15 text-white' : 'text-white/40'}`}><List size={14}/></button>
            </div>
          </div>
          <AnimatePresence>
            {demoList.length>0 && (
              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} className={viewMode==='grid' ? 'mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3' : 'mt-4 space-y-3'}>
                {demoList.map(v=>(
                  <div key={v.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur">
                    <div className="aspect-video bg-gradient-to-br from-[#1c1c1e] to-black/60 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1 text-white/30">
                        <Globe size={20}/><span className="text-xs line-clamp-1 px-4 text-center">{v.title}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-medium leading-tight">{v.title}</p>
                      <p className="mt-1 text-xs text-white/40">Queued · will resolve via yt-dlp in app</p>
                    </div>
                    <button onClick={()=>setDemoList(x=>x.filter(y=>y.id!==v.id))} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white/70 hover:bg-black/80"><X size={12}/></button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {demoList.length===0 && <p className="mt-3 text-center text-xs text-white/40">위 입력창에 URL을 넣고 Enter — 실제 앱의 <span className="kbd">MainDownloader</span> 카드와 같은 흐름으로 쌓인다.</p>}
        </div>

        <div className="mt-10 w-full max-w-4xl rounded-2xl border border-[#44c3ff]/20 bg-gradient-to-br from-[#44c3ff]/10 via-transparent to-[#7a66ff]/10 p-6 text-center">
          <h3 className="text-xl font-bold">영상은 흐름, 자막은 자산</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/60">툴을 옮겨 다니지 말고, 한 흐름에서 받고 바로 Markdown으로 정리하라. Flucto는 수집부터 아카이브까지의 마지막 변환을 맡는다.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a href="https://github.com/DeclanJeon/flucto/releases" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black">Download free <Download size={16}/></a>
            <a href="https://github.com/DeclanJeon/flucto" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm text-white/70 hover:bg-white/10">Star on GitHub</a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <a href="https://github.com/DeclanJeon/flucto" target="_blank" rel="noopener" className="rounded-full border border-white/10 px-3 py-1.5 text-white/60 hover:bg-white/10">DeclanJeon/flucto · MIT</a>
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/30">v1.13.2 · 100% TypeScript</span>
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/30">Independent project</span>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden border-t border-white/10 bg-[#1c1c1e]/90 p-3 backdrop-blur md:block">
        <div className="mx-auto flex max-w-3xl items-center justify-between text-xs text-white/60">
          <span className="inline-flex items-center gap-2"><Activity size={14}/> Status · batch queue · resilient format checks</span>
          <span className="inline-flex items-center gap-2"><FolderOpen size={14}/> ~/Downloads · <History size={14}/> history · <Settings2 size={14}/> settings</span>
        </div>
      </div>
    </div>
  )
}
