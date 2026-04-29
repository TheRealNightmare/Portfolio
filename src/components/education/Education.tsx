import { motion } from 'framer-motion'
import { HiAcademicCap } from 'react-icons/hi'
import SectionWrapper from '../ui/SectionWrapper'

export default function Education() {
  return (
    <SectionWrapper id="education">
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs tracking-widest uppercase mb-2">// education</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#e6edf3]">Academic Background</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ boxShadow: '0 8px 28px rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)' }}
          className="bg-[#161b22] border border-[#30363d] rounded-xl p-7 flex gap-5 transition-colors duration-200 will-change-transform"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-950/60 border border-green-800/40 flex items-center justify-center">
            <HiAcademicCap size={24} className="text-green-400" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-[#e6edf3]">United International University</h3>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#21262d] text-[#8b949e] border border-[#30363d] flex-shrink-0">
                2023 – Present
              </span>
            </div>
            <p className="font-mono text-green-400 text-sm mb-3">B.Sc. in Computer Science & Engineering</p>
            <p className="text-[#8b949e] text-sm leading-relaxed">
              Studying core CS fundamentals — algorithms, data structures, operating systems, and software engineering —
              while applying knowledge in real-world software development roles.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
