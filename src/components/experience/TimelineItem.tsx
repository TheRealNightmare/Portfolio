import { motion } from 'framer-motion'
import type { TimelineEntry } from '../../types'

const itemVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

interface Props {
  entry: TimelineEntry
}

export default function TimelineItem({ entry }: Props) {
  return (
    <motion.div variants={itemVariants} className="relative pl-10">
      {/* Dot */}
      <div className="absolute left-0 top-4 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0d1117] shadow-md shadow-green-500/50" />

      <motion.div
        whileHover={{
          y: -2,
          boxShadow: '0 8px 28px rgba(34,197,94,0.1)',
          transition: { type: 'spring', stiffness: 300 },
        }}
        className="bg-[#161b22] border border-[#30363d] hover:border-green-500/30 rounded-xl p-5 transition-colors duration-200 will-change-transform"
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-[#e6edf3]">{entry.role}</h3>
            <p className="font-mono text-green-400 text-sm">{entry.company}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#21262d] text-[#8b949e] border border-[#30363d]">
              {entry.period}
            </span>
            {entry.current && (
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-green-950/60 text-green-400 border border-green-800/50">
                current
              </span>
            )}
          </div>
        </div>
        <p className="text-[#8b949e] text-sm leading-relaxed">{entry.description}</p>
      </motion.div>
    </motion.div>
  )
}
