import { motion } from 'framer-motion'
import type { Skill } from '../../types'

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
}

interface Props {
  skill: Skill
}

export default function SkillCard({ skill }: Props) {
  const { name, Icon } = skill
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.08,
        boxShadow: '0 0 20px rgba(34,197,94,0.25)',
        transition: { type: 'spring', stiffness: 300, damping: 18 },
      }}
      className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-green-500/50 transition-colors duration-200 cursor-default will-change-transform"
    >
      <Icon size={24} className="text-[#6e7681] group-hover:text-green-400 transition-colors duration-200" />
      <span className="font-mono text-xs text-[#6e7681] group-hover:text-[#c9d1d9] text-center leading-tight transition-colors duration-200">
        {name}
      </span>
    </motion.div>
  )
}
