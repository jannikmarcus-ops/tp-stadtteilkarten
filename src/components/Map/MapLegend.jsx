import districts from '../../data/districts.json'

const { colorScale } = districts.meta

/**
 * Preisstufen-Legende unter der Karte.
 * 5 farbige Quadrate mit Labels.
 */
export function MapLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-4">
      {colorScale.map((level) => (
        <div key={level.label} className="flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-sm inline-block flex-shrink-0"
            style={{ backgroundColor: level.color }}
          />
          <span className="text-xs text-text/70">{level.label}</span>
        </div>
      ))}
    </div>
  )
}
