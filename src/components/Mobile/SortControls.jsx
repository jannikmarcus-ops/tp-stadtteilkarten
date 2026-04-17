/**
 * Sortier-Buttons: Cluster (default bei Regionen), Preis ↓, A-Z
 */
export function SortControls({ sort, onChange, hasCluster = false }) {
  const options = [
    ...(hasCluster ? [{ key: 'cluster', label: 'Region' }] : []),
    { key: 'price', label: 'Preis ↓' },
    { key: 'az', label: 'A–Z' },
  ]

  return (
    <div className="flex gap-2 mb-3 px-1">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            sort === key
              ? 'bg-primary text-white'
              : 'bg-white text-text/75 border border-border hover:text-text'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
