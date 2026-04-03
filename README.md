# Interaktive Stadtteil-Karte Münster

Interaktive SVG-Stadtteil-Karte für [Teigeler & Partner Immobilien](https://teigelerundpartner.de). Zeigt Immobilienpreise aller 18 Münsteraner Viertel als klickbare Heatmap mit Detail-Panels, Tooltips und Mobile-Card-Ansicht. Wird per Iframe in die WordPress/Elementor-Website eingebettet.

## Tech-Stack

- **Framework:** Vite + React
- **Styling:** Tailwind CSS v4
- **Schrift:** DM Sans (WOFF2, lokal gehostet)
- **Daten:** Statisches JSON (`src/data/districts.json`)
- **Hosting:** Vercel (Subdomain `karte.teigelerundpartner.de`)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffnet auf `http://localhost:5173/`.

## Deployment

```bash
git push origin main
```

Vercel deployed automatisch bei Push auf `main`. Die `vercel.json` im Root konfiguriert CORS-Headers und Cache.

## Daten-Aktualisierung

Datei: `src/data/districts.json`

Quartalsweise die Preise aktualisieren:

1. `meta.lastUpdated` und `meta.quarter` anpassen
2. Pro Viertel in `districts[].prices` die Werte ändern:
   - `etwPerSqm`: Eigentumswohnung €/m²
   - `housePerSqm`: Haus €/m²
   - `rentPerSqm`: Kaltmiete €/m²
   - `trendPercent`: Veränderung in % (bestimmt den Trend-Pfeil)

Beispiel:

```json
{
  "id": "kreuzviertel",
  "prices": {
    "etwPerSqm": 6300,
    "housePerSqm": 7000,
    "rentPerSqm": 17.20,
    "trend": "steigend",
    "trendPercent": 1.8
  }
}
```

Nach Änderung: `git push` → Vercel deployed automatisch.

## Iframe-Einbettung (WordPress/Elementor)

HTML-Snippet für die Einbettung mit automatischer Höhenanpassung:

```html
<iframe
  id="stadtteil-karte"
  src="https://karte.teigelerundpartner.de"
  style="width: 100%; border: none; overflow: hidden;"
  loading="lazy"
  title="Interaktive Stadtteil-Karte Münster"
></iframe>

<script>
window.addEventListener('message', function(e) {
  if (e.origin !== 'https://karte.teigelerundpartner.de') return;
  if (e.data && e.data.type === 'resize') {
    document.getElementById('stadtteil-karte').style.height = e.data.height + 'px';
  }
});
</script>
```

In Elementor: HTML-Widget einfügen, Code reinkopieren.
