<script setup>
// Five stars filled to a rating (halves too). Drawn inline: the icon set's stars are outlines only.
const props = defineProps({ value: { type: Number, default: 0 }, size: { type: String, default: 'w-4 h-4' } })
const fill = (i) => Math.max(0, Math.min(1, props.value - (i - 1)))
const STAR = 'M12 2.5l2.94 6.1 6.56.93-4.75 4.62 1.12 6.53L12 17.6l-5.87 3.08 1.12-6.53L2.5 9.53l6.56-.93z'
</script>

<template>
  <span class="inline-flex items-center gap-0.5" role="img" :aria-label="`${value.toFixed(1)} out of 5 stars`">
    <span v-for="i in 5" :key="i" class="relative inline-block" :class="size">
      <svg viewBox="0 0 24 24" class="absolute inset-0 w-full h-full text-line-strong" fill="currentColor" aria-hidden="true"><path :d="STAR" /></svg>
      <span class="absolute inset-0 overflow-hidden" :style="{ width: `${fill(i) * 100}%` }">
        <svg viewBox="0 0 24 24" class="h-full text-gold" :class="size" fill="currentColor" aria-hidden="true"><path :d="STAR" /></svg>
      </span>
    </span>
  </span>
</template>
