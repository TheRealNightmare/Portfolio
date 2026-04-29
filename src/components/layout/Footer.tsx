import { SiGithub } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="border-t border-[#30363d] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs text-[#6e7681]">
        <p>
          <span className="text-green-600">©</span> {new Date().getFullYear()}{' '}
          <span className="text-[#8b949e]">Mirazul Islam Nahid</span>
          <span className="text-[#30363d]"> · built with React + Vite</span>
        </p>
        <a
          href="https://github.com/TheRealNightmare"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-green-400 transition-colors"
        >
          <SiGithub size={14} />
          @TheRealNightmare
        </a>
      </div>
    </footer>
  )
}
