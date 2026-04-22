import { useEffect, useState, useRef } from 'react'
import { formatPrice, formatRent } from '../shared/PriceFormatter'
import { TrendArrow } from '../shared/TrendArrow'

/**
 * Hover-Tooltip für die Karte.
 * Zeigt Name, ETW-Preis, Trend, typische Objektart.
 * Positioniert sich intelligent neben dem Viertel, flippt am Rand.
 */
export function MapTooltip({ district, anchorRect, containerRect }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (district) {
      const timer = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(timer)
    }
    setVisible(false)
  }, [district])

  if (!district || !anchorRect || !containerRect) return null

  const { prices, character, name } = district

  // Tooltip-Position: rechts neben dem Viertel, flippt nach links wenn am Rand
  const tooltipWidth = 220
  const tooltipHeight = 120
  const gap = 12

  let left = anchorRect.right - containerRect.left + gap
  let top = anchorRect.top - containerRect.top + (anchorRect.height / 2) - (tooltipHeight / 2)

  // Flippt nach links wenn nicht genug Platz rechts
  if (left + tooltipWidth > containerRect.width) {
    left = anchorRect.left - containerRect.left - tooltipWidth - gap
  }

  // Clamp vertikal
  if (top < 0) top = 8
  if (top + tooltipHeight > containerRect.height) {
    top = containerRect.height - tooltipHeight - 8
  }

  return (
    <div
      ref={ref}
      className="absolute z-20 pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${tooltipWidth}px`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-border px-4 py-3">
        <p className="font-bold text-primary text-sm leading-tight">{name}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(prices.etwPerSqm)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <TrendArrow trend={prices.trend} label={prices.trend12m} />
        </div>
        {(character.typicalBuildings || character.marktsegment) && (
          <p className="mt-1.5 text-xs text-text/75 leading-snug">
            {character.typicalBuildings || character.marktsegment}
          </p>
        )}
      </div>
    </div>
  )
}
