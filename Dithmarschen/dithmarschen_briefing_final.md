# BRIEFING: Kreis Dithmarschen Preiskarte

Hi Claude. Wir bauen die vierte interaktive Immobilienpreis-Karte für den **Kreis Dithmarschen**, analog zu Hamburg, Münster und Kreis Steinfurt. Die App auf Vercel ist bereits aufgebaut, ich brauche nur eine neue Route.

## Ziel

- **Route:** `/kreis-dithmarschen` in der bestehenden Vercel-App (konsistent mit `/kreis-steinfurt`)
- **Einbettung:** Iframe auf neuer Elementor-Seite `/immobilienpreise-dithmarschen/` auf teigelerundpartner.de
- **Umfang:** 23 Gemeinden im Kreis Dithmarschen

## Was du bekommst

Ich hänge an:
- `dithmarschen_orte_daten_final.json` mit allen 23 Orten (Preise, Tooltips, Kategorisierung, Heatmap-Stufen, alles ready to use)

**Bitte nimm die Werte aus der JSON 1:1 ohne eigene Validierung.** Die Daten sind bereits aus Mehrquellen-Recherche (ImmoScout24, Immowelt, Immoverkauf24, Gutachterausschuss) cross-validiert.

## Spezifik dieser Karte

**Zwei-Markt-Logik:** Der Kreis Dithmarschen hat Wohnimmobilien-Binnenmarkt und Ferienimmobilien-Küstenmarkt. Bitte einbauen:

1. **Marktsegment-Badge im Detail-Panel** pro Ort (Wohnimmobilien dominant, Industrie, Industrie/Pendler, Mixed, Ferienimmobilien)
2. **Küstenorte subtil hervorheben:** Büsum, Friedrichskoog, Büsumer Deichhausen, Wesselburenerkoog, Reinsbüttel mit dezentem Blau-Akzent im Rand oder Label
3. **Info-Kasten unter der Karte** mit kurzer Erklärung der Zwei-Markt-Logik (Text liefere ich mit, siehe unten)

Kein Toggle-Filter oben. Die Segmentierung geht über Badge und Info-Kasten.

## Heatmap-Skala (6 Stufen)

Basierend auf ETW-Preis:

- Stufe 1 (unter 1.800 Euro/qm): hellster Ton
- Stufe 2 (1.800 bis 2.099)
- Stufe 3 (2.100 bis 2.399)
- Stufe 4 (2.400 bis 2.899)
- Stufe 5 (2.900 bis 3.999)
- Stufe 6 (ab 4.000): dunkelster Ton

Die Stufe steht pro Ort in der JSON unter `heatmap_stufe`.

## GeoJSON

OpenStreetMap, Boundary-Tag `administrative`, Admin-Level 8 für Gemeinden. Falls Probleme mit einzelnen kleinen Orten (Volsemenhusen, Reinsbüttel, Büsumer Deichhausen, Wesselburenerkoog), fallback Geoportal Schleswig-Holstein.

## Branding (identisch zu den drei anderen Karten)

- Schrift: DM Sans
- Primärfarbe: #052E26
- Background: #F5F2F0
- Text: #333333
- Akzent/CTA: #B8860B

## Detail-Panel pro Ort

Wenn der Nutzer einen Ort klickt, zeigt das Panel:

1. Ortsname (H2)
2. Marktsegment (Badge)
3. Drei Preise nebeneinander: ETW Euro/qm, EFH Euro/qm, Grundstück Euro/qm
4. 12-Monats-Trend (mit Pfeil nach oben/unten/seitlich, Werte aus `trend_12m`)
5. Einwohnerzahl
6. Tooltip-Text (Absatz, aus JSON unter `tooltip`)
7. Käufergruppen (aus JSON unter `kaeufergruppen`)
8. Besonderheiten (Absatz, aus JSON unter `besonderheiten`)

## Info-Kasten unter der Karte

Bitte unter der Karte folgenden Info-Kasten einbauen (H3 plus zwei kurze Absätze):

**Überschrift:** Zwei Märkte in einem Kreis

**Text:**
Der Kreis Dithmarschen ist immobilienwirtschaftlich kein homogener Raum, sondern vereint zwei unterschiedliche Märkte. Im Binnenland dominieren Wohnimmobilien für Familien, Pendler und Eigennutzer mit moderaten Preisen zwischen 1.500 und 2.500 Euro pro Quadratmeter. Die Kreisstadt Heide und Industriestandorte wie Brunsbüttel sind hier die Zentren.

An der Nordseeküste entsteht durch Tourismus und Zweitwohnsitz-Nachfrage ein deutlich höheres Preisniveau. Büsum erreicht über 5.000 Euro pro Quadratmeter für Eigentumswohnungen, Friedrichskoog und Büsumer Deichhausen folgen mit Werten über 3.700 Euro. Diese Spaltung prägt Bewertung, Vermarktung und Zielgruppe jeder Immobilie im Kreis.

## Texte durchgängig

**Wichtig:** In allen Texten, Seitentiteln, Meta-Daten und Überschriften durchgängig "Kreis Dithmarschen" verwenden, nicht nur "Dithmarschen". Also zum Beispiel:
- H1: "Immobilienpreise im Kreis Dithmarschen"
- Seitentitel: "Immobilienpreise Kreis Dithmarschen 2026"
- Meta-Description: "Aktuelle Quadratmeterpreise für 23 Orte im Kreis Dithmarschen..."

## Akzeptanzkriterien

- 23 Gemeinden sichtbar und klickbar
- Heatmap zeigt Preisgradient von Stufe 1 bis 6 korrekt
- Detail-Panel erscheint rechts (Desktop) oder unten (Mobile)
- Küstenorte subtil visuell hervorgehoben
- Info-Kasten unter der Karte mit Zwei-Markt-Erklärung
- Responsive auf Mobile
- Ladezeit unter 2 Sekunden
- Deploy auf Vercel unter `/kreis-dithmarschen`

## Deadline

Gleiche Geschwindigkeit wie Kreis Steinfurt (2 Tage), kein Stress aber gerne zügig.
