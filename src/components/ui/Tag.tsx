interface Props {
  label: string
}

export default function Tag({ label }: Props) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-sky-950/60 text-sky-400 border border-sky-800/50 font-mono">
      {label}
    </span>
  )
}
