/**
 * Suchleiste über der Karte. Case-insensitive Partial-Match auf Gemeindename.
 */
export function SearchBar({ value, onChange, placeholder = 'Gemeinde suchen...' }) {
  return (
    <div className="max-w-xs mx-auto mb-2">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 rounded-lg border border-border bg-white text-sm text-text
                     placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
            aria-label="Suche leeren"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l8 8M11 3L3 11" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
