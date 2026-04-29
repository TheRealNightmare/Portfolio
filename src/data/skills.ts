import {
  SiC,
  SiCplusplus,
  SiPhp,
  SiJavascript,
  SiPython,
  SiGnubash,
  SiReact,
  SiVuedotjs,
  SiNuxt,
  SiNextdotjs,
  SiDjango,
  SiLaravel,
  SiFastapi,
  SiAndroid,
  SiArduino,
  SiIonic,
  SiCapacitor,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiLinux,
} from 'react-icons/si'
import { FaJava, FaAws } from 'react-icons/fa'
import type { SkillGroup } from '../types'

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: [
      { name: 'C', Icon: SiC },
      { name: 'C++', Icon: SiCplusplus },
      { name: 'PHP', Icon: SiPhp },
      { name: 'Java', Icon: FaJava },
      { name: 'Python', Icon: SiPython },
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'Bash', Icon: SiGnubash },
    ],
  },
  {
    category: 'Frontend',
    skills: [
      { name: 'React', Icon: SiReact },
      { name: 'Vue.js', Icon: SiVuedotjs },
      { name: 'Nuxt.js', Icon: SiNuxt },
      { name: 'Next.js', Icon: SiNextdotjs },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Django', Icon: SiDjango },
      { name: 'Laravel', Icon: SiLaravel },
      { name: 'FastAPI', Icon: SiFastapi },
    ],
  },
  {
    category: 'Mobile & Embedded',
    skills: [
      { name: 'Android', Icon: SiAndroid },
      { name: 'Arduino', Icon: SiArduino },
      { name: 'Ionic', Icon: SiIonic },
      { name: 'Capacitor', Icon: SiCapacitor },
    ],
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', Icon: FaAws },
      { name: 'Docker', Icon: SiDocker },
      { name: 'Kubernetes', Icon: SiKubernetes },
      { name: 'Git', Icon: SiGit },
      { name: 'Linux', Icon: SiLinux },
    ],
  },
]
