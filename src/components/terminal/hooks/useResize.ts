import { useState, useEffect } from 'react'

function getVals() {
  const w = window.innerWidth
  const h = window.innerHeight
  return { mobile: w < 760, smallMobile: w < 380, landscape: w > h && h < 520 }
}

export function useResize() {
  const [state, setState] = useState(getVals)

  useEffect(() => {
    const handler = () => setState(getVals())
    window.addEventListener('resize', handler)
    window.addEventListener('orientationchange', handler)
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('orientationchange', handler)
    }
  }, [])

  return state
}
