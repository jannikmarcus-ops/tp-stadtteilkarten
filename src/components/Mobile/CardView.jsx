import { useState, useMemo } from 'react'
import { SortControls } from './SortControls'
import { DistrictCard } from './DistrictCard'
import districts from '../../data/districts.json'

/**
 * Mobile Card-Ansicht: Alle 18 Viertel als sortierbare, expandierbare Cards.
 */
export function CardView() {
  const [sort, setSort] = useState('price')
  const [expandedId, setExpandedId] = useState(null)

  const sorted = useMemo(() => {
    const items = [...districts.districts]
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
  }, [sort])

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
          />
        ))}
      </div>
    </div>
  )
}
