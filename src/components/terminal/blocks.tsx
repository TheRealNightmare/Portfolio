import type { ReactNode } from 'react'
import { gx, dim, pre, heading, tag, link, p, trophy, box } from './helpers'
import { projects } from '../../data/projects'
import { skillGroups } from '../../data/skills'
import { timeline } from '../../data/experience'
import { education } from '../../data/education'
import { posts } from '../../data/posts'
import { achievements } from '../../data/achievements'
import type { CommandContext, Project, ThemeName } from '../../types'

export const projectId = (proj: Project) => proj.title.toLowerCase()

export function greetingNode(smallMobile: boolean): ReactNode {
  const header = smallMobile
    ? pre('MIRAZUL ISLAM NAHID\nsoftware developer · full-stack', { fontSize: '.88em' })
    : pre(
        box(
          ['MIRAZUL ISLAM NAHID · software developer', 'full-stack dev · CSE @ UIU · always building'],
          3,
        ),
        { fontSize: '.92em' },
      )
  return (
    <div>
      {header}
      <div style={{ marginTop: '12px', ...dim() }}>Last login: just now on ttys001</div>
      <div style={{ marginTop: '4px', ...gx() }}>
        Tap a chip below or type a command. New here? Try{' '}
        <span style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          help
        </span>
        .
      </div>
    </div>
  )
}

export function helpBlock(): ReactNode {
  const cmds: [string, string][] = [
    ['about', 'who I am + the bio'],
    ['projects', 'things I have built'],
    ['skills', 'proficiency, as XP bars'],
    ['experience', 'where I have worked'],
    ['education', 'academic background'],
    ['blog', 'posts & ramblings'],
    ['contact', 'send me a message'],
    ['resume', 'download the PDF'],
    ['achievements', 'trophies you have earned'],
    ['theme', 'switch color theme'],
    ['clear', 'wipe the screen'],
  ]
  return (
    <div>
      {heading('AVAILABLE COMMANDS', 'tap a chip, or type a name')}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))',
          gap: '4px 24px',
        }}
      >
        {cmds.map(([c, d]) => (
          <div key={c} style={{ display: 'flex', gap: '12px', padding: '2px 0' }}>
            <span style={{ minWidth: '120px', fontWeight: 500, ...gx() }}>{c}</span>
            <span style={dim()}>{d}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '.86em', ...dim() }}>
        tip: ↑/↓ recall history · Tab to complete · pseudo-commands like{' '}
        <span style={gx()}>sudo</span> may have… consequences.
      </div>
    </div>
  )
}

export function aboutBlock(whoami: boolean, ctx: CommandContext): ReactNode {
  const face = [
    '      .------.',
    '     /  o  o  \\',
    '    |   ~~~~   |',
    '    |          |',
    '    |  ------  |',
    '     \\        /',
    '      `--..--\'',
    '      /  ||  \\',
    '     /   ||   \\',
    '   (_)  (_)  (_)',
  ].join('\n')
  return (
    <div>
      {heading(whoami ? 'whoami' : 'ABOUT', 'visitor sees: Mirazul Islam Nahid')}
      <div
        style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}
      >
        {pre(face, {
          fontSize: '.8em',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 6px var(--phosphor,#35f07a))',
        })}
        <div style={{ flex: '1 1 280px', minWidth: '240px' }}>
          {p(
            "Hi — I'm Mirazul Islam Nahid. I'm a CSE student at United International University and a software developer at MonerBondhu, building full-stack software while I finish my degree.",
          )}
          {p(
            'I started out as a web developer at Rokirovka back in 2021, sharpening my skills on real products. The best learning happens when theory meets practice, so I keep shipping side projects between deadlines.',
          )}
          {p(
            "My stack spans low-level systems (C, C++) through cloud-native deployments (Docker, Kubernetes, AWS). I love exploring new tools and growing every single day.",
          )}
          <div
            style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}
          >
            {tag('Dhaka, BD')}
            {tag('UTC+6')}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '14px', ...dim() }}>
        grab the{' '}
        {link('resume.pdf', undefined, () => {
          ctx.beep(520)
          ctx.pushToast({
            title: 'opening',
            sub: 'resume.pdf',
            accent: '#35f07a',
            glow: 'rgba(255,255,255,.35)',
            icon: '↗',
          })
        })}{' '}
        or type 'projects' to see the work.
      </div>
    </div>
  )
}

export function projectsBlock(ctx: CommandContext): ReactNode {
  return (
    <div>
      {heading('PROJECTS', projects.length + ' repos · tap one to open')}
      <div>{projects.map((proj) => projectRow(proj, ctx))}</div>
      <div style={{ marginTop: '10px', fontSize: '.86em', ...dim() }}>
        open one with <span style={gx()}>open {projectId(projects[0])}</span> or just click it.
      </div>
    </div>
  )
}

export function projectRow(proj: Project, ctx: CommandContext): ReactNode {
  return (
    <div
      key={projectId(proj)}
      onClick={(e) => {
        e.stopPropagation()
        ctx.runCommand('open ' + projectId(proj))
      }}
      style={{
        cursor: 'pointer',
        border: '1px solid var(--phosphor-dim,rgba(53,240,122,.3))',
        padding: '12px 14px',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1.02em', ...gx() }}>{proj.title}</span>
        <span style={dim({ fontSize: '.82em' })}>{proj.language}</span>
      </div>
      <div style={{ margin: '5px 0 9px', color: 'var(--phosphor,#35f07a)', opacity: 0.9 }}>
        {proj.description}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {proj.tags.map((t) => tag(t))}
        </div>
        <span style={dim({ fontSize: '.84em' })}>open ⸢</span>
      </div>
    </div>
  )
}

export function projectDetail(proj: Project): ReactNode {
  return (
    <div>
      {heading(proj.title, proj.language + ' · project detail')}
      <div style={{ marginBottom: '10px', fontSize: '1.02em', ...gx() }}>{proj.description}</div>
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', margin: '12px 0' }}>
        {proj.tags.map((t) => tag(t))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '18px',
          flexWrap: 'wrap',
          marginTop: '6px',
          wordBreak: 'break-all',
        }}
      >
        <span>
          <span style={dim()}>repo&nbsp;&nbsp;</span>
          {link(proj.repoUrl.replace(/^https?:\/\//, ''), proj.repoUrl)}
        </span>
      </div>
      <div style={{ marginTop: '14px', fontSize: '.86em', ...dim() }}>
        back to the list: type <span style={gx()}>projects</span>
      </div>
    </div>
  )
}

export function skillsBlock(smallMobile: boolean): ReactNode {
  return (
    <div>
      {heading('SKILLS', 'proficiency · self-assessed')}
      {skillGroups.map((group) => (
        <div key={group.category} style={{ marginBottom: '14px' }}>
          <div style={dim({ fontSize: '.8em', letterSpacing: '.16em', marginBottom: '4px' })}>
            {group.category.toUpperCase()}
          </div>
          {group.skills.map((s) => skillRow(s.name, s.level ?? 70, smallMobile))}
        </div>
      ))}
      <div style={{ marginTop: '4px', fontSize: '.84em', ...dim() }}>
        numbers are vibes-based, like all good estimates. try{' '}
        <span style={gx()}>skills --tree</span> for the node view.
      </div>
    </div>
  )
}

export function skillRow(name: string, v: number, smallMobile: boolean): ReactNode {
  const filled = Math.round(v / 10)
  return (
    <div
      key={name}
      style={{
        display: 'flex',
        alignItems: smallMobile ? 'flex-start' : 'center',
        gap: smallMobile ? '8px' : '14px',
        padding: '3px 0',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ minWidth: smallMobile ? '100px' : '140px', fontWeight: 500, ...gx() }}>
        {name}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
        <span style={{ whiteSpace: 'pre', letterSpacing: '1px' }}>
          <span style={dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.5))' })}>[</span>
          <span style={gx()}>{'█'.repeat(filled)}</span>
          <span style={dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.32))' })}>
            {'░'.repeat(10 - filled)}
          </span>
          <span style={dim({ color: 'var(--phosphor-dim,rgba(53,240,122,.5))' })}>]</span>
        </span>
        <span style={{ minWidth: '36px', ...gx() }}>{v}%</span>
      </span>
    </div>
  )
}

export function experienceBlock(): ReactNode {
  return (
    <div>
      {heading('EXPERIENCE', timeline.length + ' roles · most recent first')}
      {timeline.map((t) => (
        <div
          key={t.company}
          style={{
            borderLeft: '1px solid var(--phosphor-dim,rgba(53,240,122,.3))',
            paddingLeft: '14px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 700, ...gx() }}>
              {t.role} <span style={dim()}>@ {t.company}</span>
              {t.current ? (
                <span
                  style={{
                    ...gx(),
                    fontSize: '.74em',
                    marginLeft: '8px',
                    border: '1px solid var(--phosphor-dim,rgba(53,240,122,.4))',
                    padding: '1px 7px',
                  }}
                >
                  current
                </span>
              ) : null}
            </span>
            <span style={dim({ fontSize: '.82em' })}>{t.period}</span>
          </div>
          <div style={{ marginTop: '5px', color: 'var(--phosphor,#35f07a)', opacity: 0.9 }}>
            {t.description}
          </div>
        </div>
      ))}
    </div>
  )
}

export function educationBlock(): ReactNode {
  return (
    <div>
      {heading('EDUCATION', 'academic background')}
      {education.map((e) => (
        <div
          key={e.institution}
          style={{
            borderLeft: '1px solid var(--phosphor-dim,rgba(53,240,122,.3))',
            paddingLeft: '14px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 700, ...gx() }}>{e.institution}</span>
            <span style={dim({ fontSize: '.82em' })}>{e.period}</span>
          </div>
          <div style={{ marginTop: '3px', ...gx(), opacity: 0.92 }}>{e.degree}</div>
          <div style={{ marginTop: '5px', color: 'var(--phosphor,#35f07a)', opacity: 0.9 }}>
            {e.description}
          </div>
        </div>
      ))}
    </div>
  )
}

export function blogBlock(ctx: CommandContext): ReactNode {
  return (
    <div>
      {heading('BLOG', posts.length + ' posts · tap to read')}
      <div>{posts.map((post) => blogRow(post, ctx))}</div>
      <div style={{ marginTop: '10px', fontSize: '.86em', ...dim() }}>
        read one with <span style={gx()}>read 1</span> or click a title.
      </div>
    </div>
  )
}

export function blogRow(post: (typeof posts)[number], ctx: CommandContext): ReactNode {
  return (
    <div
      key={post.id}
      onClick={(e) => {
        e.stopPropagation()
        ctx.runCommand('read ' + post.id)
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        gap: '16px',
        padding: '9px 0',
        borderBottom: '1px solid var(--phosphor-dim,rgba(53,240,122,.18))',
        flexWrap: 'wrap',
      }}
    >
      <span style={dim({ minWidth: '92px', fontSize: '.9em' })}>{post.date}</span>
      <div style={{ flex: '1 1 260px' }}>
        <div style={{ fontWeight: 600, ...gx() }}>{post.title}</div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '6px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span style={dim({ fontSize: '.82em' })}>{post.read + ' read'}</span>
          {post.tags.map((t) => tag('#' + t))}
        </div>
      </div>
    </div>
  )
}

export function blogPost(post: (typeof posts)[number]): ReactNode {
  return (
    <div>
      {heading(post.title)}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '14px',
        }}
      >
        <span style={dim()}>{post.date}</span>
        <span style={dim()}>·</span>
        <span style={dim()}>{post.read + ' read'}</span>
        <div style={{ display: 'flex', gap: '7px' }}>
          {post.tags.map((t) => tag('#' + t))}
        </div>
      </div>
      <div style={{ maxWidth: '68ch' }}>
        {post.body.map((para, i) => (
          <div
            key={i}
            style={{
              marginBottom: '12px',
              lineHeight: 1.75,
              color: 'var(--phosphor,#35f07a)',
              opacity: 0.95,
            }}
          >
            {para}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '8px', fontSize: '.86em', ...dim() }}>
        back to the list: type <span style={gx()}>blog</span>
      </div>
    </div>
  )
}

export function contactBlock(): ReactNode {
  const row = (k: string, v: string, href?: string) => (
    <div key={k} style={{ display: 'flex', gap: '14px', padding: '3px 0' }}>
      <span style={dim({ minWidth: '92px' })}>{k}</span>
      {href ? link(v, href) : <span style={gx()}>{v}</span>}
    </div>
  )
  return (
    <div>
      {heading('CONTACT', 'reach me directly')}
      {row('email', 'nnahid929@gmail.com', 'mailto:nnahid929@gmail.com')}
      {row('github', 'github.com/TheRealNightmare', 'https://github.com/TheRealNightmare')}
      {row(
        'linkedin',
        'in/mirazulislamnahid',
        'https://www.linkedin.com/in/mirazulislamnahid/',
      )}
      {row('x', '@TheRealNightmare', 'https://x.com/TheRealNightmare')}
      {row('location', 'Dhaka, BD (UTC+6)')}
    </div>
  )
}

export function resumeBlock(ctx: CommandContext): ReactNode {
  return (
    <div>
      {heading('RESUME', 'PDF · coming soon')}
      {p('One page. No buzzwords. Mostly things I actually shipped.')}
      <div
        onClick={(e) => {
          e.stopPropagation()
          ctx.pushToast({
            title: 'not available yet',
            sub: 'resume.pdf is being polished',
            accent: '#35f07a',
            glow: 'rgba(124,255,176,.4)',
            icon: '⧉',
          })
          ctx.beep(600)
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '8px',
          cursor: 'pointer',
          border: '1px solid var(--phosphor,#35f07a)',
          padding: '9px 16px',
          ...gx(),
        }}
      >
        <span style={{ fontSize: '1.1em' }}>⧉</span>
        <span style={{ fontWeight: 600 }}>download resume.pdf</span>
      </div>
    </div>
  )
}

export function achievementsBlock(unlocked: Set<string>): ReactNode {
  const count = achievements.filter((a) => unlocked.has(a.id)).length
  return (
    <div>
      {heading('ACHIEVEMENTS', count + ' / ' + achievements.length + ' unlocked')}
      {achievements.map((a) => {
        const got = unlocked.has(a.id)
        return (
          <div
            key={a.id}
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid var(--phosphor-dim,rgba(53,240,122,.16))',
              opacity: got ? 1 : 0.55,
            }}
          >
            {got ? (
              trophy(18, 'var(--phosphor,#35f07a)')
            ) : (
              <span
                style={{
                  width: '18px',
                  textAlign: 'center',
                  color: 'var(--phosphor-dim,rgba(53,240,122,.5))',
                }}
              >
                ?
              </span>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, ...(got ? gx() : dim()) }}>
                {got ? a.name : '??? ??? ???'}
              </div>
              <div style={dim({ fontSize: '.86em' })}>
                {got ? a.desc : 'locked — keep exploring'}
              </div>
            </div>
            {got ? <span style={dim({ fontSize: '.8em' })}>+30 XP</span> : null}
          </div>
        )
      })}
    </div>
  )
}

export function themeBlock(unlockedThemes: Set<ThemeName>): ReactNode {
  const names = [...unlockedThemes]
  return (
    <div>
      {heading('THEMES', names.length + ' unlocked')}
      {names.map((name) => (
        <div key={name} style={{ display: 'flex', gap: '12px', padding: '3px 0' }}>
          <span style={{ minWidth: '100px', fontWeight: 500, ...gx() }}>{name}</span>
          <span style={dim()}>→ type `theme {name}` to apply</span>
        </div>
      ))}
      <div style={{ marginTop: '12px', fontSize: '.86em', ...dim() }}>
        There may be more themes out there. Keep exploring.
      </div>
    </div>
  )
}

export function lsBlock(): ReactNode {
  const items = [
    'about',
    'projects/',
    'skills',
    'experience',
    'education',
    'blog/',
    'contact',
    'resume.pdf',
    'achievements',
    '.secret',
  ]
  return (
    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
      {items.map((i) => (
        <span key={i} style={i === '.secret' ? dim({ opacity: 0.4 }) : gx()}>
          {i}
        </span>
      ))}
    </div>
  )
}

export function errorBlock(cmd: string, customHint?: string): ReactNode {
  const c = cmd.split(/\s+/)[0] || cmd
  return (
    <div>
      <div style={{ color: '#ff6b6b', textShadow: '0 0 6px rgba(255,107,107,.5)' }}>
        -bash: {c}: command not found
      </div>
      <div style={{ marginTop: '4px', ...dim() }}>
        {customHint || 'unknown command. type '}
        <span style={gx()}>help</span> for the menu.
      </div>
    </div>
  )
}

export function deniedBlock(sudoBang?: boolean): ReactNode {
  if (sudoBang) {
    return (
      <div>
        <div style={dim()}>[sudo] password for visitor: {'•'.repeat(8)}</div>
        <div
          style={{
            color: '#ff6b6b',
            textShadow: '0 0 6px rgba(255,107,107,.5)',
            marginTop: '4px',
          }}
        >
          visitor is not in the sudoers file.
        </div>
        <div style={dim({ marginTop: '4px' })}>
          still no. the fridge note now has a second page.
        </div>
      </div>
    )
  }
  return (
    <div>
      <div style={dim()}>[sudo] password for visitor: {'•'.repeat(8)}</div>
      <div
        style={{
          color: '#ff6b6b',
          textShadow: '0 0 6px rgba(255,107,107,.5)',
          marginTop: '4px',
        }}
      >
        visitor is not in the sudoers file.
      </div>
      <div style={dim({ marginTop: '4px' })}>
        This incident has been logged, screenshotted, and printed for the fridge.
      </div>
      <div style={{ marginTop: '4px', ...gx() }}>Nice try though. +30 XP for the curiosity.</div>
    </div>
  )
}
