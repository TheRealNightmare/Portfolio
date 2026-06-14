import { useState } from 'react'

type Status = 'idle' | 'sending' | 'success' | 'error'

const phosphor = { color: 'var(--phosphor,#35f07a)', textShadow: 'var(--glow)' } as const
const dim = { color: 'var(--phosphor-dim,rgba(53,240,122,.5))' } as const

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,.4)',
  border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))',
  color: 'var(--phosphor,#35f07a)',
  textShadow: 'var(--glow)',
  font: 'inherit',
  fontSize: '.92em',
  padding: '8px 10px',
  outline: 'none',
}

export default function ContactTerminalForm({
  onResult,
}: {
  onResult?: (ok: boolean) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean }
      if (res.ok && data.success) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        onResult?.(true)
      } else {
        setStatus('error')
        onResult?.(false)
      }
    } catch {
      setStatus('error')
      onResult?.(false)
    }
  }

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  if (status === 'success') {
    return (
      <div style={{ marginTop: '4px' }}>
        <div style={phosphor}>message --sent ✓</div>
        <div style={{ ...dim, marginTop: '4px' }}>
          Thanks for reaching out — I'll get back to you soon.
        </div>
        <button
          onClick={(e) => {
            stop(e)
            setStatus('idle')
          }}
          style={{
            ...phosphor,
            marginTop: '8px',
            background: 'transparent',
            border: '1px solid var(--phosphor-dim,rgba(53,240,122,.35))',
            font: 'inherit',
            fontSize: '.86em',
            padding: '5px 11px',
            cursor: 'pointer',
          }}
        >
          $ send --another
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      onClick={stop}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '440px', marginTop: '6px' }}
    >
      <label style={{ ...dim, fontSize: '.8em' }}>
        name:
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          style={{ ...fieldStyle, marginTop: '3px' }}
        />
      </label>
      <label style={{ ...dim, fontSize: '.8em' }}>
        email:
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{ ...fieldStyle, marginTop: '3px' }}
        />
      </label>
      <label style={{ ...dim, fontSize: '.8em' }}>
        message:
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="what's on your mind?"
          style={{ ...fieldStyle, marginTop: '3px', resize: 'vertical' }}
        />
      </label>

      {status === 'error' && (
        <div style={{ color: '#ff6b6b', textShadow: '0 0 6px rgba(255,107,107,.5)', fontSize: '.86em' }}>
          $ error: could not send. email me directly instead.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          ...phosphor,
          alignSelf: 'flex-start',
          background: 'transparent',
          border: '1px solid var(--phosphor,#35f07a)',
          font: 'inherit',
          fontWeight: 600,
          padding: '8px 16px',
          marginTop: '2px',
          cursor: status === 'sending' ? 'default' : 'pointer',
          opacity: status === 'sending' ? 0.6 : 1,
        }}
      >
        {status === 'sending' ? 'sending…' : '$ send --message'}
      </button>
    </form>
  )
}
