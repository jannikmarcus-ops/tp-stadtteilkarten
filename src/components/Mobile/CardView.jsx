import { useState, useMemo } from 'react'
import { SortControls } from './SortControls'
import { DistrictCard } from './DistrictCard'

const CLUSTER_LABELS = {
  'muenster-nah': 'Münster-nahe Gemeinden',
  'steinfurt-emsdetten': 'Steinfurt und Emsdetten',
  'tecklenburger-land': 'Tecklenburger Land',
  'rheine-norden': 'Rheine und Norden',
}

const CLUSTER_ORDER = ['muenster-nah', 'steinfurt-emsdetten', 'tecklenburger-land', 'rheine-norden']

/**
 * Mobile Card-Ansicht: Sortierbare, expandierbare Cards pro Viertel.
 * Bei Regionen mit Cluster-Daten wird nach Cluster gruppiert (Default).
 */
export function CardView({ districts, colorScale }) {
  const hasCluster = districts.some(d => d.cluster)
  const [sort, setSort] = useState(hasCluster ? 'cluster' : 'price')
  const [expandedId, setExpandedId] = useState(null)

  const sorted = useMemo(() => {
    const items = [...districts]
    switch (sort) {
      case 'price':
        return items.sort((a, b) => b.prices.etwPerSqm - a.prices.etwPerSqm)
      case 'az':
        return items.sort((a, b) => a.name.localeCompare(b.name, 'de'))
      default:
        return items
    }
  }, [sort, districts])

  // Cluster-gruppierte Ansicht
  if (sort === 'cluster' && hasCluster) {
    const groups = CLUSTER_ORDER
      .map(clusterId => ({
        id: clusterId,
        label: CLUSTER_LABELS[clusterId] || clusterId,
        items: districts
          .filter(d => d.cluster === clusterId)
          .sort((a, b) => b.prices.etwPerSqm - a.prices.etwPerSqm),
      }))
      .filter(g => g.items.length > 0)

    return (
      <div>
        <SortControls sort={sort} onChange={setSort} hasCluster={hasCluster} />
        {groups.map((group) => (
          <div key={group.id} className="mb-4">
            <h3 className="text-xs font-bold text-text/70 uppercase tracking-wider px-1 mb-2">
              {group.label}
            </h3>
            <div className="space-y-2">
              {group.items.map((district) => (
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
        ))}
      </div>
    )
  }

  // Flache Sortierung (Preis, A-Z)
  return (
    <div>
      <SortControls sort={sort} onChange={setSort} hasCluster={hasCluster} />
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
