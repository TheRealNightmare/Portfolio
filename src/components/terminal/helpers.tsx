import type { CSSProperties, ReactNode } from 'react'

export const gx = (): CSSProperties => ({
  color: 'var(--phosphor,#35f07a)',
  textShadow: 'var(--glow)',
})

export const dim = (o?: CSSProperties): CSSProperties => ({
  color: 'var(--phosphor-dim,rgba(53,240,122,.5))',
  ...(o || {}),
})

export function pre(text: string, extra?: CSSProperties): ReactNode {
  return (
    <pre
      style={{
        margin: 0,
        fontFamily: 'inherit',
        whiteSpace: 'pre',
        lineHeight: 1.25,
        ...gx(),
        ...(extra || {}),
      }}
    >
      {text}
    </pre>
  )
}

export function heading(text: string, sub?: string): ReactNode {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        marginBottom: '10px',
        borderBottom: '1px solid var(--phosphor-dim,rgba(53,240,122,.22))',
        paddingBottom: '7px',
      }}
    >
      <span style={{ fontWeight: 700, fontSize: '1.05em', letterSpacing: '.06em', ...gx() }}>
        {text}
      </span>
      {sub ? <span style={dim({ fontSize: '.8em' })}>{sub}</span> : null}
    </div>
  )
}

export function tag(text: string): ReactNode {
  return (
    <span
      key={text}
      style={{
        border: '1px solid var(--phosphor-dim,rgba(53,240,122,.4))',
        color: 'var(--phosphor,#35f07a)',
        padding: '1px 9px',
        fontSize: '.78em',
        opacity: 0.92,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  )
}

export function link(text: string, href?: string, onClick?: () => void): ReactNode {
  const style: CSSProperties = {
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
    ...gx(),
  }
  if (href) {
    return (
      <a
        key={text}
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
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
        onClick?.()
      }}
      style={style}
    >
      {text}
    </span>
  )
}

export function p(text: string): ReactNode {
  return (
    <div style={{ marginBottom: '8px', color: 'var(--phosphor,#35f07a)', opacity: 0.92 }}>
      {text}
    </div>
  )
}

export function trophy(size = 15, color = '#ffd24a'): ReactNode {
  const path = (d: string) => (
    <path d={d} stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
  )
  return (
    <svg
      width={size}
      height={size}
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

export function box(lines: string[], pad = 3): string {
  const w = Math.max(...lines.map((l) => l.length)) + pad * 2
  const top = '┌' + '─'.repeat(w) + '┐'
  const bot = '└' + '─'.repeat(w) + '┘'
  const mid = lines.map(
    (l) => '│' + ' '.repeat(pad) + l + ' '.repeat(w - pad - l.length) + '│',
  )
  return [top, ...mid, bot].join('\n')
}
