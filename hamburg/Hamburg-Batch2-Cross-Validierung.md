# Cross-Validierung Hamburg Batch 2: 24 Stadtteile (Ost + Südost)

## Reports

- **R1:** Claude Extended Search. Median aus immowelt, E&V, IS24. Vollständigste Daten.
- **R2:** ChatGPT Deep Research. ImmoScout/ImmoPortal. Tabelle kompakt.
- **R3:** ChatGPT detailliert. Breite Quellenabdeckung, viele Schätzungen bei Randstadtteilen.

## Methodische Beobachtung Batch 2

Deutlich schwierigere Datenlage als Batch 1. Die City-Stadtteile (HafenCity, Altstadt, Neustadt) haben extreme Spreizung durch Neubau-Bias. Die Randgebiete (Moorfleet, Billwerder, Allermöhe) haben kaum Transaktionen. R1 ist durchgehend am konservativsten, R3 tendenziell am höchsten (viele Schätzungen).

---

## Finale konsolidierte ETW-Preise (Angebotspreise)

| Nr | Stadtteil | R1 | R2 | R3 | **Final** | Begründung |
|---|---|---:|---:|---:|---:|---|
| 1 | Wohldorf-Ohlstedt | 5.015 | 5.406 | 5.800 | **5.400** | R2 als Mittelwert. R1 konservativ, R3 Schätzung hoch. |
| 2 | Steilshoop | 4.680 | 3.864 | 4.277 | **4.300** | R2 sehr niedrig (Rohdaten). R1/R3 eng. Mittelwert R1/R3. |
| 3 | Dulsberg | 5.300 | 4.988 | 5.364 | **5.200** | R1/R3 eng. R2 etwas niedriger. Mittelwert. |
| 4 | Marienthal | 5.160 | 5.037 | 5.450 | **5.200** | Alle 3 eng beieinander. |
| 5 | Jenfeld | 4.350 | 4.273 | 4.500 | **4.350** | R1/R2 fast identisch. |
| 6 | Tonndorf | 4.500 | 4.342 | 4.700 | **4.500** | R1 als Mittelwert. |
| 7 | Farmsen-Berne | 4.380 | 4.095 | 4.900 | **4.400** | R3 Schätzung zu hoch. R1/R2 eng. |
| 8 | Altstadt | 7.400 | 7.296 | 7.386 | **7.400** | Alle 3 fast identisch. Wenig Wohnangebot. |
| 9 | Neustadt | 7.700 | 6.571 | 7.800 | **7.200** | R2 deutlich niedriger. Kompromiss. |
| 10 | St. Pauli | 7.100 | 6.773 | 7.500 | **7.000** | R1 als Mittelwert. |
| 11 | **HafenCity** | 8.500 | 8.372 | 8.450 | **8.500** | Alle 3 fast identisch. Neubau-dominiert. |
| 12 | Hammerbrook | 5.600 | 7.256 | 6.000 | **5.800** | R2 Ausreisser (Neubau verzerrt). R1/R3 als Basis. |
| 13 | Borgfelde | 5.200 | 6.316 | 6.100 | **5.700** | R2/R3 höher. R1 konservativ. Kompromiss. |
| 14 | Hamm | 5.100 | 5.274 | 5.200 | **5.200** | Alle 3 eng. |
| 15 | Horn | 4.465 | 4.653 | 5.050 | **4.700** | R3 Schätzung hoch. R1/R2 eng. Aufgerundet. |
| 16 | Billstedt | 3.150 | 4.348 | 4.400 | **3.800** | R1 sehr niedrig. R2/R3 höher. Kompromiss bei grosser Streuung. |
| 17 | Billbrook | – | – | k.A. | **Gewerbe** | Industriegebiet. Kein Wohnmarkt. |
| 18 | Rothenburgsort | 5.989 | 5.903 | 5.150 | **5.600** | R1/R2 eng. R3 Schätzung niedriger. |
| 19 | Lohbrügge | 4.050 | 4.115 | 4.848 | **4.100** | R1/R2 fast identisch. R3 Ausreisser. |
| 20 | Bergedorf | 4.900 | 4.113 | 5.133 | **4.700** | Grosse Spreizung. Mittelwert. |
| 21 | Allermöhe | 4.100 | 4.200 | 4.000 | **4.100** | Alle 3 eng. |
| 22 | Neuallermöhe | 3.750 | 5.165 | 5.225 | **4.500** | R1 sehr niedrig, R2/R3 hoch (Neubau-Bias). Kompromiss. |
| 23 | Billwerder | 3.900 | 3.541 | 3.650 | **3.700** | Alle 3 im Bereich 3.500-3.900. |
| 24 | Moorfleet | 3.500 | 3.600 | 3.400 | **3.500** | Alle 3 eng. Kaum Wohnmarkt. |

---

## Finale Hauspreise + Mieten + Einwohner

| Stadtteil | Haus €/m² | Miete €/m² | Einwohner | Fläche km² | Bezirk | ÖPNV | Trend |
|---|---:|---:|---:|---:|---|---|---|
| Wohldorf-Ohlstedt | 5.600 | 13,50 | 4.839 | 17,3 | Wandsbek | U1 (Ohlstedt) | stabil |
| Steilshoop | 4.800 | 11,50 | 19.856 | 2,5 | Wandsbek | Bus (U5 geplant) | stabil |
| Dulsberg | 5.200 | 13,00 | 17.230 | 1,2 | Hamburg-Nord | U1 | stabil |
| Marienthal | 5.800 | 14,00 | 13.879 | 3,3 | Wandsbek | U1, S1 | steigend |
| Jenfeld | 4.400 | 12,00 | 29.391 | 5,0 | Wandsbek | Bus | seitwärts |
| Tonndorf | 4.500 | 13,00 | 15.580 | 3,9 | Wandsbek | S1 | stabil |
| Farmsen-Berne | 4.600 | 12,00 | 39.266 | 8,3 | Wandsbek | U1 | stabil |
| Altstadt | 6.000 | 18,50 | 2.549 | 1,3 | Hamburg-Mitte | U1-4, S1-3 | stabil |
| Neustadt | 6.000 | 18,00 | 12.710 | 2,4 | Hamburg-Mitte | U1-3, S1-3 | stabil |
| St. Pauli | 5.800 | 17,50 | 22.377 | 2,7 | Hamburg-Mitte | U3, S1/S3 | steigend |
| HafenCity | 7.000 | 20,00 | 8.062 | 2,4 | Hamburg-Mitte | U4 | steigend |
| Hammerbrook | 5.000 | 15,00 | 6.943 | 3,6 | Hamburg-Mitte | S3/S31 | steigend |
| Borgfelde | 5.000 | 14,00 | 8.880 | 0,9 | Hamburg-Mitte | U2/U4, S1 | stabil |
| Hamm | 4.800 | 13,50 | 40.580 | 3,7 | Hamburg-Mitte | U2/U4 | stabil |
| Horn | 4.500 | 12,50 | 39.050 | 5,9 | Hamburg-Mitte | U2/U4 | stabil |
| Billstedt | 4.000 | 11,00 | 70.950 | 15,4 | Hamburg-Mitte | U2/U4 | stabil |
| Billbrook | – | – | 1.851 | 6,1 | Hamburg-Mitte | Bus | Gewerbe |
| Rothenburgsort | 5.000 | 14,00 | 10.180 | 3,6 | Hamburg-Mitte | S2/S21 | steigend |
| Lohbrügge | 4.200 | 11,50 | 41.400 | 13,0 | Bergedorf | Bus (S Bergedorf) | stabil |
| Bergedorf | 4.500 | 12,50 | 37.560 | 11,9 | Bergedorf | S21 | stabil |
| Allermöhe | 4.200 | 11,50 | 1.411 | 8,6 | Bergedorf | S21 | stabil |
| Neuallermöhe | 4.200 | 11,50 | 12.841 | 4,4 | Bergedorf | S21 | stabil |
| Billwerder | 3.800 | 11,00 | 1.400 | 9,5 | Bergedorf | S21 | stabil |
| Moorfleet | 3.800 | 11,00 | 1.203 | 4,3 | Bergedorf | Bus | stabil |

---

## Plausibilitätsprüfung

Alle ✅:
- HafenCity (8.500) knapp unter Uhlenhorst (8.800) ✅ Neubau vs. Altbau-Premium
- Neustadt (7.200) ≈ St. Georg (7.200) ✅ Beide City-Lagen
- St. Pauli (7.000) < St. Georg (7.200) ✅ Minimal günstiger
- Dulsberg (5.200) < Barmbek-Süd (6.500) ✅ Deutlich günstiger
- Marienthal (5.200) ≈ Wandsbek (5.000) ✅ Leicht darüber
- Billstedt (3.800) < Horn (4.700) ✅ Deutlich günstiger
- Bergedorf (4.700) > Lohbrügge (4.100) ✅ Bezirkszentrum teurer
- Moorfleet (3.500) < Billwerder (3.700) < Allermöhe (4.100) ✅

---

## Heatmap-Zuordnung Batch 2

| Stufe | Farbe | Stadtteile |
|---|---|---|
| 9.000+ | #052E26 | (keiner) |
| 7.000-8.999 | #1A5C4A | HafenCity (8.500), Altstadt (7.400), Neustadt (7.200), St. Pauli (7.000) |
| 5.000-6.999 | #3D8B6E | Rothenburgsort (5.600), Hammerbrook (5.800), Borgfelde (5.700), Wohldorf-Ohlstedt (5.400), Dulsberg (5.200), Marienthal (5.200), Hamm (5.200) |
| 3.000-4.999 | #7CB89E | Horn (4.700), Bergedorf (4.700), Tonndorf (4.500), Neuallermöhe (4.500), Farmsen-Berne (4.400), Jenfeld (4.350), Steilshoop (4.300), Lohbrügge (4.100), Allermöhe (4.100), Billstedt (3.800), Billwerder (3.700), Moorfleet (3.500) |

---

## Tooltip-Texte

**Wohldorf-Ohlstedt:** Nördlichster Stadtteil der Walddörfer mit dem Naturschutzgebiet Wohldorfer Wald. U1 Endstation Ohlstedt. Exklusive Einfamilienhäuser und Villen auf großen Grundstücken. Hamburgs "grünes Dach".

**Steilshoop:** Großsiedlung der 1960er/70er mit den günstigsten Preisen nördlich der Innenstadt. Geplante U5-Anbindung als Aufwertungsperspektive. Busanbindung Richtung Barmbek. Für preisbewusste Käufer und Kapitalanleger.

**Dulsberg:** Urbaner Stadtteil zwischen Barmbek und Wandsbek mit Mix aus Altbau und Nachkriegsbauten. U1 direkt vor der Tür. Preislich deutlich unter Barmbek-Süd bei ähnlicher Lagequalität. Gute Nahversorgung.

**Marienthal:** Grüne, bürgerliche Villenlage östlich von Wandsbek. Gehobenes Preisniveau mit vielen Einfamilienhäusern und Villen. U1 und S1 in der Nähe. Beliebt bei Familien mit gehobenem Budget.

**Jenfeld:** Weitläufiger Stadtteil mit Großwohnsiedlungen und grüner Jenfelder Au. Günstiger Einstieg im Osten Hamburgs. Neubauprojekte bringen frischen Wohnraum. Busanbindung Richtung Wandsbek.

**Tonndorf:** Ruhiges Wohngebiet mit Ein- und Mehrfamilienhäusern entlang der Bahntrasse. S-Bahn Tonndorf, Nähe A24. Preislich zwischen Jenfeld und Rahlstedt. Für Familien und Pendler.

**Farmsen-Berne:** Großer, familienfreundlicher Stadtteil mit U1-Anbindung (Farmsen, Berne). Farmsener Heide als Naherholung. Mix aus Reihen-, Einfamilienhäusern und Geschosswohnungsbau. Preislich unter Bramfeld.

**Altstadt:** Historisches Herz Hamburgs mit Rathaus und Mönckebergstraße. Fast ausschließlich Gewerbe. Extrem wenige Wohnimmobilien zu sehr hohen Preisen. Beste ÖPNV-Anbindung der Stadt.

**Neustadt:** Zentrale Innenstadtlage zwischen Alster und Elbe mit Michel, Gänsemarkt und Colonnaden. Gehobene Altbauwohnungen und Geschäftshäuser. U1-3, S1-3.

**St. Pauli:** Hamburgs legendäres Szene-Viertel rund um die Reeperbahn. Kulturell vielfältig, stark gentrifiziert. Steigende Preise bei hoher Nachfrage. U3, S1/S3 (Reeperbahn, Landungsbrücken).

**HafenCity:** Europas größtes innerstädtisches Stadtentwicklungsprojekt mit Elbphilharmonie. Modernes Luxuswohnen am Wasser. Neubau-dominiert, Spitzenpreise bis 13.500 €/m². U4.

**Hammerbrook:** Im Wandel von Bürostadt (City Süd) zum urbanen Wohn-/Arbeitsviertel. Einwohnerzahl seit 2007 vervierfacht. Noch günstig für innerstädtische Lage. S3/S31.

**Borgfelde:** Kompakter Stadtteil zwischen City und Hamm. Zentrumsnah, ruhiger und günstiger als die Innenstadt. U2/U4 (Burgstraße), S1 (Berliner Tor). Kurze Wege.

**Hamm:** Dicht besiedeltes, innenstadtnahes Wohnviertel mit 40.000 Einwohnern. Preislich moderat für die zentrale Lage. Gentrifizierungstendenzen Richtung City. U2/U4.

**Horn:** Traditionsreicher Stadtteil mit der ehemaligen Horner Rennbahn. Unteres Mittelfeld preislich. U2/U4, geplante U4-Verlängerung. Für Familien und Erstkäufer.

**Billstedt:** 71.000 Einwohner, einer der bevölkerungsreichsten Stadtteile. Von Mümmelmannsberg bis Einfamilienhäuser. Eines der günstigsten Pflaster der Stadt. U2/U4.

**Billbrook:** Norddeutschlands größtes Industriegebiet. Über 1.000 Betriebe. Kaum Wohnbebauung. Für Immobilienkäufer nicht relevant.

**Rothenburgsort:** Aufstrebend an der Bille-Mündung zwischen HafenCity und Billbrook. Einwohnerzahl verfünffacht seit 2007. Neubauprojekte und HafenCity-Effekt. S2/S21.

**Lohbrügge:** Einwohnerreichster Stadtteil in Bergedorf. Einfamilienhäuser und Großsiedlungen. Boberger Düne als Naherholung. Günstige Alternative zur Innenstadt. S21 über Bergedorf.

**Bergedorf:** Eigene kleine Stadt im Osten mit Schloss, Theater und Fußgängerzone. Urbanes Bezirkszentrum. Solide mittlere Preislage. S21 (~25 Min. Hbf).

**Allermöhe:** Ländlich an der Dove-Elbe. Historische Reetdachhäuser. Seit Abtrennung von Neuallermöhe nur ~1.400 Einwohner. Ruhige Dorfidylle. S21 nah.

**Neuallermöhe:** Neubaugebiet der 1990er/2000er mit Fleetsystem nach Amsterdamer Vorbild. Reihenhäuser und ETW unter Innenstadt-Niveau. Für junge Familien. S21 Nettelnburg.

**Billwerder:** Dünn besiedeltes Marschland östlich der A1. Reiterhochburg. Bauernhöfe und JVA. Kaum Geschosswohnungsbau. S21.

**Moorfleet:** Kleines Marschdorf an der Dove-Elbe. Historische St.-Nikolai-Kirche (1681). Äußerst geringe Datenbasis. S21 (Mittlerer Landweg).
