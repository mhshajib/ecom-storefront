<script setup>
defineProps({ section: { type: Object, required: true } })
</script>

<template>
  <section class="py-20" :class="section.dark ? 's-band text-cream' : ''">
    <div v-reveal class="s-container text-center">
      <h2 class="s-title text-3xl sm:text-4xl">{{ section.title }}</h2>
      <p v-if="section.subtitle" class="mt-2 text-sm" :class="section.dark ? 'text-gold-light/80' : 'text-ink-soft'">{{ section.subtitle }}</p>
    </div>
    <div class="mt-12">
      <UiLogoMarquee :logos="section.logos.map((l) => ({ src: l.display_image, alt: l.display_label, to: l.href }))" tile />
    </div>
    <div v-if="section.button" class="text-center mt-12">
      <NuxtLink :to="section.button.href" class="s-btn-gold !py-2.5">{{ section.button.display_label }} <Icon name="lucide:arrow-right" class="w-4 h-4" /></NuxtLink>
    </div>
  </section>
</template>
