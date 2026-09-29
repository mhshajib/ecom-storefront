// Customer session: token + user in cookies (readable during SSR for the header), email code sign-in.
const TOKEN = 'sc_token'
const USER = 'sc_user'

export function useAuth() {
  const opts = { sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' }
  // cookies survive reloads (and are read during SSR); shared state keeps every component in step, since
  // separate useCookie() refs don't see each other's writes
  const tokenCookie = useCookie(TOKEN, opts)
  const userCookie = useCookie(USER, opts)
  const tokenState = useState('auth-token', () => tokenCookie.value || null)
  const userState = useState('auth-user', () => userCookie.value || null)
  const token = computed({ get: () => tokenState.value, set: (v) => { tokenState.value = v; tokenCookie.value = v } })
  const user = computed({ get: () => userState.value, set: (v) => { userState.value = v; userCookie.value = v } })
  const signedIn = computed(() => !!tokenState.value)

  /** Call the API as the signed in customer; a 401 signs out. */
  const request = async (path, { query, method = 'GET', body } = {}) => {
    try {
      return await $fetch(path, {
        baseURL: apiBase(), query: cleanQuery(query), method, body, retry: 0, timeout: 20000,
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      })
    } catch (e) {
      if (e?.response?.status === 401) { token.value = null; user.value = null }
      throw friendly(e)
    }
  }

  const requestCode = (email) => api('/auth/otp/request', { method: 'POST', body: { email } }).catch((e) => { throw friendly(e) })
  const verifyCode = async (email, code, name = '') => {
    const res = await api('/auth/otp/verify', { method: 'POST', body: { email, code, name } }).catch((e) => { throw friendly(e) })
    token.value = res.data.token
    user.value = res.data.user
    return res.data
  }
  const refreshMe = async () => {
    if (!token.value) return null
    const res = await request('/auth/me')
    user.value = res.data
    return res.data
  }
  const signOut = () => { token.value = null; user.value = null }

  return { token, user, signedIn, request, requestCode, verifyCode, refreshMe, signOut }
}

/** Turn an API error into an Error with a readable message and field errors. */
export function friendly(e) {
  const data = e?.data || e?.response?._data || {}
  const fields = data.error && typeof data.error === 'object' ? data.error : null
  const first = fields ? Object.values(fields).flat()[0] : ''
  const msg = first || (typeof data.error === 'string' ? data.error : '') || data.message || e?.message || 'Something went wrong'
  return Object.assign(new Error(msg.charAt(0).toUpperCase() + msg.slice(1)), { status: e?.response?.status, fields })
}
