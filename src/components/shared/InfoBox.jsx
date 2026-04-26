/**
 * Info-Kasten unter der Karte. Optionales Feld `meta.infoBox`.
 * Zwei-Markt-Erklärung für Kreis Dithmarschen, allgemein nutzbar.
 */
export function InfoBox({ heading, paragraphs }) {
  if (!heading || !paragraphs?.length) return null
  return (
    <section className="max-w-3xl mx-auto mt-3 mb-2 px-4 py-3 rounded-lg border border-border bg-white/70">
      <h3 className="text-sm font-bold text-primary mb-1.5">{heading}</h3>
      <div className="space-y-2 text-xs text-text leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}
