import districts from '../../data/districts.json'

export function Footer() {
  const { quarter } = districts.meta

  return (
    <footer className="px-4 py-4 text-center text-xs text-text/70 max-w-2xl mx-auto">
      <p>Daten: ImmoScout24, immowelt, Gutachterausschuss Münster. Stand: {quarter}</p>
    </footer>
  )
}
