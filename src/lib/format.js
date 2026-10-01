import { dateLocale } from '../i18n'

export function formatDate(iso, long = false) {
  if (!iso) return ''
  return new Date(iso + 'T12:00:00').toLocaleDateString(dateLocale(), {
    day: 'numeric',
    month: long ? 'long' : 'short',
    year: 'numeric',
  })
}
