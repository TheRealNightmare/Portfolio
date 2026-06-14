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
      { name: 'C', Icon: SiC, level: 78 },
      { name: 'C++', Icon: SiCplusplus, level: 80 },
      { name: 'PHP', Icon: SiPhp, level: 72 },
      { name: 'Java', Icon: FaJava, level: 70 },
      { name: 'Python', Icon: SiPython, level: 88 },
      { name: 'JavaScript', Icon: SiJavascript, level: 90 },
      { name: 'Bash', Icon: SiGnubash, level: 68 },
    ],
  },
  {
    category: 'Frontend',
    skills: [
      { name: 'React', Icon: SiReact, level: 90 },
      { name: 'Vue.js', Icon: SiVuedotjs, level: 80 },
      { name: 'Nuxt.js', Icon: SiNuxt, level: 74 },
      { name: 'Next.js', Icon: SiNextdotjs, level: 82 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Django', Icon: SiDjango, level: 80 },
      { name: 'Laravel', Icon: SiLaravel, level: 78 },
      { name: 'FastAPI', Icon: SiFastapi, level: 76 },
    ],
  },
  {
    category: 'Mobile & Embedded',
    skills: [
      { name: 'Android', Icon: SiAndroid, level: 70 },
      { name: 'Arduino', Icon: SiArduino, level: 66 },
      { name: 'Ionic', Icon: SiIonic, level: 68 },
      { name: 'Capacitor', Icon: SiCapacitor, level: 66 },
    ],
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', Icon: FaAws, level: 64 },
      { name: 'Docker', Icon: SiDocker, level: 78 },
      { name: 'Kubernetes', Icon: SiKubernetes, level: 60 },
      { name: 'Git', Icon: SiGit, level: 86 },
      { name: 'Linux', Icon: SiLinux, level: 82 },
    ],
  },
]
