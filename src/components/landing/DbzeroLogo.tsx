'use client'

export function DbzeroLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logo-bg)" />
        <text x="16" y="21" textAnchor="middle" fill="url(#logo-text-gradient)" fontFamily="var(--font-dm-sans), system-ui" fontSize="13" fontWeight="700" letterSpacing="-0.5">
          db0
        </text>
        <defs>
          <linearGradient id="logo-bg" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0a1628" />
            <stop offset="1" stopColor="#060610" />
          </linearGradient>
          <linearGradient id="logo-text-gradient" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ee6d4" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-[var(--font-dm-sans)] text-[1.15rem] font-semibold tracking-tight text-[#e8e6e3]">
        dbzero
      </span>
    </div>
  )
}
