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

## 2026-09-28 — Coupons, gift cards, store credit at checkout; rewards

- Checkout summary: coupon code (`/coupons/quote` against the API cart, re-quoted when the cart re-prices), gift card code (`/wallet/gift_cards/check`), "use my store credit" (`/wallet/me`); shows discount, wallet parts and "To pay". Order body sends `coupon_code`, `gift_card_code`, `use_store_credit`; when `due_amount` is 0 the payment step is skipped.
- Account page: Rewards card (store credit, points, earn rule, convert points to credit).

## 2026-09-29 — Reports (part 9): nothing changed here

- Reports are admin only (ecom-api `report/`, ecom-admin `/reports`). Cost prices never reach the storefront: product/variant responses only carry `cost_price` for staff tokens.

## 2026-09-29 — Labels and product codes (part 10): nothing changed here

- Variants can now get auto SKUs and in-store EAN-13 barcodes (prefix 200–299) from the API; the storefront shows neither.

## 2026-09-29 — Store finder and click & collect

- `/stores` (real now): stores from `GET /stores`, hours, phone, click & collect badge, Directions (Google Maps), "Nearest to me" (geolocation + `distanceKm`). Product page `ProductStoreStock`: which pickup stores have the chosen variant.
- Checkout: Delivery / Collect from a store (stores shown only if they have the whole bag), no address or delivery fee for pickup (the API cart is made without an address), COD reads "Pay when you collect"; order page shows the pickup store, steps Confirmed → Ready to collect → Collected.

## 2026-09-29 — Transfers (part 12): nothing changed here

- Stock moves between locations in the admin; the storefront's store stock (`/stores?variant_id=`) reflects it.

## 2026-09-29 — Stock counts (part 13): nothing changed here

- Store stock the storefront shows follows counts made in the admin.

## 2026-09-29 — Suppliers and purchase orders (part 14): nothing changed here

- Purchasing is admin only.


## 2026-09-29 — Customer notifications (part 15): nothing changed here

- Emails link to `notifications.storefront_url` + `/account/orders/{id}` (API config), so keep that route stable.
