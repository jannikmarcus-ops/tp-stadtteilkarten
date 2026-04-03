# CLAUDE.md — Interaktive Stadtteil-Karte Münster

## Projekt

Interaktive SVG-Stadtteil-Karte für Teigeler & Partner Immobilien (teigelerundpartner.de). Zeigt Immobilienpreise aller 18 Münsteraner Viertel als klickbare Heatmap. Wird per Iframe in die WordPress/Elementor-Website eingebettet.

**Auftraggeber:** Jannik Marcus, Geschäftsführer Teigeler & Partner Immobilien
**Zweck:** Eigentümer-Akquise. Eigentümer sollen sehen was ihre Immobilie wert sein könnte und dann eine Bewertung anfragen.
**Ziel-URL:** karte.teigelerundpartner.de (Subdomain, CNAME auf Vercel)

## Tech-Stack

- **Framework:** Vite + React
- **Styling:** Tailwind CSS
- **Animationen:** Framer Motion oder CSS Transitions (kein GSAP nötig für dieses Projekt)
- **Daten:** Statisches JSON (`src/data/districts.json`), kein Backend
- **Hosting:** Vercel
- **Einbettung:** Iframe in WordPress/Elementor

## Branding (exakt einhalten)

- **Schrift:** DM Sans (Google Fonts, lokal hosten als WOFF2)
- **Primärfarbe:** #052E26 (Dunkelgrün)
- **Hintergrund:** #F5F2F0 (Warmbeige)
- **Text:** #333333
- **Akzent/CTA:** #B8860B (Gold)
- **Preis-Heatmap (5 Stufen):**
  - 6.000+ €/m²: #052E26 (Dunkelgrün, Premium)
  - 5.000–5.999: #1A5C4A
  - 4.000–4.999: #3D8B6E
  - 3.000–3.999: #7CB89E
  - unter 3.000: #C5DDD1

## Architektur

```
src/
  components/
    Map/
      DistrictMap.jsx        # SVG-Karte mit allen 18 Vierteln
      DistrictPath.jsx       # Einzelner klickbarer Bezirk-Pfad
      MapLegend.jsx          # Preisstufen-Legende unter der Karte
      MapTooltip.jsx         # Hover-Tooltip (Name, Preis, Trend)
      DetailPanel.jsx        # Klick-Panel mit allen Daten + CTA
    Mobile/
      CardView.jsx           # Mobile Card-Ansicht
      DistrictCard.jsx       # Einzelne Card pro Viertel
      SortControls.jsx       # Sortier-Buttons (Preis, A-Z, Trend)
      ViewToggle.jsx         # Toggle Karte / Liste
    shared/
      TrendArrow.jsx         # Trend-Pfeil-Komponente (steigend/stabil/fallend)
      PriceFormatter.jsx     # Preis-Formatierung (z.B. "6.100 €/m²")
      Footer.jsx             # Quellenangabe + Datenstand
  data/
    districts.json           # Alle 18 Viertel mit Preisen, Profilen, CTAs
  hooks/
    useDistrict.js           # State-Management für ausgewähltes Viertel
    useMediaQuery.js         # Responsive Breakpoint-Hook
  assets/
    fonts/                   # DM Sans WOFF2 lokal
  App.jsx                    # Hauptkomponente mit Responsive-Switch
  main.jsx                   # Entry Point
  index.css                  # Tailwind Base + Custom Styles
```

## SVG-Karte: Wichtigste Anforderung

Die Karte ist das Herzstück. Sie muss:
1. Alle 18 Viertel als separate `<path>`-Elemente mit `id` passend zum JSON enthalten
2. Geographisch erkennbar sein (Münster hat eine grob kreisförmige Stadtgrenze mit dem Dom im Zentrum)
3. Die restlichen Münsteraner Stadtfläche als hellgraue (#E8E4E0) nicht-klickbare Hintergrundfläche zeigen
4. Die Stadtgrenze sichtbar darstellen
5. Viertel-Labels (Namen) innerhalb oder neben den Flächen platzieren

**IDs in der SVG müssen exakt dem `id`-Feld im JSON entsprechen:**
altstadt-dom, kreuzviertel, pluggendorf, hafen-zentrum, sentrup, aaseestadt, mauritz, gievenbeck, gremmendorf, hiltrup, kinderhaus, coerde, roxel, wolbeck, nienberge, handorf, angelmodde, amelsbueren

### Geographische Positionierung (Viewbox 0 0 800 900)

Münster hat eine grob kreisförmige Stadtgrenze (ca. 20km Durchmesser). Der Dom/Altstadt liegt leicht nördlich der Mitte. Die Innenstadt ist kompakt, die Außenviertel sind flächenmäßig sehr groß.

**Ungefähre Zentroid-Positionen (x, y in der Viewbox):**

ZENTRUM (kleine, kompakte Flächen):
- altstadt-dom: (400, 320) - Exaktes Zentrum, sehr kleine Fläche
- kreuzviertel: (355, 345) - Direkt westlich der Altstadt, klein
- pluggendorf: (370, 295) - Nördlich/nordwestlich der Altstadt, sehr klein
- hafen-zentrum: (420, 270) - Nördlich der Altstadt am Dortmund-Ems-Kanal, klein

INNERER RING (mittelgroße Flächen):
- sentrup: (310, 380) - Südwestlich, erstreckt sich zum Aasee
- aaseestadt: (330, 340) - Westlich, am Aasee
- mauritz: (480, 360) - Östlich der Altstadt, relativ groß
- gievenbeck: (240, 310) - Weit westlich

ÄUSSERER RING UND RANDGEBIETE (große Flächen):
- kinderhaus: (380, 200) - Nördlich
- coerde: (460, 220) - Nordöstlich
- gremmendorf: (500, 480) - Südöstlich
- hiltrup: (370, 620) - Weit südlich, sehr groß
- roxel: (150, 330) - Weit westlich, sehr groß
- wolbeck: (540, 580) - Weit südöstlich, sehr groß
- nienberge: (250, 170) - Nordwestlich, sehr groß
- handorf: (600, 350) - Weit östlich, sehr groß
- angelmodde: (490, 540) - Südöstlich, zwischen Gremmendorf und Wolbeck
- amelsbueren: (260, 620) - Weit südwestlich, flächenmäßig der größte

### Nachbarschafts-Beziehungen (für korrekte Grenzen)

- altstadt-dom grenzt an: kreuzviertel (W), pluggendorf (NW), hafen-zentrum (N), mauritz (E), sentrup (SW), aaseestadt (W)
- kreuzviertel grenzt an: altstadt-dom (E), pluggendorf (N), aaseestadt (W), sentrup (S)
- gievenbeck grenzt an: roxel (W), nienberge (N), aaseestadt (E), sentrup (SE)
- hiltrup grenzt an: amelsbueren (W), angelmodde (NE), Stadtgrenze (S)
- kinderhaus grenzt an: nienberge (W), coerde (E), hafen-zentrum (S)
- coerde grenzt an: kinderhaus (W), handorf (E), mauritz (S)
- handorf grenzt an: coerde (NW), mauritz (W), gremmendorf (SW), wolbeck (S), Stadtgrenze (E)

### SVG-Erstellungsstrategie

1. Zeichne zuerst die äußere Stadtgrenze als grob kreisförmigen Pfad (leicht elliptisch, nordsüdlich gestreckt)
2. Teile die Fläche in die 18 interaktiven Viertel basierend auf den Zentroid-Positionen und Größenverhältnissen
3. Die Zentrumsviertel (altstadt-dom, kreuzviertel, pluggendorf, hafen-zentrum) sind SEHR KLEIN im Vergleich zu den Randvierteln
4. Die Randviertel (amelsbueren, handorf, nienberge, wolbeck, roxel, hiltrup) füllen den Großteil der Fläche
5. Restfläche (nicht den 18 zugeordnet) als zusammenhängende graue Hintergrundfläche
6. Stil: Leicht stilisiert/vereinfacht ist OK. Keine perfekte OSM-Genauigkeit nötig. Muss aber geographisch erkennbar sein.
7. Kanten sollen leicht abgerundet wirken (nicht pixelig), Stroke zwischen Vierteln: #D1CDC9, 1px

### SVG-Struktur
```svg
<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
  <!-- Stadtgrenze / Hintergrund -->
  <path class="city-boundary" d="..." fill="#E8E4E0" stroke="#D1CDC9" stroke-width="2" />
  
  <!-- Interaktive Viertel (farbig nach Preisstufe) -->
  <g class="interactive-districts">
    <path id="altstadt-dom" d="..." />
    <path id="kreuzviertel" d="..." />
    <!-- ... alle 18 -->
  </g>
  
  <!-- Labels -->
  <g class="district-labels" font-family="DM Sans" font-size="11" fill="#333">
    <text x="400" y="320" text-anchor="middle">Altstadt</text>
    <!-- ... -->
  </g>
</svg>
```

## Interaktionen

### Desktop (>= 768px)
- **Hover:** Viertel aufhellen (opacity 0.85), Tooltip fade-in (200ms) mit Name, ETW-Preis, Trend-Pfeil, typische Objektart
- **Klick:** Karte dimmt, Detail-Panel schiebt von rechts rein (300ms ease-out). Panel zeigt: alle Preise, Demographics, Kurzprofil, CTA-Button zur Bewertungsseite, Link zur Detail-Seite (wenn vorhanden)
- **Panel schließen:** X-Button oder Klick außerhalb

### Desktop >= 1024px
- Panel neben der Karte (Side Panel), kein Overlay

### Mobile (< 768px)
- **Default:** Card-Ansicht (nicht Karte)
- **Toggle oben:** "Karte | Liste"
- **Cards:** Viertel-Name, ETW-Preis, Trend, Kurzprofil (1 Satz)
- **Sortierung:** Preis absteigend, A-Z, Trend (stärkster Anstieg zuerst)
- **Tap auf Card:** Expandiert mit allen Daten + CTA
- **Karte auf Mobile:** Optional zoombar (pinch), nicht Default

## Animationen

- Karten-Load: Viertel staggered fade-in (30ms Delay pro Viertel)
- Hover-Tooltip: Fade-in 200ms
- Panel-Slide: 300ms ease-out von rechts
- Farbwechsel Hover: 150ms CSS transition
- Card-Expand: 200ms ease-out
- Keine Gimmicks. Alles dient der Orientierung.

## Performance-Ziele

- Lighthouse Performance: > 90
- LCP: < 1,5s
- CLS: < 0,05
- INP: < 100ms
- SVG lazy-loaded falls below-the-fold, Tooltips on-demand gerendert
- DM Sans als WOFF2 lokal hosten, font-display: swap
- Kein jQuery, kein Bootstrap, kein MUI

## Iframe-Kommunikation

Die App wird per Iframe in WordPress eingebettet. Dafür:
- `postMessage` für dynamische Höhenanpassung (Iframe wächst mit Content)
- Keine externen Navigationsänderungen (Links öffnen in `_parent` oder `_blank`)
- CTA-Links (`teigelerundpartner.de/immobilienbewertung-muenster/`) öffnen mit `target="_parent"`
- CORS-Headers sind in `vercel.json` konfiguriert (frame-ancestors erlaubt teigelerundpartner.de)
- `vercel.json` liegt im Repo-Root und muss bei Deployment mitgenommen werden

## Schrift-Strategie

DM Sans als primäre Schrift. Fallback: system-ui, -apple-system, sans-serif.
- DM Sans von Google Fonts herunterladen (Regular 400, Medium 500, Bold 700)
- Als WOFF2 lokal einbinden unter src/assets/fonts/
- In index.css per @font-face laden mit font-display: swap
- Falls DM Sans nicht geladen werden kann, muss der Fallback optisch funktionieren (keine kaputten Layouts)

## Daten-Aktualisierung

Quartalsweise manuelles Update:
1. `src/data/districts.json` editieren (Preise, Trends aktualisieren)
2. `meta.lastUpdated` und `meta.quarter` anpassen
3. Git push → Vercel deployed automatisch

## Was dieses Projekt NICHT ist

- Kein CMS-Anbindung, kein Backend, keine API
- Keine Benutzer-Accounts oder Login
- Kein Passwortschutz
- Die React-App selbst braucht kein SEO (läuft im Iframe). SEO passiert auf der WordPress-Seite drumherum.
- Die Stadtteil-Detail-Seiten (z.B. stadtteil-muenster-kreuzviertel) sind ein separates Projekt in WordPress/Elementor

## Wettbewerber (Referenz, nicht kopieren)

- Heimathafen Münster: https://www.heimathafen-immo.de/stadtteilwissen — Hat SVG-Karte, aber keine Marktdaten
- David & Jacques Hamburg: https://www.david-jacques.de/ — Hat Daten, aber generisches OpenStreetMap-Design

Wir machen beides besser: Magazin-Look + harte Daten + Conversion-CTA.

## Code-Stil

- Funktionale React-Komponenten mit Hooks
- Keine Klassen-Komponenten
- Tailwind für Styling, keine CSS-in-JS-Libraries
- Kommentare auf Deutsch (Jannik liest den Code)
- Keine console.log im Production-Build
- ESLint aktiv

## Formatierungsregel (gilt für allen Text in der App)

NIEMALS Gedankenstriche (–, —) als Satzzeichen verwenden. Punkte, Doppelpunkte oder neue Sätze stattdessen. Bindestriche in Komposita (Stadtteil-Karte) und Zahlenbereiche (3.000–3.999) sind ok.
