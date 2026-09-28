<script setup>
const { promises } = useAppConfig()
</script>
<template>
  <section class="s-container py-16">
    <ul class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <li v-for="p in promises" :key="p.title" class="rounded-xl bg-white ring-1 ring-line p-6 shadow-card">
        <span class="w-11 h-11 rounded-full bg-noir-100 text-noir-800 flex items-center justify-center"><Icon :name="p.icon" class="w-5 h-5" /></span>
        <h3 class="font-display text-lg text-noir-800 mt-4">{{ p.title }}</h3>
        <p class="text-sm text-ink-soft mt-1">{{ p.body }}</p>
      </li>
    </ul>
  </section>
</template>
