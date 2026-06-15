import type { ReactNode } from 'react'
import { gx, dim, pre } from '../helpers'
import type { CommandContext } from '../../../types'

export type HiddenHandler = (cmd: string, ctx: CommandContext) => ReactNode

let fortuneIdx = 0
const FORTUNES = [
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler (probably)',
  '"It works on my machine." — famous last words.',
  '"The best code is no code at all. The second best is your code." — unknown optimist.',
  '"git commit -m \'fix\'" — a developer who has given up.',
  '"There are only two hard things in Computer Science: cache invalidation, naming things, and off-by-one errors."',
  '"sudo make me a sandwich" — the dream. the dream that never dies.',
]

export const hiddenCommands: Record<string, HiddenHandler> = {
  xyzzy: (_cmd, _ctx) => (
    <div style={dim()}>Nothing happens.</div>
  ),

  'hack the planet': (_cmd, ctx) => {
    ctx.beep(440)
    ctx.addXp(100)
    return (
      <div>
        <div style={gx()}>INITIATING HACK SEQUENCE...</div>
        {pre(
          [
            'Connecting to target.......... OK',
            'Bypassing firewall............ OK',
            'Accessing mainframe........... OK',
            'Extracting data ██████████ 100%',
          ].join('\n'),
          { marginTop: '8px', fontSize: '.9em' },
        )}
        <div style={{ marginTop: '10px', ...gx() }}>
          ACCESS GRANTED — jk, you&apos;re a visitor. here&apos;s 100 bonus XP for vibes though.
        </div>
      </div>
    )
  },

  'rm -rf /': (_cmd, ctx) => {
    ctx.unlock('destroyer')
    return (
      <div>
        <div style={dim()}>rm: /: cannot remove: i&apos;m a react app.</div>
        <div style={{ marginTop: '4px', ...gx() }}>
          i have no files. you have no power here. your chaos energy is appreciated though.
        </div>
      </div>
    )
  },

  'rm -rf /*': (_cmd, ctx) => {
    ctx.unlock('destroyer')
    return (
      <div>
        <div style={dim()}>rm: /*: ambitious. still no.</div>
        <div style={{ marginTop: '4px', ...gx() }}>
          i have no files. you have no power here.
        </div>
      </div>
    )
  },

  'git blame': (_cmd, ctx) => {
    ctx.unlock('git_blame_found' as string)
    return pre(
      [
        'a1b2c3d (visitor       1970-01-01 00:00:00 +0000  1) everything',
        'a1b2c3d (visitor       1970-01-01 00:00:00 +0000  2) is',
        'a1b2c3d (visitor       1970-01-01 00:00:00 +0000  3) your',
        'a1b2c3d (visitor       1970-01-01 00:00:00 +0000  4) fault',
        'a1b2c3d (visitor       1970-01-01 00:00:00 +0000  5) actually',
      ].join('\n'),
      { fontSize: '.88em' },
    )
  },

  'git log': (_cmd, _ctx) =>
    pre(
      [
        'commit 7026b90 (HEAD -> main)',
        'Author: TheRealNightmare <nnahid929@gmail.com>',
        'Date:   Mon Jan 1 00:00:00 2026',
        '',
        '    ship it',
        '',
        'commit ced3365',
        'Author: TheRealNightmare <nnahid929@gmail.com>',
        'Date:   Sun Dec 31 23:59:59 2025',
        '',
        '    fix the fix that fixed the previous fix',
      ].join('\n'),
      { fontSize: '.88em' },
    ),

  'uname -a': (_cmd, _ctx) => (
    <div style={gx()}>
      PortfolioOS 2.6.1-phosphor #1 SMP PREEMPT Mon Jan 1 00:00:00 UTC 1970 x86_64 GNU/Vibes
    </div>
  ),

  'cowsay hello': (_cmd, _ctx) =>
    pre(
      [
        ' _______',
        '< hello >',
        ' -------',
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||',
      ].join('\n'),
    ),

  fortune: (_cmd, ctx) => {
    const msg = FORTUNES[fortuneIdx % FORTUNES.length]
    fortuneIdx++
    if (fortuneIdx >= 3) ctx.unlock('philosopher' as string)
    return <div style={{ ...gx(), fontStyle: 'italic', maxWidth: '64ch' }}>{msg}</div>
  },

  neofetch: (_cmd, _ctx) =>
    pre(
      [
        '        ██████     visitor@portfolio',
        '       ████████    ─────────────────',
        '      ██████████   OS: PortfolioOS phosphor-3000',
        '     ████  ██████  Terminal: phosphor-3000',
        '    ██████  █████  Resolution: vibes×∞',
        '   ████████████    CPU: Intel 80486DX2 @ 66MHz',
        '  ██████████████   Memory: 640K (it was enough)',
        ' ████  ████  ████  Uptime: long enough',
        '                   Font: JetBrains Mono',
        '                   Theme: phosphor-green',
      ].join('\n'),
      { fontSize: '.88em' },
    ),

  'telnet towel.blinkenlights.nl': (_cmd, _ctx) =>
    pre(
      [
        'Trying towel.blinkenlights.nl...',
        'Connected. Escape char is \'^]\'. ',
        '',
        '             *    .  *       .         *',
        '   .                   .         .          .',
        '          .      .___________      .    *',
        '      *        /     NCC-1701 \\         .',
        '              /________________\\   .',
        '   .    *    /________________/     .',
        '',
        'Connection closed by foreign host. (you know what this is)',
      ].join('\n'),
      { fontSize: '.88em' },
    ),

  'cat /etc/passwd': (_cmd, _ctx) =>
    pre('visitor:x:1000:1000:Curious Human:/home/visitor:/bin/zsh', { fontSize: '.9em' }),

  'cat .secret': (_cmd, _ctx) => (
    <div style={dim()}>
      you found it. there is nothing here. or is there?
    </div>
  ),

  initkillsequence: (_cmd, ctx) => {
    ctx.unlockTheme('blood')
    ctx.applyTheme('blood')
    ctx.unlock('crimson' as string)
    ctx.unlock('secret_keeper' as string)
    ctx.beep(220)
    return (
      <div>
        <div style={{ color: '#ff4444', textShadow: '0 0 12px rgba(255,68,68,.8)', fontWeight: 700 }}>
          SYSTEM OVERRIDE DETECTED
        </div>
        <div style={{ marginTop: '6px', color: '#ff4444', opacity: 0.9 }}>
          switching to BLOOD MODE — theme unlocked.
        </div>
      </div>
    )
  },

  whoknowsthevoid: (_cmd, ctx) => {
    ctx.unlockTheme('void')
    ctx.applyTheme('void')
    ctx.unlock('voidwalker' as string)
    ctx.unlock('secret_keeper' as string)
    ctx.beep(110)
    return (
      <div>
        <div style={{ color: '#8844ff', textShadow: '0 0 18px rgba(136,68,255,.9)', fontWeight: 700 }}>
          you found the void.
        </div>
        <div style={{ marginTop: '6px', color: '#8844ff', opacity: 0.85 }}>
          the void found you first. theme unlocked.
        </div>
      </div>
    )
  },
}
