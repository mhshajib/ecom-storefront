<script setup>
// One quote at a time; the avatars below pick one, and a line under the chosen one fills while it waits.
const props = defineProps({ section: { type: Object, required: true } })
const items = computed(() => props.section.items || [])
const at = ref(0)
const DWELL = 7000
const tick = ref(0)
const paused = ref(false)
let timer
const schedule = () => {
  clearTimeout(timer)
  if (items.value.length < 2 || paused.value) return
  tick.value++
  timer = setTimeout(() => { at.value = (at.value + 1) % items.value.length }, DWELL)
}
watch([at, paused], schedule)
onMounted(() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) schedule() })
onBeforeUnmount(() => clearTimeout(timer))
const initials = (n) => (n || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
</script>

<template>
  <section class="s-band text-cream py-20" @mouseenter="paused = true" @mouseleave="paused = false">
    <div class="s-container text-center">
      <h2 v-reveal class="s-title text-3xl sm:text-[2.8rem]">{{ section.title }} <em v-if="section.highlight" class="font-display italic s-gold-text block">{{ section.highlight }}</em></h2>
      <p v-if="section.subtitle" class="text-cream/70 mt-3 text-sm">{{ section.subtitle }}</p>
      <div class="relative max-w-2xl mx-auto mt-12 text-left min-h-[16rem]">
        <Transition mode="out-in" enter-from-class="opacity-0 translate-y-3" enter-active-class="transition duration-500" leave-to-class="opacity-0 -translate-y-3" leave-active-class="transition duration-300">
          <figure :key="at" class="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 sm:p-10">
            <Icon name="lucide:quote" class="w-8 h-8 text-gold" />
            <blockquote class="font-display text-2xl sm:text-3xl leading-snug mt-4">{{ items[at]?.title }}</blockquote>
            <figcaption class="mt-8 flex items-center gap-3 text-sm"><span class="rounded-full border border-white/20 px-3.5 py-1 font-semibold">{{ items[at]?.name }}</span><span class="text-cream/55">{{ items[at]?.role }}</span></figcaption>
          </figure>
        </Transition>
      </div>
      <div v-if="items.length > 1" class="flex items-center justify-center gap-3 mt-8">
        <button v-for="(it, i) in items" :key="i" class="relative" :aria-label="`Show ${it.name}`" :aria-current="i === at" @click="at = i">
          <span class="block rounded-full overflow-hidden ring-2 transition" :class="i === at ? 'w-14 h-14 ring-gold' : 'w-11 h-11 ring-transparent opacity-70 hover:opacity-100'">
            <img v-if="it.image" :src="it.image" alt="" class="w-full h-full object-cover">
            <span v-else class="w-full h-full bg-gold/25 text-gold-light flex items-center justify-center text-sm font-semibold">{{ initials(it.name) }}</span>
          </span>
          <span v-if="i === at" class="absolute -bottom-2 left-1 right-1 h-0.5 bg-white/20 overflow-hidden rounded"><span :key="tick" class="absolute inset-0 origin-left bg-gold" :class="paused ? '' : 's-fill'" :style="{ animationDuration: `${DWELL}ms` }" /></span>
        </button>
      </div>
    </div>
  </section>
</template>
