# Claude Code: Initialer Prompt für Stadtteil-Karte Münster

## Prompt 1: Projekt initialisieren

Kopiere diesen Prompt in Claude Code nachdem du das Repo erstellt und die Dateien (CLAUDE.md, districts.json) eingefügt hast:

---

Lies zuerst die CLAUDE.md im Projekt-Root. Das ist dein vollständiges Briefing.

Dann initialisiere das Projekt:

1. Vite + React Setup (falls noch nicht geschehen)
2. Tailwind CSS installieren und konfigurieren
3. DM Sans als WOFF2 herunterladen und lokal einbinden (Regular 400, Medium 500, Bold 700)
4. districts.json nach src/data/ verschieben
5. Grundlegende Projektstruktur anlegen wie in CLAUDE.md beschrieben
6. Tailwind Config mit den Branding-Farben:
   - primary: #052E26
   - background: #F5F2F0
   - text: #333333
   - accent: #B8860B
   - Heatmap-Farben als eigene Klassen

Noch NICHT mit der Karte anfangen. Erst das Fundament.

---

## Prompt 2: SVG-Karte erstellen

---

Jetzt die SVG-Karte. Das ist die Kernaufgabe. Lies zuerst den Abschnitt "SVG-Karte: Wichtigste Anforderung" in der CLAUDE.md komplett durch. Dort stehen die exakten Zentroid-Positionen, Nachbarschafts-Beziehungen und die Viewbox-Vorgaben.

Erstelle eine SVG-Karte aller Münsteraner Viertel als React-Komponente (src/components/Map/MuensterSVG.jsx).

Regeln:
1. Viewbox: 0 0 800 900
2. Zuerst die äußere Stadtgrenze als leicht elliptischen Pfad (nordsüdlich gestreckt)
3. Dann die 18 interaktiven Viertel als separate <path>-Elemente mit den IDs aus der CLAUDE.md
4. Die Zentrum-Viertel (altstadt-dom, kreuzviertel, pluggendorf, hafen-zentrum) sind SEHR KLEIN. Die Rand-Viertel (amelsbueren, handorf, nienberge, wolbeck, roxel, hiltrup) füllen den Großteil der Fläche.
5. Nutze die Zentroid-Positionen aus der CLAUDE.md als Mittelpunkte
6. Nutze die Nachbarschafts-Beziehungen um sicherzustellen dass angrenzende Viertel gemeinsame Kanten haben
7. Restfläche (nicht den 18 zugeordnet) als zusammenhängende graue Hintergrundfläche (#E8E4E0)
8. Stroke zwischen Vierteln: #D1CDC9, 1px
9. Viertel-Labels als <text>-Elemente. Kleine Viertel bekommen kürzere Labels (z.B. "Altstadt" statt "Altstadt/Dom")

Die Karte muss geographisch erkennbar sein, darf aber stilisiert/vereinfacht sein. Keine Pixel-Perfektion nötig. Hauptsache die relative Lage stimmt und die Größenverhältnisse sind plausibel.

Speichere auch eine Standalone-Version als src/assets/muenster-map.svg.

---

## Prompt 3: Karten-Interaktivität

---

Baue die Interaktivität auf die SVG-Karte:

DESKTOP (>= 768px):
1. Hover auf Viertel: opacity auf 0.85, Tooltip erscheint (200ms fade-in) mit:
   - Viertel-Name (DM Sans Bold)
   - ETW-Preis: z.B. "6.100 €/m²"
   - Trend-Pfeil: ↗ steigend / → stabil / ↘ fallend + Prozent
   - Typische Objektart (aus character.typicalBuildings)
   Tooltip positioniert sich intelligent (folgt nicht dem Cursor, steht neben dem Viertel, flippt wenn am Rand)

2. Klick auf Viertel: 
   - Karte bekommt leichten Dim-Overlay
   - Detail-Panel schiebt von rechts rein (300ms ease-out)
   - Ab 1024px: Panel neben der Karte als Sidebar, nicht als Overlay
   - Panel-Inhalt:
     * Viertel-Name als Headline
     * Preisblock: ETW €/m², Haus €/m², Miete €/m² (aus districts.json)
     * Trend mit Pfeil und Prozent
     * Einwohner, Fläche, Entfernung City
     * Kurzprofil (2-3 Sätze aus character.shortProfile)
     * CTA-Button: Gold (#B8860B), Text aus cta.text, Link aus cta.url, target="_parent"
     * Stadtteil-Guide Link (nur wenn character.detailPageUrl nicht null)
   - Schließen per X-Button oder Klick außerhalb

3. Legende unter der Karte mit den 5 Preisstufen (farbige Quadrate + Labels)

4. Footer: "Daten: ImmoScout24, immowelt, Gutachterausschuss Münster. Stand: Q1/2026"

ANIMATIONEN:
- Page Load: Viertel staggered fade-in (30ms Delay pro Viertel, von Zentrum nach außen)
- Alle Transitions smooth, keine Gimmicks

---

## Prompt 4: Mobile Card-Ansicht

---

Baue die Mobile-Ansicht (< 768px):

1. Toggle oben: "Karte | Liste" als Pill-Toggle. Default: Liste.

2. CARD-ANSICHT (Default):
   - Sortier-Buttons: "Preis ↓" (default), "A–Z", "Trend"
   - Jede Card zeigt: Viertel-Name, farbiger Punkt (Heatmap-Farbe), ETW-Preis, Trend-Pfeil
   - Tap expandiert die Card mit: alle Preise, Demographics, Kurzprofil, CTA-Button
   - Smooth expand/collapse Animation (200ms)
   - Nur eine Card gleichzeitig expanded

3. KARTEN-ANSICHT (Toggle):
   - Gleiche SVG-Karte, aber zoombar (pinch-to-zoom)
   - Tap auf Viertel öffnet Bottom Sheet (nicht Side Panel) mit gleichen Daten wie Desktop-Panel
   - Bottom Sheet: Slide-up von unten, 60% Höhe, swipe-to-dismiss

4. Responsive-Switch: useMediaQuery Hook mit 768px Breakpoint

---

## Prompt 5: Polish und Performance

---

Finaler Feinschliff:

1. PERFORMANCE:
   - Lighthouse Score checken und auf 90+ optimieren
   - SVG-Pfade vereinfachen wenn nötig (weniger Punkte)
   - DM Sans: nur Gewichte 400, 500, 700 laden
   - Keine unnötigen Re-Renders (React.memo für DistrictPath)
   - Tooltip lazy rendern (nur wenn gehovert)

2. IFRAME-INTEGRATION:
   - postMessage für dynamische Höhenanpassung implementieren
   - Alle externen Links (CTA) mit target="_parent"
   - Kein eigener Scroll innerhalb der App (der Iframe soll die volle Höhe haben)
   - ResizeObserver für automatische Höhenanpassung

3. POLISH:
   - Focus-States für Keyboard-Navigation (Accessibility)
   - aria-labels auf interaktive SVG-Elemente
   - Escape-Taste schließt Panel
   - Touch-Feedback auf Mobile (active states)
   - Smooth scroll to expanded card auf Mobile

4. BUILD:
   - Vite Build optimieren
   - Vercel-Config (vercel.json) mit Cache-Headers für statische Assets
   - README.md mit Deployment-Anleitung

---

## Prompt 6: Deployment vorbereiten

---

Deployment-Setup:

1. Prüfe die vorhandene vercel.json im Repo-Root:
   - CORS-Headers müssen teigelerundpartner.de als frame-ancestors erlauben
   - Cache-Headers für statische Assets (1 Jahr)
   - Falls etwas fehlt, ergänzen

2. Erstelle README.md mit:
   - Projekt-Beschreibung (1 Absatz)
   - Tech-Stack
   - Lokale Entwicklung: npm install, npm run dev
   - Deployment: git push → Vercel auto-deploy
   - Daten-Aktualisierung: Welche Datei editieren, welche Felder ändern, Beispiel
   - Iframe-Einbettung: HTML-Snippet für WordPress/Elementor (mit postMessage-Script für Höhenanpassung)

3. Prüfe dass der Build fehlerfrei durchläuft: npm run build
