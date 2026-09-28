<script setup>
// Listing: category / sub category, search, price range, offers, option filters (from the category), sort.
const route = useRoute()
const router = useRouter()
const { data: categories } = await useCategories()

const SORTS = {
  new: { label: 'Newest', api: 'timestamp.created_at:desc' },
  best: { label: 'Best sellers', api: 'best_seller:desc' },
  price_asc: { label: 'Price: low to high', api: 'sale_price:asc' },
  price_desc: { label: 'Price: high to low', api: 'sale_price:desc' },
  name: { label: 'Name A–Z', api: 'title:asc' },
}
const BUDGETS = [[0, 500], [500, 1000], [1000, 2000], [2000, 5000], [5000, null]]
const PAGE = 24

const q = computed(() => route.query)
const category = computed(() => categories.value.find((c) => c.slug === q.value.category) || null)
const sub = computed(() => category.value?.children.find((s) => s.slug === q.value.sub) || null)
const optionFilters = computed(() => ((sub.value?.filters?.length ? sub.value : category.value)?.filters || []).filter((f) => f.filter_type === 'options' && f.values?.length))
// ?opt.Binding=Hardcover,Paperback
const selectedOptions = computed(() => Object.fromEntries(Object.entries(q.value)
  .filter(([k]) => k.startsWith('opt.')).map(([k, v]) => [k.slice(4), String(v).split(',').filter(Boolean)])))
const page = computed(() => Math.max(1, Number(q.value.page) || 1))
const sort = computed(() => (SORTS[q.value.sort] ? q.value.sort : 'new'))

const apiQuery = computed(() => ({
  page: page.value, limit: PAGE, sort_by: SORTS[sort.value].api,
  category_id: category.value?._id, sub_category_id: sub.value?._id, q: q.value.q,
  min_price: q.value.min, max_price: q.value.max, on_sale: q.value.on_sale === 'true' ? true : undefined,
  options: Object.values(selectedOptions.value).filter((vs) => vs.length).map((vs) => vs.join(',')),
}))

const { data, pending, error } = await useAsyncData('listing', () => api('/products', { query: apiQuery.value }), {
  watch: [apiQuery], default: () => ({ data: [], pagination: null }),
})
const products = computed(() => data.value?.data || [])
const total = computed(() => data.value?.pagination?.total || 0)
const pages = computed(() => Math.max(1, Math.ceil(total.value / PAGE)))

const set = (patch) => {
  const next = { ...q.value, ...patch }
  if (!('page' in patch)) delete next.page
  for (const k of Object.keys(next)) if (next[k] === '' || next[k] == null) delete next[k]
  router.push({ query: next })
}
const toggleOption = (group, value) => {
  const cur = selectedOptions.value[group] || []
  const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
  set({ [`opt.${group}`]: next.join(',') || undefined })
}
const setBudget = ([min, max]) => set({ min: min || undefined, max: max ?? undefined })
const budgetOn = ([min, max]) => String(q.value.min || '') === String(min || '') && String(q.value.max || '') === String(max ?? '')
const minDraft = ref(q.value.min || '')
const maxDraft = ref(q.value.max || '')
watch(() => [q.value.min, q.value.max], ([a, b]) => { minDraft.value = a || ''; maxDraft.value = b || '' })
const applyPrice = () => set({ min: minDraft.value || undefined, max: maxDraft.value || undefined })
const clearAll = () => router.push({ query: q.value.q ? { q: q.value.q } : {} })
const activeCount = computed(() => ['category', 'min', 'max', 'on_sale'].filter((k) => q.value[k]).length + Object.values(selectedOptions.value).flat().length)
const filtersOpen = ref(false)

const heading = computed(() => (q.value.q ? `Results for “${q.value.q}”` : sub.value?.name || category.value?.name || (q.value.on_sale ? 'Offers' : 'The collection')))
const { store } = useAppConfig()
useSeoMeta({ title: () => heading.value.replace(/[“”]/g, ''), description: () => category.value?.description || store.description })
</script>

<template>
  <div>
    <section class="s-band">
      <div class="s-container py-14 sm:py-20 text-center">
        <p class="s-eyebrow text-gold">{{ category && sub ? category.name : 'Shop' }}</p>
        <h1 class="s-title text-4xl sm:text-6xl mt-3">{{ heading }}</h1>
        <div class="flex items-center justify-center gap-3 mt-5 text-gold"><span class="h-px w-16 bg-gold/40" />✦<span class="h-px w-16 bg-gold/40" /></div>
        <p class="text-cream/70 mt-4 text-sm">{{ pending ? 'Loading…' : `${total} ${total === 1 ? 'product' : 'products'}` }}</p>
      </div>
    </section>

    <!-- category chips -->
    <div class="border-b border-line bg-cream-deep/60">
      <div class="s-container py-4 flex gap-2 overflow-x-auto">
        <button class="s-chip shrink-0" :class="{ 's-chip-on': !category }" @click="set({ category: undefined, sub: undefined })">Everything</button>
        <button v-for="c in categories" :key="c._id" class="s-chip shrink-0" :class="{ 's-chip-on': category?._id === c._id && !sub }" @click="set({ category: c.slug, sub: undefined })">{{ c.name }}</button>
        <template v-if="category?.children?.length">
          <span class="w-px bg-line-strong mx-1 shrink-0" />
          <button v-for="s in category.children" :key="s._id" class="s-chip shrink-0" :class="{ 's-chip-on': sub?._id === s._id }" @click="set({ sub: s.slug })">{{ s.name }}</button>
        </template>
      </div>
    </div>

    <div class="s-container py-10 grid lg:grid-cols-[17rem_1fr] gap-10">
      <!-- filters -->
      <aside :class="filtersOpen ? 'fixed inset-0 z-50 bg-cream overflow-y-auto p-6' : 'hidden lg:block'">
        <div class="flex items-center justify-between lg:hidden mb-6">
          <h2 class="font-display text-2xl text-noir-800">Filters</h2>
          <button class="p-2" aria-label="Close filters" @click="filtersOpen = false"><Icon name="lucide:x" class="w-6 h-6" /></button>
        </div>
        <div class="rounded-2xl bg-white ring-1 ring-line p-6 space-y-8 lg:sticky lg:top-28">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-xl text-noir-800 hidden lg:block">Filters</h2>
            <button v-if="activeCount" class="text-xs font-semibold text-sale" @click="clearAll">Clear all</button>
          </div>

          <fieldset>
            <legend class="font-display text-lg text-noir-800 mb-3">Price</legend>
            <form class="flex items-center gap-2" @submit.prevent="applyPrice">
              <input v-model="minDraft" type="number" min="0" class="s-input !px-3 !py-2 !rounded-lg" placeholder="৳ Min" aria-label="Minimum price">
              <span class="text-ink-faint">–</span>
              <input v-model="maxDraft" type="number" min="0" class="s-input !px-3 !py-2 !rounded-lg" placeholder="৳ Max" aria-label="Maximum price">
              <button class="s-btn-dark !px-3 !py-2 !rounded-lg" aria-label="Apply price"><Icon name="lucide:check" class="w-4 h-4" /></button>
            </form>
            <div class="flex flex-wrap gap-2 mt-3">
              <button v-for="b in BUDGETS" :key="b.join('-')" class="s-chip !px-3 !py-1.5 !text-xs" :class="{ 's-chip-on': budgetOn(b) }" @click="budgetOn(b) ? setBudget([null, null]) : setBudget(b)">
                {{ b[1] == null ? `${money(b[0])}+` : b[0] ? `${money(b[0])}–${money(b[1])}` : `Under ${money(b[1])}` }}
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend class="sr-only">Offers</legend>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 accent-noir-800" :checked="q.on_sale === 'true'" @change="set({ on_sale: $event.target.checked ? 'true' : undefined })">
              <span>On offer only</span>
            </label>
          </fieldset>

          <fieldset v-for="f in optionFilters" :key="f.group">
            <legend class="font-display text-lg text-noir-800 mb-3">{{ f.group }}</legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="v in f.values" :key="v" class="s-chip !py-1.5" :class="{ 's-chip-on': selectedOptions[f.group]?.includes(v) }"
                :aria-pressed="selectedOptions[f.group]?.includes(v)" @click="toggleOption(f.group, v)"
              >
                <span v-if="f.option_type === 'colour' && f.swatches?.[v]" class="w-3.5 h-3.5 rounded-full ring-1 ring-black/10" :style="{ background: f.swatches[v] }" />
                <img v-else-if="f.option_type === 'image' && f.swatches?.[v]" :src="f.swatches[v]" alt="" class="w-4 h-4 rounded-full object-cover">
                {{ v }}
              </button>
            </div>
          </fieldset>
          <p v-if="!category" class="text-xs text-ink-faint">Pick a category for more filters, like size or colour.</p>
        </div>
        <button class="s-btn-dark w-full mt-6 lg:hidden" @click="filtersOpen = false">Show {{ total }} products</button>
      </aside>

      <div>
        <div class="flex items-center justify-between gap-3 mb-8">
          <button class="lg:hidden s-chip" @click="filtersOpen = true"><Icon name="lucide:sliders-horizontal" class="w-4 h-4" /> Filters<span v-if="activeCount" class="rounded-full bg-noir-800 text-cream text-xs px-1.5">{{ activeCount }}</span></button>
          <label class="ml-auto flex items-center gap-2 text-sm">
            <span class="text-ink-soft hidden sm:inline">Sort by</span>
            <select :value="sort" class="s-input !w-auto !py-2 !pr-10" @change="set({ sort: $event.target.value })">
              <option v-for="(s, key) in SORTS" :key="key" :value="key">{{ s.label }}</option>
            </select>
          </label>
        </div>

        <p v-if="error" class="text-center py-16 text-sale">We couldn't load products right now. Please try again.</p>
        <template v-else>
          <ProductGrid :products="products" :loading="pending && !products.length" cols="grid-cols-2 md:grid-cols-3" :skeletons="6" />
          <div v-if="!pending && !products.length" class="text-center py-20">
            <Icon name="lucide:search-x" class="w-10 h-10 mx-auto text-gold-dark" />
            <p class="font-display text-2xl mt-4">Nothing matches, yet</p>
            <p class="text-ink-soft mt-1">Try fewer filters or a different search.</p>
            <button v-if="activeCount || q.q" class="s-btn-line mt-6" @click="router.push({ query: {} })">See everything</button>
          </div>
        </template>

        <nav v-if="pages > 1" class="flex items-center justify-center gap-2 mt-14" aria-label="Pages">
          <button class="s-chip" :disabled="page <= 1" @click="set({ page: page - 1 })"><Icon name="lucide:chevron-left" class="w-4 h-4" /> Previous</button>
          <span class="text-sm text-ink-soft px-3 tabular-nums">Page {{ page }} of {{ pages }}</span>
          <button class="s-chip" :disabled="page >= pages" @click="set({ page: page + 1 })">Next <Icon name="lucide:chevron-right" class="w-4 h-4" /></button>
        </nav>
      </div>
    </div>
  </div>
</template>
