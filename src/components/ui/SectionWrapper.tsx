import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface Props {
  id: string
  className?: string
  children: React.ReactNode
}

export default function SectionWrapper({ id, className = '', children }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.07 })
  return (
    <section id={id} className={`py-24 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={variants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
