// Give the API client its base url (server and browser) before any page fetches data.
export default defineNuxtPlugin(() => {
  setApiBase(useRuntimeConfig().public.apiBaseUrl)
})
