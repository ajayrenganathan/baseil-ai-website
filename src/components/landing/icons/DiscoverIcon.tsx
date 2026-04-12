'use client'

import { useReducedMotion } from './useReducedMotion'

export function DiscoverIcon({ size = 48 }: { size?: number }) {
  const reduced = useReducedMotion()
  const animStyle = (delay: string, duration: string, name: string): React.CSSProperties =>
    reduced ? {} : { animation: `${name} ${duration} ease-out ${delay} infinite` }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Discover">
      <title>Discover</title>
      {/* Brain outline */}
      <path
        d="M 32 8 C 18 8 10 18 10 30 C 10 42 18 52 32 54 C 46 52 54 42 54 30 C 54 18 46 8 32 8 Z"
        stroke="#52B788"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="#52B788"
        fillOpacity="0.04"
      />
      {/* Schema nodes */}
      <circle cx="22" cy="24" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('0.3s', '4s', 'node-fade-in')} />
      <circle cx="42" cy="24" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('0.6s', '4s', 'node-fade-in')} />
      <circle cx="28" cy="36" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('0.9s', '4s', 'node-fade-in')} />
      <circle cx="40" cy="40" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('1.2s', '4s', 'node-fade-in')} />
      <circle cx="32" cy="48" r="3" fill="#6FCF97" className="baseil-anim-node-fade-in" style={animStyle('1.5s', '4s', 'node-fade-in')} />
      {/* Connecting edges */}
      <g stroke="#52B788" strokeWidth="1.2" strokeOpacity="0.7" fill="none">
        <line x1="22" y1="24" x2="42" y2="24" strokeDasharray="22" className="baseil-anim-draw-path" style={{ ...animStyle('0.4s', '4s', 'draw-path'), ['--total-length' as string]: '22' }} />
        <line x1="22" y1="24" x2="28" y2="36" strokeDasharray="14" className="baseil-anim-draw-path" style={{ ...animStyle('0.7s', '4s', 'draw-path'), ['--total-length' as string]: '14' }} />
        <line x1="42" y1="24" x2="40" y2="40" strokeDasharray="17" className="baseil-anim-draw-path" style={{ ...animStyle('1.0s', '4s', 'draw-path'), ['--total-length' as string]: '17' }} />
        <line x1="28" y1="36" x2="32" y2="48" strokeDasharray="13" className="baseil-anim-draw-path" style={{ ...animStyle('1.3s', '4s', 'draw-path'), ['--total-length' as string]: '13' }} />
        <line x1="40" y1="40" x2="32" y2="48" strokeDasharray="12" className="baseil-anim-draw-path" style={{ ...animStyle('1.5s', '4s', 'draw-path'), ['--total-length' as string]: '12' }} />
      </g>
    </svg>
  )
}
