import type { ThemeDef, ThemeName } from '../types'

export const themes: Record<ThemeName, ThemeDef> = {
  green: {
    name: 'green',
    label: 'Classic Green',
    p: '#35f07a',
    d: 'rgba(53,240,122,.45)',
    g: '0 0 6px rgba(53,240,122,.55), 0 0 18px rgba(53,240,122,.20)',
  },
  amber: {
    name: 'amber',
    label: 'Amber Phosphor',
    p: '#ffb23e',
    d: 'rgba(255,178,62,.45)',
    g: '0 0 6px rgba(255,178,62,.55), 0 0 18px rgba(255,178,62,.20)',
  },
  cyan: {
    name: 'cyan',
    label: 'Ice Blue',
    p: '#5fe6f0',
    d: 'rgba(95,230,240,.45)',
    g: '0 0 6px rgba(95,230,240,.55), 0 0 18px rgba(95,230,240,.20)',
  },
  blood: {
    name: 'blood',
    label: 'Blood Red',
    p: '#ff4444',
    d: 'rgba(255,68,68,.45)',
    g: '0 0 6px rgba(255,68,68,.55), 0 0 18px rgba(255,68,68,.20)',
  },
  void: {
    name: 'void',
    label: 'Deep Void',
    p: '#8844ff',
    d: 'rgba(136,68,255,.45)',
    g: '0 0 6px rgba(136,68,255,.55), 0 0 18px rgba(136,68,255,.20)',
  },
  matrix: {
    name: 'matrix',
    label: 'Matrix Rain',
    p: '#00ff41',
    d: 'rgba(0,255,65,.45)',
    g: '0 0 6px rgba(0,255,65,.55), 0 0 18px rgba(0,255,65,.20)',
  },
}
