import { formatDate } from './format'
import { locale } from '../i18n'

// Lê todos os arquivos .md da pasta src/posts.
// meu-post.md é a versão em português; meu-post.en.md é a tradução para o inglês.
// O nome do arquivo (sem .md e sem .en) vira o endereço do post.
const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })

// Separa o cabeçalho (entre as linhas ---) do texto do post.
function parse(raw) {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n').trim()
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

// slug -> { pt: post, en: post }
const bySlug = {}
for (const [path, raw] of Object.entries(files)) {
  const name = path.split('/').pop().replace(/\.md$/, '')
  const lang = name.endsWith('.en') ? 'en' : 'pt'
  const slug = name.replace(/\.en$/, '')
  const { meta, body } = parse(raw)
  ;(bySlug[slug] ||= {})[lang] = {
    slug,
    lang,
    title: meta.title || slug,
    date: meta.date || '',
    updated: meta.updated || '',
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    draft: String(meta.draft).toLowerCase() === 'true',
    minutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200)),
    body,
  }
}

// Posts no idioma atual. Sem tradução, mostra o português e marca "fallback".
export function getPosts(lang = locale.value) {
  return Object.values(bySlug)
    .map((v) => {
      const post = v[lang] || v.pt || v.en
      return { ...post, fallback: post.lang !== lang, dateLabel: formatDate(post.date) }
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
