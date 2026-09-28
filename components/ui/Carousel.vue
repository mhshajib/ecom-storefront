<script setup>
// A swipeable row (scroll snap) with arrows, and optional autoplay whose dot fills up as it waits. Pauses while
// hovered, focused or touched. Slot: #item="{ item, index, active }". itemClass sets the width per slide.
const props = defineProps({
  items: { type: Array, default: () => [] },
  itemClass: { type: String, default: 'w-[82%] sm:w-[48%] lg:w-[32%]' },
  autoplay: { type: Number, default: 0 }, // ms per slide, 0 = off
  dots: { type: Boolean, default: true },
  arrows: { type: Boolean, default: true },
  dark: Boolean, // controls for a dark background
  label: { type: String, default: 'Carousel' },
})
const track = ref(null)
const active = ref(0)
const paused = ref(false)
const slides = () => [...(track.value?.children || [])]

const onScroll = () => {
  const el = track.value
  if (!el) return
  const left = el.scrollLeft
  let best = 0, dist = Infinity
  slides().forEach((s, i) => { const d = Math.abs(s.offsetLeft - el.offsetLeft - left); if (d < dist) { dist = d; best = i } })
  active.value = best
}
const go = (i) => {
  const el = track.value, list = slides()
  if (!el || !list.length) return
  const n = (i + list.length) % list.length
  el.scrollTo({ left: list[n].offsetLeft - el.offsetLeft, behavior: 'smooth' })
  active.value = n
}
const atEnd = () => { const el = track.value; return el && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 }
const next = () => (atEnd() ? go(0) : go(active.value + 1))
const prev = () => go(active.value - 1)

// autoplay: restart the timer whenever the slide changes or the pause lifts
let timer
const tick = ref(0) // restarts the dot's fill animation
const schedule = () => {
  clearTimeout(timer)
  if (!props.autoplay || paused.value || props.items.length < 2) return
  tick.value++
  timer = setTimeout(next, props.autoplay)
}
watch([active, paused], schedule)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  schedule()
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="relative" :aria-label="label" role="region" aria-roledescription="carousel" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false" @touchstart.passive="paused = true">
    <div ref="track" class="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth s-no-scrollbar" @scroll.passive="onScroll">
      <div v-for="(item, i) in items" :key="i" class="snap-start shrink-0" :class="itemClass" :aria-roledescription="'slide'" :aria-label="`${i + 1} of ${items.length}`">
        <slot name="item" :item="item" :index="i" :active="i === active" />
      </div>
    </div>
    <div v-if="(dots || arrows) && items.length > 1" class="flex items-center justify-center gap-4 mt-7">
      <button v-if="arrows" class="w-10 h-10 rounded-full flex items-center justify-center transition" :class="dark ? 'text-cream/80 hover:bg-white/10' : 'text-noir-800 hover:bg-cream-deep'" aria-label="Previous" @click="prev"><Icon name="lucide:chevron-left" class="w-5 h-5" /></button>
      <div v-if="dots" class="flex items-center gap-1.5">
        <button v-for="(_, i) in items" :key="i" class="relative h-1 rounded-full overflow-hidden transition-all duration-300" :class="[i === active ? 'w-12' : 'w-5', dark ? 'bg-white/20' : 'bg-line-strong']" :aria-label="`Go to ${i + 1}`" :aria-current="i === active" @click="go(i)">
          <span v-if="i === active" :key="tick" class="absolute inset-0 origin-left bg-gold" :class="autoplay && !paused ? 's-fill' : ''" :style="autoplay && !paused ? { animationDuration: `${autoplay}ms` } : {}" />
        </button>
      </div>
      <button v-if="arrows" class="w-10 h-10 rounded-full flex items-center justify-center transition" :class="dark ? 'text-cream/80 hover:bg-white/10' : 'text-noir-800 hover:bg-cream-deep'" aria-label="Next" @click="next"><Icon name="lucide:chevron-right" class="w-5 h-5" /></button>
    </div>
  </div>
</template>
