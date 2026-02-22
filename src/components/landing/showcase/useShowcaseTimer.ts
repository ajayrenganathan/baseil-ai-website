'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SCENES, TRANSITION_MS } from './data'

export interface ShowcaseTimerState {
  currentScene: number
  sceneProgress: number
  totalProgress: number
  isTransitioning: boolean
  isPaused: boolean
  jumpToScene: (index: number) => void
  pause: () => void
  resume: () => void
  togglePause: () => void
}

export function useShowcaseTimer(): ShowcaseTimerState {
  const [currentScene, setCurrentScene] = useState(0)
  const [sceneProgress, setSceneProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const pausedRef = useRef(false)
  const pausedAtRef = useRef<number | null>(null)
  const userPausedRef = useRef(false)
  const sceneStartRef = useRef(Date.now())
  const currentSceneRef = useRef(0)
  const isTransitioningRef = useRef(false)

  const totalDuration = SCENES.reduce((sum, s) => sum + s.duration, 0)

  const advanceScene = useCallback(() => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setIsTransitioning(true)

    setTimeout(() => {
      // Swap scene while content is invisible
      const next = (currentSceneRef.current + 1) % SCENES.length
      currentSceneRef.current = next
      setCurrentScene(next)
      sceneStartRef.current = Date.now()
      setSceneProgress(0)

      // Wait one frame for the new scene to render, then fade in
      requestAnimationFrame(() => {
        isTransitioningRef.current = false
        setIsTransitioning(false)
      })
    }, TRANSITION_MS)
  }, [])

  useEffect(() => {
    let rafId: number

    const tick = () => {
      if (pausedRef.current || isTransitioningRef.current) {
        rafId = requestAnimationFrame(tick)
        return
      }

      const elapsed = Date.now() - sceneStartRef.current
      const sceneDuration = SCENES[currentSceneRef.current].duration

      if (elapsed >= sceneDuration) {
        advanceScene()
      } else {
        setSceneProgress(elapsed / sceneDuration)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [advanceScene])

  const jumpToScene = useCallback((index: number) => {
    isTransitioningRef.current = false
    currentSceneRef.current = index
    setCurrentScene(index)
    sceneStartRef.current = Date.now()
    setSceneProgress(0)
    setIsTransitioning(false)
    // Unpause so the scene plays
    userPausedRef.current = false
    pausedRef.current = false
    pausedAtRef.current = null
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    pausedRef.current = true
    pausedAtRef.current = Date.now()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    // Don't resume if user explicitly paused
    if (userPausedRef.current) return
    if (pausedAtRef.current !== null) {
      // Shift scene start forward by the paused duration so elapsed time is preserved
      const pausedDuration = Date.now() - pausedAtRef.current
      sceneStartRef.current += pausedDuration
      pausedAtRef.current = null
    }
    pausedRef.current = false
    setIsPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    if (userPausedRef.current) {
      userPausedRef.current = false
      resume()
    } else {
      userPausedRef.current = true
      pause()
    }
  }, [pause, resume])

  // Calculate total progress (scene durations only, transitions are visual-only)
  let elapsedTotal = 0
  for (let i = 0; i < currentScene; i++) {
    elapsedTotal += SCENES[i].duration
  }
  elapsedTotal += sceneProgress * SCENES[currentScene].duration
  const totalProgress = Math.min(elapsedTotal / totalDuration, 1)

  return {
    currentScene,
    sceneProgress,
    totalProgress,
    isTransitioning,
    isPaused,
    jumpToScene,
    pause,
    resume,
    togglePause,
  }
}
