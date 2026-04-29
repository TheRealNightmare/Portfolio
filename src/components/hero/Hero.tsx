import { motion } from 'framer-motion'
import { HiArrowDown } from 'react-icons/hi'
import { SiGithub } from 'react-icons/si'
import TypingTitle from './TypingTitle'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="scanlines relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl w-full"
      >
        {/* Terminal prompt */}
        <motion.p variants={item} className="font-mono text-sky-400 text-sm mb-6 tracking-wide">
          <span className="text-[#6e7681]">~/portfolio</span>
          <span className="text-[#8b949e]"> $ </span>
          whoami
        </motion.p>

        {/* Big name */}
        <motion.h1
          variants={item}
          className="font-black tracking-tighter leading-none mb-1 text-[#e6edf3]"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
        >
          MIRAZUL
        </motion.h1>
        <motion.h1
          variants={item}
          className="font-black tracking-tighter leading-none text-[#e6edf3]"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
        >
          ISLAM{' '}
          <span className="text-sky-400">NAHID</span>
        </motion.h1>

        {/* Separator */}
        <motion.div variants={item} className="flex items-center justify-center gap-4 my-6">
          <div className="flex-1 max-w-[180px] h-px bg-[#30363d]" />
          <span className="font-mono text-sky-600 text-xs tracking-widest">SOFTWARE DEVELOPER</span>
          <div className="flex-1 max-w-[180px] h-px bg-[#30363d]" />
        </motion.div>

        {/* Typing role */}
        <motion.div variants={item} className="mb-4 flex items-center justify-center gap-2 font-mono text-sm text-[#8b949e]">
          <span className="text-sky-600">$</span>
          <TypingTitle />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-[#8b949e] text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed"
        >
          Always exploring, always learning, building things as I grow.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-wrap gap-4 justify-center">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(56,189,248,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="font-mono px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#0d1117] font-bold text-sm transition-colors duration-200"
          >
            ./view-work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="font-mono px-6 py-2.5 rounded-lg border border-[#30363d] hover:border-sky-500/60 text-[#8b949e] hover:text-sky-400 text-sm transition-all duration-200"
          >
            ./contact-me
          </motion.a>
          <motion.a
            href="https://github.com/TheRealNightmare"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="font-mono px-6 py-2.5 rounded-lg border border-[#30363d] hover:border-[#6e7681] text-[#6e7681] hover:text-[#c9d1d9] text-sm transition-all duration-200 flex items-center gap-2"
          >
            <SiGithub size={14} />
            github
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#6e7681] hover:text-sky-400 transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiArrowDown size={18} />
        </motion.div>
      </motion.a>
    </section>
  )
}
