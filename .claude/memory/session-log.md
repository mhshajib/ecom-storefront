# Session log

## 2026-09-28 — Storefront foundation

- Nuxt 3 SSR app on port 4000: header (mega menu from `/categories/tree`, search, saved, bag), announcement marquee, footer + newsletter band, WhatsApp button; home (hero collage from products, new arrivals, category showcase, best sellers, offer band, promises, FAQ); listing with price/offer/option filters and sort; product page with text/colour/image option pickers, online-stock aware add to bag, related products, JSON-LD; bag drawer; saved items; help pages.
- Re-themed to the Scentology logo (noir + gold). Logo is an SVG approximation (`components/layout/Logo.vue`); swap in the real artwork (`public/logo.png`) when available.
- Next: customer auth (phone OTP), checkout (cart → order → COD/bKash), account, store finder (public locations API).

## 2026-09-28 — Sign-in and checkout

- `useAuth` (token + user in cookies mirrored in `useState`), `AuthPhoneSignIn` (phone → code; shows the dev code in test mode). Checkout: sign in → pick/add address (districts list) → API cart prices delivery → payment method from `/payments/gateways` → order + payment (redirect for online gateways) → `/account/orders/[id]?placed=1`. Account page: profile, orders; order detail with progress.
- Local test customers: 01999000111 … 01999000777 (dev codes, no SMS).

## 2026-09-28 — Return requests

- Account order page: delivered orders show a Returns section (window end date, request form with quantity + reason per item, refund preview, existing returns with status, cancel a pending request). Uses `/returns/returnable`, `/returns`, `/returns/{id}/cancel`. "To pay on delivery" hidden once delivered.

