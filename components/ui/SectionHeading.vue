<script setup>
defineProps({ eyebrow: String, title: String, highlight: String, body: String, center: Boolean, light: Boolean, to: String, linkLabel: { type: String, default: 'View all' } })
</script>
<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" :class="{ 'items-center text-center sm:flex-col sm:items-center': center }">
    <div :class="{ 'max-w-2xl': center }">
      <p v-if="eyebrow" class="s-eyebrow" :class="light ? 'text-gold' : 'text-ink-faint'">{{ eyebrow }}</p>
      <h2 class="s-title text-3xl sm:text-[2.6rem] mt-2" :class="light ? 'text-cream' : 'text-noir-800'">
        {{ title }} <em v-if="highlight" class="font-display italic" :class="light ? 's-gold-text' : 'text-gold-dark'">{{ highlight }}</em>
      </h2>
      <p v-if="body" class="mt-3 text-sm sm:text-base" :class="light ? 'text-cream/70' : 'text-ink-soft'">{{ body }}</p>
    </div>
    <NuxtLink v-if="to" :to="to" class="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0" :class="light ? 'text-gold' : 'text-noir-800'">
      {{ linkLabel }} <Icon name="lucide:arrow-right" class="w-4 h-4" />
    </NuxtLink>
  </div>
</template>
