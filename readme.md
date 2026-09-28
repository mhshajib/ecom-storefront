# Scentology storefront

The public shop for [ecom-api](../ecom-api), built with Nuxt 3 (server rendered).

```bash
cp .env.example .env   # NUXT_PUBLIC_API_BASE_URL, NUXT_PUBLIC_SITE_URL
npm install
npm run dev            # http://localhost:4000
```

Store name, announcement bar, hero copy and FAQ live in `app.config.ts`.

Production: `npm run build`, then `node .output/server/index.mjs` with `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_SITE_URL` and `PORT` set.
