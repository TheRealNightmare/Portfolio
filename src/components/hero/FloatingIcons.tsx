import { motion } from 'framer-motion'
import {
  SiReact, SiPython, SiDocker, SiGit, SiJavascript,
  SiDjango, SiLinux, SiTypescript, SiKubernetes,
  SiVuedotjs, SiFastapi,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

const icons = [
  { Icon: SiReact, top: 12, left: 8 },
  { Icon: SiPython, top: 20, left: 85 },
  { Icon: SiDocker, top: 65, left: 6 },
  { Icon: SiGit, top: 80, left: 80 },
  { Icon: SiJavascript, top: 35, left: 92 },
  { Icon: SiDjango, top: 75, left: 45 },
  { Icon: SiLinux, top: 15, left: 55 },
  { Icon: SiTypescript, top: 50, left: 90 },
  { Icon: SiKubernetes, top: 88, left: 20 },
  { Icon: SiVuedotjs, top: 42, left: 3 },
  { Icon: SiFastapi, top: 60, left: 70 },
  { Icon: FaAws, top: 30, left: 20 },
]

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {icons.map(({ Icon, top, left }, i) => (
        <motion.div
          key={i}
          className="absolute text-slate-700/50"
          style={{ top: `${top}%`, left: `${left}%` }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.35,
          }}
        >
          <Icon size={28 + (i % 3) * 6} />
        </motion.div>
      ))}
    </div>
  )
}
