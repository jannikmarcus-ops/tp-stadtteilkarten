/**
 * Formatiert Preise im deutschen Format: 6.100 €/m²
 */
export function formatPrice(value, unit = '€/m²') {
  if (value == null) return '–'
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
  return `${formatted} ${unit}`
}

/**
 * Formatiert Mietpreise: 15,80 €/m²
 */
export function formatRent(value) {
  if (value == null) return '–'
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
  return `${formatted} €/m²`
}

export function PriceDisplay({ value, unit = '€/m²' }) {
  return <span className="font-bold text-primary">{formatPrice(value, unit)}</span>
}
