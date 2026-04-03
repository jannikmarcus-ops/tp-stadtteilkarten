import { formatPrice, formatRent } from '../shared/PriceFormatter'
import { TrendArrow } from '../shared/TrendArrow'
import districts from '../../data/districts.json'

const { colorScale } = districts.meta

function getColor(price) {
  const s = colorScale.find(s => price >= s.min && price <= s.max)
  return s ? s.color : '#E8E4E0'
}

/**
 * Mobile Card für ein Viertel.
 * Collapsed: Name, Farbpunkt, ETW-Preis, Trend
 * Expanded: Alle Preise, Demographics, Profil, CTA
 */
export function DistrictCard({ district, expanded, onToggle }) {
  const { id, name, bezirk, prices, demographics, character, cta } = district
  const color = getColor(prices.etwPerSqm)

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-background/80 transition-colors"
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="flex-1 min-w-0">
          <span className="font-bold text-sm text-primary block truncate">{name}</span>
        </span>
        <span className="text-sm font-bold text-primary whitespace-nowrap">
          {formatPrice(prices.etwPerSqm)}
        </span>
        <span className="text-xs whitespace-nowrap">
          <TrendArrow trend={prices.trend} percent={prices.trendPercent} />
        </span>
        <svg
          className={`w-4 h-4 text-text/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{ maxHeight: expanded ? '500px' : '0', opacity: expanded ? 1 : 0 }}
      >
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <p className="text-xs text-text/70">{bezirk}</p>

          {/* Preise */}
          <div className="grid grid-cols-3 gap-2">
            <PriceBox label="ETW" value={formatPrice(prices.etwPerSqm)} />
            <PriceBox label="Haus" value={formatPrice(prices.housePerSqm)} />
            <PriceBox label="Miete" value={formatRent(prices.rentPerSqm)} />
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <StatBox label="Einwohner" value={new Intl.NumberFormat('de-DE').format(demographics.population)} />
            {demographics.areaSqKm != null && (
              <StatBox label="Fläche" value={`${demographics.areaSqKm.toFixed(1).replace('.', ',')} km²`} />
            )}
            <StatBox label="zur City" value={demographics.distanceCityKm === 0 ? 'Zentrum' : `${demographics.distanceCityKm} km`} />
          </div>

          {/* Kurzprofil */}
          <p className="text-xs text-text leading-relaxed">{character.shortProfile}</p>

          {/* CTA */}
          <a
            href={cta.url}
            target="_parent"
            className="block w-full text-center px-4 py-2.5 rounded-lg font-bold text-white text-sm"
            style={{ backgroundColor: '#B8860B' }}
          >
            {cta.text}
          </a>
        </div>
      </div>
    </div>
  )
}

function PriceBox({ label, value }) {
  return (
    <div className="bg-background rounded px-2 py-1.5 text-center">
      <p className="text-[10px] text-text/70">{label}</p>
      <p className="text-xs font-bold text-primary">{value}</p>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-background rounded px-2 py-1.5 text-center">
      <p className="text-[10px] text-text/70">{label}</p>
      <p className="text-xs font-bold text-text">{value}</p>
    </div>
  )
}
