<script setup>
useSeoMeta({ title: 'My account', robots: 'noindex' })
const auth = useAuth()
const orders = ref([])
const loading = ref(false)
const profile = reactive({ name: '', email: '' })
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const localPhone = (p) => (p && p.startsWith('880') ? `0${p.slice(3)}` : p || '')

const load = async () => {
  if (!auth.signedIn.value) return
  loading.value = true
  try {
    const me = await auth.refreshMe()
    Object.assign(profile, { name: me?.name || '', email: me?.email || '' })
    orders.value = (await auth.request('/orders', { query: { limit: 20 } })).data || []
    wallet.value = (await auth.request('/wallet/me')).data
  } catch (e) { error.value = e.message } finally { loading.value = false }
}
onMounted(load)
// signed in from a page that sent them here (e.g. to write a review): back there
const route = useRoute()
const signedIn = () => {
  const next = String(route.query.next || '')
  if (next.startsWith('/') && !next.startsWith('//')) return navigateTo(next)
  load()
}

// store credit and loyalty points
const wallet = ref(null)
const converting = ref(false)
const convertMsg = ref('')
const convert = async () => {
  converting.value = true; convertMsg.value = ''
  try {
    wallet.value = (await auth.request('/wallet/me/convert', { method: 'POST', body: { points: wallet.value.points } })).data
    convertMsg.value = 'Added to your store credit.'
  } catch (e) { convertMsg.value = e.message } finally { converting.value = false }
}
const saveProfile = async () => {
  saving.value = true; error.value = ''; saved.value = false
  try { auth.user.value = (await auth.request('/auth/me', { method: 'PUT', body: profile })).data; saved.value = true } catch (e) { error.value = e.message } finally { saving.value = false }
}
const { date } = { date: (v) => (v ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(String(v).replace(' ', 'T') + '+06:00')) : '') }
</script>

<template>
  <section class="s-container py-14">
    <ClientOnly>
      <div v-if="!auth.signedIn.value" class="max-w-md mx-auto">
        <div class="text-center mb-8">
          <LayoutLogo stacked class="mx-auto" />
          <h1 class="s-title text-4xl text-noir-900 mt-8">Sign in</h1>
          <p class="text-ink-soft mt-2">Track orders, save addresses and check out faster.</p>
        </div>
        <div class="rounded-2xl bg-white ring-1 ring-line p-8"><AuthEmailSignIn ask-name @done="signedIn" /></div>
      </div>

      <div v-else class="grid lg:grid-cols-[20rem_1fr] gap-10 items-start">
        <aside class="rounded-2xl bg-white ring-1 ring-line p-6">
          <p class="s-eyebrow text-ink-faint">My account</p>
          <h1 class="font-display text-3xl mt-2">{{ auth.user.value?.name || 'Welcome' }}</h1>
          <p class="text-sm text-ink-soft break-all">{{ auth.user.value?.email || localPhone(auth.user.value?.phone) }}</p>
          <form class="mt-6 space-y-3" @submit.prevent="saveProfile">
            <div><label class="block text-sm font-medium mb-1.5" for="p-name">Name</label><input id="p-name" v-model="profile.name" required class="s-input"></div>
            <div><label class="block text-sm font-medium mb-1.5" for="p-email">Email <span class="text-ink-faint font-normal">(optional)</span></label><input id="p-email" v-model="profile.email" type="email" class="s-input"></div>
            <p v-if="error" class="text-sm text-sale">{{ error }}</p>
            <p v-if="saved" class="text-sm text-green-700">Saved.</p>
            <button class="s-btn-dark w-full" :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</button>
          </form>
          <div v-if="wallet" class="mt-6 pt-6 border-t border-line">
            <p class="s-eyebrow text-ink-faint">Rewards</p>
            <dl class="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-xl bg-cream p-3"><dt class="text-ink-soft">Store credit</dt><dd class="font-display text-2xl tabular-nums">{{ money(wallet.store_credit) }}</dd></div>
              <div class="rounded-xl bg-cream p-3"><dt class="text-ink-soft">Points</dt><dd class="font-display text-2xl tabular-nums">{{ wallet.points }}</dd></div>
            </dl>
            <p v-if="wallet.loyalty_enabled" class="text-xs text-ink-faint mt-3">Earn {{ wallet.earn_per_100 }} point{{ wallet.earn_per_100 === 1 ? '' : 's' }} per ৳100 on delivered orders. {{ wallet.min_convert }} points or more turn into store credit (1 point = {{ money(wallet.point_value) }}).</p>
            <button v-if="wallet.loyalty_enabled && wallet.points >= wallet.min_convert" class="s-btn-line w-full mt-3" :disabled="converting" @click="convert">Turn {{ wallet.points }} points into {{ money(wallet.points_worth) }}</button>
            <p v-if="convertMsg" class="text-sm mt-2">{{ convertMsg }}</p>
            <p class="text-xs text-ink-faint mt-2">Use store credit at checkout or in our stores.</p>
          </div>
          <button class="mt-4 w-full text-sm text-ink-soft underline" @click="auth.signOut()">Sign out</button>
        </aside>

        <div>
          <h2 class="font-display text-3xl">Your orders</h2>
          <p v-if="loading" class="text-ink-soft mt-6">Loading…</p>
          <p v-else-if="!orders.length" class="text-ink-soft mt-6">No orders yet. <NuxtLink to="/products" class="underline">Find something you love.</NuxtLink></p>
          <ul v-else class="mt-6 space-y-3">
            <li v-for="o in orders" :key="o._id">
              <NuxtLink :to="`/account/orders/${o._id}`" class="flex items-center gap-4 rounded-2xl bg-white ring-1 ring-line p-5 hover:ring-noir-900 transition">
                <div class="flex -space-x-3">
                  <img v-for="p in o.products.slice(0, 3)" :key="p.variant_id" :src="p.product_thumb" alt="" class="w-12 h-12 rounded-full object-cover ring-2 ring-white">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold">Order {{ o.invoice_id }}</p>
                  <p class="text-sm text-ink-soft">{{ date(o.order_date) }} · {{ o.products.reduce((n, p) => n + p.quantity, 0) }} items</p>
                </div>
                <span class="rounded-full text-xs font-semibold px-3 py-1" :class="ORDER_STATUS[o.status]?.tone">{{ ORDER_STATUS[o.status]?.label || o.status }}</span>
                <span class="font-semibold tabular-nums hidden sm:block">{{ money(o.grand_total) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </ClientOnly>
  </section>
</template>
