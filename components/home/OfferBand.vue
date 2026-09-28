<script setup>
// Offers teaser: the biggest discount in the catalog and a spotlight product.
const props = defineProps({ products: { type: Array, default: () => [] } })
const onSale = computed(() => props.products.filter((p) => discountOf(p) > 0).sort((a, b) => discountOf(b) - discountOf(a)))
const best = computed(() => (onSale.value[0] ? discountOf(onSale.value[0]) : 0))
const spot = computed(() => onSale.value[0] || props.products[0])
</script>
<template>
  <section v-if="spot" class="s-container py-8">
    <div class="s-band rounded-2xl grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-14">
      <div>
        <span class="inline-block rounded-full ring-1 ring-white/25 px-4 py-1.5 s-eyebrow text-cream/80">Offers</span>
        <h2 class="s-title text-4xl sm:text-5xl mt-5">Save up to {{ best || 10 }}%<br><em class="font-display italic text-gold">this week only</em></h2>
        <span class="s-rule mt-6" />
        <dl class="mt-8 grid grid-cols-3 gap-4 max-w-md">
          <div><dt class="text-xs uppercase tracking-widest text-cream/60 order-2">On offer</dt><dd class="text-3xl font-semibold s-gold-text tabular-nums">{{ onSale.length }}+</dd></div>
          <div><dt class="text-xs uppercase tracking-widest text-cream/60">Best deal</dt><dd class="text-3xl font-semibold s-gold-text tabular-nums">{{ best }}%</dd></div>
          <div><dt class="text-xs uppercase tracking-widest text-cream/60">Authentic</dt><dd class="text-3xl font-semibold s-gold-text tabular-nums">100%</dd></div>
        </dl>
        <NuxtLink to="/products?on_sale=true" class="s-btn-gold mt-10">Shop all offers <Icon name="lucide:arrow-right" class="w-4 h-4" /></NuxtLink>
      </div>
      <NuxtLink :to="productUrl(spot)" class="group mx-auto w-full max-w-sm rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 transition hover:bg-white/10">
        <div class="relative aspect-square overflow-hidden rounded-xl bg-white">
          <img v-if="imagesOf(spot)[0]" :src="imagesOf(spot)[0]" :alt="spot.title" loading="lazy" class="w-full h-full object-cover transition duration-700 group-hover:scale-105">
          <span v-if="discountOf(spot)" class="absolute left-3 top-3 rounded-full bg-gold text-noir-900 text-xs font-bold px-3 py-1">Save {{ money(priceOf(spot).was - priceOf(spot).min) }}</span>
        </div>
        <p class="s-eyebrow text-cream/60 text-center mt-4">{{ categoryLabel(spot) }}</p>
        <p class="font-display text-xl text-center mt-1">{{ spot.title }}</p>
        <p class="text-center mt-1 tabular-nums"><span class="text-gold font-semibold">{{ money(priceOf(spot).min) }}</span> <s v-if="priceOf(spot).was" class="text-cream/50 text-sm ml-1">{{ money(priceOf(spot).was) }}</s></p>
      </NuxtLink>
    </div>
  </section>
</template>
