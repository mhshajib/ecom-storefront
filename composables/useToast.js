// Small messages at the top right ("Added to your bag"), each gone after a few seconds.
let next = 1
export function useToast() {
  const toasts = useState('toasts', () => [])
  const dismiss = (id) => { toasts.value = toasts.value.filter((t) => t.id !== id) }
  // { title, body?, image?, icon?, action?: { label, to?, run? }, ms? }
  const show = (t) => {
    const id = next++
    const ms = t.ms ?? 3800
    toasts.value = [...toasts.value.slice(-2), { ...t, id, ms }]
    if (import.meta.client) setTimeout(() => dismiss(id), ms)
    return id
  }
  return { toasts, show, dismiss }
}
