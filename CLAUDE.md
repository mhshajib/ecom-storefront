# Scentology storefront

Public shop for `../ecom-api` (Nuxt 3, **server rendered** for SEO). Tailwind + @nuxt/icon (lucide). Brand: **Scentology — "Scented Your Mood"** (fragrances): noir bands, metallic gold accent, warm ivory ground. Layout inspired by elorvabd.com (dark hero bands, centred logo header, serif display, brand-eyebrow product cards, FAQ, subscribe band).

## Layout

- `app.config.ts` — store name/tagline/contact, announcement bar, hero copy, promises, FAQ. Rebrand here; products and categories come from the API.
- `tailwind.config.js` + `assets/css/main.css` — tokens (`noir-*`, `gold`, `cream`, `ink`) and `s-*` classes (`s-container`, `s-band`, `s-title`, `s-eyebrow`, `s-btn-gold|dark|ghost|line`, `s-chip`, `s-input`, `s-gold-text`). Fonts: Cinzel (wordmark), Cormorant Garamond (display), Figtree (body). Use sans for prices (Cormorant has old-style numerals).
- `composables/useApi.js` — the only fetch client (`api(path, { query })`); base url set by `plugins/api.js`. `useCatalog.js` — categories tree, price/discount/image/stock helpers, `money()`. `useCart.js` / `useWishlist.js` — bag and saved items in localStorage. `useAuth.js` — customer session (`request()` sends the token; 401 signs out), `friendly()` error messages.
- `components/layout|home|product|ui/*` — auto-imported as `LayoutSiteHeader`, `HomeHeroSection`, `ProductCard`, `UiSectionHeading`…
- Pages: `/`, `/products` (filters in the query string: `category`, `sub`, `q`, `min`, `max`, `on_sale`, `opt.<Option>=a,b`, `sort`, `page`), `/products/[slug]`, `/saved`, `/pages/[slug]`; `/checkout` (phone OTP sign-in → address → pay), `/account`, `/account/orders/[id]`; `/stores` is a placeholder.

## Commands

- `npm install`, `npm run dev` → http://localhost:4000 (API on 8080).
- `npm run build` then `node .output/server/index.mjs` (set `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_SITE_URL`, `PORT`).

## Config

`.env` (git ignored; copy `.env.example`): `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_SITE_URL`.

## Shared memory (read this every session)

@.claude/memory/MEMORY.md

Keep it current: non-obvious decisions/gotchas in `.claude/memory/`, one line each in `MEMORY.md`, dated entries in `session-log.md`. Never store secrets.
