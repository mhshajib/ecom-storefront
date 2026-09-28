<script setup>
const shop = useShop()
const announcements = computed(() => shop.value.announcements || [])
</script>
<template>
  <div v-if="announcements.length" class="bg-gold text-noir-900 text-[0.78rem] font-semibold overflow-hidden" role="region" aria-label="Announcements">
    <div class="flex w-max animate-marquee hover:[animation-play-state:paused] py-2">
      <template v-for="n in 2" :key="n">
        <span v-for="(a, i) in announcements" :key="`${n}-${i}`" class="px-8 whitespace-nowrap" :aria-hidden="n === 2">
          {{ a }}<span class="ml-8 opacity-40">✦</span>
        </span>
      </template>
    </div>
  </div>
</template>
