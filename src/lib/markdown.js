import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Links externos abrem em outra aba.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && /^https?:/i.test(node.getAttribute('href') || '')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

// Converte Markdown em HTML e remove qualquer coisa perigosa antes de exibir.
export function renderMarkdown(md) {
  return DOMPurify.sanitize(marked.parse(md, { gfm: true }))
}
