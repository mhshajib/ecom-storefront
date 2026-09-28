<script setup>
useSeoMeta({ title: 'Your order', robots: 'noindex' })
const route = useRoute()
const auth = useAuth()
const order = ref(null)
const error = ref('')
const placed = computed(() => route.query.placed === '1')
onMounted(async () => {
  if (!auth.signedIn.value) { error.value = 'Sign in to see this order.'; return }
  try { order.value = (await auth.request(`/orders/${route.params.id}`)).data } catch (e) { error.value = e.status === 404 ? 'We couldn’t find that order.' : e.message }
})
const steps = ['PROCESSING', 'ON_SHIPPING', 'DELIVERED']
const stepIndex = computed(() => steps.indexOf(order.value?.status))
</script>

<template>
  <section class="s-container py-14 max-w-4xl">
    <ClientOnly>
      <p v-if="error" class="text-center py-20 text-ink-soft">{{ error }} <NuxtLink to="/account" class="underline">My account</NuxtLink></p>
      <div v-else-if="order">
        <div v-if="placed" class="s-band rounded-2xl p-8 sm:p-10 text-center mb-10">
          <Icon name="lucide:circle-check" class="w-12 h-12 mx-auto text-gold" />
          <h1 class="s-title text-4xl mt-4">Thank you, <em class="s-gold-text">order placed</em></h1>
          <p class="text-cream/70 mt-3">Order {{ order.invoice_id }}. We'll text you when it ships.</p>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <NuxtLink to="/account" class="text-sm text-ink-soft inline-flex items-center gap-1"><Icon name="lucide:arrow-left" class="w-4 h-4" /> My orders</NuxtLink>
            <h2 class="font-display text-3xl mt-2">Order {{ order.invoice_id }}</h2>
          </div>
          <span class="rounded-full text-sm font-semibold px-4 py-1.5" :class="ORDER_STATUS[order.status]?.tone">{{ ORDER_STATUS[order.status]?.label || order.status }}</span>
        </div>

        <ol v-if="stepIndex >= 0" class="mt-8 grid grid-cols-3 gap-2">
          <li v-for="(s, i) in steps" :key="s" class="text-center">
            <span class="block h-1.5 rounded-full" :class="i <= stepIndex ? 'bg-gold' : 'bg-line'" />
            <span class="block text-xs mt-2" :class="i <= stepIndex ? 'text-ink font-semibold' : 'text-ink-faint'">{{ ORDER_STATUS[s].label }}</span>
          </li>
        </ol>
        <p v-if="order.delivery_tracking_link" class="mt-4 text-sm"><a :href="order.delivery_tracking_link" target="_blank" rel="noopener" class="underline">Track your parcel</a></p>

        <div class="mt-8 grid md:grid-cols-[1fr_18rem] gap-6">
          <ul class="rounded-2xl bg-white ring-1 ring-line divide-y divide-line">
            <li v-for="p in order.products" :key="p.variant_id" class="p-4 flex gap-4">
              <img :src="p.product_thumb" alt="" class="w-16 h-20 rounded-lg object-cover ring-1 ring-line">
              <div class="flex-1 min-w-0"><p class="font-medium">{{ p.product_title }}</p><p class="text-xs text-ink-faint">{{ Object.values(p.variant_attributes || {}).join(' · ') }} · × {{ p.quantity }}</p></div>
              <p class="tabular-nums">{{ money(p.total_amount) }}</p>
            </li>
          </ul>
          <aside class="space-y-4">
            <dl class="rounded-2xl bg-white ring-1 ring-line p-5 text-sm space-y-2 tabular-nums">
              <div class="flex justify-between"><dt class="text-ink-soft">Subtotal</dt><dd>{{ money(order.sales_amount) }}</dd></div>
              <div class="flex justify-between"><dt class="text-ink-soft">Delivery</dt><dd>{{ money(order.delivery_fee) }}</dd></div>
              <div class="flex justify-between font-semibold pt-2 border-t border-line"><dt>Total</dt><dd>{{ money(order.grand_total) }}</dd></div>
              <div v-if="order.due_amount > 0" class="flex justify-between"><dt class="text-ink-soft">To pay on delivery</dt><dd>{{ money(order.due_amount) }}</dd></div>
            </dl>
            <div class="rounded-2xl bg-white ring-1 ring-line p-5 text-sm">
              <p class="font-semibold">Delivering to</p>
              <p class="text-ink-soft mt-1">{{ order.delivery_address?.name }} · {{ order.delivery_address?.phone }}<br>{{ [order.delivery_address?.address_line, order.delivery_address?.zone, order.delivery_address?.city].filter(Boolean).join(', ') }}</p>
            </div>
          </aside>
        </div>
      </div>
      <p v-else class="text-center py-20 text-ink-soft">Loading…</p>
    </ClientOnly>
  </section>
</template>
