import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import SkillCard from './SkillCard'
import { skillGroups } from '../../data/skills'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

export default function Skills() {
  return (
    <SectionWrapper id="skills" className="bg-[#161b22]/30">
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs tracking-widest uppercase mb-2">// skills</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#e6edf3]">What I Work With</h2>
      </div>

      <div className="space-y-10">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-green-600">#</span>
              <h3 className="font-mono text-xs font-semibold text-[#6e7681] uppercase tracking-wider">
                {group.category}
              </h3>
              <div className="flex-1 h-px bg-[#21262d]" />
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3"
            >
              {group.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
