import { useRef } from 'react'

export function useHistory() {
  const hist = useRef<string[]>([])
  const histIdx = useRef(-1)

  function push(cmd: string) {
    hist.current.push(cmd)
    histIdx.current = hist.current.length
  }

  function back(): string | undefined {
    if (!hist.current.length) return undefined
    histIdx.current = Math.max(0, histIdx.current - 1)
    return hist.current[histIdx.current]
  }

  function forward(): string {
    if (!hist.current.length) return ''
    histIdx.current = Math.min(hist.current.length, histIdx.current + 1)
    return hist.current[histIdx.current] || ''
  }

  return { push, back, forward }
}
