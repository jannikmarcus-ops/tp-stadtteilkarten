/**
 * Trend-Pfeil basierend auf trendPercent.
 * >= 1.0% = steigend (↗), 0.3-0.9% = stabil (→), < 0.3% = fallend (↘)
 * Farben WCAG AA-konform auf weißem Hintergrund (Kontrast >= 4.5:1)
 */
export function TrendArrow({ trend, percent }) {
  let arrow, color
  if (percent >= 1.0) {
    arrow = '↗'
    color = 'text-green-800'  // #166534, Kontrast 8.2:1
  } else if (percent >= 0.3) {
    arrow = '→'
    color = 'text-yellow-800' // #854d0e, Kontrast 5.7:1
  } else {
    arrow = '↘'
    color = 'text-red-700'    // #b91c1c, Kontrast 5.1:1
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${color}`}>
      <span>{arrow}</span>
      {percent != null && (
        <span>{percent > 0 ? '+' : ''}{percent.toFixed(1).replace('.', ',')}%</span>
      )}
    </span>
  )
}
