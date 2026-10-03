// Types for the vendored scroll-craft engine. scrollcraft.js and
// scrollcraft.css are copied verbatim from the skill and never edited; the
// script is browser-only, has no exports, and sets window.ScrollCraft.
export {}

export interface ScrollCraftAct {
  el: HTMLElement
  device: 'scrub' | 'pin' | 'pan' | 'flow'
  pinned: boolean
  /** Act progress from 0 to 1, the value published as --sc-p. */
  p: number
  raw: number
  /** Document offset and height, measured by the engine's layout pass. */
  top: number
  height: number
}

export interface ScrollCraftApi {
  acts: ScrollCraftAct[]
  layout(): void
  read(): void
  destroy(): void
}

declare global {
  interface Window {
    ScrollCraft?: { mount(root: Element): ScrollCraftApi; reduce: boolean }
  }
}
