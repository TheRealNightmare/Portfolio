import { TypeAnimation } from 'react-type-animation'

export default function TypingTitle() {
  return (
    <TypeAnimation
      sequence={[
        'Software Developer',
        2200,
        'Full-Stack Engineer',
        2200,
        'CSE Student @ UIU',
        2200,
        'Problem Solver',
        2200,
      ]}
      wrapper="span"
      speed={60}
      repeat={Infinity}
      className="text-sky-400"
    />
  )
}
