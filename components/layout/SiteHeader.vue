<script setup>
// Centred logo, shop menu from the category tree on the left, search / saved / bag on the right.
const { data: categories } = await useCategories()
const cart = useCart()
const auth = useAuth()
const saved = useWishlist()
const route = useRoute()

const menuOpen = ref(false) // mobile drawer
const shopOpen = ref(false) // desktop mega menu
const searchOpen = ref(false)
const q = ref('')
watch(() => route.fullPath, () => { menuOpen.value = false; shopOpen.value = false; searchOpen.value = false })

const submitSearch = () => {
  const term = q.value.trim()
  if (!term) return
  navigateTo({ path: '/products', query: { q: term } })
}
const searchInput = ref(null)
watch(searchOpen, (v) => { if (v) nextTick(() => searchInput.value?.focus()) })

// band style on dark hero pages until scrolled
const scrolled = ref(false)
onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 24 }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-noir-900/95 backdrop-blur text-cream border-b border-white/10 transition-shadow" :class="{ 'shadow-lift': scrolled }">
    <div class="s-container h-16 sm:h-[4.5rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
      <!-- left -->
      <nav class="flex items-center gap-1" aria-label="Main">
        <button class="lg:hidden -ml-2 p-2" aria-label="Open menu" @click="menuOpen = true"><Icon name="lucide:menu" class="w-6 h-6" /></button>
        <div class="hidden lg:flex items-center gap-7 text-[0.9rem]">
          <div class="relative" @mouseenter="shopOpen = true" @mouseleave="shopOpen = false">
            <button class="inline-flex items-center gap-1 py-6 hover:text-gold" :aria-expanded="shopOpen" @click="shopOpen = !shopOpen" @focus="shopOpen = true">
              Shop <Icon name="lucide:chevron-down" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': shopOpen }" />
            </button>
          </div>
          <NuxtLink to="/products?sort=new" class="hover:text-gold">New in</NuxtLink>
          <NuxtLink to="/products?on_sale=true" class="hover:text-gold">Offers</NuxtLink>
          <NuxtLink to="/combos" class="hover:text-gold">Combos</NuxtLink>
          <NuxtLink to="/stores" class="hover:text-gold">Our stores</NuxtLink>
        </div>
      </nav>

      <LayoutLogo light />

      <!-- right -->
      <div class="flex items-center justify-end gap-0.5 sm:gap-1.5">
        <button class="p-2.5 hover:text-gold" aria-label="Search" @click="searchOpen = !searchOpen"><Icon name="lucide:search" class="w-5 h-5" /></button>
        <NuxtLink to="/saved" class="relative p-2.5 hover:text-gold hidden sm:inline-flex" aria-label="Saved items">
          <Icon name="lucide:heart" class="w-5 h-5" />
          <ClientOnly><span v-if="saved.ids.value.length" class="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-noir-900 text-[0.62rem] font-bold flex items-center justify-center">{{ saved.ids.value.length }}</span></ClientOnly>
        </NuxtLink>
        <button class="relative p-2.5 hover:text-gold" aria-label="Open bag" @click="cart.open.value = true">
          <Icon name="lucide:shopping-bag" class="w-5 h-5" />
          <ClientOnly><span v-if="cart.count.value" class="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-noir-900 text-[0.62rem] font-bold flex items-center justify-center">{{ cart.count.value }}</span></ClientOnly>
        </button>
        <NuxtLink to="/account" class="hidden md:inline-flex ml-2 s-btn border border-white/30 !px-5 !py-2 hover:border-gold hover:text-gold"><ClientOnly fallback="Sign in">{{ auth.signedIn.value ? (auth.user.value?.name?.split(" ")[0] || "Account") : "Sign in" }}</ClientOnly></NuxtLink>
      </div>
    </div>

    <!-- mega menu -->
    <Transition enter-from-class="opacity-0 -translate-y-1" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-150">
      <div v-if="shopOpen && categories.length" class="hidden lg:block absolute inset-x-0 top-full bg-cream text-ink border-b border-line shadow-lift" @mouseenter="shopOpen = true" @mouseleave="shopOpen = false">
        <div class="s-container py-10 grid grid-cols-4 gap-10">
          <div v-for="c in categories.slice(0, 3)" :key="c._id">
            <NuxtLink :to="`/products?category=${c.slug}`" class="font-display text-xl text-noir-800 hover:underline">{{ c.name }}</NuxtLink>
            <ul class="mt-4 space-y-2.5 text-sm">
              <li v-for="s in c.children" :key="s._id"><NuxtLink :to="`/products?category=${c.slug}&sub=${s.slug}`" class="text-ink-soft hover:text-noir-800">{{ s.name }}</NuxtLink></li>
              <li><NuxtLink :to="`/products?category=${c.slug}`" class="text-noir-800 font-semibold inline-flex items-center gap-1">Shop all <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" /></NuxtLink></li>
            </ul>
          </div>
          <div class="s-band rounded-xl p-6 flex flex-col justify-end min-h-[12rem]">
            <p class="s-eyebrow text-gold">This week</p>
            <p class="font-display text-2xl mt-2">Offers worth a look</p>
            <NuxtLink to="/products?on_sale=true" class="mt-4 text-gold text-sm font-semibold inline-flex items-center gap-1">Shop offers <Icon name="lucide:arrow-up-right" class="w-4 h-4" /></NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- search -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition" leave-to-class="opacity-0" leave-active-class="transition">
      <div v-if="searchOpen" class="absolute inset-x-0 top-full bg-cream border-b border-line shadow-lift">
        <form class="s-container py-6 flex gap-3" role="search" @submit.prevent="submitSearch">
          <label for="site-search" class="sr-only">Search products</label>
          <input id="site-search" ref="searchInput" v-model="q" type="search" class="s-input" placeholder="Search for a product…" autocomplete="off">
          <button class="s-btn-dark" type="submit">Search</button>
        </form>
      </div>
    </Transition>

    <!-- mobile drawer -->
    <Teleport to="body">
      <Transition enter-from-class="opacity-0" enter-active-class="transition" leave-to-class="opacity-0" leave-active-class="transition">
        <div v-if="menuOpen" class="fixed inset-0 z-50 bg-noir-950/60" @click.self="menuOpen = false">
          <nav class="h-full w-[min(22rem,88vw)] bg-cream text-ink overflow-y-auto p-6" aria-label="Mobile">
            <div class="flex items-center justify-between mb-8">
              <LayoutLogo />
              <button class="p-2" aria-label="Close menu" @click="menuOpen = false"><Icon name="lucide:x" class="w-6 h-6" /></button>
            </div>
            <ul class="space-y-1">
              <li v-for="c in categories" :key="c._id">
                <details class="group">
                  <summary class="flex items-center justify-between py-3 font-display text-lg text-noir-800 cursor-pointer list-none">
                    {{ c.name }} <Icon name="lucide:chevron-down" class="w-5 h-5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <ul class="pl-3 pb-3 space-y-2 text-sm">
                    <li v-for="s in c.children" :key="s._id"><NuxtLink :to="`/products?category=${c.slug}&sub=${s.slug}`" class="text-ink-soft">{{ s.name }}</NuxtLink></li>
                    <li><NuxtLink :to="`/products?category=${c.slug}`" class="text-noir-800 font-semibold">Shop all {{ c.name }}</NuxtLink></li>
                  </ul>
                </details>
              </li>
            </ul>
            <div class="mt-6 pt-6 border-t border-line space-y-3 text-sm">
              <NuxtLink to="/products?sort=new" class="block">New in</NuxtLink>
              <NuxtLink to="/products?on_sale=true" class="block">Offers</NuxtLink>
              <NuxtLink to="/combos" class="block">Combos</NuxtLink>
              <NuxtLink to="/stores" class="block">Our stores</NuxtLink>
              <NuxtLink to="/saved" class="block">Saved items</NuxtLink>
              <NuxtLink to="/account" class="s-btn-dark w-full mt-4">Sign in</NuxtLink>
            </div>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
