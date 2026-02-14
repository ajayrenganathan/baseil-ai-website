'use client'

export function BaseilLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Leaf-data icon */}
      <svg width="38" height="38" viewBox="0 0 36 36" fill="none" className="baseil-float">
        <defs>
          <linearGradient id="baseil-leaf" x1="18" y1="3" x2="18" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7EDCAC" />
            <stop offset="100%" stopColor="#3A8F6A" />
          </linearGradient>
        </defs>
        {/* Leaf body */}
        <path
          d="M18 3C12 7 8 13 8 19.5c0 5 4 8.5 10 12 6-3.5 10-7 10-12 0-6.5-4-12.5-10-16.5z"
          fill="url(#baseil-leaf)"
        />
        {/* Midrib */}
        <path d="M18 7v22" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Data-routing veins — upper pair */}
        <path d="M18 13 L12 17" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <path d="M18 13 L24 17" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        {/* Data-routing veins — lower pair */}
        <path d="M18 20 L11 24.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="round" />
        <path d="M18 20 L25 24.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="round" />
        {/* Node dots at branch points */}
        <circle cx="18" cy="13" r="1.8" fill="rgba(255,255,255,0.5)" />
        <circle cx="18" cy="20" r="1.8" fill="rgba(255,255,255,0.35)" />
      </svg>
      <span className="font-[var(--font-newsreader)] text-[1.5rem] font-medium tracking-tight select-none text-[#8FAF8A]">
        Baseil
      </span>
    </div>
  )
}
