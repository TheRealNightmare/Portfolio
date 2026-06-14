import type { ComponentType } from 'react'

export interface Project {
  title: string
  description: string
  language: string
  languageColor: string
  repoUrl: string
  tags: string[]
}

export interface Skill {
  name: string
  Icon: ComponentType<{ size?: number; className?: string }>
  /** Self-assessed proficiency 0–100, used for the terminal skill bars. */
  level?: number
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

export interface TimelineEntry {
  company: string
  role: string
  period: string
  description: string
  current?: boolean
}

export interface EducationEntry {
  institution: string
  degree: string
  period: string
  description: string
}

export interface Post {
  id: number
  title: string
  date: string
  read: string
  tags: string[]
  body: string[]
}
