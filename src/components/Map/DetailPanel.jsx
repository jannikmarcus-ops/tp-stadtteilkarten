import { formatPrice, formatRent } from '../shared/PriceFormatter'
import { TrendArrow } from '../shared/TrendArrow'

/**
 * Detail-Panel: Schiebt von rechts rein bei Klick auf ein Viertel.
 * Ab 1024px als Sidebar neben der Karte, darunter als Overlay.
 */
export function DetailPanel({ district, onClose }) {
  if (!district) return null

  const { name, bezirk, prices, demographics, character, cta } = district

  return (
    <>
      {/* Dim-Overlay (nur auf Mobile/Tablet, unter 1024px) */}
      <div
        className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-40 shadow-2xl overflow-y-auto
                   lg:relative lg:top-auto lg:right-auto lg:h-auto lg:max-w-none lg:shadow-lg lg:rounded-lg lg:z-auto"
        style={{
          animation: 'slideIn 300ms ease-out',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">{name}</h2>
            <p className="text-xs text-text/70 mt-0.5">{bezirk}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-background text-text/40 hover:text-text transition-colors"
            aria-label="Panel schließen"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Inhalt */}
        <div className="px-5 py-4 space-y-5">

          {/* Preisblock */}
          <div className="grid grid-cols-3 gap-3">
            <PriceCard label="ETW" value={formatPrice(prices.etwPerSqm)} />
            <PriceCard label="Haus" value={formatPrice(prices.housePerSqm)} />
            <PriceCard label="Miete" value={formatRent(prices.rentPerSqm)} />
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text/75">Preistrend:</span>
            <TrendArrow trend={prices.trend} percent={prices.trendPercent} />
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <StatCard
              label="Einwohner"
              value={new Intl.NumberFormat('de-DE').format(demographics.population)}
            />
            {demographics.areaSqKm != null && (
              <StatCard
                label="Fläche"
                value={`${demographics.areaSqKm.toFixed(1).replace('.', ',')} km²`}
              />
            )}
            <StatCard
              label="zur City"
              value={demographics.distanceCityKm === 0
                ? 'Zentrum'
                : `${demographics.distanceCityKm} km`
              }
            />
          </div>

          {/* ÖPNV (nur Hamburg) */}
          {character.oepnv && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text/75">ÖPNV:</span>
              <span className="font-medium text-text">{character.oepnv}</span>
            </div>
          )}

          {/* Kurzprofil */}
          <div>
            <h3 className="text-xs font-bold text-text/70 uppercase tracking-wider mb-1.5">Profil</h3>
            <p className="text-sm text-text leading-relaxed">{character.shortProfile}</p>
          </div>

          {/* Typische Gebäude */}
          <div>
            <h3 className="text-xs font-bold text-text/70 uppercase tracking-wider mb-1.5">Typische Objekte</h3>
            <p className="text-sm text-text">{character.typicalBuildings}</p>
          </div>

          {/* CTA Button */}
          <a
            href={cta.url}
            target="_parent"
            className="block w-full text-center px-5 py-3 rounded-lg font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: '#B8860B' }}
          >
            {cta.text}
          </a>

          {/* Stadtteil-Guide Link (nur wenn vorhanden) */}
          {character.detailPageUrl && (
            <a
              href={character.detailPageUrl}
              target="_parent"
              className="block text-center text-sm text-primary underline underline-offset-2 hover:text-accent"
            >
              Stadtteil-Guide {name} →
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

function PriceCard({ label, value }) {
  return (
    <div className="bg-background rounded-lg px-3 py-2.5 text-center">
      <p className="text-xs text-text/70">{label}</p>
      <p className="text-sm font-bold text-primary mt-0.5">{value}</p>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-background rounded-lg px-2 py-2">
      <p className="text-xs text-text/70">{label}</p>
      <p className="text-sm font-bold text-text mt-0.5">{value}</p>
    </div>
  )
}
