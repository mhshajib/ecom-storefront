<script setup>
// "Shop by category": dark band of large cards. Image: the category's own, else one of its products'.
const props = defineProps({ categories: { type: Array, default: () => [] }, products: { type: Array, default: () => [] } })
const cards = computed(() => props.categories.slice(0, 3).map((c, i) => {
  const fromProduct = props.products.find((p) => p.category_id === c._id && imagesOf(p)[0])
  return { ...c, img: c.image || (fromProduct && imagesOf(fromProduct)[0]) || '', wide: i === 2 || props.categories.length === 1 }
}))
</script>
<template>
  <section v-if="cards.length" class="s-band py-20 sm:py-24">
    <div class="s-container">
      <UiSectionHeading light center eyebrow="Collections" title="Find what you love," highlight="faster" body="Browse by category, every one hand-curated." />
      <div class="mt-12 grid gap-5 md:grid-cols-4">
        <NuxtLink
          v-for="c in cards" :key="c._id" :to="`/products?category=${c.slug}`"
          class="group relative overflow-hidden rounded-2xl h-80 sm:h-96 bg-noir-700 ring-1 ring-white/10"
          :class="c.wide ? 'md:col-span-2' : 'md:col-span-1'"
        >
          <img v-if="c.img" :src="c.img" :alt="c.name" loading="lazy" class="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/20 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-6">
            <h3 class="font-display text-3xl">{{ c.name }}</h3>
            <p v-if="c.description" class="text-sm text-cream/75 mt-1">{{ c.description }}</p>
            <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold">Shop now <Icon name="lucide:arrow-right" class="w-4 h-4 transition group-hover:translate-x-1" /></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
