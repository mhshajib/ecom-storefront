<script setup>
// Which stores have the chosen variant for click & collect.
const props = defineProps({ variantId: String })
const stores = ref([])
const open = ref(false)
watch(() => props.variantId, async (id) => {
  stores.value = []
  if (!id) return
  try { stores.value = ((await api('/stores', { query: { variant_id: id } })).data || []).filter((s) => s.pickup) } catch { /* nothing to show */ }
}, { immediate: true })
const available = computed(() => stores.value.filter((s) => s.stock?.[props.variantId] !== 'out'))
</script>

<template>
  <div v-if="stores.length" class="mt-6 rounded-xl bg-white ring-1 ring-line p-4 text-sm">
    <button type="button" class="w-full flex items-center justify-between gap-3 text-left" :aria-expanded="open" @click="open = !open">
      <span class="flex items-center gap-2"><Icon name="lucide:store" class="w-5 h-5 text-noir-800" />
        <span><strong>Click & collect</strong> · {{ available.length ? `available at ${available.length} store${available.length === 1 ? '' : 's'}` : 'not in our stores right now' }}</span>
      </span>
      <Icon name="lucide:chevron-down" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': open }" />
    </button>
    <ul v-if="open" class="mt-3 divide-y divide-line">
      <li v-for="s in stores" :key="s._id" class="py-2 flex justify-between gap-3">
        <span><span class="font-medium">{{ s.name }}</span><span v-if="s.hours" class="block text-xs text-ink-faint">{{ s.hours }}</span></span>
        <span :class="STORE_STOCK[s.stock?.[variantId]]?.tone">{{ STORE_STOCK[s.stock?.[variantId]]?.label }}</span>
      </li>
    </ul>
  </div>
</template>
