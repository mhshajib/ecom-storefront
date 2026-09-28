<script setup>
const { faq } = useAppConfig()
const open = ref(0)
</script>
<template>
  <section class="s-container py-20 max-w-4xl">
    <UiSectionHeading center eyebrow="Help" title="Frequently asked" highlight="questions" body="Everything you need to know before you order." />
    <div class="mt-12 space-y-3">
      <div v-for="(f, i) in faq" :key="i" class="rounded-xl bg-white ring-1 transition" :class="open === i ? 'ring-noir-800 shadow-card' : 'ring-line'">
        <h3>
          <button class="w-full flex items-center justify-between gap-4 text-left px-6 py-5 font-medium" :aria-expanded="open === i" @click="open = open === i ? -1 : i">
            <span :class="open === i ? 'text-noir-800' : ''">{{ f.q }}</span>
            <span class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition" :class="open === i ? 'bg-noir-800 text-cream' : 'bg-cream-deep'">
              <Icon :name="open === i ? 'lucide:minus' : 'lucide:plus'" class="w-4 h-4" />
            </span>
          </button>
        </h3>
        <p v-show="open === i" class="px-6 pb-6 text-ink-soft leading-relaxed">{{ f.a }}</p>
      </div>
    </div>
  </section>
</template>
