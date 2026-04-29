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
