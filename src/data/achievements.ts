export interface Achievement {
  id: string
  name: string
  desc: string
}

export const achievements: Achievement[] = [
  { id: 'first', name: 'First Contact', desc: 'Run your first command.' },
  { id: 'curious', name: 'Curious Cat', desc: 'Read the about page.' },
  { id: 'reviewer', name: 'Code Reviewer', desc: 'Open a project in detail.' },
  { id: 'bookworm', name: 'Bookworm', desc: 'Open a blog post.' },
  { id: 'sudoer', name: 'Nice Try', desc: 'Attempt something above your pay grade.' },
  { id: 'explorer', name: 'Completionist', desc: 'Visit every section of the system.' },
  { id: 'persistent', name: 'Persistence', desc: 'Run 12 commands in one session.' },
]
