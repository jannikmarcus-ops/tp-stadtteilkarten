/**
 * Trend-Pfeil basierend auf dem Text-Trend aus dem JSON.
 * Optional `label` zeigt einen Prozent-Wert (z.B. "+2,8%") statt des Trend-Worts.
 * Farben WCAG AA-konform auf weißem Hintergrund (Kontrast >= 4.5:1).
 *
 * Strikt nach Richtung: steigend grün ↗, fallend rot ↘, stabil grau →.
 * Keine Schwellwerte — jeder positive Wert ist steigend.
 */
export function TrendArrow({ trend, label }) {
  const t = (trend || '').toLowerCase()
  let arrow, color

  if (t.includes('steigend') || t.includes('steigt')) {
    arrow = '↗'
    color = 'text-green-800'
  } else if (t.includes('fallend') || t.includes('fällt') || t.includes('sinkend')) {
    arrow = '↘'
    color = 'text-red-700'
  } else {
    arrow = '→'
    color = 'text-text/60'
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${color}`}>
      <span>{arrow}</span>
      <span className="text-xs">{label || trend || 'stabil'}</span>
    </span>
  )
}
