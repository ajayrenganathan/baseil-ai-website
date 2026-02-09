'use client'

export function BaseilLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Basil leaf icon mark */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="baseil-float">
        <path
          d="M14 3C8 3 4 8 4 14c0 4 2 7 5 9 1-2 3-4 5-4s4 2 5 4c3-2 5-5 5-9 0-6-4-11-10-11z"
          fill="#52B788"
          opacity="0.8"
        />
        <path
          d="M14 3c-1 3-1 7 0 11 1 4 3 7 5 9"
          stroke="#6FCF97"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 7c-2 1-4 4-5 7"
          stroke="#6FCF97"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M14 7c2 1 4 4 5 7"
          stroke="#6FCF97"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
      <span className="font-[var(--font-newsreader)] text-[1.5rem] font-medium tracking-tight select-none text-[#8FAF8A]">
        baseil
      </span>
    </div>
  )
}
