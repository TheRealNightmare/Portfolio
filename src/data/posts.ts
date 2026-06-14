import type { Post } from '../types'

// Placeholder posts — swap in real ones any time; the blog command reads from here.
export const posts: Post[] = [
  {
    id: 1,
    title: 'Shipping side projects while finishing a CS degree',
    date: '2026-05-18',
    read: '5 min',
    tags: ['life', 'dev'],
    body: [
      'Balancing coursework at UIU with a software job at MonerBondhu means my side projects live in the cracks — a half hour before class, a late commit after a deadline. The trick is keeping each project small enough that a single sitting moves it forward.',
      'Verso2.0, ScrollSense, Spotuber: none of them started as grand plans. They each scratched one itch, and that constraint is exactly why they actually got finished instead of rotting in a branch.',
    ],
  },
  {
    id: 2,
    title: 'Why I keep reaching for the terminal',
    date: '2026-03-02',
    read: '4 min',
    tags: ['tools', 'cli'],
    body: [
      'Every GUI eventually hides the thing I actually want to do behind three menus. The shell composes — small sharp tools that pipe into each other — and the whole becomes greater than any single app.',
      'Spotuber is basically that philosophy as a binary: hand it a playlist ID, get audio files. No dashboard, no login, no ceremony. Just input, pipeline, output.',
    ],
  },
  {
    id: 3,
    title: 'From PHP web work to full-stack systems',
    date: '2025-12-10',
    read: '6 min',
    tags: ['career', 'backend'],
    body: [
      'I started as a web developer at Rokirovka in 2021, mostly PHP and the front-end glue around it. The biggest shift since then has been thinking in systems — how the pieces deploy, scale, and fail — rather than in pages.',
      'C and C++ from coursework gave me a respect for what is actually happening underneath the frameworks. Docker, Kubernetes, and Linux turned that curiosity into something I can ship and run.',
    ],
  },
]
