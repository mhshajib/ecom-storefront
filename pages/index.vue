<script setup>
const { data: categories } = await useCategories()
// one request for the home page's products: newest first; offers and best sellers are picked from it
const { data: products, pending } = await useAsyncData('home-products', async () => {
  const res = await api('/products', { query: { limit: 24, sort_by: 'timestamp.created_at:desc' } })
  return res.data || []
}, { default: () => [] })

const newIn = computed(() => products.value.slice(0, 8))
const best = computed(() => [...products.value].sort((a, b) => (b.best_seller || 0) - (a.best_seller || 0)).slice(0, 8))
const hero = computed(() => [...products.value].filter((p) => imagesOf(p)[0]).sort((a, b) => (b.best_seller || 0) - (a.best_seller || 0)))

const { store } = useAppConfig()
useSeoMeta({ ogTitle: store.name, description: store.description })
</script>

<template>
  <div>
    <HomeHeroSection :products="hero" />

    <section class="s-container py-20">
      <UiSectionHeading eyebrow="Just in" title="New" highlight="arrivals" to="/products?sort=new" />
      <ProductGrid class="mt-10" :products="newIn" :loading="pending" />
      <p v-if="!pending && !newIn.length" class="text-center text-ink-soft py-16">New products are on their way. Check back soon.</p>
    </section>

    <HomeCategoryShowcase :categories="categories" :products="products" />

    <section v-if="best.length" class="s-container py-20">
      <UiSectionHeading eyebrow="Most loved" title="Best" highlight="sellers" to="/products?sort=best" />
      <ProductGrid class="mt-10" :products="best" />
    </section>

    <HomeOfferBand :products="products" />
    <HomePromiseStrip />
    <HomeFaqSection />
  </div>
</template>
