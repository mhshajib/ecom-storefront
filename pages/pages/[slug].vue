<script setup>
const route = useRoute()
const PAGES = {
  delivery: { title: 'Delivery', body: 'We deliver across Bangladesh through trusted couriers. Orders inside Dhaka usually arrive in 1–2 days and outside Dhaka in 2–4 days. You get a tracking link by SMS once your parcel ships.' },
  returns: { title: 'Returns & refunds', body: 'If something is not right, tell us within 7 days of delivery. Unopened items can be returned for any reason; damaged or wrong items are replaced or refunded in full. Refunds go back to your original payment method.' },
  terms: { title: 'Terms & conditions', body: 'By placing an order you agree to our terms of sale. Prices include VAT. Orders are confirmed once payment is received or cash on delivery is accepted.' },
  privacy: { title: 'Privacy policy', body: 'We only use your details to process orders and, if you agree, to send offers. We never sell your data. Payments are handled by the payment gateway; we never see your card or wallet details.' },
}
const page = PAGES[route.params.slug]
if (!page) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
useSeoMeta({ title: page.title })
</script>
<template>
  <article class="s-container py-20 max-w-3xl">
    <p class="s-eyebrow text-ink-faint">Help</p>
    <h1 class="s-title text-5xl text-noir-800 mt-2">{{ page.title }}</h1>
    <span class="s-rule mt-6" />
    <p class="mt-8 text-lg text-ink-soft leading-relaxed">{{ page.body }}</p>
  </article>
</template>
