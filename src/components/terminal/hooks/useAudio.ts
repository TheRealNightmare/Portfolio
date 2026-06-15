import { useState, useRef, useCallback } from 'react'

export function useAudio() {
  const [soundOn, setSoundOn] = useState(false)
  const soundOnRef = useRef(false)
  const audioRef = useRef<AudioContext | undefined>(undefined)

  const beep = useCallback((freq: number) => {
    if (!soundOnRef.current) return
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!audioRef.current) audioRef.current = new Ctor()
      const o = audioRef.current.createOscillator()
      const g = audioRef.current.createGain()
      o.type = 'square'
      o.frequency.value = freq
      g.gain.value = 0.035
      o.connect(g)
      g.connect(audioRef.current.destination)
      o.start()
      g.gain.exponentialRampToValueAtTime(0.0001, audioRef.current.currentTime + 0.08)
      o.stop(audioRef.current.currentTime + 0.09)
    } catch {
      /* no audio */
    }
  }, [])

  const toggleSound = useCallback(
    (focusInput?: () => void) => {
      const on = !soundOnRef.current
      soundOnRef.current = on
      setSoundOn(on)
      if (on) {
        try {
          const Ctor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          if (!audioRef.current) audioRef.current = new Ctor()
        } catch {
          /* no audio */
        }
        window.setTimeout(() => beep(660), 10)
      }
      if (focusInput) window.setTimeout(focusInput, 10)
    },
    [beep],
  )

  return { soundOn, beep, toggleSound }
}
