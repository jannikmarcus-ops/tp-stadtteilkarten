export function Footer({ meta }) {
  return (
    <footer className="px-4 py-4 text-center text-xs text-text/70 max-w-2xl mx-auto">
      <p>Daten: {meta.source}. Stand: {meta.quarter}</p>
    </footer>
  )
}
