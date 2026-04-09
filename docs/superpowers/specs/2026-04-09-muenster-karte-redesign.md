# Münster-Karte Redesign: Detailgetreue Grenzen + Hafen-Korrektur

## Ziel

Die Münster-Stadtteilkarte soll geographisch korrektere, natürlich wirkende Grenzen bekommen. Der Hafen wird an die richtige Position verschoben.

## Änderungen

### 1. Hafen-Position korrigieren

**Ist:** Nordöstlich der Altstadt (zwischen C2/C3/C4/CX).
**Soll:** Nördlich der Altstadt, westlich von Coerde, am Dortmund-Ems-Kanal. Liegt zwischen Pluggendorf (W), Kinderhaus (N) und Altstadt (S).

Auswirkung auf Nachbarn: Pluggendorf, Kinderhaus und Altstadt bekommen angepasste Grenzen.

### 2. Bezier-Kurven statt gerader Linien

- Alle Stadtteil-Pfade werden als SVG-Pfad-Strings mit Cubic-Bezier-Kurven (`C`-Commands) definiert
- Statt `pts2path()` mit 5-8 Punkten pro Stadtteil: 20-40 Kontrollpunkte mit Bezier-Kurven
- Die `pts2path()`-Hilfsfunktion entfällt. Pfade werden direkt als `d`-Strings gespeichert.
- Gemeinsame Knotenpunkte (B, N1-N5, K1-K4, C1-CX, S1-S18) werden durch die neuen Pfad-Strings ersetzt

### 3. Stadtgrenze realistischer

Referenzbilder zeigen:
- Handorf: ausgeprägte Ost-Nase
- Roxel/Albachten: kantigere Westseite
- Amelsbüren: breite Südausdehnung
- Sprakel/Gelmer: unregelmäßige Nordkante
- Gesamtform: unregelmäßiges Polygon, NICHT kreisförmig

### 4. Proportionen anpassen

- Zentrumsviertel bleiben kompakt (Altstadt, Kreuz, Pluggendorf, Hafen)
- Außenviertel bekommen realistischere Flächenverhältnisse laut Referenzbildern

## Was sich NICHT ändert

- Alle 26 Stadtteil-IDs bleiben identisch
- `INTERACTIVE_IDS` Set bleibt gleich
- `getDistrictColor()` Logik bleibt gleich
- `DistrictPath` memo-Komponente bleibt gleich
- Farbskala, Hover-Effekte, Stagger-Animation bleiben gleich
- Export-Interface (`PATHS`, `DISTRICT_LABELS`, `CITY_BOUNDARY`) bleibt gleich
- Label-Positionen werden an neue Grenzen angepasst

## Betroffene Datei

`src/components/Map/MuensterSVG.jsx` (einzige Datei)

## Datenstruktur nach Redesign

```js
// Vorher:
const ALL_DISTRICTS = [
  { id: 'pluggendorf', pts: [C1, C2, CX, C8] },
  ...
]
const PATHS = ALL_DISTRICTS.map(d => ({ id: d.id, path: pts2path(d.pts), ... }))

// Nachher:
const ALL_DISTRICTS = [
  { id: 'pluggendorf', path: 'M328,275 C335,268 ... Z' },
  ...
]
// pts2path() entfällt, PATHS nutzt direkt die path-Strings
```

## Referenzmaterial

- `reference-1.png`: Detaillierte Stadtteilgrenzen mit Labels
- `reference-2.png`: Nummerierte Viertel mit Stadtgrenze (Münsterland-Karte)
- `reference-3.png`: Dunkle Karte mit nummerierten Vierteln, gute Proportionen

## Validierung

- Visueller Abgleich mit allen drei Referenzbildern
- Hafen liegt nördlich der Altstadt, nicht nordöstlich
- Keine Lücken zwischen Stadtteilen
- Alle 26 IDs vorhanden und klickbar
- Labels lesbar und korrekt positioniert
- App startet ohne Fehler (`npm run dev`)
