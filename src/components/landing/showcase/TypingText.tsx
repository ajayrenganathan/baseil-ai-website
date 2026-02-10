'use client'

import { useState, useEffect, useRef } from 'react'

interface TypingTextProps {
  text: string
  startDelay?: number
  charDelay?: number
  randomVariance?: number
  onComplete?: () => void
  className?: string
  cursor?: boolean
}

export function TypingText({
  text,
  startDelay = 0,
  charDelay = 45,
  randomVariance = 15,
  onComplete,
  className = '',
  cursor = true,
}: TypingTextProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timeout)
  }, [startDelay])

  useEffect(() => {
    if (!started || done) return

    let rafId: number
    let lastTime = performance.now()
    let accumulated = 0
    let currentTarget = charDelay + (Math.random() - 0.5) * 2 * randomVariance

    const tick = (now: number) => {
      accumulated += now - lastTime
      lastTime = now

      if (accumulated >= currentTarget) {
        accumulated = 0
        currentTarget = charDelay + (Math.random() - 0.5) * 2 * randomVariance

        setVisibleCount(prev => {
          const next = prev + 1
          if (next >= text.length) {
            setDone(true)
            onCompleteRef.current?.()
            return text.length
          }
          return next
        })
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [started, done, text.length, charDelay, randomVariance])

  // Reset when text changes
  useEffect(() => {
    setVisibleCount(0)
    setStarted(false)
    setDone(false)
    const timeout = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timeout)
  }, [text, startDelay])

  return (
    <span className={className}>
      {text.slice(0, visibleCount)}
      {cursor && !done && (
        <span className="inline-block w-[2px] h-[1em] bg-[#52B788]/50 animate-pulse ml-0.5 align-text-bottom" />
      )}
    </span>
  )
}
