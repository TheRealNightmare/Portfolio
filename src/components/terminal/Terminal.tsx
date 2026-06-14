import { Component, createRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './crt.css'
import ContactTerminalForm from './ContactTerminalForm'
import { projects } from '../../data/projects'
import { skillGroups } from '../../data/skills'
import { timeline } from '../../data/experience'
import { education } from '../../data/education'
import { posts } from '../../data/posts'
import { achievements } from '../../data/achievements'
import type { Project } from '../../types'

type Section = 'home' | 'about' | 'projects' | 'skills' | 'experience' | 'education' | 'blog' | 'contact'

interface Toast {
  id: number
  title: string
  sub: string
  accent: string
  glow: string
  icon: string
}

interface StreamItem {
  id: number
  node: ReactNode
}

interface TState {
  booting: boolean
  stream: StreamItem[]
  input: string
  section: Section
  totalXp: number
  level: number
  soundOn: boolean
  toasts: Toast[]
  mobile: boolean
}

const projectId = (p: Project) => p.title.toLowerCase()

const BOOT: { t: string; c: string }[] = [
  { t: 'PORTFOLIO BIOS v2.6.1 — (c) 2026 Nahid Systems', c: 'dim' },
  { t: 'CPU: Intel 80486DX2 @ 66MHz ............. OK', c: 'ok' },
  { t: 'Memory Test: 640K base ................. OK', c: 'ok' },
  { t: '             64512K extended ........... OK', c: 'ok' },
  { t: 'Detecting drives ...', c: 'dim' },
  { t: '  Primary Master : NAHID-CORE SSD 2TB', c: '' },
  { t: '  Primary Slave  : None', c: 'dim' },
  { t: 'Initializing devices ... keyboard, mouse, vibes', c: '' },
  { t: 'Loading kernel  ████████████████████  100%', c: 'ok' },
  { t: 'Mounting /home/visitor ................. OK', c: 'ok' },
  { t: 'Starting phosphor display service ...... OK', c: 'ok' },
  { t: '', c: '' },
  { t: "Welcome, visitor. Type 'help' to begin.", c: 'bright' },
]

const CHIPS = ['help', 'about', 'projects', 'skills', 'experience', 'blog', 'contact', 'resume']

const SECTION_LABELS: Record<Section, string> = {
  home: '~/home',
  about: '~/about',
  projects: '~/projects',
  skills: '~/skills',
  experience: '~/experience',
  education: '~/education',
  blog: '~/blog',
  contact: '~/contact',
}

type Props = Record<string, never>

export default class Terminal extends Component<Props, TState> {
  state: TState = {
    booting: true,
    stream: [],
    input: '',
    section: 'home',
    totalXp: 0,
    level: 1,
    soundOn: false,
    toasts: [],
    mobile: false,
  }

  nid = 1
  tid = 1
  bootShown = 0
  cmdCount = 0
  greeted = false
  unlocked = new Set<string>()
  visited = new Set<string>()
  hist: string[] = []
  histIdx = -1
  shouldScroll = false
  inputRef = createRef<HTMLInputElement>()
  streamRef = createRef<HTMLDivElement>()
  bootTimer: number | undefined
  audio: AudioContext | undefined
  onDocKey: ((e: KeyboardEvent) => void) | undefined
  onResize: (() => void) | undefined

  // ---- theme ----
  themeOf(s: Section): 'green' | 'amber' | 'cyan' {
    return s === 'projects' ? 'amber' : s === 'blog' ? 'cyan' : 'green'
  }
  themeColor(): string {
    return { amber: '#ffb23e', cyan: '#5fe6f0', green: '#35f07a' }[this.themeOf(this.state.section)]
  }
  gx(): CSSProperties {
    return { color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)' }
  }
  dim(o?: CSSProperties): CSSProperties {
    return { color: 'var(--phosphor-dim,rgba(53,240,122,.5))', ...(o || {}) }
  }

  // ---- lifecycle ----
  componentDidMount() {
    this.bootTimer = window.setInterval(() => {
      this.bootShown++
      if (this.bootShown >= BOOT.length) {
        window.clearInterval(this.bootTimer)
        this.bootTimer = undefined
        window.setTimeout(() => this.finishBoot(), 850)
      }
      this.forceUpdate()
    }, 230)

    this.onDocKey = (e: KeyboardEvent) => {
      if (this.state.booting) {
        this.skipBoot()
        return
      }
      const el = this.inputRef.current
      if (el && document.activeElement !== el && e.key && e.key.length === 1) el.focus()
    }
    document.addEventListener('keydown', this.onDocKey)

    this.onResize = () => {
      const m = window.innerWidth < 760
      if (m !== this.state.mobile) this.setState({ mobile: m })
    }
    window.addEventListener('resize', this.onResize)
    this.setState({ mobile: window.innerWidth < 760 })
    window.setTimeout(() => this.inputRef.current?.focus(), 60)
  }

  componentWillUnmount() {
    window.clearInterval(this.bootTimer)
    if (this.onDocKey) document.removeEventListener('keydown', this.onDocKey)
    if (this.onResize) window.removeEventListener('resize', this.onResize)
  }

  componentDidUpdate() {
    if (this.shouldScroll && this.streamRef.current) {
      this.streamRef.current.scrollTop = this.streamRef.current.scrollHeight
      this.shouldScroll = false
    }
  }

  finishBoot() {
    if (this.greeted) return
    this.greeted = true
    window.clearInterval(this.bootTimer)
    this.bootTimer = undefined
    this.setState({ booting: false })
    this.print(this.greetingNode())
    window.setTimeout(() => this.inputRef.current?.focus(), 60)
  }
  skipBoot = () => {
    if (this.bootTimer) {
      window.clearInterval(this.bootTimer)
      this.bootTimer = undefined
    }
    this.finishBoot()
  }

  // ---- audio ----
  beep(freq: number) {
    if (!this.state.soundOn) return
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!this.audio) this.audio = new Ctor()
      const o = this.audio.createOscillator()
      const g = this.audio.createGain()
      o.type = 'square'
      o.frequency.value = freq
      g.gain.value = 0.035
      o.connect(g)
      g.connect(this.audio.destination)
      o.start()
      g.gain.exponentialRampToValueAtTime(0.0001, this.audio.currentTime + 0.08)
      o.stop(this.audio.currentTime + 0.09)
    } catch {
      /* no audio */
    }
  }
  toggleSound = () => {
    const on = !this.state.soundOn
    this.setState({ soundOn: on })
    if (on) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!this.audio) this.audio = new Ctor()
      } catch {
        /* no audio */
      }
      window.setTimeout(() => this.beep(660), 10)
    }
    window.setTimeout(() => this.inputRef.current?.focus(), 10)
  }

  // ---- gamification ----
  addXp(n: number) {
    this.setState((s) => {
      const total = s.totalXp + n
      const level = Math.floor(total / 100) + 1
      if (level > s.level) {
        window.setTimeout(() => this.levelToast(level), 60)
        this.beep(880)
      }
      return { totalXp: total, level }
    })
  }
  levelToast(level: number) {
    this.pushToast({ title: 'LEVEL UP', sub: 'You reached Level ' + level, accent: '#7cffb0', glow: 'rgba(124,255,176,.55)', icon: '▲' })
  }
  unlock(id: string) {
    if (this.unlocked.has(id)) return
    this.unlocked.add(id)
    const a = achievements.find((x) => x.id === id)
    this.pushToast({ title: 'Achievement Unlocked', sub: a ? a.name : id, accent: '#ffd24a', glow: 'rgba(255,210,74,.55)', icon: 'trophy' })
    this.beep(760)
    this.addXp(30)
    this.forceUpdate()
  }
  markVisited(s: string) {
    this.visited.add(s)
    if (['about', 'projects', 'skills', 'blog', 'contact'].every((x) => this.visited.has(x))) this.unlock('explorer')
  }
  pushToast(o: Omit<Toast, 'id'>) {
    const id = this.tid++
    const to: Toast = { id, ...o }
    this.setState((s) => ({ toasts: [...s.toasts, to] }))
    window.setTimeout(() => this.setState((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 4600)
  }

  // ---- stream / input ----
  print(node: ReactNode) {
    const id = this.nid++
    const wrapped = (
      <div key={id} style={{ marginBottom: '16px' }}>
        {node}
      </div>
    )
    this.shouldScroll = true
    this.setState((s) => ({ stream: [...s.stream, { id, node: wrapped }] }))
  }
  onInput = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ input: e.target.value })
  onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const v = this.state.input
      if (v.trim()) this.hist.push(v)
      this.histIdx = this.hist.length
      this.setState({ input: '' })
      this.runCommand(v)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (this.hist.length) {
        this.histIdx = Math.max(0, this.histIdx - 1)
        this.setState({ input: this.hist[this.histIdx] || '' })
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (this.hist.length) {
        this.histIdx = Math.min(this.hist.length, this.histIdx + 1)
        this.setState({ input: this.hist[this.histIdx] || '' })
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      this.setState({ stream: [] })
    }
  }
  focusInput = () => this.inputRef.current?.focus()
  setSection(s: Section) {
    this.setState({ section: s })
  }

  runCommand(raw: string) {
    const cmd = (raw || '').trim()
    const parts = cmd.split(/\s+/)
    const head = (parts[0] || '').toLowerCase()
    const arg = parts.slice(1).join(' ').toLowerCase()
    const echo = (
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', opacity: 0.92 }}>
        <span style={{ color: 'var(--phosphor-dim,rgba(53,240,122,.55))', whiteSpace: 'nowrap' }}>visitor@portfolio:~$</span>
        <span style={this.gx()}>{cmd || ' '}</span>
      </div>
    )
    let body: ReactNode = null

    if (head === '') {
      this.print(<div>{echo}</div>)
      this.afterCommand()
      return
    } else if (head === 'clear' || head === 'cls') {
      this.setState({ stream: [] })
      this.afterCommand()
      return
    } else if (head === 'help' || head === '?' || head === 'menu') {
      body = this.helpBlock()
      this.setSection('home')
    } else if (head === 'about' || head === 'whoami' || head === 'me') {
      body = this.aboutBlock(head === 'whoami')
      this.setSection('about')
      this.markVisited('about')
      this.unlock('curious')
    } else if (head === 'projects' || head === 'work' || (head === 'ls' && (arg === 'projects' || arg === ''))) {
      const match = arg && head === 'projects' ? projects.find((p) => projectId(p) === arg) : undefined
      if (match) {
        this.setSection('projects')
        this.markVisited('projects')
        body = this.projectDetail(match)
        this.unlock('reviewer')
      } else {
        body = this.projectsBlock()
        this.setSection('projects')
        this.markVisited('projects')
      }
    } else if (head === 'open' || head === 'cat') {
      const p = projects.find((x) => projectId(x) === arg)
      if (p) {
        this.setSection('projects')
        this.markVisited('projects')
        body = this.projectDetail(p)
        this.unlock('reviewer')
      } else {
        body = this.errorBlock(cmd, 'no such project. try ')
      }
    } else if (head === 'skills' || head === 'stack') {
      body = this.skillsBlock()
      this.setSection('skills')
      this.markVisited('skills')
    } else if (head === 'experience' || head === 'jobs' || head === 'work-history') {
      body = this.experienceBlock()
      this.setSection('experience')
    } else if (head === 'education' || head === 'edu' || head === 'school') {
      body = this.educationBlock()
      this.setSection('education')
    } else if (head === 'blog' || head === 'posts') {
      const n = parseInt(arg, 10)
      if (arg && !isNaN(n) && posts[n - 1]) {
        this.setSection('blog')
        this.markVisited('blog')
        body = this.blogPost(posts[n - 1])
        this.unlock('bookworm')
      } else {
        body = this.blogBlock()
        this.setSection('blog')
        this.markVisited('blog')
      }
    } else if (head === 'read') {
      const n = parseInt(arg, 10)
      const p = posts[n - 1]
      if (p) {
        this.setSection('blog')
        this.markVisited('blog')
        body = this.blogPost(p)
        this.unlock('bookworm')
      } else {
        body = this.errorBlock(cmd, 'no post with that number. try ')
      }
    } else if (head === 'contact' || head === 'email') {
      body = this.contactBlock()
      this.setSection('contact')
      this.markVisited('contact')
    } else if (head === 'resume' || head === 'cv') {
      body = this.resumeBlock()
      this.setSection('home')
    } else if (head === 'achievements' || head === 'trophies' || head === 'badges') {
      body = this.achievementsBlock()
      this.setSection('home')
    } else if (head === 'sudo') {
      body = this.deniedBlock()
      this.unlock('sudoer')
    } else if (head === 'echo') {
      body = <div style={this.gx()}>{parts.slice(1).join(' ') || ' '}</div>
    } else if (head === 'ls' || head === 'dir') {
      body = this.lsBlock()
    } else if (head === 'exit' || head === 'quit' || head === 'logout') {
      body = <div style={this.dim()}>there is no escape. (just kidding — close the tab.) but stay a while?</div>
    } else {
      body = this.errorBlock(cmd)
    }

    this.print(
      <div>
        {echo}
        {body}
      </div>,
    )
    this.afterCommand()
  }
  afterCommand() {
    this.cmdCount++
    this.beep(220 + Math.random() * 100)
    this.unlock('first')
    if (this.cmdCount >= 12) this.unlock('persistent')
    this.addXp(15)
  }

  // ---- generic helpers ----
  box(lines: string[], pad = 3): string {
    const w = Math.max(...lines.map((l) => l.length)) + pad * 2
    const top = '┌' + '─'.repeat(w) + '┐'
    const bot = '└' + '─'.repeat(w) + '┘'
    const mid = lines.map((l) => '│' + ' '.repeat(pad) + l + ' '.repeat(w - pad - l.length) + '│')
    return [top, ...mid, bot].join('\n')
  }
  pre(text: string, extra?: CSSProperties): ReactNode {
    return <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre', lineHeight: 1.25, ...this.gx(), ...(extra || {}) }}>{text}</pre>
  }
  heading(text: string, sub?: string): ReactNode {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '10px', borderBottom: '1px solid var(--phosphor-dim,rgba(53,240,122,.22))', paddingBottom: '7px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.05em', letterSpacing: '.06em', ...this.gx() }}>{text}</span>
        {sub ? <span style={this.dim({ fontSize: '.8em' })}>{sub}</span> : null}
      </div>
    )
  }
  tag(text: string): ReactNode {
    return (
      <span key={text} style={{ border: '1px solid var(--phosphor-dim,rgba(53,240,122,.4))', color: 'var(--phosphor,#35f07a)', padding: '1px 9px', fontSize: '.78em', opacity: 0.92, whiteSpace: 'nowrap' }}>
        {text}
      </span>
    )
  }
  link(text: string, href?: string): ReactNode {
    const style: CSSProperties = { textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer', ...this.gx() }
    if (href) {
      return (
        <a
          key={text}
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation()
            this.beep(520)
          }}
          style={style}
        >
          {text}
        </a>
      )
    }
    return (
      <span
        key={text}
        onClick={(e) => {
          e.stopPropagation()
          this.pushToast({ title: 'opening', sub: text, accent: this.themeColor(), glow: 'rgba(255,255,255,.35)', icon: '↗' })
          this.beep(520)
        }}
        style={style}
      >
        {text}
      </span>
    )
  }
  p(text: string): ReactNode {
    return <div style={{ marginBottom: '8px', color: 'var(--phosphor,#35f07a)', opacity: 0.92 }}>{text}</div>
  }
  trophy(size = 15, color = '#ffd24a'): ReactNode {
    const path = (d: string) => <path d={d} stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: '0 0 auto', filter: 'drop-shadow(0 0 5px ' + color + ')' }}>
        {path('M6 4h12v3a6 6 0 0 1-12 0V4Z')}
        {path('M6 5H3.5v1.5A2.5 2.5 0 0 0 6 9')}
        {path('M18 5h2.5v1.5A2.5 2.5 0 0 1 18 9')}
        {path('M12 13v3')}
        {path('M9.5 20h5')}
        {path('M10 16.5h4l.4 3.5h-4.8l.4-3.5Z')}
      </svg>
    )
  }

  // ---- blocks ----
  greetingNode(): ReactNode {
    return (
      <div>
        {this.pre(this.box(['MIRAZUL ISLAM NAHID · software developer', 'full-stack dev · CSE @ UIU · always building'], 3), { fontSize: '.92em' })}
        <div style={{ marginTop: '12px', ...this.dim() }}>Last login: just now on ttys001</div>
        <div style={{ marginTop: '4px', ...this.gx() }}>
          Tap a chip below or type a command. New here? Try{' '}
          <span style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>help</span>.
        </div>
      </div>
    )
  }
  helpBlock(): ReactNode {
    const cmds: [string, string][] = [
      ['about', 'who I am + the bio'],
      ['projects', 'things I have built'],
      ['skills', 'proficiency, as XP bars'],
      ['experience', 'where I have worked'],
      ['education', 'academic background'],
      ['blog', 'posts & ramblings'],
      ['contact', 'send me a message'],
      ['resume', 'download the PDF'],
      ['achievements', 'trophies you have earned'],
      ['clear', 'wipe the screen'],
    ]
    return (
      <div>
        {this.heading('AVAILABLE COMMANDS', 'tap a chip, or type a name')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))', gap: '4px 24px' }}>
          {cmds.map(([c, d]) => (
            <div key={c} style={{ display: 'flex', gap: '12px', padding: '2px 0' }}>
              <span style={{ minWidth: '120px', fontWeight: 500, ...this.gx() }}>{c}</span>
              <span style={this.dim()}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', fontSize: '.86em', ...this.dim() }}>
          tip: ↑/↓ recall history · pseudo-commands like <span style={this.gx()}>sudo</span> may have… consequences.
        </div>
      </div>
    )
  }
  aboutBlock(whoami: boolean): ReactNode {
    const face = ['  ▄▄▄▄▄▄▄▄  ', ' ██████████ ', ' ██████████ ', ' ███▟▙██▟▙██ ', ' █████▼▼████ ', ' ██████████ ', ' ██████████ ', '  ▀▀▀▀▀▀▀▀  ', '   ▀▀▀▀▀▀   '].join('\n')
    return (
      <div>
        {this.heading(whoami ? 'whoami' : 'ABOUT', 'visitor sees: Mirazul Islam Nahid')}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {this.pre(face, { fontSize: '.86em', filter: 'drop-shadow(0 0 6px var(--phosphor,#35f07a))' })}
          <div style={{ flex: '1 1 280px', minWidth: '240px' }}>
            {this.p("Hi — I'm Mirazul Islam Nahid. I'm a CSE student at United International University and a software developer at MonerBondhu, building full-stack software while I finish my degree.")}
            {this.p('I started out as a web developer at Rokirovka back in 2021, sharpening my skills on real products. The best learning happens when theory meets practice, so I keep shipping side projects between deadlines.')}
            {this.p("My stack spans low-level systems (C, C++) through cloud-native deployments (Docker, Kubernetes, AWS). I love exploring new tools and growing every single day.")}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {this.tag('Dhaka, BD')}
              {this.tag('UTC+6')}
              {this.tag('open to work')}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '14px', ...this.dim() }}>
          grab the {this.link('resume.pdf')} or type 'projects' to see the work.
        </div>
      </div>
    )
  }
  projectsBlock(): ReactNode {
    return (
      <div>
        {this.heading('PROJECTS', projects.length + ' repos · tap one to open')}
        <div>{projects.map((p) => this.projectRow(p))}</div>
        <div style={{ marginTop: '10px', fontSize: '.86em', ...this.dim() }}>
          open one with <span style={this.gx()}>open {projectId(projects[0])}</span> or just click it.
        </div>
      </div>
    )
  }
  projectRow(p: Project): ReactNode {
    return (
      <div
        key={projectId(p)}
        onClick={(e) => {
          e.stopPropagation()
          this.runCommand('open ' + projectId(p))
        }}
        style={{ cursor: 'pointer', border: '1px solid var(--phosphor-dim,rgba(255,178,62,.3))', padding: '12px 14px', marginBottom: '10px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '1.02em', ...this.gx() }}>{p.title}</span>
          <span style={this.dim({ fontSize: '.82em' })}>{p.language}</span>
        </div>
        <div style={{ margin: '5px 0 9px', color: 'var(--phosphor,#35f07a)', opacity: 0.9 }}>{p.description}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>{p.tags.map((t) => this.tag(t))}</div>
          <span style={this.dim({ fontSize: '.84em' })}>open ⸢</span>
        </div>
      </div>
    )
  }
  projectDetail(p: Project): ReactNode {
    return (
      <div>
        {this.heading(p.title, p.language + ' · project detail')}
        <div style={{ marginBottom: '10px', fontSize: '1.02em', ...this.gx() }}>{p.description}</div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', margin: '12px 0' }}>{p.tags.map((t) => this.tag(t))}</div>
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '6px' }}>
          <span>
            <span style={this.dim()}>repo&nbsp;&nbsp;</span>
            {this.link(p.repoUrl.replace(/^https?:\/\//, ''), p.repoUrl)}
          </span>
        </div>
        <div style={{ marginTop: '14px', fontSize: '.86em', ...this.dim() }}>
          back to the list: type <span style={this.gx()}>projects</span>
        </div>
      </div>
    )
  }
  skillsBlock(): ReactNode {
    return (
      <div>
        {this.heading('SKILLS', 'proficiency · self-assessed')}
        {skillGroups.map((group) => (
          <div key={group.category} style={{ marginBottom: '14px' }}>
            <div style={this.dim({ fontSize: '.8em', letterSpacing: '.16em', marginBottom: '4px' })}>{group.category.toUpperCase()}</div>
            {group.skills.map((s) => this.skillRow(s.name, s.level ?? 70))}
          </div>
        ))}
        <div style={{ marginTop: '4px', fontSize: '.84em', ...this.dim() }}>numbers are vibes-based, like all good estimates.</div>
      </div>
    )
  }
  skillRow(name: string, v: number): ReactNode {
    const filled = Math.round(v / 10)
    return (
      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '3px 0', flexWrap: 'wrap' }}>
        <span style={{ minWidth: '140px', fontWeight: 500, ...this.gx() }}>{name}</span>
        <span style={{ whiteSpace: 'pre', letterSpacing: '1px' }}>
          <span style={this.dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.5))' })}>[</span>
          <span style={this.gx()}>{'█'.repeat(filled)}</span>
          <span style={this.dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.32))' })}>{'░'.repeat(10 - filled)}</span>
          <span style={this.dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.5))' })}>]</span>
        </span>
        <span style={{ minWidth: '42px', ...this.gx() }}>{v}%</span>
      </div>
    )
  }
  experienceBlock(): ReactNode {
    return (
      <div>
        {this.heading('EXPERIENCE', timeline.length + ' roles · most recent first')}
        {timeline.map((t) => (
          <div key={t.company} style={{ borderLeft: '1px solid var(--phosphor-dim,rgba(53,240,122,.3))', paddingLeft: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, ...this.gx() }}>
                {t.role} <span style={this.dim()}>@ {t.company}</span>
                {t.current ? <span style={{ ...this.gx(), fontSize: '.74em', marginLeft: '8px', border: '1px solid var(--phosphor-dim,rgba(53,240,122,.4))', padding: '1px 7px' }}>current</span> : null}
              </span>
              <span style={this.dim({ fontSize: '.82em' })}>{t.period}</span>
            </div>
            <div style={{ marginTop: '5px', color: 'var(--phosphor,#35f07a)', opacity: 0.9 }}>{t.description}</div>
          </div>
        ))}
      </div>
    )
  }
  educationBlock(): ReactNode {
    return (
      <div>
        {this.heading('EDUCATION', 'academic background')}
        {education.map((e) => (
          <div key={e.institution} style={{ borderLeft: '1px solid var(--phosphor-dim,rgba(53,240,122,.3))', paddingLeft: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, ...this.gx() }}>{e.institution}</span>
              <span style={this.dim({ fontSize: '.82em' })}>{e.period}</span>
            </div>
            <div style={{ marginTop: '3px', ...this.gx(), opacity: 0.92 }}>{e.degree}</div>
            <div style={{ marginTop: '5px', color: 'var(--phosphor,#35f07a)', opacity: 0.9 }}>{e.description}</div>
          </div>
        ))}
      </div>
    )
  }
  blogBlock(): ReactNode {
    return (
      <div>
        {this.heading('BLOG', posts.length + ' posts · tap to read')}
        <div>{posts.map((p) => this.blogRow(p))}</div>
        <div style={{ marginTop: '10px', fontSize: '.86em', ...this.dim() }}>
          read one with <span style={this.gx()}>read 1</span> or click a title.
        </div>
      </div>
    )
  }
  blogRow(p: (typeof posts)[number]): ReactNode {
    return (
      <div
        key={p.id}
        onClick={(e) => {
          e.stopPropagation()
          this.runCommand('read ' + p.id)
        }}
        style={{ cursor: 'pointer', display: 'flex', gap: '16px', padding: '9px 0', borderBottom: '1px solid var(--phosphor-dim,rgba(95,230,240,.18))', flexWrap: 'wrap' }}
      >
        <span style={this.dim({ minWidth: '92px', fontSize: '.9em' })}>{p.date}</span>
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ fontWeight: 600, ...this.gx() }}>{p.title}</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={this.dim({ fontSize: '.82em' })}>{p.read + ' read'}</span>
            {p.tags.map((t) => this.tag('#' + t))}
          </div>
        </div>
      </div>
    )
  }
  blogPost(p: (typeof posts)[number]): ReactNode {
    return (
      <div>
        {this.heading(p.title)}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={this.dim()}>{p.date}</span>
          <span style={this.dim()}>·</span>
          <span style={this.dim()}>{p.read + ' read'}</span>
          <div style={{ display: 'flex', gap: '7px' }}>{p.tags.map((t) => this.tag('#' + t))}</div>
        </div>
        <div style={{ maxWidth: '68ch' }}>
          {p.body.map((para, i) => (
            <div key={i} style={{ marginBottom: '12px', lineHeight: 1.75, color: 'var(--phosphor,#35f07a)', opacity: 0.95 }}>
              {para}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '8px', fontSize: '.86em', ...this.dim() }}>
          back to the list: type <span style={this.gx()}>blog</span>
        </div>
      </div>
    )
  }
  contactBlock(): ReactNode {
    const row = (k: string, v: string, href?: string) => (
      <div key={k} style={{ display: 'flex', gap: '14px', padding: '3px 0' }}>
        <span style={this.dim({ minWidth: '92px' })}>{k}</span>
        {href ? this.link(v, href) : <span style={this.gx()}>{v}</span>}
      </div>
    )
    return (
      <div>
        {this.heading('CONTACT', 'send a message, or reach me directly')}
        {row('email', 'nnahid929@gmail.com', 'mailto:nnahid929@gmail.com')}
        {row('github', 'github.com/TheRealNightmare', 'https://github.com/TheRealNightmare')}
        {row('linkedin', 'in/mirazulislamnahid', 'https://www.linkedin.com/in/mirazulislamnahid/')}
        {row('x', '@TheRealNightmare', 'https://x.com/TheRealNightmare')}
        {row('location', 'Dhaka, BD (UTC+6)')}
        <div style={{ marginTop: '14px', ...this.dim({ fontSize: '.86em', letterSpacing: '.06em' }) }}>$ send --message</div>
        <ContactTerminalForm
          onResult={(ok) => {
            if (ok) this.pushToast({ title: 'message sent', sub: "I'll get back to you soon", accent: '#7cffb0', glow: 'rgba(124,255,176,.4)', icon: '✉' })
            this.beep(ok ? 600 : 200)
          }}
        />
      </div>
    )
  }
  resumeBlock(): ReactNode {
    return (
      <div>
        {this.heading('RESUME', 'PDF · coming soon')}
        {this.p('One page. No buzzwords. Mostly things I actually shipped.')}
        <div
          onClick={(e) => {
            e.stopPropagation()
            this.pushToast({ title: 'not available yet', sub: 'resume.pdf is being polished', accent: this.themeColor(), glow: 'rgba(124,255,176,.4)', icon: '⧉' })
            this.beep(600)
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '8px', cursor: 'pointer', border: '1px solid var(--phosphor,#35f07a)', padding: '9px 16px', ...this.gx() }}
        >
          <span style={{ fontSize: '1.1em' }}>⧉</span>
          <span style={{ fontWeight: 600 }}>download resume.pdf</span>
        </div>
      </div>
    )
  }
  achievementsBlock(): ReactNode {
    const count = this.unlocked.size
    return (
      <div>
        {this.heading('ACHIEVEMENTS', count + ' / ' + achievements.length + ' unlocked')}
        {achievements.map((a) => {
          const got = this.unlocked.has(a.id)
          return (
            <div key={a.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--phosphor-dim,rgba(53,240,122,.16))', opacity: got ? 1 : 0.55 }}>
              {got ? this.trophy(18, 'var(--phosphor,#35f07a)') : <span style={{ width: '18px', textAlign: 'center', color: 'var(--phosphor-dim,rgba(53,240,122,.5))' }}>?</span>}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, ...(got ? this.gx() : this.dim()) }}>{got ? a.name : '??? ??? ???'}</div>
                <div style={this.dim({ fontSize: '.86em' })}>{got ? a.desc : 'locked — keep exploring'}</div>
              </div>
              {got ? <span style={this.dim({ fontSize: '.8em' })}>+30 XP</span> : null}
            </div>
          )
        })}
      </div>
    )
  }
  lsBlock(): ReactNode {
    const items = ['about', 'projects/', 'skills', 'experience', 'education', 'blog/', 'contact', 'resume.pdf', 'achievements', '.secret']
    return (
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
        {items.map((i) => (
          <span key={i} style={i === '.secret' ? this.dim({ opacity: 0.4 }) : this.gx()}>
            {i}
          </span>
        ))}
      </div>
    )
  }
  errorBlock(cmd: string, customHint?: string): ReactNode {
    const c = cmd.split(/\s+/)[0] || cmd
    return (
      <div>
        <div style={{ color: '#ff6b6b', textShadow: '0 0 6px rgba(255,107,107,.5)' }}>-bash: {c}: command not found</div>
        <div style={{ marginTop: '4px', ...this.dim() }}>
          {customHint || 'unknown command. type '}
          <span style={this.gx()}>help</span> for the menu.
        </div>
      </div>
    )
  }
  deniedBlock(): ReactNode {
    return (
      <div>
        <div style={this.dim()}>[sudo] password for visitor: {'•'.repeat(8)}</div>
        <div style={{ color: '#ff6b6b', textShadow: '0 0 6px rgba(255,107,107,.5)', marginTop: '4px' }}>visitor is not in the sudoers file.</div>
        <div style={this.dim({ marginTop: '4px' })}>This incident has been logged, screenshotted, and printed for the fridge.</div>
        <div style={{ marginTop: '4px', ...this.gx() }}>Nice try though. +30 XP for the curiosity.</div>
      </div>
    )
  }

  // ---- boot / toast render ----
  bootNodes(): ReactNode {
    const shown = BOOT.slice(0, this.bootShown)
    return (
      <div>
        {shown.map((l, i) => {
          let st: CSSProperties = { whiteSpace: 'pre-wrap', minHeight: '1.2em', color: '#35f07a' }
          if (l.c === 'dim') st.opacity = 0.55
          if (l.c === 'ok') st = { ...st, color: '#35f07a', textShadow: '0 0 6px rgba(53,240,122,.5)' }
          if (l.c === 'bright') st = { ...st, color: '#7cffb0', textShadow: '0 0 8px rgba(124,255,176,.6)', fontWeight: 600, marginTop: '6px' }
          return (
            <div key={i} style={st}>
              {l.t || ' '}
            </div>
          )
        })}
        {this.bootShown < BOOT.length ? (
          <span style={{ display: 'inline-block', width: '.55em', height: '1em', background: '#35f07a', boxShadow: '0 0 6px rgba(53,240,122,.6)', animation: 'blink 1s step-end infinite' }} />
        ) : null}
      </div>
    )
  }
  toastNode(to: Toast): ReactNode {
    const iconEl =
      to.icon === 'trophy' ? (
        this.trophy(17, to.accent)
      ) : (
        <span style={{ fontSize: '1.05em', color: to.accent, textShadow: '0 0 8px ' + to.glow }}>{to.icon}</span>
      )
    return (
      <div
        key={to.id}
        style={{ pointerEvents: 'auto', minWidth: '232px', background: 'rgba(4,6,5,.82)', border: '1px solid ' + to.accent, borderLeft: '4px solid ' + to.accent, padding: '10px 14px', boxShadow: '0 0 22px ' + to.glow + ', inset 0 0 24px rgba(0,0,0,.5)', animation: 'toastin .34s cubic-bezier(.2,.9,.3,1.25)', backdropFilter: 'blur(2px)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          {iconEl}
          <span style={{ fontWeight: 700, fontSize: '.74em', letterSpacing: '.14em', color: to.accent, textShadow: '0 0 8px ' + to.glow }}>{to.title}</span>
        </div>
        <div style={{ marginTop: '3px', color: '#e8fff0', opacity: 0.92, fontSize: '.92em' }}>{to.sub}</div>
      </div>
    )
  }

  // ---- main render ----
  render() {
    const themes = {
      green: { p: '#35f07a', d: 'rgba(53,240,122,.45)', g: '0 0 6px rgba(53,240,122,.55), 0 0 18px rgba(53,240,122,.20)' },
      amber: { p: '#ffb23e', d: 'rgba(255,178,62,.45)', g: '0 0 6px rgba(255,178,62,.55), 0 0 18px rgba(255,178,62,.20)' },
      cyan: { p: '#5fe6f0', d: 'rgba(95,230,240,.45)', g: '0 0 6px rgba(95,230,240,.55), 0 0 18px rgba(95,230,240,.20)' },
    }
    const t = themes[this.themeOf(this.state.section)]
    const mob = this.state.mobile
    const crt = (mob ? 0.55 : 1) * 0.55

    const total = this.state.totalXp
    const xpInLevel = total % 100

    const rootVars = {
      '--phosphor': t.p,
      '--phosphor-dim': t.d,
      '--glow': t.g,
      '--crt': String(crt),
    } as CSSProperties

    return (
      <div
        onClick={this.focusInput}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          ...rootVars,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: mob ? '0px' : '2.2vmin',
            background: mob ? '#000' : '#0b0c0f',
            borderRadius: mob ? '0px' : '34px',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.03), 0 40px 120px rgba(0,0,0,.6)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: mob ? '0px' : '24px',
              background: 'radial-gradient(ellipse 120% 130% at 50% 42%, #0a0f0b 0%, #050705 55%, #000 100%)',
              boxShadow: 'inset 0 0 120px rgba(0,0,0,.7), inset 0 0 26px rgba(0,0,0,.6)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: mob ? '16px' : '30px', fontSize: mob ? '16px' : '15px', lineHeight: 1.55, zIndex: 10 }}>
              {/* status bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flex: '0 0 auto', marginBottom: '10px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    this.toggleSound()
                  }}
                  style={{ font: 'inherit', fontSize: '.82em', background: 'transparent', border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))', color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)', padding: '5px 11px', cursor: 'pointer', letterSpacing: '.04em' }}
                >
                  {this.state.soundOn ? '♪ sound: on' : '♪ muted'}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)', fontSize: '.82em' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <span style={{ opacity: 0.6 }}>{SECTION_LABELS[this.state.section]}</span>
                    <span>LVL {this.state.level}</span>
                    <span>XP {xpInLevel}/100</span>
                  </div>
                  <div style={{ width: '168px', height: '7px', border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))', background: 'rgba(0,0,0,.4)' }}>
                    <div style={{ height: '100%', width: xpInLevel + '%', background: 'var(--phosphor,#35f07a)', boxShadow: 'var(--glow)', transition: 'width .4s ease' }} />
                  </div>
                </div>
              </div>

              {/* stream */}
              <div ref={this.streamRef} className="crtstream" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', paddingRight: '8px', color: 'var(--phosphor,#35f07a)', scrollbarWidth: 'thin' }}>
                {this.state.stream.map((x) => x.node)}
              </div>

              {/* chips */}
              <div style={{ flex: '0 0 auto', display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '14px 0 10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--phosphor-dim,rgba(53,240,122,.5))', fontSize: '.78em', letterSpacing: '.1em' }}>QUICK ⸢</span>
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={(e) => {
                      e.stopPropagation()
                      this.runCommand(c)
                      window.setTimeout(() => this.focusInput(), 10)
                    }}
                    style={{ font: 'inherit', fontSize: '.92em', minHeight: mob ? '46px' : '38px', background: 'transparent', border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))', color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)', padding: '4px 13px', cursor: 'pointer', letterSpacing: '.02em' }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* input */}
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid var(--phosphor-dim,rgba(53,240,122,.22))', paddingTop: '13px' }}>
                <span style={{ color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)', whiteSpace: 'nowrap', fontWeight: 500 }}>visitor@portfolio:~$</span>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <span style={{ color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)', whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'clip' }}>{this.state.input}</span>
                  <span style={{ display: 'inline-block', width: '.58em', height: '1.05em', background: 'var(--phosphor,#35f07a)', boxShadow: 'var(--glow)', marginLeft: '1px', animation: 'blink 1.05s step-end infinite', flex: '0 0 auto' }} />
                  <input
                    ref={this.inputRef}
                    value={this.state.input}
                    onChange={this.onInput}
                    onKeyDown={this.onKey}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', color: 'transparent', caretColor: 'transparent' }}
                  />
                </div>
              </div>
            </div>

            {/* CRT layers */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,.5) 3px, rgba(0,0,0,.5) 3px)', opacity: (mob ? 0.7 : 1) * crt * 0.55, mixBlendMode: 'multiply' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 21, background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 52%, rgba(0,0,0,.5) 86%, rgba(0,0,0,.92) 100%)', opacity: 0.62 }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 22, background: 'var(--phosphor,#35f07a)', mixBlendMode: 'soft-light', animation: 'crtflicker .2s steps(3) infinite' }} />

            {/* toasts */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 40, pointerEvents: 'none', maxWidth: '80%' }}>
              {this.state.toasts.map((to) => this.toastNode(to))}
            </div>

            {/* boot overlay */}
            {this.state.booting ? (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  this.skipBoot()
                }}
                style={{ position: 'absolute', inset: 0, zIndex: 60, background: '#000', padding: mob ? '16px' : '30px', overflow: 'hidden', color: '#35f07a', fontSize: mob ? '16px' : '15px', lineHeight: 1.6, cursor: 'pointer' }}
              >
                {this.bootNodes()}
                <div style={{ position: 'absolute', bottom: '18px', left: 0, right: 0, textAlign: 'center', color: 'rgba(53,240,122,.55)', fontSize: '.82em', letterSpacing: '.12em', animation: 'blink 1.4s step-end infinite' }}>press any key to skip ⸢</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
