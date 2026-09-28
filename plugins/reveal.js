// v-reveal: sections fade and slide in as they come into view. v-reveal="'left'" / "'right'" / "'fade'",
// or { dir, delay } (ms). Things already on screen when the page loads aren't hidden (no flash), and nothing
// is hidden for reduced motion or without JavaScript.
export default defineNuxtPlugin((nuxtApp) => {
  let io = null
  const observer = () => {
    if (io || typeof IntersectionObserver === 'undefined') return io
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('s-revealed')
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    return io
  }
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const v = binding.value
      const dir = typeof v === 'string' ? v : v?.dir || 'up'
      const delay = typeof v === 'object' && v ? v.delay || 0 : 0
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) return // already in view
      el.classList.add('s-reveal')
      el.dataset.reveal = dir
      if (delay) el.style.transitionDelay = `${delay}ms`
      observer()?.observe(el)
    },
    unmounted(el) { io?.unobserve(el) },
  })
})
