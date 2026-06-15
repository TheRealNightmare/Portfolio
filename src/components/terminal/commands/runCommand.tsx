import type { ReactNode } from 'react'
import { commandRegistry } from './commandRegistry'
import { hiddenCommands } from './hiddenCommands'
import { errorBlock } from '../blocks'
import { gx } from '../helpers'
import type { CommandContext } from '../../../types'

function buildEcho(cmd: string, mobile: boolean): ReactNode {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', opacity: 0.92 }}>
      <span style={{ color: 'var(--phosphor-dim,rgba(53,240,122,.55))', whiteSpace: 'nowrap' }}>
        {mobile ? '~$' : 'visitor@portfolio:~$'}
      </span>
      <span style={gx()}>{cmd || ' '}</span>
    </div>
  )
}

export function runCommand(raw: string, ctx: CommandContext): void {
  const cmd = (raw || '').trim()
  const parts = cmd.split(/\s+/)
  const head = (parts[0] || '').toLowerCase()
  const echo = buildEcho(cmd, ctx.mobile)

  if (head === '') {
    ctx.print(<div>{echo}</div>)
    return
  }

  if (head === 'clear' || head === 'cls') {
    ctx.clearStream()
    return
  }

  let body: ReactNode = null

  // check visible commands first
  const handler = commandRegistry[head]
  if (handler) {
    body = handler(parts, ctx)
  } else {
    // check hidden commands by full normalized command string
    const fullCmd = cmd.toLowerCase()
    const hiddenHandler = hiddenCommands[fullCmd]
    if (hiddenHandler) {
      body = hiddenHandler(fullCmd, ctx)
    } else {
      body = errorBlock(cmd)
    }
  }

  ctx.print(
    <div>
      {echo}
      {body}
    </div>,
  )
}
