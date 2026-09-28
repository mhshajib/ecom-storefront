// Store identity and page copy. Change these to rebrand; products and categories come from ecom-api.
export default defineAppConfig({
  store: {
    name: 'Scentology',
    tagline: 'Scented Your Mood',
    description: 'Authentic designer, niche and Arabian fragrances, full bottles and decants, delivered across Bangladesh.',
    phone: '+880 1700-000000',
    email: 'hello@scentology.com.bd',
    whatsapp: '8801700000000', // digits only, for wa.me links; empty hides the button
    address: 'House 1, Road 1, Gulshan, Dhaka 1212',
    social: { facebook: '', instagram: '', youtube: '' },
  },
  announcements: [
    '100% authentic fragrances, sourced from authorised distributors',
    'Free delivery inside Dhaka on orders over ৳3,000',
    'Cash on delivery all over Bangladesh',
    'Try before you commit: decants from 3ml',
  ],
  hero: {
    eyebrow: 'Scentology',
    title: 'Find the scent that',
    highlight: 'sets your mood',
    body: 'Designer icons, niche discoveries and Arabian classics. Every bottle authentic, every decant freshly poured.',
    cta: { label: 'Explore fragrances', to: '/products' },
  },
  promises: [
    { icon: 'lucide:badge-check', title: 'Authentic, always', body: 'Sourced from authorised distributors, never grey market.' },
    { icon: 'lucide:droplets', title: 'Freshly decanted', body: 'Poured on order with clean, sealed atomisers.' },
    { icon: 'lucide:truck', title: 'Nationwide delivery', body: '1–2 days in Dhaka, 2–4 days outside.' },
    { icon: 'lucide:gift', title: 'Gift-ready', body: 'Every order packed in our signature box.' },
  ],
  faq: [
    { q: 'Are your perfumes authentic?', a: 'Yes. Every bottle comes from authorised distributors or the brand, and decants are poured straight from those same bottles. We never sell copies or grey-market stock.' },
    { q: 'What is a decant?', a: 'A decant is a smaller amount (3ml, 5ml, 10ml…) poured from an authentic full bottle into a travel atomiser: the easiest way to try a fragrance before buying the full size.' },
    { q: 'What do EDP, EDT and Parfum mean?', a: 'They describe concentration. Eau de Toilette (EDT) is lighter and fresher, Eau de Parfum (EDP) is richer and lasts longer, and Parfum or Extrait is the most concentrated and long-lasting.' },
    { q: 'How long does delivery take?', a: 'Inside Dhaka usually 1–2 days, outside Dhaka 2–4 days. You get a tracking link as soon as your parcel ships, and you can pay cash on delivery.' },
    { q: 'Can I return a fragrance?', a: 'Sealed full bottles can be returned within 7 days. For hygiene, opened bottles and decants can only be returned if they arrive damaged or wrong.' },
    { q: 'Can I smell them in person?', a: 'Of course. Visit one of our stores to try any fragrance; store stock is shown on each product so you know what is there before you go.' },
  ],
})
