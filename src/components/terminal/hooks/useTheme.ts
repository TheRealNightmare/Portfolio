import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { themes } from '../../../data/themes'
import type { ThemeName } from '../../../types'

const FREE_THEMES: ThemeName[] = ['green', 'amber', 'cyan']

function loadUnlocked(): Set<ThemeName> {
  try {
    const saved = JSON.parse(localStorage.getItem('portfolio_unlocked_themes') || '[]') as ThemeName[]
    return new Set([...FREE_THEMES, ...saved])
  } catch {
    return new Set(FREE_THEMES)
  }
}

function saveUnlocked(set: Set<ThemeName>) {
  const extras = [...set].filter((t) => !FREE_THEMES.includes(t))
  localStorage.setItem('portfolio_unlocked_themes', JSON.stringify(extras))
}

export function useTheme() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('portfolio_theme') as ThemeName | null
    return saved && themes[saved] ? saved : 'green'
  })

  const [unlockedThemes, setUnlockedThemes] = useState<Set<ThemeName>>(loadUnlocked)

  const unlockTheme = useCallback((name: ThemeName) => {
    setUnlockedThemes((prev) => {
      if (prev.has(name)) return prev
      const next = new Set(prev)
      next.add(name)
      saveUnlocked(next)
      return next
    })
  }, [])

  const applyTheme = useCallback(
    (name: ThemeName): boolean => {
      if (!unlockedThemes.has(name)) return false
      setActiveTheme(name)
      localStorage.setItem('portfolio_theme', name)
      return true
    },
    [unlockedThemes],
  )

  const current = themes[activeTheme]
  const cssVars = {
    '--phosphor': current.p,
    '--phosphor-dim': current.d,
    '--glow': current.g,
  } as CSSProperties

  return { activeTheme, unlockedThemes, unlockTheme, applyTheme, cssVars, current }
}
