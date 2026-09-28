<script setup>
const { store } = useAppConfig()
const { data: categories } = await useCategories()
const email = ref('')
const joined = ref(false)
const join = () => { if (email.value.trim()) joined.value = true }
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24">
    <!-- newsletter -->
    <section class="s-container">
      <div v-reveal="'zoom'" class="s-band rounded-2xl px-6 py-14 sm:px-16 text-center">
        <p class="s-eyebrow text-gold">Stay in the loop</p>
        <h2 class="s-title text-3xl sm:text-5xl mt-3">First to know, <em class="text-gold not-italic font-display italic">first to shop</em></h2>
        <p class="text-cream/70 mt-3 text-sm">New arrivals and members-only offers, a couple of times a month.</p>
        <form v-if="!joined" class="mt-8 mx-auto max-w-md flex gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15" @submit.prevent="join">
          <label for="nl" class="sr-only">Email or WhatsApp number</label>
          <input id="nl" v-model="email" required class="flex-1 bg-transparent px-4 text-sm text-cream placeholder:text-cream/50 focus:outline-none" placeholder="Email or WhatsApp number">
          <button class="s-btn-gold !px-5 !py-2.5" aria-label="Subscribe"><Icon name="lucide:arrow-right" class="w-4 h-4" /></button>
        </form>
        <p v-else class="mt-8 text-gold font-semibold">Thank you, you're on the list.</p>
      </div>
    </section>

    <div class="bg-noir-900 text-cream/80 mt-16">
      <div class="s-container py-16 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <LayoutLogo light />
          <p class="text-sm mt-5 max-w-xs leading-relaxed">{{ store.description }}</p>
          <div class="flex gap-3 mt-6">
            <a v-if="store.social.facebook" :href="store.social.facebook" class="p-2 rounded-full ring-1 ring-white/20 hover:text-gold" aria-label="Facebook"><Icon name="lucide:facebook" class="w-4 h-4" /></a>
            <a v-if="store.social.instagram" :href="store.social.instagram" class="p-2 rounded-full ring-1 ring-white/20 hover:text-gold" aria-label="Instagram"><Icon name="lucide:instagram" class="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <h3 class="s-eyebrow text-gold mb-4">Shop</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="c in categories.slice(0, 5)" :key="c._id"><NuxtLink :to="`/products?category=${c.slug}`" class="hover:text-gold">{{ c.name }}</NuxtLink></li>
            <li><NuxtLink to="/products?on_sale=true" class="hover:text-gold">Offers</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="s-eyebrow text-gold mb-4">Help</h3>
          <ul class="space-y-2.5 text-sm">
            <li><NuxtLink to="/pages/delivery" class="hover:text-gold">Delivery</NuxtLink></li>
            <li><NuxtLink to="/pages/returns" class="hover:text-gold">Returns &amp; refunds</NuxtLink></li>
            <li><NuxtLink to="/pages/terms" class="hover:text-gold">Terms &amp; conditions</NuxtLink></li>
            <li><NuxtLink to="/pages/privacy" class="hover:text-gold">Privacy policy</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="s-eyebrow text-gold mb-4">Visit &amp; contact</h3>
          <ul class="space-y-2.5 text-sm">
            <li><NuxtLink to="/stores" class="hover:text-gold">Our stores</NuxtLink></li>
            <li><a :href="`tel:${store.phone.replace(/[^+\\d]/g, '')}`" class="hover:text-gold">{{ store.phone }}</a></li>
            <li><a :href="`mailto:${store.email}`" class="hover:text-gold">{{ store.email }}</a></li>
            <li class="text-cream/60">{{ store.address }}</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="s-container py-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-cream/50">
          <p>© {{ year }} {{ store.name }}. All rights reserved.</p>
          <p class="flex items-center gap-2"><Icon name="lucide:shield-check" class="w-4 h-4" /> Secure checkout · Cash on delivery · bKash</p>
        </div>
      </div>
    </div>

    <a
      v-if="store.whatsapp" :href="`https://wa.me/${store.whatsapp}`" target="_blank" rel="noopener"
      class="fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lift hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
    ><span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 motion-reduce:hidden" aria-hidden="true" /><Icon name="lucide:message-circle" class="relative w-7 h-7" /></a>
  </footer>
</template>
