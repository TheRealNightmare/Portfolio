import { useState, useRef, useEffect } from 'react'

const BOOT_LENGTH = 13

export function useBootSequence(onFinish: () => void) {
  const [booting, setBooting] = useState(true)
  const [bootShown, setBootShown] = useState(0)
  const greetedRef = useRef(false)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  })

  function finishBoot() {
    if (greetedRef.current) return
    greetedRef.current = true
    setBooting(false)
    onFinishRef.current()
  }

  function skipBoot() {
    setBootShown(BOOT_LENGTH)
    finishBoot()
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBootShown((n) => {
        const next = n + 1
        if (next >= BOOT_LENGTH) {
          window.clearInterval(timer)
          window.setTimeout(finishBoot, 850)
          return BOOT_LENGTH
        }
        return next
      })
    }, 230)
    return () => window.clearInterval(timer)
  }, [])

  return { booting, bootShown, skipBoot }
}
