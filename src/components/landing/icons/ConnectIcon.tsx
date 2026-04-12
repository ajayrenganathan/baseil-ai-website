'use client'

import { useReducedMotion } from './useReducedMotion'

export function ConnectIcon({ size = 48 }: { size?: number }) {
  const reduced = useReducedMotion()
  const animStyle = (delay: string, duration: string, name: string): React.CSSProperties =>
    reduced ? {} : { animation: `${name} ${duration} ease-in-out ${delay} infinite` }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Connect">
      <title>Connect</title>
      {/* Plug */}
      <g
        className="baseil-anim-draw-path"
        style={animStyle('0s', '4s', 'node-fade-in')}
      >
        <rect x="4" y="24" width="16" height="16" rx="3" fill="#52B788" fillOpacity="0.2" stroke="#52B788" strokeWidth="1.5" />
        <line x1="8" y1="20" x2="8" y2="24" stroke="#52B788" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="20" x2="16" y2="24" stroke="#52B788" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Spark */}
      <circle
        cx="22"
        cy="32"
        r="2"
        fill="#6FCF97"
        className="baseil-anim-spark-pop"
        style={animStyle('1.2s', '4s', 'spark-pop')}
      />
      {/* Connecting line */}
      <path
        d="M 20 32 L 44 32"
        stroke="#52B788"
        strokeWidth="1.5"
        strokeDasharray="24"
        className="baseil-anim-draw-path"
        style={{ ...animStyle('0.6s', '4s', 'draw-path'), ['--total-length' as string]: '24' }}
      />
      {/* Database icon */}
      <g
        className="baseil-anim-node-fade-in"
        style={animStyle('1.5s', '4s', 'node-fade-in')}
      >
        <ellipse cx="52" cy="24" rx="8" ry="3" fill="#52B788" fillOpacity="0.15" stroke="#52B788" strokeWidth="1.5" />
        <path d="M 44 24 L 44 40 C 44 42 48 43 52 43 C 56 43 60 42 60 40 L 60 24" stroke="#52B788" strokeWidth="1.5" fill="#52B788" fillOpacity="0.08" />
        <ellipse cx="52" cy="32" rx="8" ry="3" fill="none" stroke="#52B788" strokeWidth="1" strokeOpacity="0.4" />
      </g>
    </svg>
  )
}
