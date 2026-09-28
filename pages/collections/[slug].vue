<script setup>
// A collection: hand-picked or by rule (the API works out which products).
const route = useRoute()
const router = useRouter()
const { data: collection, error } = await useAsyncData(`collection-${route.params.slug}`, async () => (await api(`/collections/${route.params.slug}`)).data)
if (error.value || !collection.value) throw createError({ statusCode: 404, statusMessage: 'Collection not found', fatal: true })
const PAGE = 24
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const { data, pending } = await useAsyncData(`collection-products-${route.params.slug}`, () => api(`/collections/${route.params.slug}/products`, { query: { page: page.value, limit: PAGE } }), {
  watch: [page], default: () => ({ data: [], pagination: null }),
})
const products = computed(() => data.value?.data || [])
const total = computed(() => data.value?.pagination?.total || 0)
const pages = computed(() => Math.max(1, Math.ceil(total.value / PAGE)))
const go = (p) => router.push({ query: p > 1 ? { page: p } : {} })
const c = collection
useSeoMeta({ title: () => c.value.name, description: () => c.value.subtitle || c.value.description, ogImage: () => c.value.image || undefined })
</script>

<template>
  <div>
    <UiPageHero eyebrow="Collection" :title="c.name" :subtitle="c.subtitle" :image="c.image" :note="`${total} ${total === 1 ? 'product' : 'products'}`">
      <p v-if="c.description" class="text-cream/80 mt-5 max-w-2xl mx-auto">{{ c.description }}</p>
    </UiPageHero>
    <div class="s-container py-12">
      <ProductGrid :products="products" :loading="pending && !products.length" cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :skeletons="8" />
      <p v-if="!pending && !products.length" class="text-center py-16 text-ink-soft">Nothing here right now. <NuxtLink to="/products" class="underline">See everything</NuxtLink></p>
      <nav v-if="pages > 1" class="flex items-center justify-center gap-2 mt-14" aria-label="Pages">
        <button class="s-chip" :disabled="page <= 1" @click="go(page - 1)"><Icon name="lucide:chevron-left" class="w-4 h-4" /> Previous</button>
        <span class="text-sm text-ink-soft px-3 tabular-nums">Page {{ page }} of {{ pages }}</span>
        <button class="s-chip" :disabled="page >= pages" @click="go(page + 1)">Next <Icon name="lucide:chevron-right" class="w-4 h-4" /></button>
      </nav>
    </div>
  </div>
</template>
