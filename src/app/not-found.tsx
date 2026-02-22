'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[20%] left-[40%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-24 pb-20 px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Go back link */}
        <div className="w-full max-w-[900px] mb-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Go back
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-auto">
        {/* Mascot on cloud */}
        <div className={`mb-2 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative flex flex-col items-center">
            {/* Mascot */}
            <div className="relative z-10 mascot-float">
              <Image
                src="/robot/robot-back.png"
                alt="Baseil mascot looking lost"
                width={160}
                height={200}
                priority
                className="select-none pointer-events-none drop-shadow-[0_0_30px_rgba(82,183,136,0.15)]"
                style={{ objectFit: 'contain', height: 'auto' }}
              />
            </div>

            {/* Cloud underneath */}
            <div className="relative -mt-14 z-0 cloud-drift w-[360px] h-[100px]">
              <div className="absolute rounded-full" style={{ width: 250, height: 70, left: 55, top: 25, background: 'radial-gradient(ellipse at 50% 45%, rgba(120,195,150,0.6), rgba(82,183,136,0.2))', filter: 'blur(6px)' }} />
              <div className="absolute rounded-full" style={{ width: 200, height: 55, left: 80, top: 28, background: 'radial-gradient(ellipse at 50% 40%, rgba(145,215,175,0.55), rgba(100,185,145,0.15))', filter: 'blur(4px)' }} />
              <div className="absolute rounded-full cloud-puff-2" style={{ width: 115, height: 90, left: 18, top: 8, background: 'radial-gradient(ellipse at 45% 38%, rgba(115,200,155,0.5), rgba(82,183,136,0.1))', filter: 'blur(5px)' }} />
              <div className="absolute rounded-full cloud-puff-3" style={{ width: 125, height: 100, left: 75, top: -6, background: 'radial-gradient(ellipse at 48% 35%, rgba(135,215,170,0.55), rgba(90,190,145,0.12))', filter: 'blur(4px)' }} />
              <div className="absolute rounded-full cloud-puff-4" style={{ width: 120, height: 95, left: 170, top: -2, background: 'radial-gradient(ellipse at 52% 36%, rgba(120,205,160,0.5), rgba(82,183,136,0.1))', filter: 'blur(4px)' }} />
              <div className="absolute rounded-full cloud-puff-5" style={{ width: 110, height: 85, left: 235, top: 8, background: 'radial-gradient(ellipse at 50% 40%, rgba(110,195,152,0.45), rgba(82,183,136,0.08))', filter: 'blur(5px)' }} />
              <div className="absolute rounded-full cloud-puff-7" style={{ width: 80, height: 60, left: -5, top: 24, background: 'radial-gradient(ellipse at 50% 45%, rgba(105,190,148,0.35), rgba(82,183,136,0.05))', filter: 'blur(7px)' }} />
              <div className="absolute rounded-full cloud-puff-8" style={{ width: 75, height: 55, left: 290, top: 26, background: 'radial-gradient(ellipse at 50% 45%, rgba(105,190,148,0.32), rgba(82,183,136,0.05))', filter: 'blur(7px)' }} />
              <div className="absolute rounded-full cloud-puff-1" style={{ width: 300, height: 50, left: 30, top: 45, background: 'radial-gradient(ellipse at 50% 50%, rgba(100,185,145,0.45), rgba(82,183,136,0.08))', filter: 'blur(6px)' }} />
              <div className="absolute pointer-events-none cloud-glow-breathe" style={{ width: 280, height: 45, left: 40, top: 48, background: 'radial-gradient(ellipse, rgba(82,183,136,0.18) 0%, transparent 70%)', filter: 'blur(20px)' }} />
            </div>
          </div>
        </div>

        {/* 404 */}
        <h1 className={`font-[var(--font-newsreader)] text-[clamp(4rem,10vw,7rem)] font-medium leading-none tracking-tight gradient-text-animated glow-text mb-4 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          404
        </h1>

        <p className={`font-[var(--font-outfit)] text-[1rem] text-[#8FAF8A] mb-2 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          This page doesn&apos;t exist. Much like our bugs.
        </p>

        <p className={`font-[var(--font-newsreader)] text-[0.9rem] italic text-[#5A7A58] mb-10 transition-all duration-700 delay-[600ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          (We swear we had it here somewhere...)
        </p>

        <div className={`transition-all duration-700 delay-[800ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            href="/"
            className="baseil-cta-primary text-[0.9rem] px-8 py-3 inline-flex items-center gap-2"
          >
            Take me home before I cry
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}
