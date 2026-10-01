export function formatDate(iso, long = false) {
  if (!iso) return ''
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: long ? 'long' : 'short',
    year: 'numeric',
  })
}
