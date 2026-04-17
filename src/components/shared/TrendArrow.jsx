/**
 * Trend-Pfeil basierend auf dem Text-Trend aus dem JSON.
 * Farben WCAG AA-konform auf weißem Hintergrund (Kontrast >= 4.5:1)
 */
export function TrendArrow({ trend }) {
  const t = (trend || '').toLowerCase()
  let arrow, color

  if (t.includes('steigend') || t.includes('steigt')) {
    arrow = '↗'
    color = 'text-green-800'
  } else if (t.includes('fallend') || t.includes('fällt') || t.includes('sinkend')) {
    arrow = '↘'
    color = 'text-red-700'
  } else if (t.includes('gemischt')) {
    arrow = '↔'
    color = 'text-yellow-800'
  } else {
    arrow = '→'
    color = 'text-yellow-800'
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${color}`}>
      <span>{arrow}</span>
      <span className="text-xs">{trend || 'stabil'}</span>
    </span>
  )
}
