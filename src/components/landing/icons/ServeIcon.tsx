'use client'

import { useReducedMotion } from './useReducedMotion'

export function ServeIcon({ size = 48 }: { size?: number }) {
  const reduced = useReducedMotion()
  const animStyle = (delay: string, duration: string, name: string): React.CSSProperties =>
    reduced ? {} : { animation: `${name} ${duration} ease-out ${delay} infinite` }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Serve">
      <title>Serve</title>
      {/* Lightning bolt at center */}
      <path
        d="M 30 12 L 22 32 L 30 32 L 26 52 L 42 28 L 34 28 L 38 12 Z"
        fill="#52B788"
        stroke="#6FCF97"
        strokeWidth="1.2"
        className="baseil-anim-breathing-glow"
        style={animStyle('0s', '3s', 'breathing-glow')}
      />
      {/* Three output paths */}
      <g stroke="#52B788" strokeWidth="1.2" strokeOpacity="0.6" fill="none">
        <path d="M 38 20 Q 48 20 52 14" strokeDasharray="18" className="baseil-anim-draw-path" style={{ ...animStyle('0.4s', '3s', 'draw-path'), ['--total-length' as string]: '18' }} />
        <path d="M 42 32 L 54 32" strokeDasharray="12" className="baseil-anim-draw-path" style={{ ...animStyle('0.6s', '3s', 'draw-path'), ['--total-length' as string]: '12' }} />
        <path d="M 38 44 Q 48 44 52 50" strokeDasharray="18" className="baseil-anim-draw-path" style={{ ...animStyle('0.8s', '3s', 'draw-path'), ['--total-length' as string]: '18' }} />
      </g>
      {/* Chat bubble (humans) */}
      <g className="baseil-anim-serve-split" style={animStyle('0.9s', '3s', 'serve-split')}>
        <rect x="50" y="8" width="12" height="10" rx="2" fill="#52B788" fillOpacity="0.2" stroke="#52B788" strokeWidth="1" />
        <circle cx="54" cy="13" r="0.7" fill="#6FCF97" />
        <circle cx="56" cy="13" r="0.7" fill="#6FCF97" />
        <circle cx="58" cy="13" r="0.7" fill="#6FCF97" />
      </g>
      {/* Agent/gear */}
      <g className="baseil-anim-serve-split" style={animStyle('1.1s', '3s', 'serve-split')}>
        <circle cx="58" cy="32" r="4" fill="#52B788" fillOpacity="0.2" stroke="#52B788" strokeWidth="1" />
        <circle cx="58" cy="32" r="1.5" fill="#6FCF97" />
      </g>
      {/* Code brackets */}
      <g className="baseil-anim-serve-split" style={animStyle('1.3s', '3s', 'serve-split')} stroke="#52B788" strokeWidth="1" fill="none">
        <path d="M 54 46 L 52 50 L 54 54" strokeLinecap="round" />
        <path d="M 58 46 L 60 50 L 58 54" strokeLinecap="round" />
      </g>
    </svg>
  )
}
