export function Footer({ meta }) {
  const isRegion = !!meta.region
  return (
    <footer className="px-4 py-4 text-center text-xs text-text/70 max-w-2xl mx-auto">
      <p>{meta.source}{isRegion ? ' Nicht beurkundete Transaktionspreise. Datenqualität variiert je Gemeinde.' : ''}</p>
    </footer>
  )
}
