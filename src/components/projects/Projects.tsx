import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import ProjectCard from './ProjectCard'
import { projects } from '../../data/projects'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs tracking-widest uppercase mb-2">// projects</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#e6edf3]">What I've Built</h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
