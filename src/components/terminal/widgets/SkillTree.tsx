import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { skillGroups } from '../../../data/skills'
import { gx, dim } from '../helpers'

interface SkillNode {
  name: string
  level: number
  col: number
  row: number
}

const COLS = skillGroups.length
const MAX_ROWS = Math.max(...skillGroups.map((g) => g.skills.length))

function buildGrid(): (SkillNode | null)[][] {
  const grid: (SkillNode | null)[][] = []
  for (let row = 0; row < MAX_ROWS; row++) {
    const r: (SkillNode | null)[] = []
    for (let col = 0; col < COLS; col++) {
      const skill = skillGroups[col].skills[row]
      r.push(skill ? { name: skill.name, level: skill.level ?? 70, col, row } : null)
    }
    grid.push(r)
  }
  return grid
}

const GRID = buildGrid()

function findNextCell(
  col: number,
  row: number,
  dCol: number,
  dRow: number,
): { col: number; row: number } {
  let c = col + dCol
  let r = row + dRow
  c = Math.max(0, Math.min(COLS - 1, c))
  r = Math.max(0, Math.min(MAX_ROWS - 1, r))
  // if target cell is empty, try to find the closest non-empty in the same direction
  while (!GRID[r]?.[c]) {
    if (dRow !== 0) {
      r += dRow
      if (r < 0 || r >= MAX_ROWS) { r = row; break }
    } else if (dCol !== 0) {
      c += dCol
      if (c < 0 || c >= COLS) { c = col; break }
    } else break
  }
  if (!GRID[r]?.[c]) return { col, row }
  return { col: c, row: r }
}

export function SkillTree() {
  const [cursor, setCursor] = useState({ col: 0, row: 0 })
  const [active, setActive] = useState(true)
  const [detail, setDetail] = useState<SkillNode | null>(null)
  const activeRef = useRef(true)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!activeRef.current) return
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape']
      if (!keys.includes(e.key)) return
      e.stopPropagation()
      e.preventDefault()

      if (e.key === 'Escape') {
        activeRef.current = false
        setActive(false)
        return
      }

      if (e.key === 'Enter') {
        setCursor((c) => {
          const cell = GRID[c.row]?.[c.col]
          if (cell) setDetail(cell)
          return c
        })
        return
      }

      const delta: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      }
      const [dCol, dRow] = delta[e.key]
      setCursor((c) => findNextCell(c.col, c.row, dCol, dRow))
    }

    document.addEventListener('keydown', handler, { capture: true })
    return () => document.removeEventListener('keydown', handler, { capture: true })
  }, [])

  const CELL_W = '120px'
  const CELL_GAP = '6px'

  function cellStyle(col: number, row: number, hasSkill: boolean): CSSProperties {
    const selected = active && cursor.col === col && cursor.row === row
    if (!hasSkill) return { width: CELL_W, minHeight: '24px' }
    return {
      width: CELL_W,
      border: '1px solid ' + (selected ? 'var(--phosphor,#35f07a)' : 'var(--phosphor-dim,rgba(53,240,122,.25))'),
      padding: '2px 8px',
      boxShadow: selected ? 'var(--glow)' : 'none',
      background: selected ? 'rgba(53,240,122,.07)' : 'transparent',
      fontSize: '.84em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      transition: 'border-color .12s, box-shadow .12s',
      ...gx(),
    }
  }

  const filled = (v: number) => Math.round(v / 10)

  return (
    <div style={{ userSelect: 'none' }}>
      {/* heading */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '10px',
          borderBottom: '1px solid var(--phosphor-dim,rgba(53,240,122,.22))',
          paddingBottom: '7px',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1.05em', letterSpacing: '.06em', ...gx() }}>
          SKILL TREE
        </span>
        <span style={dim({ fontSize: '.8em' })}>
          {active
            ? '↑↓←→ navigate · Enter detail · Esc exit'
            : 'deactivated — run skills --tree again'}
        </span>
      </div>

      {/* category headers */}
      <div style={{ display: 'flex', gap: CELL_GAP, marginBottom: '6px' }}>
        {skillGroups.map((group) => (
          <div
            key={group.category}
            style={{
              width: CELL_W,
              ...dim({ fontSize: '.72em', letterSpacing: '.12em' }),
            }}
          >
            {group.category.toUpperCase().replace('& EMBEDDED', '').trim()}
          </div>
        ))}
      </div>

      {/* connector line */}
      <div
        style={{
          display: 'flex',
          gap: CELL_GAP,
          marginBottom: '6px',
          ...dim({ fontSize: '.8em' }),
        }}
      >
        {skillGroups.map((_, i) => (
          <div key={i} style={{ width: CELL_W }}>
            {i < skillGroups.length - 1 ? '──────────────' : '──────────────'}
          </div>
        ))}
      </div>

      {/* grid rows */}
      {GRID.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: 'flex', gap: CELL_GAP, marginBottom: '3px' }}>
          {row.map((cell, colIdx) => (
            <div
              key={colIdx}
              style={cellStyle(colIdx, rowIdx, !!cell)}
              onClick={() => {
                if (!cell) return
                setCursor({ col: colIdx, row: rowIdx })
                setDetail(cell)
                if (!activeRef.current) {
                  activeRef.current = true
                  setActive(true)
                }
              }}
            >
              {cell ? cell.name : ''}
            </div>
          ))}
        </div>
      ))}

      {/* detail panel */}
      {detail && (
        <div
          style={{
            marginTop: '12px',
            borderTop: '1px solid var(--phosphor-dim,rgba(53,240,122,.22))',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ minWidth: '140px', fontWeight: 600, ...gx() }}>{detail.name}</span>
            <span style={{ whiteSpace: 'pre', letterSpacing: '1px' }}>
              <span style={dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.5))' })}>[</span>
              <span style={gx()}>{'█'.repeat(filled(detail.level))}</span>
              <span style={dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.32))' })}>
                {'░'.repeat(10 - filled(detail.level))}
              </span>
              <span style={dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.5))' })}>]</span>
            </span>
            <span style={gx()}>{detail.level}%</span>
          </div>
        </div>
      )}

      {!active && (
        <div style={{ marginTop: '8px', ...dim({ fontSize: '.86em' }) }}>
          tree deactivated — run <span style={gx()}>skills --tree</span> to reopen.
        </div>
      )}
    </div>
  )
}
