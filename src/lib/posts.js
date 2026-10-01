import { formatDate } from './format'

// Lê todos os arquivos .md da pasta src/posts. O nome do arquivo vira o endereço do post.
const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })

// Separa o cabeçalho (entre as linhas ---) do texto do post.
function parse(raw) {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim()
  const m = text.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n([\s\S]*))?$/)
  const meta = {}
  let body = text
  if (m) {
    body = (m[2] || '').trim()
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':')
      if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim()
    }
  }
  return { meta, body }
}

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parse(raw)
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      dateLabel: formatDate(meta.date),
      tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      draft: String(meta.draft).toLowerCase() === 'true',
      minutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200)),
      body,
    }
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
