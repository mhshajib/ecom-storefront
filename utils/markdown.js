// Markdown from the admin → HTML. Raw HTML in the text is shown as text, never run, and links to other sites
// open in a new tab.
import { Marked } from 'marked'

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html(token) { return escape(token.text || token.raw || '') },
    link(token) {
      const href = String(token.href || '')
      if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return escape(token.text || '')
      const outside = /^https?:/i.test(href)
      return `<a href="${escape(href)}"${outside ? ' target="_blank" rel="noopener"' : ''}>${this.parser.parseInline(token.tokens)}</a>`
    },
  },
})
export const renderMarkdown = (text) => md.parse(String(text || ''))
