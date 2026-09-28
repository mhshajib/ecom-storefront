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
  const toggle = (id) => {
    const adding = !has(id)
    ids.value = adding ? [...ids.value, id] : ids.value.filter((x) => x !== id)
    useToast().show(adding ? { title: 'Saved for later', icon: 'lucide:heart', action: { label: 'See saved', to: '/saved' }, ms: 2600 } : { title: 'Removed from saved', icon: 'lucide:heart-off', ms: 2000 })
  }
  return { ids, has, toggle }
}
