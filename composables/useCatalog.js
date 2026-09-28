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
