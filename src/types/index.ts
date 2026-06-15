import type { ReactNode } from 'react'
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

export interface Achievement {
  id: string
  name: string
  desc: string
}

export type ThemeName = 'green' | 'amber' | 'cyan' | 'blood' | 'void' | 'matrix'

export interface ThemeDef {
  name: ThemeName
  label: string
  p: string
  d: string
  g: string
}

export type Section =
  | 'home'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'blog'
  | 'contact'

export interface Toast {
  id: number
  title: string
  sub: string
  accent: string
  glow: string
  icon: string
}

export interface StreamItem {
  id: number
  node: ReactNode
}

export interface CommandContext {
  print: (node: ReactNode) => void
  clearStream: () => void
  setSection: (s: Section) => void
  markVisited: (s: string) => void
  markPostVisited: (id: number) => void
  unlock: (id: string) => void
  unlockTheme: (name: ThemeName) => void
  applyTheme: (name: ThemeName) => boolean
  beep: (freq: number) => void
  pushToast: (o: Omit<Toast, 'id'>) => void
  runCommand: (raw: string) => void
  addXp: (n: number) => void
  mobile: boolean
  smallMobile: boolean
  unlocked: Set<string>
  visitedPosts: Set<number>
  unlockedThemes: Set<ThemeName>
}
