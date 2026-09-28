<script setup>
const props = defineProps({ error: Object })
const notFound = computed(() => props.error?.statusCode === 404)
useSeoMeta({ title: () => (notFound.value ? 'Not found' : 'Something went wrong'), robots: 'noindex' })
</script>
<template>
  <NuxtLayout>
    <section class="s-container py-28 text-center max-w-xl">
      <p class="font-display text-8xl text-gold-dark">{{ error?.statusCode || 500 }}</p>
      <h1 class="s-title text-4xl text-noir-800 mt-4">{{ notFound ? 'We couldn’t find that page' : 'Something went wrong' }}</h1>
      <p class="text-ink-soft mt-3">{{ notFound ? 'It may have moved, or the product is no longer available.' : 'Please try again in a moment.' }}</p>
      <button class="s-btn-dark mt-8" @click="clearError({ redirect: '/' })">Back to the shop</button>
    </section>
  </NuxtLayout>
</template>
