import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import TimelineItem from './TimelineItem'
import { timeline } from '../../data/experience'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-[#161b22]/30">
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs tracking-widest uppercase mb-2">// experience</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#e6edf3]">Where I've Worked</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute left-[5px] top-3 bottom-3 w-px bg-[#30363d]" />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-5"
          >
            {timeline.map((entry) => (
              <TimelineItem key={entry.company} entry={entry} />
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
