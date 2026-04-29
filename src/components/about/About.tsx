import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionWrapper from '../ui/SectionWrapper'

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <SectionWrapper id="about">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center md:justify-start"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 250 } }}
          >
            <div className="absolute -inset-px bg-gradient-to-br from-green-500/40 to-emerald-500/20 rounded-2xl blur-sm" />
            <div className="absolute -inset-[3px] rounded-2xl border border-green-500/20" />
            <img
              src="https://avatars.githubusercontent.com/TheRealNightmare"
              alt="Mirazul Islam Nahid"
              className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl object-cover border border-[#30363d]"
            />
            {/* Terminal badge */}
            <div className="absolute -bottom-3 -right-3 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 font-mono text-xs text-green-400">
              &gt; available
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="space-y-5"
        >
          <div>
            <p className="font-mono text-green-500 text-xs tracking-widest uppercase mb-2">// about-me</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#e6edf3]">Who I Am</h2>
          </div>

          <p className="text-[#8b949e] leading-relaxed">
            I'm <span className="text-[#e6edf3] font-medium">Mirazul Islam Nahid</span> — a Computer Science & Engineering
            student at <span className="text-[#e6edf3] font-medium">United International University</span> and a Software
            Developer at <span className="text-[#e6edf3] font-medium">MonerBondhu</span>.
          </p>

          <p className="text-[#8b949e] leading-relaxed">
            I started my professional journey as a web developer at{' '}
            <span className="text-[#e6edf3] font-medium">Rokirovka</span> in 2021, sharpening my skills on real-world
            products. Today I build full-stack software while pushing forward in my studies — because the best learning
            happens when theory meets practice.
          </p>

          <p className="text-[#8b949e] leading-relaxed">
            My stack spans low-level systems (C, C++) through cloud-native deployments (Docker, Kubernetes, AWS). I love
            exploring new tools and growing every single day.
          </p>

          <div className="border-l-2 border-green-500 pl-4 font-mono text-sm text-[#8b949e] italic">
            "Always exploring, always learning, building things as I grow."
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
