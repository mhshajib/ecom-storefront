// Stop the page scrolling while an overlay (bag, search, menu, filters) is open; counts overlapping overlays.
const locks = { n: 0 }
export function useScrollLock(open) {
  const set = (on) => {
    if (!import.meta.client) return
    const lenis = useNuxtApp().$lenis
    locks.n = Math.max(0, locks.n + (on ? 1 : -1))
    const locked = locks.n > 0
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    if (lenis) locked ? lenis.stop() : lenis.start()
  }
  let held = false
  watch(open, (v) => {
    if (v && !held) { held = true; set(true) } else if (!v && held) { held = false; set(false) }
  }, { immediate: true })
  onBeforeUnmount(() => { if (held) { held = false; set(false) } })
}
