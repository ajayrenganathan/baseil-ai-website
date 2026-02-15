'use client'

import Image from 'next/image'

export function BaseilMascot({ className = '' }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="mascot-float">
        <Image
          src="/robot/robot-front-left.png"
          alt="Baseil mascot"
          width={120}
          height={150}
          priority
          className="select-none pointer-events-none"
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}
