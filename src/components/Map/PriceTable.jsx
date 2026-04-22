import { useState, useMemo } from 'react'
import { formatPrice, formatRent } from '../shared/PriceFormatter'
import { TrendArrow } from '../shared/TrendArrow'

/**
 * Sortierbare Preistabelle unter der Karte (nur Desktop).
 * Mobile: ausgeblendet, Cards übernehmen.
 */
export function PriceTable({ districts }) {
  const hasLand = districts.some(d => d.prices.landPerSqm != null)
  const thirdCol = hasLand
    ? { key: 'grund', label: 'Grund €/m²', format: formatPrice, field: 'landPerSqm' }
    : { key: 'miete', label: 'Miete €/m²', format: formatRent, field: 'rentPerSqm' }

  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const sorted = useMemo(() => {
    const items = [...districts]
    const dir = sortDir === 'asc' ? 1 : -1

    switch (sortKey) {
      case 'name':
        return items.sort((a, b) => dir * a.name.localeCompare(b.name, 'de'))
      case 'etw':
        return items.sort((a, b) => dir * (a.prices.etwPerSqm - b.prices.etwPerSqm))
      case 'haus':
        return items.sort((a, b) => dir * (a.prices.housePerSqm - b.prices.housePerSqm))
      case 'grund':
      case 'miete':
        return items.sort((a, b) => dir * ((a.prices[thirdCol.field] ?? 0) - (b.prices[thirdCol.field] ?? 0)))
      default:
        return items
    }
  }, [sortKey, sortDir, districts, thirdCol.field])

  const arrow = sortDir === 'asc' ? ' ↑' : ' ↓'

  return (
    <div className="hidden md:block max-w-3xl mx-auto mt-6 mb-2">
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th onClick={() => handleSort('name')} active={sortKey === 'name'} arrow={arrow} align="left">
                Gemeinde
              </Th>
              <Th onClick={() => handleSort('etw')} active={sortKey === 'etw'} arrow={arrow} align="right">
                ETW €/m²
              </Th>
              <Th onClick={() => handleSort('haus')} active={sortKey === 'haus'} arrow={arrow} align="right">
                Haus €/m²
              </Th>
              <Th onClick={() => handleSort(thirdCol.key)} active={sortKey === thirdCol.key} arrow={arrow} align="right">
                {thirdCol.label}
              </Th>
              <Th align="left">Trend</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => (
              <tr
                key={d.id}
                className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-primary/[0.03]'} hover:bg-primary/[0.06] transition-colors`}
              >
                <td className="px-4 py-2.5 font-medium text-primary">{d.name}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{formatPrice(d.prices.etwPerSqm)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{formatPrice(d.prices.housePerSqm)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{thirdCol.format(d.prices[thirdCol.field])}</td>
                <td className="px-4 py-2.5">
                  <TrendArrow trend={d.prices.trend} label={d.prices.trend12m} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, onClick, active, arrow, align = 'left' }) {
  const textAlign = align === 'right' ? 'text-right' : 'text-left'
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 font-semibold text-white whitespace-nowrap ${textAlign} ${onClick ? 'cursor-pointer select-none hover:brightness-110' : ''}`}
      style={{ backgroundColor: '#052E26' }}
    >
      {children}{active ? arrow : ''}
    </th>
  )
}
