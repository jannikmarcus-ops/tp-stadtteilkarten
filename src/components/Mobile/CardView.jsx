import { useState, useMemo } from 'react'
import { SortControls } from './SortControls'
import { DistrictCard } from './DistrictCard'

/**
 * Mobile Card-Ansicht: Sortierbare, expandierbare Cards pro Viertel.
 */
export function CardView({ districts, colorScale }) {
  const [sort, setSort] = useState('price')
  const [expandedId, setExpandedId] = useState(null)

  const sorted = useMemo(() => {
    const items = [...districts]
    switch (sort) {
      case 'price':
        return items.sort((a, b) => b.prices.etwPerSqm - a.prices.etwPerSqm)
      case 'az':
        return items.sort((a, b) => a.name.localeCompare(b.name, 'de'))
      case 'trend':
        return items.sort((a, b) => b.prices.trendPercent - a.prices.trendPercent)
      default:
        return items
    }
  }, [sort, districts])

  return (
    <div>
      <SortControls sort={sort} onChange={setSort} />
      <div className="space-y-2">
        {sorted.map((district) => (
          <DistrictCard
            key={district.id}
            district={district}
            expanded={expandedId === district.id}
            onToggle={() => setExpandedId(
              expandedId === district.id ? null : district.id
            )}
            colorScale={colorScale}
          />
        ))}
      </div>
    </div>
  )
}
