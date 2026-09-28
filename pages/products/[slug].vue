<script setup>
const route = useRoute()
const { data: product, error } = await useAsyncData(`product-${route.params.slug}`, async () => (await api(`/products/slug/${route.params.slug}`)).data)
if (error.value || !product.value) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })

const p = product
const cart = useCart()
const saved = useWishlist()
const { data: attributes } = await useAttributes()
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

// the chosen size's own photo leads the gallery
const pics = computed(() => {
  const base = imagesOf(p.value)
  const own = variant.value?.image
  return own ? [own, ...base.filter((x) => x !== own)] : base
})
watch(() => variant.value?._id, () => { active.value = 0 })

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

// the fragrance profile
const one = (attr) => valuesOf(attributes.value, p.value, attr)[0] || null
const concentration = computed(() => one('concentration'))
const facts = computed(() => [
  { k: 'For', v: valuesOf(attributes.value, p.value, 'gender').map((x) => x.label).join(', '), to: (s) => `/products?f.gender=${s}`, slug: one('gender')?.slug },
  { k: 'Concentration', v: concentration.value?.label, slug: concentration.value?.slug, to: (s) => `/products?f.concentration=${s}` },
  { k: 'Type', v: one('style')?.label, slug: one('style')?.slug, to: (s) => `/products?f.style=${s}` },
  { k: 'Family', v: valuesOf(attributes.value, p.value, 'family').map((x) => x.label).join(', ') },
  { k: 'Edition', v: one('edition')?.label },
].filter((f) => f.v))
const notes = computed(() => [
  { k: 'Top', hint: 'The first impression', list: p.value.notes?.top || [] },
  { k: 'Heart', hint: 'Once it settles', list: p.value.notes?.heart || [] },
  { k: 'Base', hint: 'What lingers', list: p.value.notes?.base || [] },
].filter((t) => t.list.length))
const seasons = computed(() => valuesOf(attributes.value, p.value, 'season'))
const allSeasons = computed(() => attributes.value.find((a) => a.slug === 'season')?.values || [])
const occasions = computed(() => valuesOf(attributes.value, p.value, 'occasion'))
const perf = computed(() => p.value.performance || {})
const hasProfile = computed(() => facts.value.length || notes.value.length || perf.value.longevity || perf.value.projection || seasons.value.length || occasions.value.length)
const limited = computed(() => (p.value.facets?.edition || []).includes('limited'))

const { data: related } = await useAsyncData(`related-${route.params.slug}`, async () => {
  const family = p.value.facets?.family?.[0]
  const query = family ? { 'f.family': family, limit: 9 } : { category_id: p.value.category_id, limit: 9 }
  const res = await api('/products', { query })
  return (res.data || []).filter((x) => x._id !== p.value._id && x.brand_id !== p.value.brand_id).slice(0, 4)
}, { default: () => [] })
const { data: fromBrand } = await useAsyncData(`brand-${route.params.slug}`, async () => {
  if (!p.value.brand) return []
  const res = await api('/products', { query: { brand: p.value.brand.slug, limit: 5 } })
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
        <p class="s-eyebrow text-ink-faint flex flex-wrap items-center gap-2">
          <NuxtLink v-if="p.brand" :to="`/products?brand=${p.brand.slug}`" class="hover:text-noir-800">{{ p.brand.name }}</NuxtLink>
          <span v-else-if="categoryLabel(p)">{{ categoryLabel(p) }}</span>
          <template v-if="concentration"><span class="text-gold">•</span><NuxtLink :to="`/products?f.concentration=${concentration.slug}`" class="hover:text-noir-800">{{ concentration.label }}</NuxtLink></template>
        </p>
        <h1 class="s-title text-4xl sm:text-5xl text-noir-800 mt-2">{{ p.title }}</h1>
        <div v-if="limited || p.featured" class="flex gap-2 mt-3">
          <span v-if="limited" class="rounded-full bg-noir-800 text-gold-light text-[0.7rem] font-semibold tracking-wide uppercase px-3 py-1">Limited edition</span>
          <span v-if="p.featured" class="rounded-full bg-gold/15 text-gold-dark text-[0.7rem] font-semibold tracking-wide uppercase px-3 py-1">Featured</span>
        </div>
        <p v-if="p.subtitle" class="text-ink-soft mt-3 text-lg">{{ p.subtitle }}</p>
        <p class="mt-6 flex items-baseline gap-3 tabular-nums">
          <span class="text-3xl font-semibold text-noir-900">{{ money(price.min) }}</span>
          <s v-if="price.was" class="text-ink-faint text-lg">{{ money(price.was) }}</s>
          <span v-if="price.was" class="rounded-full bg-sale/10 text-sale text-xs font-bold px-2.5 py-1">Save {{ money(price.was - price.min) }}</span>
        </p>
        <p v-if="variant?.caption" class="text-sm text-ink-soft mt-2">{{ variant.caption }}</p>

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

        <ClientOnly><ProductStoreStock :variant-id="variant?._id" /></ClientOnly>

        <ul class="mt-8 grid grid-cols-2 gap-3 text-sm">
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:truck" class="w-5 h-5 text-noir-800 shrink-0" /> Delivery in 1–4 days</li>
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:banknote" class="w-5 h-5 text-noir-800 shrink-0" /> Cash on delivery</li>
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:rotate-ccw" class="w-5 h-5 text-noir-800 shrink-0" /> 7 day returns</li>
          <li class="rounded-xl bg-white ring-1 ring-line p-4 flex gap-3"><Icon name="lucide:badge-check" class="w-5 h-5 text-noir-800 shrink-0" /> 100% authentic</li>
        </ul>

        <div v-if="(!hasProfile && p.description) || p.features?.length" class="mt-10 border-t border-line pt-8">
          <h2 class="font-display text-2xl text-noir-800">Details</h2>
          <p v-if="!hasProfile && p.description" class="mt-4 text-ink-soft leading-relaxed whitespace-pre-line">{{ p.description }}</p>
          <ul v-if="p.features?.length" class="mt-4 space-y-2">
            <li v-for="f in p.features" :key="f" class="flex gap-2 text-ink-soft"><Icon name="lucide:check" class="w-4 h-4 mt-1 text-gold-dark shrink-0" />{{ f }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- fragrance profile -->
    <section v-if="hasProfile" class="s-container py-12 border-t border-line">
      <div class="grid lg:grid-cols-[1fr_22rem] gap-10 lg:gap-16">
        <div>
          <h2 class="s-title text-3xl text-noir-800">About the fragrance</h2>
          <p v-if="p.description" class="mt-5 text-ink-soft leading-relaxed whitespace-pre-line max-w-2xl">{{ p.description }}</p>
        </div>
        <dl v-if="facts.length" class="divide-y divide-line border-y border-line self-start">
          <div v-for="f in facts" :key="f.k" class="flex justify-between gap-6 py-3.5 text-sm">
            <dt class="text-ink-faint">{{ f.k }}</dt>
            <dd class="text-right font-semibold text-noir-800">
              <NuxtLink v-if="f.to && f.slug" :to="f.to(f.slug)" class="hover:underline">{{ f.v }}</NuxtLink><template v-else>{{ f.v }}</template>
            </dd>
          </div>
        </dl>
      </div>

      <div v-if="notes.length" class="mt-14">
        <h2 class="s-title text-3xl text-noir-800">Notes</h2>
        <ol class="mt-6 grid sm:grid-cols-3 gap-4">
          <li v-for="(t, i) in notes" :key="t.k" class="rounded-2xl bg-white ring-1 ring-line p-6">
            <p class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-noir-800 text-gold-light flex items-center justify-center text-sm font-semibold">{{ i + 1 }}</span>
              <span><span class="block font-display text-xl text-noir-800">{{ t.k }} notes</span><span class="block text-xs text-ink-faint">{{ t.hint }}</span></span>
            </p>
            <div class="flex flex-wrap gap-2 mt-5">
              <NuxtLink v-for="n in t.list" :key="n" :to="`/products?f.notes=${n}`" class="s-chip !py-1.5 !text-xs">{{ valueLabel(attributes, 'notes', n) }}</NuxtLink>
            </div>
          </li>
        </ol>
      </div>

      <div v-if="perf.longevity || perf.projection || seasons.length || occasions.length" class="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div v-if="perf.longevity || perf.projection">
          <h2 class="s-title text-3xl text-noir-800">Performance</h2>
          <div v-for="m in [{ k: 'Longevity', v: perf.longevity, max: 5, scale: LONGEVITY }, { k: 'Projection', v: perf.projection, max: 4, scale: PROJECTION }].filter((x) => x.v)" :key="m.k" class="mt-6">
            <p class="flex justify-between text-sm"><span class="text-ink-soft">{{ m.k }}</span><span class="font-semibold text-noir-800">{{ m.scale[m.v].label }}</span></p>
            <div class="flex gap-1.5 mt-2" role="img" :aria-label="`${m.k}: ${m.v} of ${m.max}`">
              <span v-for="i in m.max" :key="i" class="h-1.5 flex-1 rounded-full" :class="i <= m.v ? 'bg-noir-800' : 'bg-line'" />
            </div>
            <p class="text-xs text-ink-faint mt-1.5">{{ m.scale[m.v].hint }}</p>
          </div>
        </div>
        <div v-if="seasons.length || occasions.length">
          <h2 class="s-title text-3xl text-noir-800">When to wear</h2>
          <div v-if="allSeasons.length" class="flex flex-wrap gap-5 mt-6">
            <NuxtLink v-for="s in allSeasons" :key="s.slug" :to="`/products?f.season=${s.slug}`" class="text-center group" :class="seasons.some((x) => x.slug === s.slug) ? '' : 'opacity-35'">
              <span class="w-14 h-14 rounded-full flex items-center justify-center transition" :class="seasons.some((x) => x.slug === s.slug) ? 'bg-noir-800 text-gold-light' : 'bg-cream-deep text-ink-faint'">
                <Icon :name="s.icon || 'lucide:calendar'" class="w-5 h-5" />
              </span>
              <span class="block text-xs mt-2 font-semibold">{{ s.label }}</span>
            </NuxtLink>
          </div>
          <div v-if="occasions.length" class="flex flex-wrap gap-2 mt-6">
            <NuxtLink v-for="o in occasions" :key="o.slug" :to="`/products?f.occasion=${o.slug}`" class="s-chip !py-1.5 !text-xs">{{ o.label }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="fromBrand.length" class="s-container py-16">
      <UiSectionHeading eyebrow="The house" :title="`More from`" :highlight="p.brand.name" :to="`/products?brand=${p.brand.slug}`" />
      <ProductGrid class="mt-10" :products="fromBrand" />
    </section>

    <section v-if="related.length" class="s-container py-16">
      <UiSectionHeading eyebrow="You may also like" title="Smells a bit" highlight="like this" :to="p.facets?.family?.[0] ? `/products?f.family=${p.facets.family[0]}` : '/products'" />
      <ProductGrid class="mt-10" :products="related" />
    </section>
  </div>
</template>
