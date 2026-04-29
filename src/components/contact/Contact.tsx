import { SiGithub, SiX } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import SectionWrapper from '../ui/SectionWrapper'
import ContactForm from './ContactForm'

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/TheRealNightmare',
    Icon: SiGithub,
    description: '@TheRealNightmare',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mirazulislamnahid/',
    Icon: FaLinkedin,
    description: 'Connect with me',
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/TheRealNightmare',
    Icon: SiX,
    description: '@TheRealNightmare',
  },
  {
    label: 'Email',
    href: 'mailto:nnahid929@gmail.com',
    Icon: HiMail,
    description: 'nnahid929@gmail.com',
  },
]

export default function Contact() {
  return (
    <SectionWrapper id="contact" className="bg-[#161b22]/30">
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs tracking-widest uppercase mb-2">// contact</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#e6edf3]">Get In Touch</h2>
        <p className="text-[#8b949e] mt-2 text-sm max-w-md">
          Have a project in mind or want to collaborate? My inbox is open.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-4xl">
        <div>
          <p className="font-mono text-xs text-[#6e7681] mb-5">$ send --message</p>
          <ContactForm />
        </div>

        <div>
          <p className="font-mono text-xs text-[#6e7681] mb-5">$ find --links</p>
          <div className="space-y-3">
            {socials.map(({ label, href, Icon, description }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-green-500/40 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-green-950/40 border border-green-800/30 flex items-center justify-center flex-shrink-0 group-hover:border-green-600/50 transition-colors">
                  <Icon size={16} className="text-green-500 group-hover:text-green-400 transition-colors" />
                </div>
                <div>
                  <p className="font-mono text-sm text-[#c9d1d9] group-hover:text-green-400 transition-colors">
                    {label}
                  </p>
                  <p className="font-mono text-xs text-[#6e7681]">{description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
