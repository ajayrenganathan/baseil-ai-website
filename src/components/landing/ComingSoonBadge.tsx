interface ComingSoonBadgeProps {
  label?: string
  className?: string
}

export function ComingSoonBadge({ label = 'Soon', className = '' }: ComingSoonBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-[var(--font-outfit)] uppercase tracking-[0.15em] bg-[#52B788]/[0.08] text-[#52B788]/70 border border-[#52B788]/20 ${className}`}
      aria-label="Coming soon"
    >
      {label}
    </span>
  )
}
