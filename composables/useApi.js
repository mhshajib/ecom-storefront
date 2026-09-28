// ecom-api client for pages and components (works during SSR and in the browser).
// Responses use the API envelope { data, pagination, message, error }.

// Set once by plugins/api.js: reading the runtime config inside async data handlers loses Nuxt's context.
let base = ''
export function setApiBase(url) { base = (url || '').replace(/\/$/, '') }
export function apiBase() {
  if (!base) { try { setApiBase(useRuntimeConfig().public.apiBaseUrl) } catch { /* outside Nuxt's context */ } }
  if (!base) throw new Error('API base url is not configured (NUXT_PUBLIC_API_BASE_URL)')
  return base
}

/** Build query params, dropping empty values; arrays repeat the key. */
export function cleanQuery(params = {}) {
  const out = {}
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue
    out[k] = v
  }
  return out
}

export function api(path, { query, method = 'GET', body } = {}) {
  return $fetch(path, { baseURL: apiBase(), query: cleanQuery(query), method, body, retry: 0, timeout: 15000 })
}
