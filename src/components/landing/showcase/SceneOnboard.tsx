'use client'

import { Check, Circle, Loader2 } from 'lucide-react'
import { PIPELINE_STEPS } from './data'
import { ProgressBar } from './ProgressBar'

interface SceneOnboardProps {
  progress: number // 0-1
}

export function SceneOnboard({ progress }: SceneOnboardProps) {
  // 5 steps across 0-0.85 of the timeline, last 0.15 is hold
  const stepDuration = 0.17 // each step takes ~17% of scene

  const getStepState = (index: number) => {
    const stepStart = index * stepDuration
    const stepEnd = stepStart + stepDuration

    if (progress < stepStart) return 'pending'
    if (progress < stepEnd) return 'active'
    return 'complete'
  }

  const getStepProgress = (index: number) => {
    const stepStart = index * stepDuration
    const stepEnd = stepStart + stepDuration
    if (progress < stepStart) return 0
    if (progress >= stepEnd) return 1
    return (progress - stepStart) / (stepEnd - stepStart)
  }

  const allComplete = progress > 0.85
  const completedCount = PIPELINE_STEPS.filter((_, i) => getStepState(i) === 'complete').length

  return (
    <div className="px-8 py-8">
      <div className="space-y-7">
        {PIPELINE_STEPS.map((step, i) => {
          const state = getStepState(i)
          const stepProgress = getStepProgress(i)

          return (
            <div key={step.label} className="flex items-start gap-4">
              {/* Status icon */}
              <div className="mt-0.5 flex-shrink-0">
                {state === 'complete' ? (
                  <div className="w-8 h-8 rounded-full bg-[#52B788]/15 flex items-center justify-center">
                    <Check size={16} className="text-[#52B788]" />
                  </div>
                ) : state === 'active' ? (
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Loader2 size={16} className="text-amber-500/70 animate-spin" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-[#52B788]/10 flex items-center justify-center">
                    <Circle size={12} className="text-[#5A7A58]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className={`text-[0.95rem] font-[var(--font-outfit)] transition-colors duration-300 ${
                    state === 'pending' ? 'text-[#5A7A58]' : 'text-[#E0EAD8]'
                  }`}>
                    {step.label}
                  </span>
                  <div className="flex-1">
                    <ProgressBar
                      progress={state === 'complete' ? 1 : state === 'active' ? stepProgress : 0}
                      animated
                    />
                  </div>
                </div>
                <p className={`text-[0.78rem] font-[var(--font-outfit)] text-[#8FAF8A] mt-1.5 transition-opacity duration-300 ${
                  (state === 'complete' || (state === 'active' && stepProgress > 0.5)) ? 'opacity-100' : 'opacity-0'
                }`}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion status */}
      <div className={`text-center mt-8 transition-all duration-500 ${
        allComplete ? 'opacity-100' : 'opacity-70'
      }`}>
        <span className="text-[0.88rem] font-[var(--font-outfit)] text-[#8FAF8A]">
          {allComplete
            ? 'Onboarding complete — 5 tools deployed'
            : `${completedCount} of ${PIPELINE_STEPS.length} steps complete`
          }
        </span>
      </div>
    </div>
  )
}
