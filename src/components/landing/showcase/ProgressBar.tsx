'use client'

interface ProgressBarProps {
  progress: number // 0-1
  className?: string
  animated?: boolean
}

export function ProgressBar({ progress, className = '', animated = false }: ProgressBarProps) {
  return (
    <div className={`h-1.5 rounded-full bg-[#52B788]/10 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full bg-[#52B788] ${animated ? 'transition-all duration-500 ease-out' : ''}`}
        style={{ width: `${Math.min(progress * 100, 100)}%` }}
      />
    </div>
  )
}
