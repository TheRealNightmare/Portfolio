import { useState, useRef, useEffect, useCallback } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './crt.css'
import { useResize } from './hooks/useResize'
import { useAudio } from './hooks/useAudio'
import { useHistory } from './hooks/useHistory'
import { useTheme } from './hooks/useTheme'
import { useGameState } from './hooks/useGameState'
import { useBootSequence } from './hooks/useBootSequence'
import { useTabCompletion } from './hooks/useTabCompletion'
import { runCommand } from './commands/runCommand'
import { greetingNode } from './blocks'
import type { Section, StreamItem, Toast, CommandContext } from '../../types'

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

export default function Terminal() {
  const resize = useResize()
  const audio = useAudio()
  const history = useHistory()
  const theme = useTheme()

  const [stream, setStream] = useState<StreamItem[]>([])
  const [input, setInput] = useState('')
  const [section, setSection] = useState<Section>('home')

  const nidRef = useRef(1)
  const shouldScrollRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)

  const game = useGameState({ beep: audio.beep, unlockTheme: theme.unlockTheme })

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  const print = useCallback((node: ReactNode) => {
    const id = nidRef.current++
    shouldScrollRef.current = true
    setStream((s) => [
      ...s,
      { id, node: <div key={id} style={{ marginBottom: '16px' }}>{node}</div> },
    ])
  }, [])

  const clearStream = useCallback(() => setStream([]), [])

  const onBootFinish = useCallback(() => {
    print(greetingNode(resize.smallMobile))
    window.setTimeout(focusInput, 60)
  }, [print, resize.smallMobile, focusInput])

  const boot = useBootSequence(onBootFinish)

  const tab = useTabCompletion({
    unlock: game.unlock,
    unlockedThemes: theme.unlockedThemes,
  })

  // ctx is rebuilt each render — functions like unlock/beep are stable via useCallback
  const ctx: CommandContext = {
    print,
    clearStream,
    setSection,
    markVisited: game.markVisited,
    markPostVisited: game.markPostVisited,
    unlock: game.unlock,
    unlockTheme: theme.unlockTheme,
    applyTheme: theme.applyTheme,
    beep: audio.beep,
    pushToast: game.pushToast,
    runCommand: execCommand,
    addXp: game.addXp,
    mobile: resize.mobile,
    smallMobile: resize.smallMobile,
    unlocked: game.unlocked,
    visitedPosts: game.visitedPosts,
    unlockedThemes: theme.unlockedThemes,
  }

  function execCommand(raw: string) {
    runCommand(raw, ctx)
    game.afterCommand()
  }

  // Auto-scroll after new stream items
  useEffect(() => {
    if (shouldScrollRef.current && streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight
      shouldScrollRef.current = false
    }
  })

  // Global keydown: skip boot or focus input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (boot.booting) {
        boot.skipBoot()
        return
      }
      const el = inputRef.current
      if (el && document.activeElement !== el && e.key && e.key.length === 1) el.focus()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [boot.booting, boot.skipBoot])

  // Focus input on mount
  useEffect(() => {
    window.setTimeout(focusInput, 60)
  }, [focusInput])

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim()) history.push(input)
      const cmd = input
      setInput('')
      execCommand(cmd)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const completed = tab.handleTab(input, print)
      if (completed !== null) setInput(completed)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      game.unlock('historian')
      const prev = history.back()
      if (prev !== undefined) setInput(prev)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setInput(history.forward())
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      clearStream()
    }
  }

  // Responsive layout values
  const mob = resize.mobile
  const smob = resize.smallMobile
  const land = resize.landscape
  const crt = (mob ? 0.55 : 1) * 0.55
  const innerPad = smob ? '10px' : land && mob ? '8px' : mob ? '12px' : '30px'
  const baseFontSize = smob || (land && mob) ? '13px' : mob ? '14px' : '15px'
  const chipMinH = land && mob ? '36px' : mob ? '46px' : '38px'
  const xpBarW = smob || (land && mob) ? '110px' : mob ? '140px' : '168px'
  const xpInLevel = game.totalXp % 100

  const rootVars = { ...theme.cssVars, '--crt': String(crt) } as CSSProperties

  return (
    <div
      onClick={focusInput}
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
            background:
              'radial-gradient(ellipse 120% 130% at 50% 42%, #0a0f0b 0%, #050705 55%, #000 100%)',
            boxShadow: 'inset 0 0 120px rgba(0,0,0,.7), inset 0 0 26px rgba(0,0,0,.6)',
          }}
        >
          {/* content layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              padding: innerPad,
              fontSize: baseFontSize,
              lineHeight: 1.55,
              zIndex: 10,
            }}
          >
            {/* status bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
                flex: '0 0 auto',
                marginBottom: '10px',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  audio.toggleSound(focusInput)
                }}
                style={{
                  font: 'inherit',
                  fontSize: '.82em',
                  background: 'transparent',
                  border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))',
                  color: 'var(--phosphor,#35f07a)',
                  textShadow: 'var(--glow)',
                  padding: '5px 11px',
                  cursor: 'pointer',
                  letterSpacing: '.04em',
                }}
              >
                {audio.soundOn ? '♪ sound: on' : '♪ muted'}
              </button>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '5px',
                  color: 'var(--phosphor,#35f07a)',
                  textShadow: 'var(--glow)',
                  fontSize: '.82em',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {smob ? null : (
                    <span style={{ opacity: 0.6 }}>{SECTION_LABELS[section]}</span>
                  )}
                  <span>LVL {game.level}</span>
                  <span>XP {xpInLevel}/100</span>
                </div>
                <div
                  style={{
                    width: xpBarW,
                    height: '7px',
                    border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))',
                    background: 'rgba(0,0,0,.4)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: xpInLevel + '%',
                      background: 'var(--phosphor,#35f07a)',
                      boxShadow: 'var(--glow)',
                      transition: 'width .4s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* stream */}
            <div
              ref={streamRef}
              className="crtstream"
              style={{
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '8px',
                color: 'var(--phosphor,#35f07a)',
                scrollbarWidth: 'thin',
              }}
            >
              {stream.map((x) => x.node)}
            </div>

            {/* chips */}
            <div
              style={{
                flex: '0 0 auto',
                display: 'grid',
                gridTemplateColumns: mob
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fill, minmax(90px, auto))',
                gap: mob ? '6px' : '8px',
                margin: land && mob ? '8px 0 6px' : '14px 0 10px',
              }}
            >
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={(e) => {
                    e.stopPropagation()
                    execCommand(c)
                    window.setTimeout(focusInput, 10)
                  }}
                  style={{
                    font: 'inherit',
                    fontSize: '.92em',
                    minHeight: chipMinH,
                    background: 'transparent',
                    border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))',
                    color: 'var(--phosphor,#35f07a)',
                    textShadow: 'var(--glow)',
                    padding: '4px 13px',
                    cursor: 'pointer',
                    letterSpacing: '.02em',
                    width: '100%',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* input line */}
            <div
              style={{
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid var(--phosphor-dim,rgba(53,240,122,.22))',
                paddingTop: '13px',
              }}
            >
              <span
                style={{
                  color: 'var(--phosphor,#35f07a)',
                  textShadow: 'var(--glow)',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                {mob ? '~$' : 'visitor@portfolio:~$'}
              </span>
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    color: 'var(--phosphor,#35f07a)',
                    textShadow: 'var(--glow)',
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'clip',
                  }}
                >
                  {input}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '.58em',
                    height: '1.05em',
                    background: 'var(--phosphor,#35f07a)',
                    boxShadow: 'var(--glow)',
                    marginLeft: '1px',
                    animation: 'blink 1.05s step-end infinite',
                    flex: '0 0 auto',
                  }}
                />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    font: 'inherit',
                    color: 'transparent',
                    caretColor: 'transparent',
                  }}
                />
              </div>
            </div>
          </div>

          {/* CRT scanlines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 20,
              background:
                'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,.5) 3px, rgba(0,0,0,.5) 3px)',
              opacity: (mob ? 0.7 : 1) * crt * 0.55,
              mixBlendMode: 'multiply',
            }}
          />
          {/* CRT vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 21,
              background:
                'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 52%, rgba(0,0,0,.5) 86%, rgba(0,0,0,.92) 100%)',
              opacity: 0.62,
            }}
          />
          {/* CRT flicker */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 22,
              background: 'var(--phosphor,#35f07a)',
              mixBlendMode: 'soft-light',
              animation: 'crtflicker .2s steps(3) infinite',
            }}
          />

          {/* Toasts */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              zIndex: 40,
              pointerEvents: 'none',
              maxWidth: '80%',
            }}
          >
            {game.toasts.map((to) => (
              <ToastItem key={to.id} toast={to} />
            ))}
          </div>

          {/* Boot overlay */}
          {boot.booting ? (
            <div
              onClick={(e) => {
                e.stopPropagation()
                boot.skipBoot()
              }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 60,
                background: '#000',
                padding: innerPad,
                overflow: 'hidden',
                color: '#35f07a',
                fontSize: baseFontSize,
                lineHeight: 1.6,
                cursor: 'pointer',
              }}
            >
              <BootScreen bootShown={boot.bootShown} />
              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: 'rgba(53,240,122,.55)',
                  fontSize: '.82em',
                  letterSpacing: '.12em',
                  animation: 'blink 1.4s step-end infinite',
                }}
              >
                press any key to skip ⸢
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function BootScreen({ bootShown }: { bootShown: number }) {
  return (
    <div>
      {BOOT.slice(0, bootShown).map((l, i) => {
        let st: CSSProperties = { whiteSpace: 'pre-wrap', minHeight: '1.2em', color: '#35f07a' }
        if (l.c === 'dim') st.opacity = 0.55
        if (l.c === 'ok')
          st = { ...st, color: '#35f07a', textShadow: '0 0 6px rgba(53,240,122,.5)' }
        if (l.c === 'bright')
          st = {
            ...st,
            color: '#7cffb0',
            textShadow: '0 0 8px rgba(124,255,176,.6)',
            fontWeight: 600,
            marginTop: '6px',
          }
        return (
          <div key={i} style={st}>
            {l.t || ' '}
          </div>
        )
      })}
      {bootShown < BOOT.length ? (
        <span
          style={{
            display: 'inline-block',
            width: '.55em',
            height: '1em',
            background: '#35f07a',
            boxShadow: '0 0 6px rgba(53,240,122,.6)',
            animation: 'blink 1s step-end infinite',
          }}
        />
      ) : null}
    </div>
  )
}

function ToastItem({ toast: to }: { toast: Toast }) {
  const iconEl =
    to.icon === 'trophy' ? (
      <TrophyIcon color={to.accent} />
    ) : (
      <span
        style={{ fontSize: '1.05em', color: to.accent, textShadow: '0 0 8px ' + to.glow }}
      >
        {to.icon}
      </span>
    )
  return (
    <div
      style={{
        pointerEvents: 'auto',
        minWidth: '232px',
        background: 'rgba(4,6,5,.82)',
        border: '1px solid ' + to.accent,
        borderLeft: '4px solid ' + to.accent,
        padding: '10px 14px',
        boxShadow: '0 0 22px ' + to.glow + ', inset 0 0 24px rgba(0,0,0,.5)',
        animation: 'toastin .34s cubic-bezier(.2,.9,.3,1.25)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        {iconEl}
        <span
          style={{
            fontWeight: 700,
            fontSize: '.74em',
            letterSpacing: '.14em',
            color: to.accent,
            textShadow: '0 0 8px ' + to.glow,
          }}
        >
          {to.title}
        </span>
      </div>
      <div style={{ marginTop: '3px', color: '#e8fff0', opacity: 0.92, fontSize: '.92em' }}>
        {to.sub}
      </div>
    </div>
  )
}

function TrophyIcon({ color = '#ffd24a' }: { color?: string }) {
  const path = (d: string) => (
    <path
      d={d}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  )
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      style={{ flex: '0 0 auto', filter: 'drop-shadow(0 0 5px ' + color + ')' }}
    >
      {path('M6 4h12v3a6 6 0 0 1-12 0V4Z')}
      {path('M6 5H3.5v1.5A2.5 2.5 0 0 0 6 9')}
      {path('M18 5h2.5v1.5A2.5 2.5 0 0 1 18 9')}
      {path('M12 13v3')}
      {path('M9.5 20h5')}
      {path('M10 16.5h4l.4 3.5h-4.8l.4-3.5Z')}
    </svg>
  )
}
