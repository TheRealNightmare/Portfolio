interface Props {
  children: React.ReactNode
  className?: string
}

export default function GradientText({ children, className = '' }: Props) {
  return (
    <span
      className={`bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  )
}
