<script setup>
await loadShop()
const { store } = useAppConfig()
useHead({
  titleTemplate: (t) => (t ? `${t} · ${store.name}` : `${store.name} · ${store.tagline}`),
  meta: [{ name: 'description', content: store.description }],
})
useSeoMeta({ ogSiteName: store.name, ogType: 'website' })
</script>
<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
