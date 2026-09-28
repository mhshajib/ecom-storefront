<script setup>
defineProps({ section: { type: Object, required: true } })
const open = ref(0)
</script>

<template>
  <section class="s-container py-20 max-w-4xl">
    <div v-reveal class="text-center">
      <h2 class="s-title text-3xl sm:text-[2.8rem] text-noir-800">{{ section.title }} <em v-if="section.highlight" class="font-display italic text-gold-dark block">{{ section.highlight }}</em></h2>
      <p v-if="section.subtitle" class="mt-3 text-ink-soft">{{ section.subtitle }}</p>
    </div>
    <div class="mt-12 space-y-3">
      <div v-for="(f, i) in section.items" :key="i" v-reveal="{ dir: 'up', delay: i * 50 }" class="rounded-xl bg-white ring-1 transition" :class="open === i ? 'ring-noir-800 shadow-card' : 'ring-line'">
        <h3>
          <button class="w-full flex items-center justify-between gap-4 text-left px-6 py-5 font-medium" :aria-expanded="open === i" @click="open = open === i ? -1 : i">
            <span :class="open === i ? 'text-noir-800' : ''">{{ f.title }}</span>
            <span class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition" :class="open === i ? 'bg-noir-800 text-cream rotate-180' : 'bg-cream-deep'">
              <Icon :name="open === i ? 'lucide:minus' : 'lucide:plus'" class="w-4 h-4" />
            </span>
          </button>
        </h3>
        <div class="grid transition-[grid-template-rows] duration-300" :class="open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
          <p class="overflow-hidden px-6 text-ink-soft leading-relaxed" :class="open === i ? 'pb-6' : ''">{{ f.body }}</p>
        </div>
      </div>
    </div>
    <p class="text-center text-sm text-ink-soft mt-10">Still have questions? <NuxtLink to="/stores" class="font-semibold text-noir-800 underline">Visit or call a store</NuxtLink></p>
  </section>
</template>
