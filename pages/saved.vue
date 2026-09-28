<script setup>
useSeoMeta({ title: 'Saved items', robots: 'noindex' })
const saved = useWishlist()
const products = ref([])
const loading = ref(true)
onMounted(async () => {
  try {
    const all = await Promise.all(saved.ids.value.map((id) => api(`/products/${id}`).then((r) => r.data).catch(() => null)))
    products.value = all.filter(Boolean)
  } finally { loading.value = false }
})
</script>
<template>
  <section class="s-container py-16">
    <UiSectionHeading eyebrow="Your list" title="Saved" highlight="items" />
    <ProductGrid class="mt-10" :products="products" :loading="loading" :skeletons="4" />
    <p v-if="!loading && !products.length" class="text-center text-ink-soft py-16">Nothing saved yet. Tap the heart on any product to keep it here.</p>
  </section>
</template>
