'use client'

export function DbzeroLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span
        className="font-[var(--font-dm-sans)] text-[1.4rem] font-extrabold tracking-tight select-none"
        style={{
          background: 'linear-gradient(135deg, #0ee6d4 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        dbzero
      </span>
    </div>
  )
}
