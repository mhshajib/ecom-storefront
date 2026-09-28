<script setup>
defineProps({ section: { type: Object, required: true } })
</script>

<template>
  <section class="grid lg:grid-cols-2" :class="section.dark ? 's-band text-cream' : 'bg-cream'">
    <div v-reveal="'left'" class="flex items-center px-6 sm:px-12 lg:px-20 py-16 lg:py-24">
      <div class="max-w-lg">
        <p v-if="section.eyebrow" class="s-eyebrow text-gold">{{ section.eyebrow }}</p>
        <h2 class="s-title text-4xl sm:text-5xl leading-tight mt-3">
          {{ section.title }} <em v-if="section.highlight" class="font-display italic text-gold-light block">{{ section.highlight }}</em>
          <span v-if="section.subtitle" class="block">{{ section.subtitle }}</span>
        </h2>
        <span class="s-rule mt-6" />
        <p v-if="section.body" class="mt-6 leading-relaxed" :class="section.dark ? 'text-cream/75' : 'text-ink-soft'">{{ section.body }}</p>
        <NuxtLink v-if="section.button" :to="section.button.href" class="s-btn-gold mt-8">{{ section.button.display_label }} <Icon name="lucide:arrow-right" class="w-4 h-4" /></NuxtLink>
      </div>
    </div>
    <div v-reveal="'right'" class="relative min-h-[22rem] lg:min-h-[36rem] overflow-hidden">
      <img v-if="section.image" :src="section.image" alt="" class="absolute inset-0 w-full h-full object-cover" loading="lazy">
    </div>
  </section>
</template>
