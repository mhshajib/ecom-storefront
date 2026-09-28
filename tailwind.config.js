/**
 * Storefront tokens. Structure inspired by elorvabd.com (dark bands, serif display, warm accent),
 * with its own palette: oxblood and plum for the deep bands, gold as the one accent, warm cream ground.
 */
export default {
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './composables/**/*.js', './app.vue', './error.vue', './app.config.ts'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
        brand: ['Cinzel', 'Cormorant Garamond', 'serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        noir: { 950: '#0A0908', 900: '#111010', 800: '#1A1817', 700: '#262320', 600: '#36322D', 100: '#EFE9DF' },
        gold: { DEFAULT: '#C9A24E', light: '#E8CF94', dark: '#9A7430', deep: '#6E5122' },
        cream: { DEFAULT: '#F8F4EC', deep: '#EEE6D8' },
        ink: { DEFAULT: '#1A1714', soft: '#5B544C', faint: '#978E83' },
        line: { DEFAULT: '#E7DECF', strong: '#D5C7B0' },
        sale: '#A8322D',
      },
      borderRadius: { DEFAULT: '10px', lg: '16px', xl: '22px', '2xl': '28px' },
      boxShadow: { card: '0 1px 2px rgb(20 17 14 / .04), 0 8px 28px -12px rgb(20 17 14 / .14)', lift: '0 18px 48px -18px rgb(0 0 0 / .55)' },
      maxWidth: { site: '84rem' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        rise: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: { marquee: 'marquee 40s linear infinite', rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both' },
    },
  },
}
