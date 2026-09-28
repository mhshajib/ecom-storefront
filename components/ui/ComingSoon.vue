<script setup>
defineProps({ title: String, body: String, icon: { type: String, default: 'lucide:sparkles' } })
</script>
<template>
  <section class="s-container py-24 text-center max-w-xl">
    <span class="w-14 h-14 mx-auto rounded-full bg-noir-100 text-noir-800 flex items-center justify-center"><Icon :name="icon" class="w-6 h-6" /></span>
    <h1 class="s-title text-4xl text-noir-800 mt-6">{{ title }}</h1>
    <p class="text-ink-soft mt-3">{{ body }}</p>
    <NuxtLink to="/products" class="s-btn-dark mt-8">Keep shopping</NuxtLink>
  </section>
</template>
