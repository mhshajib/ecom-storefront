<script setup>
// Scentology mark: a gold ring holding a swirling atomiser, after the brand logo. Swap for /logo.png
// (or /logo.svg) in public/ when the real artwork is added.
defineProps({ light: Boolean, stacked: Boolean })
const { store } = useAppConfig()
</script>
<template>
  <NuxtLink to="/" class="inline-flex items-center gap-3 group" :class="{ 'flex-col !gap-2': stacked }" :aria-label="`${store.name} home`">
    <svg viewBox="0 0 48 48" class="shrink-0" :class="stacked ? 'w-16 h-16' : 'w-8 h-8 sm:w-10 sm:h-10'" aria-hidden="true">
      <defs>
        <linearGradient id="sc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F1DDA8" /><stop offset=".45" stop-color="#C9A24E" /><stop offset="1" stop-color="#8C6A2F" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="26" r="17" fill="none" stroke="url(#sc-gold)" stroke-width="1.6" />
      <!-- atomiser -->
      <rect x="22.4" y="12.5" width="3.2" height="4.2" rx=".8" fill="url(#sc-gold)" />
      <!-- swirl body -->
      <path d="M24 17.2c-4.6 3-6.2 6.6-4.6 10.2 1.3 2.9 5 3.6 5.6 6.6.3 1.6-.4 3.1-1.8 4.3 4.9-1.3 7.2-4.8 5.9-8.4-1.1-3-4.7-3.9-5.2-6.8-.3-1.8.3-3.8.1-5.9Z" fill="url(#sc-gold)" />
      <!-- scent trail -->
      <path d="M24.6 12.3c-1.5-2.3.6-3.6-.4-6.1-.5-1.3-1.6-2.1-2.7-2.9" fill="none" stroke="url(#sc-gold)" stroke-width="1" stroke-linecap="round" opacity=".75" />
    </svg>
    <span class="leading-none" :class="{ 'text-center': stacked }">
      <span class="block font-brand uppercase" :class="[stacked ? 'text-3xl tracking-[0.2em]' : 'text-[1.02rem] tracking-[0.14em] sm:text-[1.35rem] sm:tracking-[0.2em]', light ? 's-gold-text' : 'text-noir-900']">{{ store.name }}</span>
      <span class="font-display italic text-[0.8rem] tracking-[0.18em] mt-1" :class="[stacked ? 'block' : 'hidden sm:block', light ? 'text-gold-light/80' : 'text-ink-soft']">{{ store.tagline }}</span>
    </span>
  </NuxtLink>
</template>
