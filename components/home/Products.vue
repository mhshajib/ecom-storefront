<script setup>
defineProps({ section: { type: Object, required: true } })
</script>

<template>
  <section class="s-container py-20">
    <div v-reveal class="text-center">
      <p v-if="section.eyebrow" class="s-eyebrow text-ink-faint">{{ section.eyebrow }}</p>
      <h2 class="s-title text-3xl sm:text-[2.8rem] text-noir-800">{{ section.title }} <em v-if="section.highlight" class="font-display italic text-gold-dark">{{ section.highlight }}</em></h2>
      <p v-if="section.subtitle" class="mt-3 text-ink-soft">{{ section.subtitle }}</p>
    </div>
    <ProductGrid class="mt-12" :products="section.products" cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-5" />
    <div v-if="section.button" class="text-center mt-12">
      <NuxtLink :to="section.button.href" class="s-btn-dark !py-2.5">{{ section.button.display_label }} <Icon name="lucide:arrow-right" class="w-4 h-4" /></NuxtLink>
    </div>
  </section>
</template>
