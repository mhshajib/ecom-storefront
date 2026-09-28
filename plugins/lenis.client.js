// Smooth, eased scrolling (Lenis). Off for people who prefer reduced motion. Overlays stop it while open
// (useScrollLock); scrollable panels inside them carry data-lenis-prevent.
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { provide: { lenis: null } }
  const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, anchors: true })
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  // a new page starts at the top, at once
  nuxtApp.hook('page:finish', () => { if (!window.location.hash) lenis.scrollTo(0, { immediate: true, force: true }) })
  return { provide: { lenis } }
})
