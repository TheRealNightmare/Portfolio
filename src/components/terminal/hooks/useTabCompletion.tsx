import { useRef } from 'react'
import type { ReactNode } from 'react'
import { VISIBLE_COMMANDS } from '../commands/commandRegistry'
import { projects } from '../../../data/projects'
import { posts } from '../../../data/posts'
import { gx } from '../helpers'
import type { ThemeName } from '../../../types'

interface TabCompletionOptions {
  unlock: (id: string) => void
  unlockedThemes: Set<ThemeName>
}

export function useTabCompletion({ unlock, unlockedThemes }: TabCompletionOptions) {
  const tabCountRef = useRef(0)

  function handleTab(
    input: string,
    print: (node: ReactNode) => void,
  ): string | null {
    tabCountRef.current++
    if (tabCountRef.current >= 5) unlock('tab_master')

    const parts = input.split(/\s+/)
    const head = (parts[0] || '').toLowerCase()
    const arg = parts.slice(1).join(' ').toLowerCase()
    const hasArg = parts.length >= 2

    // Argument completion for open/cat
    if ((head === 'open' || head === 'cat') && hasArg) {
      const ids = projects.map((p) => p.title.toLowerCase())
      const matches = ids.filter((id) => id.startsWith(arg))
      if (matches.length === 1) return head + ' ' + matches[0]
      return null
    }

    // Argument completion for read
    if (head === 'read' && hasArg) {
      const ids = posts.map((p) => String(p.id))
      const matches = ids.filter((id) => id.startsWith(arg))
      if (matches.length === 1) return head + ' ' + matches[0]
      return null
    }

    // Argument completion for theme
    if (head === 'theme' && hasArg) {
      const names = [...unlockedThemes]
      const matches = names.filter((n) => n.startsWith(arg))
      if (matches.length === 1) return head + ' ' + matches[0]
      return null
    }

    // Command completion (single token only)
    if (parts.length === 1) {
      const matches = VISIBLE_COMMANDS.filter((c) => c.startsWith(head))
      if (matches.length === 1) return matches[0]
      if (matches.length > 1) {
        print(
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
            {matches.map((m) => (
              <span key={m} style={gx()}>
                {m}
              </span>
            ))}
          </div>,
        )
      }
    }

    return null
  }

  return { handleTab }
}
