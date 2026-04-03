/**
 * Panel für graue (nicht-interaktive) Viertel.
 * Zeigt Hinweis dass Marktdaten zusammengestellt werden + CTA.
 */
export function GrayDistrictPanel({ name, onClose }) {
  if (!name) return null

  return (
    <>
      {/* Dim-Overlay (Mobile) */}
      <div
        className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-40 shadow-2xl overflow-y-auto
                   lg:relative lg:top-auto lg:right-auto lg:h-auto lg:max-w-none lg:shadow-lg lg:rounded-lg lg:z-auto"
        style={{ animation: 'slideIn 300ms ease-out' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border">
          <h2 className="text-xl font-bold text-primary">{name}</h2>
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
        <div className="px-5 py-6 space-y-5">
          <p className="text-sm text-text leading-relaxed">
            Für {name} stellen wir aktuell Marktdaten zusammen.
          </p>

          <a
            href="https://teigelerundpartner.de/immobilienbewertung-muenster/"
            target="_parent"
            className="block w-full text-center px-5 py-3 rounded-lg font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: '#B8860B' }}
          >
            Persönliche Einschätzung anfragen
          </a>
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
