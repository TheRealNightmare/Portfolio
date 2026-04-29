import { useState } from 'react'
import { motion } from 'framer-motion'

const WEB3FORMS_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, name, email, message, subject: `Portfolio: ${name}` }),
      })
      const data = await res.json() as { success: boolean }
      if (data.success) {
        setStatus('success')
        setName(''); setEmail(''); setMessage('')
      } else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputClass =
    'w-full bg-[#0d1117] border border-[#30363d] focus:border-green-500/60 rounded-lg px-4 py-3 text-[#e6edf3] placeholder-[#6e7681] outline-none transition-colors duration-200 text-sm font-mono'

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-start gap-3 py-6"
      >
        <div className="font-mono text-sm text-green-400">
          <span className="text-[#6e7681]">$</span> message --sent ✓
        </div>
        <p className="text-[#8b949e] text-sm">Thanks for reaching out. I'll get back to you soon.</p>
        <button onClick={() => setStatus('idle')} className="font-mono text-xs text-green-500 hover:text-green-400 transition-colors">
          $ send --another
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="font-mono text-xs text-[#6e7681] mb-1.5 block">name:</label>
        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="font-mono text-xs text-[#6e7681] mb-1.5 block">email:</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="font-mono text-xs text-[#6e7681] mb-1.5 block">message:</label>
        <textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="what's on your mind?" className={`${inputClass} resize-none`} />
      </div>

      {status === 'error' && (
        <p className="font-mono text-xs text-red-400">$ error: something went wrong. try again.</p>
      )}

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        whileHover={{ scale: 1.02, boxShadow: '0 0 22px rgba(34,197,94,0.3)' }}
        whileTap={{ scale: 0.97 }}
        className="w-full font-mono py-3 rounded-lg bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1117] font-bold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {status === 'sending' ? (
          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>sending…</>
        ) : '$ send --message'}
      </motion.button>
    </form>
  )
}
