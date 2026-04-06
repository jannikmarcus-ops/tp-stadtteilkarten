# Projekt-Briefing: Interaktive Stadtteil-Karte Hamburg

## Basis

Dieses Briefing baut auf der bereits fertigen Münster-Karte auf. Die Hamburg-Karte verwendet denselben Tech-Stack, dasselbe Branding und die gleiche UX. Alles was in der Münster-Karte funktioniert (Hover-Tooltips, Detail-Panel, Mobile Cards, Heatmap, Legende) wird 1:1 übernommen. Dieses Dokument beschreibt nur die Hamburg-spezifischen Unterschiede.

---

## 1. Was anders ist als bei Münster

**Mehr Stadtteile:** Hamburg hat 104 Stadtteile (vs. Münsters ~45). Wir zeigen 20 interaktive + ca. 15-20 als grauen Hintergrund. Der Rest bleibt unsichtbar (ausserhalb des Fokusgebiets).

**Komplexere Geografie:** Elbe, Alster (Binnen- und Aussenalster), Hafen. Diese Gewässer müssen als blaue Flächen sichtbar sein. Sie sind das wichtigste visuelle Erkennungsmerkmal. Bei Münster gab es keine Gewässer auf der Karte.

**Grössere Preisspanne:** 4.300-9.500 €/m² (vs. 2.600-6.100 in Münster). Die Heatmap braucht andere Stufen.

**Fokusgebiet:** Wir zeigen nicht ganz Hamburg. Der Fokus liegt auf den Kernbezirken Eimsbüttel, Hamburg-Nord, Altona, Wandsbek und Hamburg-Mitte. Harburg und Bergedorf sind ausserhalb des Fokus (keine T&P-Aktivität dort).

---

## 2. Die 20 interaktiven Stadtteile

### Priorität 1 (Kerngebiete, T&P aktiv)
1. Eimsbüttel – 7.000 €/m²
2. Eppendorf – 8.000
3. Winterhude – 8.000
4. Ottensen – 7.500
5. Barmbek-Süd – 6.500
6. Barmbek-Nord – 5.800
7. Hoheluft-Ost – 8.500
8. Hoheluft-West – 7.300
9. Stellingen – 5.500
10. Lokstedt – 6.000

### Priorität 2 (erweiterte Gebiete)
11. Blankenese – 7.200
12. Othmarschen – 7.500
13. Bahrenfeld – 5.900
14. Wandsbek – 5.000
15. Rahlstedt – 4.300
16. Bramfeld – 4.700
17. Eilbek – 5.700
18. Uhlenhorst – 8.800
19. Harvestehude – 9.500
20. St. Georg – 7.200

### Graue Hintergrund-Stadtteile (nicht interaktiv, füllen Lücken)
Altona-Altstadt, Altona-Nord, Sternschanze, Rotherbaum, Neustadt, St. Pauli, HafenCity, Hamm, Horn, Dulsberg, Steilshoop, Ohlsdorf, Alsterdorf, Groß Borstel, Niendorf, Schnelsen, Lurup, Osdorf, Nienstedten, Wellingsbüttel, Sasel, Poppenbüttel, Farmsen-Berne, Tonndorf, Jenfeld, Marienthal

---

## 3. Heatmap-Farbstufen Hamburg (angepasst)

Hamburg ist teurer als Münster. Die Stufen werden nach oben verschoben:

| Preisstufe | Farbe | Stadtteile |
|---|---|---|
| **9.000+ €/m²** | #052E26 (Dunkelgrün) | Harvestehude |
| **7.000-8.999** | #1A5C4A (Mittelgrün) | Eppendorf, Winterhude, Uhlenhorst, Hoheluft-Ost, Eimsbüttel, Blankenese, Ottensen, Othmarschen, Hoheluft-West, St. Georg |
| **5.000-6.999** | #3D8B6E (Hellgrün) | Barmbek-Süd, Lokstedt, Bahrenfeld, Barmbek-Nord, Eilbek, Stellingen, Wandsbek |
| **3.000-4.999** | #7CB89E (Mintgrün) | Bramfeld, Rahlstedt |
| **unter 3.000** | #C5DDD1 (Hellmint) | (keiner) |

---

## 4. SVG-Karte: Spezifische Anforderungen Hamburg

### Gewässer
Die Elbe, Binnen- und Aussenalster müssen als separate SVG-Pfade in **leichtem Blau** (#B8D4E3 oder ähnlich) dargestellt werden. Sie sind nicht klickbar, nicht interaktiv, aber visuell prominent. Die Alster ist DAS Erkennungsmerkmal. Ohne Alster erkennt niemand Hamburg.

### Empfohlene Vorgehensweise
Gleicher Ansatz wie Münster: GeoJSON von OpenStreetMap/Geofabrik für Hamburger Stadtteile holen, per mapshaper.org vereinfachen, in SVG konvertieren. Dann die 20 relevanten Stadtteile als interaktive Pfade, den Rest als Hintergrund.

Alternativ: Die bestehende Münster-SVG als Architektur-Vorlage nutzen und die Hamburg-Pfade einsetzen.

### Stadtgrenze
Hamburg hat eine markante Form: Die Elbe teilt die Stadt in Nord und Süd. Da wir nur den Norden zeigen (kein Harburg/Bergedorf), sollte die Elbe als natürliche Südgrenze fungieren. Kein harter Kartenrand im Süden, sondern die Elbe als visueller Abschluss.

### Viewbox
Empfehlung: 0 0 1000 800 (Hamburg ist breiter als hoch, anders als Münster das eher rund ist). Die Stadtteile im Westen (Blankenese) bis Osten (Rahlstedt) erstrecken sich über ca. 35 km.

---

## 5. Datenstruktur (JSON)

Gleiches Format wie Münster. Beispiel-Eintrag:

```json
{
  "id": "eimsbuettel",
  "name": "Eimsbüttel",
  "slug": "eimsbuettel",
  "bezirk": "Eimsbüttel",
  "priority": "kern",
  "prices": {
    "etwPerSqm": 7000,
    "housePerSqm": 7500,
    "rentPerSqm": 16.00,
    "trend": "steigend",
    "trendPercent": 3.0
  },
  "demographics": {
    "population": 57800,
    "areaSqKm": 3.2,
    "distanceCityKm": 3,
    "distanceCityMin": 10
  },
  "character": {
    "typicalBuildings": "Altbau-MFH, Gründerzeit",
    "targetGroups": ["Junge Berufstätige", "Familien", "Akademiker"],
    "image": "urban, szenig, akademisch",
    "isUpcoming": false,
    "shortProfile": "Hamburgs beliebtester Stadtteil. Gründerzeit-Altbauten, die Osterstrasse als Lebensader und U2-Anbindung in 10 Min. zum Jungfernstieg. Höchste Kita-Dichte der Stadt.",
    "detailPageUrl": null
  },
  "cta": {
    "text": "Was ist Ihre Immobilie in Eimsbüttel wert?",
    "url": "https://teigelerundpartner.de/immobilienbewertung-hamburg/"
  }
}
```

---

## 6. Unterschiede zum Münster-Panel

Im Detail-Panel (rechts bei Desktop-Klick) wird zusätzlich die **U/S-Bahn-Anbindung** angezeigt. In Münster gibt es keine U/S-Bahn. In Hamburg ist das ein zentrales Kaufkriterium.

Panel-Aufbau Hamburg:
- Stadtteil-Name + Bezirk
- Preis-Block: ETW, Haus, Miete (wie Münster)
- Preistrend mit Pfeil
- Einwohner, Fläche, Entfernung City
- **NEU: ÖPNV-Zeile** (z.B. "U2, U3 | 10 Min. zum Jungfernstieg")
- Kurz-Profil (2-3 Sätze)
- Gold-CTA: "Was ist Ihre Immobilie in [Stadtteil] wert?" → Link zu /immobilienbewertung-hamburg/

---

## 7. Mobile Card-Ansicht

Identisch zu Münster: Toggle "Liste | Karte", Cards sortierbar nach Preis/A-Z/Trend, Tap expandiert. Einziger Unterschied: Die Cards zeigen zusätzlich die ÖPNV-Anbindung als Icon oder Kurztext.

---

## 8. Deployment

Die Hamburg-Karte wird in derselben Vercel-App deployed wie Münster. Routing:
- `/muenster` → Münster-Karte (bestehend)
- `/hamburg` → Hamburg-Karte (neu)
- `/` → Startseite mit Toggle zwischen beiden Städten

In WordPress/Elementor wird eine separate Seite `immobilienpreise-hamburg` angelegt mit eigenem Iframe.

---

## 9. Acceptance Criteria (zusätzlich zu Münster-Checkliste)

- [ ] Elbe als blaue Fläche sichtbar
- [ ] Binnen- und Aussenalster als blaue Flächen sichtbar
- [ ] 20 interaktive Stadtteile korrekt positioniert
- [ ] Graue Hintergrund-Stadtteile füllen Lücken
- [ ] ÖPNV-Info im Detail-Panel sichtbar
- [ ] Routing `/hamburg` und `/muenster` funktioniert
- [ ] CTA verlinkt auf /immobilienbewertung-hamburg/

---

## 10. Referenzkarten

Für die geographische Genauigkeit der SVG-Pfade:
- hamburg.de Stadtteil-Karte (offizielle Bezirksgrenzen)
- Wikipedia "Liste der Bezirke und Stadtteile Hamburgs" (Übersichtskarte)
- OpenStreetMap Hamburg administrative boundaries (GeoJSON-Quelle)

---

## 11. Vollständige Datentabelle für JSON

| id | name | ETW | Haus | Miete | Einwohner | Fläche | Bezirk | ÖPNV | Trend |
|---|---|---:|---:|---:|---:|---:|---|---|---|
| eimsbuettel | Eimsbüttel | 7000 | 7500 | 16.00 | 57800 | 3.2 | Eimsbüttel | U2, U3 | steigend |
| eppendorf | Eppendorf | 8000 | 10000 | 18.00 | 25250 | 2.7 | Hamburg-Nord | U1, U3 | stabil |
| winterhude | Winterhude | 8000 | 10000 | 17.50 | 61000 | 7.6 | Hamburg-Nord | U1, U3, S1 | stabil |
| ottensen | Ottensen | 7500 | 8000 | 17.00 | 35000 | 2.9 | Altona | S1, S3 | steigend |
| barmbek-sued | Barmbek-Süd | 6500 | 7000 | 16.00 | 40000 | 3.1 | Hamburg-Nord | U3, S1 | stabil |
| barmbek-nord | Barmbek-Nord | 5800 | 5500 | 14.50 | 13600 | 3.2 | Hamburg-Nord | U3, S1 | steigend |
| hoheluft-ost | Hoheluft-Ost | 8500 | 9000 | 18.00 | 9800 | 0.6 | Hamburg-Nord | U3 | stabil |
| hoheluft-west | Hoheluft-West | 7300 | 8000 | 17.00 | 13600 | 0.7 | Eimsbüttel | U3 | stabil |
| stellingen | Stellingen | 5500 | 5500 | 14.00 | 28800 | 6.1 | Eimsbüttel | U2, S3 | steigend |
| lokstedt | Lokstedt | 6000 | 7000 | 15.00 | 31000 | 4.9 | Eimsbüttel | U2 | steigend |
| blankenese | Blankenese | 7200 | 8500 | 18.00 | 13500 | 8.3 | Altona | S1 | stabil |
| othmarschen | Othmarschen | 7500 | 9000 | 18.00 | 16500 | 5.9 | Altona | S1 | stabil |
| bahrenfeld | Bahrenfeld | 5900 | 6500 | 15.50 | 30000 | 10.9 | Altona | S1, S3 | steigend |
| wandsbek | Wandsbek | 5000 | 4800 | 13.00 | 37000 | 6.4 | Wandsbek | U1, S1 | stabil |
| rahlstedt | Rahlstedt | 4300 | 4800 | 13.00 | 92000 | 27.2 | Wandsbek | RB (S4 geplant) | seitwärts |
| bramfeld | Bramfeld | 4700 | 5000 | 13.50 | 54000 | 10.3 | Wandsbek | U5 (geplant) | steigend |
| eilbek | Eilbek | 5700 | 5500 | 15.50 | 22000 | 1.7 | Wandsbek | U1, S1 | stabil |
| uhlenhorst | Uhlenhorst | 8800 | 9500 | 18.00 | 17000 | 2.2 | Hamburg-Nord | U3 | stabil |
| harvestehude | Harvestehude | 9500 | 12000 | 20.00 | 17000 | 2.0 | Eimsbüttel | U1 | stabil |
| st-georg | St. Georg | 7200 | 8000 | 17.50 | 13000 | 1.8 | Hamburg-Mitte | U1-4, S1-3 | steigend |
