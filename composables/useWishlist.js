// Saved products (ids) kept in the browser.
const KEY = 'ecom_saved_v1'

export function useWishlist() {
  const ids = useState('saved', () => [])
  const loaded = useState('saved-loaded', () => false)
  if (import.meta.client && !loaded.value) {
    loaded.value = true
    try { ids.value = JSON.parse(localStorage.getItem(KEY) || '[]') } catch { ids.value = [] }
    watch(ids, (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* private mode */ } }, { deep: true })
  }
  const has = (id) => ids.value.includes(id)
  const toggle = (id) => { ids.value = has(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id] }
  return { ids, has, toggle }
}
