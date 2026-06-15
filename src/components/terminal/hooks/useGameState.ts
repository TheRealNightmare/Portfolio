import { useState, useRef, useEffect, useCallback } from 'react'
import { achievements } from '../../../data/achievements'
import type { Toast, ThemeName } from '../../../types'

const STORAGE_XP = 'portfolio_xp'
const STORAGE_ACH = 'portfolio_unlocked'

function loadXp(): number {
  return Number(localStorage.getItem(STORAGE_XP) ?? 0)
}

function loadUnlocked(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_ACH) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

interface GameStateOptions {
  beep: (freq: number) => void
  unlockTheme: (name: ThemeName) => void
}

export function useGameState({ beep, unlockTheme }: GameStateOptions) {
  const [totalXp, setTotalXp] = useState<number>(() => loadXp())
  const [level, setLevel] = useState<number>(() => Math.floor(loadXp() / 100) + 1)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [, forceRender] = useState(0)

  const tidRef = useRef(1)
  const unlockedRef = useRef<Set<string>>(loadUnlocked())
  const visitedRef = useRef(new Set<string>())
  const visitedPostsRef = useRef(new Set<number>())
  const cmdCountRef = useRef(0)
  const firstCmdTimeRef = useRef<number | null>(null)
  const speedCmdCountRef = useRef(0)

  // Re-apply level-gated unlocks from previous sessions silently
  useEffect(() => {
    if (Math.floor(loadXp() / 100) + 1 >= 5) {
      unlockTheme('matrix')
    }
  }, [unlockTheme])

  const pushToast = useCallback((o: Omit<Toast, 'id'>) => {
    const id = tidRef.current++
    const toast: Toast = { id, ...o }
    setToasts((s) => [...s, toast])
    window.setTimeout(
      () => setToasts((s) => s.filter((x) => x.id !== id)),
      4600,
    )
  }, [])

  const addXp = useCallback(
    (n: number) => {
      setTotalXp((prev) => {
        const total = prev + n
        localStorage.setItem(STORAGE_XP, String(total))
        const newLevel = Math.floor(total / 100) + 1
        setLevel((prevLevel) => {
          if (newLevel > prevLevel) {
            window.setTimeout(
              () =>
                pushToast({
                  title: 'LEVEL UP',
                  sub: 'You reached Level ' + newLevel,
                  accent: '#7cffb0',
                  glow: 'rgba(124,255,176,.55)',
                  icon: '▲',
                }),
              60,
            )
            beep(880)
            if (newLevel >= 5) {
              window.setTimeout(() => unlockTheme('matrix'), 100)
              window.setTimeout(() => unlock('level5'), 150)
            }
          }
          return newLevel
        })
        return total
      })
    },
    [beep, pushToast, unlockTheme],
  )

  const unlock = useCallback(
    (id: string) => {
      if (unlockedRef.current.has(id)) return
      unlockedRef.current.add(id)
      localStorage.setItem(STORAGE_ACH, JSON.stringify([...unlockedRef.current]))
      const a = achievements.find((x) => x.id === id)
      pushToast({
        title: 'Achievement Unlocked',
        sub: a ? a.name : id,
        accent: '#ffd24a',
        glow: 'rgba(255,210,74,.55)',
        icon: 'trophy',
      })
      beep(760)
      addXp(30)
      forceRender((n) => n + 1)
      if (unlockedRef.current.size >= 12) {
        window.setTimeout(() => unlock('completionist2'), 50)
      }
    },
    [beep, addXp, pushToast],
  )

  const markVisited = useCallback(
    (s: string) => {
      visitedRef.current.add(s)
      if (
        ['about', 'projects', 'skills', 'blog', 'contact'].every((x) =>
          visitedRef.current.has(x),
        )
      )
        unlock('explorer')
    },
    [unlock],
  )

  const markPostVisited = useCallback(
    (id: number) => {
      visitedPostsRef.current.add(id)
      if (visitedPostsRef.current.size >= 3) unlock('speed_reader')
    },
    [unlock],
  )

  const afterCommand = useCallback(() => {
    cmdCountRef.current++
    const now = Date.now()
    if (firstCmdTimeRef.current === null) firstCmdTimeRef.current = now
    speedCmdCountRef.current++
    if (speedCmdCountRef.current >= 5 && now - firstCmdTimeRef.current <= 60000) {
      unlock('speed_runner')
    }
    beep(220 + Math.random() * 100)
    unlock('first')
    if (cmdCountRef.current >= 12) unlock('persistent')
    addXp(15)
  }, [beep, unlock, addXp])

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 0 && h < 5) window.setTimeout(() => unlock('night_owl'), 2000)
  }, [unlock])

  return {
    totalXp,
    level,
    toasts,
    unlocked: unlockedRef.current,
    visitedPosts: visitedPostsRef.current,
    addXp,
    unlock,
    markVisited,
    markPostVisited,
    pushToast,
    afterCommand,
  }
}
