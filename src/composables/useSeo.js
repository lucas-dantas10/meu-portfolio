import { profile } from '../data/profile'

// Atualiza description, canonical e Open Graph/Twitter conforme a página aberta.
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function setSeo({ title, description, path = '', type = 'website' }) {
  document.title = title
  const url = profile.siteUrl + (path ? '#' + path : '')
  if (description) {
    setMeta('name', 'description', description)
    setMeta('property', 'og:description', description)
    setMeta('name', 'twitter:description', description)
  }
  setMeta('property', 'og:title', title)
  setMeta('name', 'twitter:title', title)
  setMeta('property', 'og:type', type)
  setMeta('property', 'og:url', url)
}
