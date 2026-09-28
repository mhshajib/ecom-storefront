<script setup>
defineProps({ products: { type: Array, default: () => [] }, loading: Boolean, cols: { type: String, default: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }, skeletons: { type: Number, default: 8 } })
</script>
<template>
  <div class="grid gap-x-4 gap-y-10 sm:gap-x-6" :class="cols">
    <template v-if="loading">
      <div v-for="n in skeletons" :key="n" class="animate-pulse">
        <div class="aspect-[4/5] rounded-xl bg-cream-deep" />
        <div class="h-3 w-1/3 mx-auto mt-4 rounded bg-cream-deep" />
        <div class="h-4 w-2/3 mx-auto mt-2 rounded bg-cream-deep" />
      </div>
    </template>
    <ProductCard v-for="(p, i) in products" v-else :key="p._id" :product="p" :eager="i < 4" />
  </div>
</template>
