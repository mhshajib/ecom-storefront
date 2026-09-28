<script setup>
defineProps({ section: { type: Object, required: true } })
</script>

<template>
  <section class="s-container py-20">
    <div v-reveal>
      <p v-if="section.eyebrow" class="s-eyebrow text-ink-faint">{{ section.eyebrow }}</p>
      <h2 class="s-title text-3xl sm:text-[2.8rem] text-noir-800 mt-2">{{ section.title }} <em v-if="section.highlight" class="font-display italic text-gold-dark">{{ section.highlight }}</em></h2>
      <p v-if="section.subtitle" class="mt-2 text-ink-soft">{{ section.subtitle }}</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-10">
      <div v-for="(f, i) in section.figures" :key="f.key" v-reveal="{ dir: 'up', delay: i * 60 }" class="rounded-2xl bg-white ring-1 ring-line p-5 shadow-card">
        <p class="text-[0.65rem] tracking-[0.18em] uppercase text-ink-faint">{{ f.label }}</p>
        <p class="text-3xl font-semibold text-noir-800 tabular-nums mt-2">{{ f.value }}</p>
        <p class="text-xs text-ink-faint mt-1">{{ f.note }}</p>
      </div>
      <div v-for="(it, i) in section.items" :key="`i${i}`" v-reveal="{ dir: 'up', delay: 360 + i * 60 }" class="rounded-2xl bg-white ring-1 ring-line p-5">
        <p class="text-[0.65rem] tracking-[0.18em] uppercase text-ink-faint">{{ it.label }}</p>
        <p class="font-semibold text-noir-800 mt-2 leading-snug">{{ it.title }}</p>
        <p class="text-xs text-ink-faint mt-1">{{ it.body }}</p>
      </div>
    </div>
  </section>
</template>
