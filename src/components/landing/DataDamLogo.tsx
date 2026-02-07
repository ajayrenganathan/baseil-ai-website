'use client'

export function DataDamLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo mark - stylized dam with water flow */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dam structure */}
        <rect x="8" y="6" width="20" height="24" rx="3" fill="url(#dam-gradient)" opacity="0.9" />
        {/* Water level lines */}
        <path d="M12 14 Q18 12 24 14" stroke="#0ee6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M12 18 Q18 16 24 18" stroke="#0ee6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M12 22 Q18 20 24 22" stroke="#0ee6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        {/* Outflow at bottom */}
        <path d="M16 30 Q18 33 20 30" stroke="#0ee6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </path>
        <defs>
          <linearGradient id="dam-gradient" x1="8" y1="6" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e3a5f" />
            <stop offset="1" stopColor="#0a1628" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-[var(--font-dm-sans)] text-[1.25rem] font-semibold tracking-tight text-[#e8e6e3]">
        DataDam
      </span>
    </div>
  )
}
