// Catalog data and the small derivations every product view needs.

/** Published categories as a tree (cached per request/session); categories without a slug are skipped. */
export function useCategories() {
  return useAsyncData('categories', async () => {
    const res = await api('/categories/tree', { query: { published: true } })
    return (res.data || []).filter((c) => c.slug).map((c) => ({ ...c, children: (c.children || []).filter((s) => s.slug) }))
  }, { default: () => [] })
}

export const money = (v) => `৳${new Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 }).format(Math.round(Number(v) || 0))}`

/** Lowest/highest variant sale price and the matching regular price. */
export function priceOf(p) {
  const vs = (p?.variants || []).filter((v) => v.sale_price > 0)
  if (!vs.length) return { min: p?.sale_price || 0, max: p?.sale_price || 0, was: p?.original_price > p?.sale_price ? p.original_price : 0 }
  const cheapest = vs.reduce((a, b) => (b.sale_price < a.sale_price ? b : a))
  const max = Math.max(...vs.map((v) => v.sale_price))
  return { min: cheapest.sale_price, max, was: cheapest.original_price > cheapest.sale_price ? cheapest.original_price : 0 }
}

export const discountOf = (p) => {
  const { min, was } = priceOf(p)
  return was ? Math.round((1 - min / was) * 100) : 0
}

export const imagesOf = (p) => [p?.thumb, ...(p?.images || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)

/** Units the website can sell (stock at locations that sell online). */
export const onlineStockOf = (p) => (p?.variants || []).reduce((n, v) => n + Math.max(0, v.online_stock || 0), 0)

export const productUrl = (p) => `/products/${p.slug}`

export const categoryLabel = (p) => p?.sub_category?.name || p?.category?.name || ''

/** Every attribute (Gender, Concentration, Season, Notes…) with its values, cached. */
export function useAttributes() {
  return useAsyncData('attributes', async () => (await api('/attributes')).data || [], { default: () => [] })
}

/** Every brand on the store (name order), cached. */
export function useBrands() {
  return useAsyncData('brands', async () => (await api('/brands', { query: { limit: 100 } })).data || [], { default: () => [] })
}

/** The label of an attribute value, e.g. ('concentration', 'edp') → Eau de Parfum. */
export const valueLabel = (attributes, attr, slug) => attributes?.find((a) => a.slug === attr)?.values.find((v) => v.slug === slug)?.label || slug

/** The value objects a product has for an attribute. */
export const valuesOf = (attributes, p, attr) => {
  const a = attributes?.find((x) => x.slug === attr)
  return (p?.facets?.[attr] || []).map((s) => a?.values.find((v) => v.slug === s) || { slug: s, label: s })
}

/** What a card shows above the title: the brand, or the category. */
export const eyebrowOf = (p) => p?.brand?.name || categoryLabel(p)

// how a fragrance wears (0 = not rated)
export const LONGEVITY = [null, { label: 'Weak', hint: 'Under 2 hours' }, { label: 'Moderate', hint: '2 to 4 hours' }, { label: 'Long lasting', hint: '4 to 6 hours' }, { label: 'Very long lasting', hint: '6 to 10 hours' }, { label: 'Eternal', hint: '10 hours or more' }]
export const PROJECTION = [null, { label: 'Intimate', hint: 'Close to the skin' }, { label: 'Moderate', hint: 'Arm’s length' }, { label: 'Strong', hint: 'Noticed across a room' }, { label: 'Enormous', hint: 'Fills the room' }]

/** For a combo: what its contents cost one by one, less its price (the biggest saving of its variants). */
export const comboSaving = (p) => {
  if (!p?.is_combo) return 0
  return Math.max(0, ...(p.variants || []).map((v) => (v.bundle_value || 0) - (v.sale_price || 0)))
}

/** The storefront menu (links resolved by the API: href + display_*), cached. */
export function useMenu() {
  return useAsyncData('menu', async () => (await api('/storefront/menu')).data || { items: [], discover: [] }, { default: () => ({ items: [], discover: [] }) })
}
