<script setup>
// Dark band: headline on the left, a collage of featured product images on the right.
const props = defineProps({ products: { type: Array, default: () => [] } })
const { hero } = useAppConfig()
const pics = computed(() => props.products.map((p) => ({ p, img: imagesOf(p)[0] })).filter((x) => x.img).slice(0, 3))
</script>
<template>
  <section class="s-band">
    <div class="s-container grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center py-16 sm:py-24 min-h-[34rem]">
      <div class="animate-rise">
        <p class="s-eyebrow text-gold">{{ hero.eyebrow }}</p>
        <h1 class="s-title text-[2.6rem] sm:text-6xl xl:text-7xl mt-4">
          {{ hero.title }}<br><em class="font-display italic s-gold-text">{{ hero.highlight }}</em>
        </h1>
        <span class="s-rule mt-8" />
        <p class="mt-8 max-w-md text-cream/75 leading-relaxed">{{ hero.body }}</p>
        <div class="mt-10 flex flex-wrap gap-3">
          <NuxtLink :to="hero.cta.to" class="s-btn-gold">{{ hero.cta.label }} <Icon name="lucide:arrow-right" class="w-4 h-4" /></NuxtLink>
          <NuxtLink to="/stores" class="s-btn-ghost text-cream">Visit a store</NuxtLink>
        </div>
      </div>

      <div v-if="pics.length" class="relative h-[26rem] sm:h-[30rem] hidden sm:block">
        <NuxtLink
          v-for="(x, i) in pics" :key="x.p._id" :to="productUrl(x.p)"
          class="absolute overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-lift transition duration-500 hover:-translate-y-1 animate-rise"
          :class="[
            i === 0 && 'left-[18%] top-0 w-[52%] h-[78%] z-20',
            i === 1 && 'left-0 bottom-0 w-[36%] h-[52%] z-10',
            i === 2 && 'right-0 bottom-[6%] w-[34%] h-[56%] z-30',
          ]"
          :style="{ animationDelay: `${150 + i * 120}ms` }"
        >
          <img :src="x.img" :alt="x.p.title" class="w-full h-full object-cover" :loading="i === 0 ? 'eager' : 'lazy'">
          <span class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-noir-950/85 to-transparent text-sm">
            <span class="block font-display text-lg leading-tight">{{ x.p.title }}</span>
            <span class="text-gold font-semibold">{{ money(priceOf(x.p).min) }}</span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
