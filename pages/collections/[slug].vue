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
    <section class="s-band relative overflow-hidden">
      <img v-if="c.image" :src="c.image" alt="" class="absolute inset-0 w-full h-full object-cover opacity-35">
      <div class="s-container relative py-16 sm:py-24 text-center">
        <p class="s-eyebrow text-gold">Collection</p>
        <h1 class="s-title text-4xl sm:text-6xl mt-3">{{ c.name }}</h1>
        <p v-if="c.subtitle" class="text-gold-light/90 mt-3 font-display text-xl italic">{{ c.subtitle }}</p>
        <div class="flex items-center justify-center gap-3 mt-5 text-gold"><span class="h-px w-16 bg-gold/40" />✦<span class="h-px w-16 bg-gold/40" /></div>
        <p v-if="c.description" class="text-cream/80 mt-5 max-w-2xl mx-auto">{{ c.description }}</p>
        <p class="text-cream/60 mt-4 text-sm">{{ total }} {{ total === 1 ? 'product' : 'products' }}</p>
      </div>
    </section>
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
