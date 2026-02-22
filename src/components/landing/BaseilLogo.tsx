'use client'

import Image from 'next/image'

export function BaseilLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/robot/robot-leaf.png"
        alt="Baseil logo"
        width={32}
        height={36}
        className="select-none pointer-events-none"
        style={{ objectFit: 'contain' }}
      />
      <span className="font-[var(--font-newsreader)] text-[1.5rem] font-medium tracking-tight select-none text-[#8FAF8A]">
        Baseil
      </span>
    </div>
  )
}
