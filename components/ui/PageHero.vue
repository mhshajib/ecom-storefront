<script setup>
// The dark band at the top of listing pages: eyebrow, title, a gold rule, a line under it; slow gold rings
// turn behind it (and a picture, when there is one).
defineProps({ eyebrow: String, title: String, subtitle: String, note: String, image: String })
</script>

<template>
  <section class="s-band relative overflow-hidden">
    <img v-if="image" :src="image" alt="" class="absolute inset-0 w-full h-full object-cover opacity-30">
    <span class="s-orbit w-[34rem] h-[34rem] -left-40 -top-56" aria-hidden="true" />
    <span class="s-orbit w-[46rem] h-[46rem] -right-72 -bottom-[30rem] [animation-direction:reverse] [animation-duration:90s]" aria-hidden="true" />
    <div class="s-container relative py-14 sm:py-20 text-center">
      <p v-if="eyebrow" class="s-eyebrow text-gold animate-rise">{{ eyebrow }}</p>
      <h1 class="s-title text-4xl sm:text-6xl mt-3 animate-rise [animation-delay:80ms]">{{ title }}</h1>
      <p v-if="subtitle" class="text-gold-light/90 mt-3 font-display text-xl italic animate-rise [animation-delay:140ms]">{{ subtitle }}</p>
      <div class="flex items-center justify-center gap-3 mt-5 text-gold animate-rise [animation-delay:180ms]"><span class="h-px w-16 bg-gold/40" />✦<span class="h-px w-16 bg-gold/40" /></div>
      <slot />
      <p v-if="note" class="text-cream/70 mt-4 text-sm animate-rise [animation-delay:220ms]">{{ note }}</p>
    </div>
  </section>
</template>
