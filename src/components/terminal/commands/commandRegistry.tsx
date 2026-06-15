import type { ReactNode } from 'react'
import { SkillTree } from '../widgets/SkillTree'
import {
  helpBlock,
  aboutBlock,
  projectsBlock,
  projectDetail,
  skillsBlock,
  experienceBlock,
  educationBlock,
  blogBlock,
  blogPost,
  contactBlock,
  resumeBlock,
  achievementsBlock,
  themeBlock,
  lsBlock,
  errorBlock,
  deniedBlock,
  projectId,
} from '../blocks'
import { gx, dim } from '../helpers'
import { projects } from '../../../data/projects'
import { posts } from '../../../data/posts'
import type { CommandContext, ThemeName } from '../../../types'

export type CommandHandler = (parts: string[], ctx: CommandContext) => ReactNode

export const VISIBLE_COMMANDS = [
  'about',
  'achievements',
  'badges',
  'blog',
  'cat',
  'clear',
  'cls',
  'contact',
  'cv',
  'dir',
  'echo',
  'edu',
  'education',
  'email',
  'exit',
  'experience',
  'help',
  'jobs',
  'logout',
  'ls',
  'me',
  'menu',
  'open',
  'posts',
  'projects',
  'quit',
  'read',
  'resume',
  'school',
  'skills',
  'stack',
  'sudo',
  'theme',
  'trophies',
  'whoami',
  'work',
  'work-history',
]

export const commandRegistry: Record<string, CommandHandler> = {
  help: (_p, _ctx) => helpBlock(),
  '?': (_p, _ctx) => helpBlock(),
  menu: (_p, _ctx) => helpBlock(),

  about: (_p, ctx) => {
    ctx.setSection('about')
    ctx.markVisited('about')
    ctx.unlock('curious')
    return aboutBlock(false, ctx)
  },
  whoami: (_p, ctx) => {
    ctx.setSection('about')
    ctx.markVisited('about')
    ctx.unlock('curious')
    return aboutBlock(true, ctx)
  },
  me: (_p, ctx) => {
    ctx.setSection('about')
    ctx.markVisited('about')
    ctx.unlock('curious')
    return aboutBlock(false, ctx)
  },

  projects: (parts, ctx) => {
    const arg = parts.slice(1).join(' ').toLowerCase()
    const match = arg ? projects.find((proj) => projectId(proj) === arg) : undefined
    ctx.setSection('projects')
    ctx.markVisited('projects')
    if (match) {
      ctx.unlock('reviewer')
      return projectDetail(match)
    }
    return projectsBlock(ctx)
  },
  work: (parts, ctx) => commandRegistry.projects(parts, ctx),

  open: (parts, ctx) => {
    const arg = parts.slice(1).join(' ').toLowerCase()
    const proj = projects.find((x) => projectId(x) === arg)
    if (proj) {
      ctx.setSection('projects')
      ctx.markVisited('projects')
      ctx.unlock('reviewer')
      return projectDetail(proj)
    }
    return errorBlock(parts.join(' '), 'no such project. try ')
  },
  cat: (parts, ctx) => commandRegistry.open(parts, ctx),

  skills: (parts, ctx) => {
    ctx.setSection('skills')
    ctx.markVisited('skills')
    const flag = (parts[1] || '').toLowerCase()
    if (flag === '--tree') {
      ctx.unlock('skill_tree')
      return <SkillTree />
    }
    return skillsBlock(ctx.smallMobile)
  },
  stack: (parts, ctx) => commandRegistry.skills(parts, ctx),

  experience: (_p, ctx) => {
    ctx.setSection('experience')
    return experienceBlock()
  },
  jobs: (_p, ctx) => commandRegistry.experience(_p, ctx),
  'work-history': (_p, ctx) => commandRegistry.experience(_p, ctx),

  education: (_p, ctx) => {
    ctx.setSection('education')
    return educationBlock()
  },
  edu: (_p, ctx) => commandRegistry.education(_p, ctx),
  school: (_p, ctx) => commandRegistry.education(_p, ctx),

  blog: (parts, ctx) => {
    const arg = parts.slice(1).join(' ')
    const n = parseInt(arg, 10)
    ctx.setSection('blog')
    ctx.markVisited('blog')
    if (arg && !isNaN(n) && posts[n - 1]) {
      ctx.unlock('bookworm')
      ctx.markPostVisited(n)
      return blogPost(posts[n - 1])
    }
    return blogBlock(ctx)
  },
  posts: (parts, ctx) => commandRegistry.blog(parts, ctx),

  read: (parts, ctx) => {
    const n = parseInt(parts[1] || '', 10)
    const post = posts[n - 1]
    if (post) {
      ctx.setSection('blog')
      ctx.markVisited('blog')
      ctx.unlock('bookworm')
      ctx.markPostVisited(n)
      return blogPost(post)
    }
    return errorBlock(parts.join(' '), 'no post with that number. try ')
  },

  contact: (_p, ctx) => {
    ctx.setSection('contact')
    ctx.markVisited('contact')
    return contactBlock()
  },
  email: (_p, ctx) => commandRegistry.contact(_p, ctx),

  resume: (_p, ctx) => {
    ctx.setSection('home')
    return resumeBlock(ctx)
  },
  cv: (_p, ctx) => commandRegistry.resume(_p, ctx),

  achievements: (_p, ctx) => achievementsBlock(ctx.unlocked),
  trophies: (_p, ctx) => commandRegistry.achievements(_p, ctx),
  badges: (_p, ctx) => commandRegistry.achievements(_p, ctx),

  theme: (parts, ctx) => {
    const arg = (parts[1] || '').toLowerCase() as ThemeName
    if (!arg) return themeBlock(ctx.unlockedThemes)
    if (ctx.applyTheme(arg)) {
      ctx.beep(660)
      ctx.unlock('theme_changer')
      return <div style={gx()}>Theme switched to <strong>{arg}</strong>. Looking good.</div>
    }
    return (
      <div>
        <div style={{ color: '#ff6b6b', textShadow: '0 0 6px rgba(255,107,107,.5)' }}>
          no such theme: {arg}
        </div>
        <div style={{ marginTop: '4px', ...dim() }}>
          type <span style={gx()}>theme</span> to see available themes.
        </div>
      </div>
    )
  },

  sudo: (parts, ctx) => {
    if (parts[1] === '!!') return deniedBlock(true)
    ctx.unlock('sudoer')
    return deniedBlock(false)
  },

  echo: (parts, _ctx) => (
    <div style={gx()}>{parts.slice(1).join(' ') || ' '}</div>
  ),

  ls: (parts, ctx) => {
    const arg = parts.slice(1).join(' ').toLowerCase()
    if (arg === 'projects') {
      ctx.setSection('projects')
      ctx.markVisited('projects')
      return projectsBlock(ctx)
    }
    return lsBlock()
  },
  dir: (_p, _ctx) => lsBlock(),

  exit: (_p, _ctx) => (
    <div style={dim()}>
      there is no escape. (just kidding — close the tab.) but stay a while?
    </div>
  ),
  quit: (_p, _ctx) => commandRegistry.exit(_p, _ctx),
  logout: (_p, _ctx) => commandRegistry.exit(_p, _ctx),
}
