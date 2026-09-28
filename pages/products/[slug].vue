<script setup>
const route = useRoute()
const { data: product, error } = await useAsyncData(`product-${route.params.slug}`, async () => (await api(`/products/slug/${route.params.slug}`)).data)
if (error.value || !product.value) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })

const p = product
const cart = useCart()
const saved = useWishlist()
const pics = computed(() => imagesOf(p.value))
const active = ref(0)

// variant selection: one value per option, starting from the first variant that can be sold online
const options = computed(() => p.value.options || [])
const variants = computed(() => p.value.variants || [])
const firstSellable = variants.value.find((v) => v.online_stock > 0) || variants.value[0]
const picks = reactive({ ...(firstSellable?.attributes || {}) })
const variant = computed(() => variants.value.find((v) => options.value.every((o) => v.attributes?.[o.name] === picks[o.name])) || (options.value.length ? null : variants.value[0]))
// a value is available when some variant with it (and the other current picks) is in stock online
const availableFor = (name) => (value) => variants.value.some((v) => v.online_stock > 0 && v.attributes?.[name] === value
  && options.value.every((o) => o.name === name || !picks[o.name] || v.attributes?.[o.name] === picks[o.name]))

const inStock = computed(() => (variant.value?.online_stock || 0) > 0)
const price = computed(() => (variant.value ? { min: variant.value.sale_price, was: variant.value.original_price > variant.value.sale_price ? variant.value.original_price : 0 } : priceOf(p.value)))
const qty = ref(1)
watch(variant, () => { qty.value = 1 })
const addToBag = () => {
  if (!variant.value || !inStock.value) return
  cart.add({
    variant_id: variant.value._id, product_id: p.value._id, slug: p.value.slug, title: p.value.title,
    thumb: pics.value[0] || '', attrs: { ...variant.value.attributes }, price: variant.value.sale_price,
    was: variant.value.original_price, max: variant.value.online_stock,
  }, qty.value)
}

const { data: related } = await useAsyncData(`related-${route.params.slug}`, async () => {
  const res = await api('/products', { query: { category_id: p.value.category_id, limit: 5 } })
  return (res.data || []).filter((x) => x._id !== p.value._id).slice(0, 4)
}, { default: () => [] })

const site = useRuntimeConfig().public.siteUrl
useSeoMeta({
  title: () => p.value.title,
  description: () => (p.value.subtitle || p.value.description || '').slice(0, 160),
  ogImage: () => pics.value[0],
  ogType: 'product',
})
useHead({
  link: [{ rel: 'canonical', href: `${site}/products/${p.value.slug}` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.value.title, image: pics.value, description: p.value.description,
      offers: { '@type': 'AggregateOffer', priceCurrency: 'BDT', lowPrice: priceOf(p.value).min, highPrice: priceOf(p.value).max, availability: onlineStockOf(p.value) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    }),
  }],
})
</script>

<template>
  <div>
    <nav class="s-container pt-6 text-xs text-ink-faint flex flex-wrap gap-1.5" aria-label="Breadcrumb">
      <NuxtLink to="/" class="hover:text-noir-800">Home</NuxtLink><span>/</span>
      <NuxtLink v-if="p.category" :to="`/products?category=${p.category.slug}`" class="hover:text-noir-800">{{ p.category.name }}</NuxtLink><span v-if="p.category">/</span>
      <span class="text-ink-soft">{{ p.title }}</span>
    </nav>

    <section class="s-container py-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
      <!-- gallery -->
      <div class="lg:sticky lg:top-28 self-start">
        <div class="relative aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-line">
          <img v-if="pics[active]" :src="pics[active]" :alt="p.title" class="w-full h-full object-cover">
          <span v-if="discountOf(p)" class="absolute left-4 top-4 rounded-full bg-sale text-white text-xs font-bold px-3 py-1">−{{ discountOf(p) }}%</span>
        </div>
        <div v-if="pics.length > 1" class="flex gap-3 mt-4 overflow-x-auto">
          <button v-for="(img, i) in pics" :key="img" class="w-20 h-20 shrink-0 rounded-xl overflow-hidden ring-2 transition" :class="active === i ? 'ring-noir-800' : 'ring-transparent opacity-70 hover:opacity-100'" :aria-label="`Image ${i + 1}`" @click="active = i">
            <img :src="img" alt="" class="w-full h-full object-cover" loading="lazy">
          </button>
        </div>
      </div>

      <!-- details -->
      <div>
        <p v-if="categoryLabel(p)" class="s-eyebrow text-ink-faint">{{ categoryLabel(p) }}</p>
        <h1 class="s-title text-4xl sm:text-5xl text-noir-800 mt-2">{{ p.title }}</h1>
        <p v-if="p.subtitle" class="text-ink-soft mt-3 text-lg">{{ p.subtitle }}</p>
        <p class="mt-6 flex items-baseline gap-3 tabular-nums">
          <span class="text-3xl font-semibold text-noir-900">{{ money(price.min) }}</span>
          <s v-if="price.was" class="text-ink-faint text-lg">{{ money(price.was) }}</s>
          <span v-if="price.was" class="rounded-full bg-sale/10 text-sale text-xs font-bold px-2.5 py-1">Save {{ money(price.was - price.min) }}</span>
        </p>

        <div class="mt-8 space-y-6">
          <ProductOptionPicker v-for="o in options" :key="o.name" v-model="picks[o.name]" :option="o" :available="availableFor(o.name)" />
        </div>

        <p class="mt-6 text-sm flex items-center gap-2" :class="inStock ? 'text-green-700' : 'text-sale'">
          <Icon :name="inStock ? 'lucide:circle-check' : 'lucide:circle-x'" class="w-4 h-4" />
          <template v-if="!variant">This combination isn't available</template>
          <template v-else-if="!inStock">Out of stock online</template>
          <template v-else-if="variant.online_stock <= 5">Only {{ variant.online_stock }} left</template>
          <template v-else>In stock, ready to ship</template>
        </p>

        <div class="mt-6 flex gap-3">
          <div class="inline-flex items-center rounded-full border border-line-strong bg-white">
            <button class="p-3.5" aria-label="One less" :disabled="qty <= 1" @click="qty--"><Icon name="lucide:minus" class="w-4 h-4" /></button>
            <span class="w-8 text-center tabular-nums" aria-live="polite">{{ qty }}</span>
            <button class="p-3.5" aria-label="One more" :disabled="!variant || qty >= variant.online_stock" @click="qty++"><Icon name="lucide:plus" class="w-4 h-4" /></button>
          </div>
          <button class="s-btn-dark flex-1" :disabled="!inStock" @click="addToBag"><Icon name="lucide:shopping-bag" class="w-4 h-4" /> {{ inStock ? 'Add to bag' : 'Sold out' }}</button>
          <ClientOnly>
            <button class="s-btn-line !px-4" :aria-pressed="saved.has(p._id)" :aria-label="saved.has(p._id) ? 'Remove from saved' : 'Save'" @click="saved.toggle(p._id)">
              <Icon name="lucide:heart" class="w-5 h-5" :class="saved.has(p._id) ? 'text-sale fill-current' : ''" />
            </button>
          </ClientOnly>
        </div>

        <ul class="mt-8 grid grid-cols-2 gap-3 text-sm">
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:truck" class="w-5 h-5 text-noir-800 shrink-0" /> Delivery in 1–4 days</li>
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:banknote" class="w-5 h-5 text-noir-800 shrink-0" /> Cash on delivery</li>
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:rotate-ccw" class="w-5 h-5 text-noir-800 shrink-0" /> 7 day returns</li>
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:badge-check" class="w-5 h-5 text-noir-800 shrink-0" /> 100% authentic</li>
        </ul>

        <div v-if="p.description || p.features?.length" class="mt-10 border-t border-line pt-8">
          <h2 class="font-display text-2xl text-noir-800">Details</h2>
          <p v-if="p.description" class="mt-4 text-ink-soft leading-relaxed whitespace-pre-line">{{ p.description }}</p>
          <ul v-if="p.features?.length" class="mt-4 space-y-2">
            <li v-for="f in p.features" :key="f" class="flex gap-2 text-ink-soft"><Icon name="lucide:check" class="w-4 h-4 mt-1 text-gold-dark shrink-0" />{{ f }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="s-container py-16">
      <UiSectionHeading eyebrow="You may also like" title="From the same" highlight="collection" :to="p.category ? `/products?category=${p.category.slug}` : '/products'" />
      <ProductGrid class="mt-10" :products="related" />
    </section>
  </div>
</template>
