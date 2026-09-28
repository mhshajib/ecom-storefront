<script setup>
// Full width slides: picture with a slow zoom, headline on the left, "Previous —— Next" with a filling line.
const props = defineProps({ section: { type: Object, required: true } })
const slides = computed(() => props.section.slides || [])
const at = ref(0)
const DWELL = 6500
const tick = ref(0)
const paused = ref(false)
let timer
const go = (i) => { at.value = (i + slides.value.length) % slides.value.length }
const schedule = () => {
  clearTimeout(timer)
  if (slides.value.length < 2 || paused.value) return
  tick.value++
  timer = setTimeout(() => go(at.value + 1), DWELL)
}
watch([at, paused], schedule)
onMounted(() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) schedule() })
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="relative h-[78vh] min-h-[30rem] max-h-[52rem] bg-noir-950 text-cream overflow-hidden" aria-roledescription="carousel" aria-label="Featured" @mouseenter="paused = true" @mouseleave="paused = false">
    <TransitionGroup enter-from-class="opacity-0" enter-active-class="transition-opacity duration-1000" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-1000">
      <div v-for="(s, i) in slides" v-show="i === at" :key="i" class="absolute inset-0" :aria-hidden="i !== at">
        <img v-if="s.image" :src="s.image" alt="" class="absolute inset-0 w-full h-full object-cover" :class="{ 's-kenburns': i === at }" :loading="i === 0 ? 'eager' : 'lazy'" :fetchpriority="i === 0 ? 'high' : undefined">
        <span v-else class="absolute inset-0 s-band" />
        <span class="absolute inset-0 bg-gradient-to-r from-noir-950/85 via-noir-950/45 to-transparent" />
        <div class="relative s-container h-full flex items-center">
          <div v-if="i === at" class="max-w-xl">
            <p v-if="s.eyebrow" class="s-eyebrow text-gold animate-rise">{{ s.eyebrow }}</p>
            <h2 class="s-title text-5xl sm:text-7xl leading-[1.02] mt-4 animate-rise [animation-delay:90ms]">{{ s.title }} <em v-if="s.highlight" class="font-display italic s-gold-text block">{{ s.highlight }}</em></h2>
            <span class="s-rule mt-7 animate-rise [animation-delay:160ms]" />
            <p v-if="s.body" class="mt-6 text-cream/80 max-w-md leading-relaxed animate-rise [animation-delay:220ms]">{{ s.body }}</p>
            <NuxtLink v-if="s.button" :to="s.button.href" class="s-btn-gold mt-8 animate-rise [animation-delay:280ms]">{{ s.button.display_label }} <Icon name="lucide:arrow-right" class="w-4 h-4" /></NuxtLink>
          </div>
        </div>
      </div>
    </TransitionGroup>
    <div v-if="slides.length > 1" class="absolute bottom-7 right-0 left-0">
      <div class="s-container flex items-center justify-end gap-4 text-xs tracking-[0.2em] uppercase">
        <button class="text-cream/70 hover:text-gold" @click="go(at - 1)">Previous</button>
        <span class="relative w-24 h-px bg-cream/25 overflow-hidden"><span :key="tick" class="absolute inset-0 origin-left bg-gold" :class="paused ? '' : 's-fill'" :style="{ animationDuration: `${DWELL}ms` }" /></span>
        <button class="text-cream/70 hover:text-gold" @click="go(at + 1)">Next</button>
        <span class="text-cream/50 tabular-nums tracking-normal">{{ String(at + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}</span>
      </div>
    </div>
  </section>
</template>
