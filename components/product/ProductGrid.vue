<script setup>
defineProps({ products: { type: Array, default: () => [] }, loading: Boolean, cols: { type: String, default: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }, skeletons: { type: Number, default: 8 } })
</script>
<template>
  <div class="grid gap-x-4 gap-y-10 sm:gap-x-6" :class="cols">
    <template v-if="loading">
      <div v-for="n in skeletons" :key="n">
        <div class="aspect-[4/5] rounded-xl s-shimmer" />
        <div class="h-3 w-1/3 mx-auto mt-4 rounded s-shimmer" />
        <div class="h-4 w-2/3 mx-auto mt-2 rounded s-shimmer" />
      </div>
    </template>
    <ProductCard v-for="(p, i) in products" v-else :key="p._id" v-reveal="{ dir: 'up', delay: (i % 4) * 70 }" :product="p" :eager="i < 4" />
  </div>
</template>
