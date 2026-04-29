import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { HiExternalLink } from 'react-icons/hi'
import Tag from '../ui/Tag'
import type { Project } from '../../types'

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 48px rgba(34,197,94,0.12)',
        transition: { type: 'spring', stiffness: 280, damping: 22 },
      }}
      className="group flex flex-col h-full bg-[#161b22] border border-[#30363d] hover:border-green-500/40 rounded-xl p-6 gap-4 transition-colors duration-300 will-change-transform"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.languageColor }}
          />
          <span className="font-mono text-xs text-[#6e7681]">{project.language}</span>
        </div>
        <motion.a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="text-[#6e7681] hover:text-green-400 transition-colors duration-200"
          aria-label={`View ${project.title} on GitHub`}
        >
          <HiExternalLink size={15} />
        </motion.a>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-mono text-base font-semibold text-[#e6edf3] mb-2 group-hover:text-green-400 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-[#8b949e] text-sm leading-relaxed">{project.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      {/* Footer link */}
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-mono text-xs text-[#6e7681] hover:text-green-400 transition-colors duration-200"
      >
        <SiGithub size={13} />
        view source
      </a>
    </motion.div>
  )
}
