/**
 * Pill-Toggle: "Karte | Liste"
 */
export function ViewToggle({ view, onChange }) {
  return (
    <div className="flex justify-center mb-4">
      <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-border">
        {['liste', 'karte'].map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              view === v
                ? 'bg-primary text-white shadow-sm'
                : 'text-text/75 hover:text-text'
            }`}
          >
            {v === 'liste' ? 'Liste' : 'Karte'}
          </button>
        ))}
      </div>
    </div>
  )
}
