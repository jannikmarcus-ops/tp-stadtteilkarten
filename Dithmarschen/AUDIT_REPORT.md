# Audit-Report: Kreis Dithmarschen Karte

**Datum:** 2026-04-26
**Vergleich:** Aktuelle App-Karte vs. Wikipedia-Referenz `dithmarschen-referenzkarte-aemter.png`

## Visueller Vergleich

- Referenz: `dithmarschen-referenzkarte-aemter.png` (Wikipedia, Ämter-Übersicht)
- Aktueller Stand: `screenshots/audit-current.png`

## A) Gemeinde-Polygone

Die 23 ausgewählten Gemeinden liegen positional korrekt. Polygon-Größenverteilung
ist in `geojson` valide (Brunsbüttel und Friedrichskoog am größten, Büsumer
Deichhausen und Lunden am kleinsten — passt zur Realität).

| Gemeinde | Befund | Schwere |
|----------|--------|---------|
| Marne | Polygon klein, wirkt als Splitter neben Friedrichskoog. Geographisch jedoch korrekt: Stadtgemeinde Marne ist wirklich klein, der "große pinke Bereich" in der Referenz ist das Amt Marne-Nordsee (mehrere Gemeinden, die wir nicht zeigen). | niedrig |
| Reinsbüttel | Position links Mitte korrekt, Größe plausibel | – |
| Wesselburenerkoog | Position links oben korrekt | – |
| Volsemenhusen | Position links unten korrekt | – |
| Friedrichskoog | Großes Polygon, Position unten links — entspricht Referenz | – |
| Lunden | Im Norden, korrekt als Exklave nördlich der Eider — entspricht Referenz | – |
| Büsumer Deichhausen | Polygon winzig, Label überlappt mit Büsum (siehe D) | mittel |

## B) Wasserflächen und Geografie

| Element | Aktueller Stand | Sollzustand laut Referenz | Schwere |
|---------|-----------------|---------------------------|---------|
| Nordsee-Küstenlinie | Wasserstreifen links neben Büsum-Halbinsel sichtbar | Korrekt, plus Wattenmeer-Eindruck | niedrig |
| **Nord-Ostsee-Kanal** | **Fehlt komplett** | Prominente blaue Linie im Süd-Osten, fließt durch Brunsbüttel als Mündung | **hoch** |
| Eider | Wasservorsprung oben rechts/mittig sichtbar (geographisch korrekt: Eider-Mündung) | Schmaler Fluss zwischen Lunden-Bereich und Nordfriesland | mittel |
| Wasserfläche oben rechts | Erscheint als großes Dreieck zwischen Dithmarschen und Nordfriesland | Tatsächlich Eider-Bucht plus Übergang zu Schleswig-Flensburg | mittel |
| Elbe als Südgrenze | Wasserstreifen unten sichtbar mit "Elbe"-Label | Korrekt | – |

## C) Kreisgrenzen

| Kreis | Aktueller Stand | Sollzustand laut Referenz | Schwere |
|-------|-----------------|---------------------------|---------|
| Nord (Nordfriesland) | Vorhanden, mit gestrichelter Grenze | Korrekt | – |
| **Nordost (Schleswig-Flensburg)** | **Fehlt komplett** | Vorhanden in Referenz, oben rechts | **hoch** |
| Ost (Rendsburg-Eckernförde) | Vorhanden | Korrekt | – |
| Süd (Steinburg) | Vorhanden | Korrekt | – |
| Grenzverlauf zu Nordfriesland | Naht teilweise sichtbar (40px Filler) | Sollte durch Eider-Fluss verlaufen | mittel |

## D) Beschriftungen

| Element | Aktueller Stand | Sollzustand | Schwere |
|---------|-----------------|-------------|---------|
| "Eider"-Label | Sitzt oben mittig, auf Wasserdreieck | OK | – |
| "Nordsee"-Label | Sitzt links unten neben Friedrichskoog | OK | – |
| "Elbe"-Label | Sitzt unten | OK | – |
| **Nord-Ostsee-Kanal-Label** | **Fehlt** | Sollte unten rechts beim Kanal stehen | hoch (mit Kanal-Linie) |
| Kreis Nordfriesland | Sitzt oben mittig auf #F5F2F0 (Nachbar) | Korrekt | – |
| Rendsburg-Eckernförde | Vertikal rechts, auf #F5F2F0 | Korrekt | – |
| Kreis Steinburg | Vertikal rechts unten, auf #F5F2F0 | Korrekt | – |
| Kreis Schleswig-Flensburg | Fehlt | Sollte oben rechts erscheinen | hoch |
| Büsum / Büsumer Deichhausen | Leader-Line bereits implementiert, Label noch sehr klein und schwer lesbar im Iframe | Klare Trennung beider Labels | mittel |

## Bekannte Fixes aus vorheriger Runde

| # | Fix | Schwere |
|---|-----|---------|
| 1 | Blau-Akzent zurück auf Büsum/Deichhausen/Friedrichskoog/Wesselburenerkoog (Reinsbüttel ohne) | mittel |
| 2 | Büsumer Deichhausen Leader-Line (bereits umgesetzt, aber Label evtl. schwer lesbar) | niedrig (verifizieren) |
| 3 | Tabelle Meldorf: graues Pill-Element zwischen ETW und Haus muss raus | hoch (Daten-Render-Bug) |
| 4 | Trend-Pfeil: > 0 grün ↗ / < 0 rot ↘ / = 0 grau →. Lunden +0,4% zeigt aktuell fälschlich orange ↔ | mittel |
| 5 | "Burg" überall einheitlich "Burg in Dithmarschen" | niedrig |

## Priorisierung der Fixes

### Hoch (Go-Live blockierend)

1. **Nord-Ostsee-Kanal hinzufügen** als blaue Linie im Süd-Osten (geografische Vollständigkeit)
2. **Kreis Schleswig-Flensburg** als zusätzlicher Nachbarkreis aufnehmen (Nordost-Grenze fehlt)
3. **Kreis-Schleswig-Flensburg-Label** ergänzen
4. **Tabellen-Bug Meldorf**: graues Pill-Element zwischen ETW und Haus untersuchen und entfernen

### Mittel (kosmetisch, sollte gefixt werden)

5. Eider-Naht visuell sauberer (mit Schleswig-Flensburg-Polygon evtl. automatisch besser)
6. Trend-Pfeil-Logik vereinfachen (Schwellwerte raus)
7. Blau-Akzent für 4 echte Küstenorte wiederherstellen
8. Büsumer Deichhausen Label besser lesbar (Schriftgröße prüfen)

### Niedrig (optional)

9. "Burg" → "Burg in Dithmarschen" durchgängig (auch in Tabelle und Card)
10. Marne-Polygon-Größe akzeptieren als geografisch korrekt

## Geoportal-SH-Alternative

Die Polygon-Daten aus OSM (Overpass) sind funktional korrekt. Marne wirkt nur klein,
weil das Stadtpolygon real klein ist — kein OSM-Datenfehler. Ein Wechsel auf
Geoportal-SH ist nicht nötig.

## Plan für Umsetzung

1. Nord-Ostsee-Kanal als manuelle SVG-Linie zwischen Brunsbüttel und Steinburg-Grenze
2. Kreis Schleswig-Flensburg über Overpass nachfetchen, in Geography-GeoJSON ergänzen
3. Tabellen-Render-Bug debuggen (PriceTable Inspektion)
4. Trend-Logik in `TrendArrow.jsx` und `parseTrend()` vereinfachen
5. COASTAL_IDS in beiden Skripten zurück auf 4 Orte
6. Naming "Burg" überall harmonisieren (Daten-JSON, Label, Tabelle)

Kommittierung in 4 logischen Einheiten.
