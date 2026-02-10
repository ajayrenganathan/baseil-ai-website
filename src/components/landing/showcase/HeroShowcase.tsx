'use client'

import { useEffect, useRef } from 'react'
import { SCENES } from './data'
import { useShowcaseTimer } from './useShowcaseTimer'
import { ShowcaseShell } from './ShowcaseShell'
import { SceneConnect } from './SceneConnect'
import { SceneOnboard } from './SceneOnboard'
import { SceneQuery } from './SceneQuery'
import { SceneCrossQuery } from './SceneCrossQuery'
import { SceneChat } from './SceneChat'
import { SceneIntegrate } from './SceneIntegrate'

const SCENE_COMPONENTS = [SceneConnect, SceneOnboard, SceneQuery, SceneCrossQuery, SceneChat, SceneIntegrate]

export function HeroShowcase() {
  const {
    currentScene,
    sceneProgress,
    totalProgress,
    isTransitioning,
    isPaused,
    jumpToScene,
    pause,
    resume,
    togglePause,
  } = useShowcaseTimer()

  const containerRef = useRef<HTMLDivElement>(null)

  // Pause when out of viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          resume()
        } else {
          pause()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [pause, resume])

  // Pause on prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) pause()

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) pause()
      else resume()
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [pause, resume])

  const ActiveScene = SCENE_COMPONENTS[currentScene]

  return (
    <div ref={containerRef}>
      <ShowcaseShell
        title={SCENES[currentScene].label}
        currentScene={currentScene}
        totalProgress={totalProgress}
        isPaused={isPaused}
        onJumpToScene={jumpToScene}
        onTogglePause={togglePause}
      >
        <div
          className="transition-opacity duration-[600ms] cursor-pointer"
          style={{ opacity: isTransitioning ? 0 : 1 }}
          onClick={togglePause}
        >
          <ActiveScene progress={sceneProgress} />
        </div>
      </ShowcaseShell>
    </div>
  )
}
