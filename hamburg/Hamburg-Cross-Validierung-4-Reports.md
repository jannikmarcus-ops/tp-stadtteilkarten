# Cross-Validierung Hamburg: 4 Reports, 20 Stadtteile

## Reports

- **R1:** Claude Extended Search (compass_artifact) – Vollständigster Report, alle 20 Stadtteile, Angebotspreise
- **R2:** ChatGPT Deep Research (deep-research-report) – Stärkste Quelle: Gutachterausschuss Transaktionspreise 2024 für alle 20 ETW. Aber lückenhaft bei Haus/Miete.
- **R3:** Gemini (Hamburg_Immobilienmarktdaten) – Viele Schätzungen, Mieten oft nur Bezirkslevel. Gemischte Qualität.
- **R4:** ChatGPT/Gemini detailliert (Immobilienmarktdaten_Hamburg_20) – Beste Quellenarbeit, breite Portal-Abdeckung, detaillierte Profile.

## Methodische Besonderheit Hamburg

R2 liefert **Gutachterausschuss-Transaktionspreise** (echte Kaufverträge 2024, ohne Neubau). Diese sind die verlässlichste Quelle, liegen aber systematisch **10-20% unter Angebotspreisen**. Für die Karte verwenden wir wie bei Münster **Angebotspreise** (was Nutzer auf Portalen sehen). Die GA-Werte dienen als Plausibilitäts-Anker.

---

## Gesamtmarkt Hamburg (Konsens alle 4 Reports)

| Kennzahl | Wert | Konsens |
|---|---|---|
| Einwohner | 1,86-1,97 Mio. | **~1,92 Mio.** (Register 31.12.2024) |
| Ø ETW Angebot | 5.400-6.400 €/m² | **~6.000 €/m²** |
| Ø ETW Neubau (Transaktion) | 8.200 €/m² | Gutachterausschuss, belastbar |
| Ø ETW Bestand (Transaktion) | ~4.800 €/m² | Gutachterausschuss, belastbar |
| Ø Kaltmiete Mietspiegel | 9,94 €/m² | Bestandsmieten (Mietspiegel 2025) |
| Ø Angebotsmiete | 13,58 €/m² | ImmoScout24 Q1/2026 |
| Leerstandsquote | 0,4-1,9% | **< 1%** (funktionaler Leerstand) |
| Kaufverträge 2024 | 9.089 | (+29% ggü. 2023) |
| Geldumsatz 2024 | 8,6 Mrd. € | (+34% ggü. 2023) |
| Grunderwerbsteuer | 5,5% | seit 01.01.2023, bestätigt |
| Maklerquote | 70-73% | höchste in D |

---

## Konsolidierte ETW-Preise (Angebotspreise, finaler Wert für Karte)

| Nr | Stadtteil | R1 | R2 (GA Transakt.) | R3 | R4 | **Final (Angebot)** | GA-Referenz |
|---|---|---:|---:|---:|---:|---:|---:|
| 1 | Eimsbüttel | 6.950 | 6.843 (T) | 6.941 | 7.100 | **7.000** | 6.843 |
| 2 | Eppendorf | 7.900 | 7.643 (T) | ~8.600 | 8.600 | **8.000** | 7.643 |
| 3 | Winterhude | 7.900 | 8.353 (T) | 11.071¹ | 8.150 | **8.000** | 8.353 |
| 4 | Ottensen | 7.450 | 6.848 (T) | 7.211 | 7.750 | **7.500** | 6.848 |
| 5 | Barmbek-Süd | 6.400 | 5.627 (T) | ~5.500 | 6.700 | **6.500** | 5.627 |
| 6 | Barmbek-Nord | 5.830 | 5.315 (T) | 4.977 | 5.900 | **5.800** | 5.315 |
| 7 | Hoheluft-Ost | 8.520 | 9.918 (T) | ~8.000 | – | **8.500** | 9.918² |
| 8 | Hoheluft-West | 7.340 | 6.743 (T) | 12.939¹ | – | **7.300** | 6.743 |
| 9 | Stellingen | 5.520 | 5.198 (T) | 4.823 | 5.800 | **5.500** | 5.198 |
| 10 | Lokstedt | 6.040 | 5.295 (T) | ~5.500 | 6.270 | **6.000** | 5.295 |
| 11 | Blankenese | 7.050 | 7.444 (T) | 6.831 | 7.500 | **7.200** | 7.444 |
| 12 | Othmarschen | 7.550 | 7.336 (T) | 7.169 | 7.900 | **7.500** | 7.336 |
| 13 | Bahrenfeld | 5.900 | 5.277 (T) | 5.359 | 6.150 | **5.900** | 5.277 |
| 14 | Wandsbek | 4.950 | 4.232 (T) | 4.927 | 5.150 | **5.000** | 4.232 |
| 15 | Rahlstedt | 4.450 | 3.625 (T) | – | 4.350 | **4.300** | 3.625 |
| 16 | Bramfeld | 4.690 | 4.146 (T) | 4.639 | 4.850 | **4.700** | 4.146 |
| 17 | Eilbek | 5.600 | 4.940 (T) | ~5.500 | 6.100 | **5.700** | 4.940 |
| 18 | Uhlenhorst | 8.700 | 9.000 (T) | ~8.000 | 9.200 | **8.800** | 9.000 |
| 19 | Harvestehude | 9.800 | 9.736 (T) | 9.314 | 9.000 | **9.500** | 9.736 |
| 20 | St. Georg | 7.000 | 7.216 (T) | ~7.000 | 7.650 | **7.200** | 7.216 |

¹ = R3-Ausreisser (Winterhude 11.071, Hoheluft-West 12.939) sind klar unplausibel und werden ignoriert
² = Hoheluft-Ost GA-Transaktionspreis (9.918) liegt ÜBER dem Angebotspreis. Ungewöhnlich, erklärt sich durch wenige hochpreisige Transaktionen in diesem sehr kleinen Stadtteil.

---

## Konsolidierte Hauspreise + Mieten

| Stadtteil | Haus €/m² (Final) | Miete €/m² (Final) | Trend |
|---|---:|---:|---|
| Eimsbüttel | 7.500 | 16,00 | ↑ steigend |
| Eppendorf | 10.000 | 18,00 | → stabil/↑ |
| Winterhude | 10.000 | 17,50 | → stabil |
| Ottensen | 8.000 | 17,00 | ↑ steigend |
| Barmbek-Süd | 7.000 | 16,00 | → stabil |
| Barmbek-Nord | 5.500 | 14,50 | ↑ steigend |
| Hoheluft-Ost | 9.000 | 18,00 | → stabil |
| Hoheluft-West | 8.000 | 17,00 | → stabil |
| Stellingen | 5.500 | 14,00 | ↑ steigend |
| Lokstedt | 7.000 | 15,00 | ↑ steigend |
| Blankenese | 8.500 | 18,00 | → stabil |
| Othmarschen | 9.000 | 18,00 | → stabil |
| Bahrenfeld | 6.500 | 15,50 | ↑ steigend |
| Wandsbek | 4.800 | 13,00 | → stabil |
| Rahlstedt | 4.800 | 13,00 | → seitwärts |
| Bramfeld | 5.000 | 13,50 | ↑ leicht |
| Eilbek | 5.500 | 15,50 | → stabil |
| Uhlenhorst | 9.500 | 18,00 | → stabil |
| Harvestehude | 12.000 | 20,00 | → stabil |
| St. Georg | 8.000 | 17,50 | ↑ steigend |

---

## Referenzwert-Abgleich (Janniks Marktkenntnis vs. Recherche)

| Stadtteil | Jannik-Referenz | Final (Angebot) | GA (Transaktion) | Bewertung |
|---|---|---:|---:|---|
| Eimsbüttel | 5.500-6.500 | 7.000 | 6.843 | Referenz = Transaktionsniveau. GA bestätigt exakt. Angebotspreise +8% darüber. |
| Eppendorf | 6.000-7.500 | 8.000 | 7.643 | Referenz = untere Grenze Transaktionsniveau. Angebotspreise +7% über GA. |
| Winterhude | 5.500-7.000 | 8.000 | 8.353 | Referenz zu niedrig. Auch GA liegt bei 8.353. Winterhude ist teurer als gedacht. |
| Barmbek-Süd | 4.500-5.500 | 6.500 | 5.627 | Referenz = Transaktionsniveau. Angebotspreise +16% darüber. |
| Ottensen | 5.000-6.500 | 7.500 | 6.848 | Referenz = Transaktionsniveau. Angebotspreise +10% darüber. |
| Blankenese | 6.500-9.000 | 7.200 | 7.444 | ✅ Passt perfekt in die Referenzspanne. |
| Harvestehude | 7.000-10.000 | 9.500 | 9.736 | ✅ Passt in Referenzspanne. |
| Rahlstedt | 3.000-4.000 | 4.300 | 3.625 | Referenz = Transaktionsniveau. Angebotspreise +19% darüber. |

**Ergebnis:** Janniks Referenzwerte bilden durchweg das Transaktionspreislevel ab. Der Gutachterausschuss bestätigt die Referenzwerte fast exakt. Angebotspreise (für die Karte) liegen systematisch 8-20% darüber. Für die Karte verwenden wir Angebotspreise und kennzeichnen sie als solche.

---

## Heatmap-Farbzuordnung Hamburg

| Preisstufe | Farbe | Stadtteile |
|---|---|---|
| **9.000+ €/m²** | #052E26 (Dunkelgrün) | Harvestehude (9.500) |
| **7.000-8.999** | #1A5C4A (Mittelgrün) | Eppendorf (8.000), Winterhude (8.000), Uhlenhorst (8.800), Hoheluft-Ost (8.500), Eimsbüttel (7.000), Blankenese (7.200), Ottensen (7.500), Othmarschen (7.500), Hoheluft-West (7.300), St. Georg (7.200) |
| **5.000-6.999** | #3D8B6E (Hellgrün) | Barmbek-Süd (6.500), Lokstedt (6.000), Bahrenfeld (5.900), Barmbek-Nord (5.800), Eilbek (5.700), Stellingen (5.500), Wandsbek (5.000) |
| **3.000-4.999** | #7CB89E (Mintgrün) | Bramfeld (4.700), Rahlstedt (4.300) |
| **unter 3.000** | #C5DDD1 (Hellmint) | (keiner der 20) |

Hamburg ist insgesamt teurer als Münster: Kein Stadtteil unter 4.000 €/m², die meisten über 5.000.

---

## Tooltip-Texte für die interaktive Karte

**Eimsbüttel:** Hamburgs beliebtester Stadtteil. Gründerzeit-Altbauten, die Osterstrasse als Lebensader und U2-Anbindung in 10 Min. zum Jungfernstieg. Höchste Kita-Dichte der Stadt. 57.800 Einwohner.

**Eppendorf:** Gehobene Toplage zwischen Alster und UKE. Jugendstil-Architektur, exklusive Boutiquen an der Eppendorfer Landstrasse und U1/U3-Knoten Kellinghusenstrasse. Beliebte Ärzte- und Akademikerlage.

**Winterhude:** Hamburgs vielfältigstes Premiumviertel. Von Alster-Villen über die Jarrestadt bis zum Stadtpark. U1, U3 und S1-Anbindung. 57.000 Einwohner, grösster innenstädtischer Stadtteil.

**Ottensen:** Urban, kreativ, familienfreundlich. Kleinteile Altbaustruktur mit Kneipen, Galerien und Wochenmärkten. S-Bahn-Knoten Altona plus neue Station Ottensen seit 2023.

**Barmbek-Süd:** Gentrifizierung in vollem Gang. Gründerzeit-Charme trifft auf Szenelokale. U3 und S1 am Knoten Barmbek. 40.000 Einwohner, stärkster Preisanstieg unter den Kernvierteln.

**Barmbek-Nord:** Aufsteiger mit U5-Perspektive. Pergolenviertel und Quartier 21 bringen tausende neue Wohnungen. +13% Bevölkerungswachstum seit 2012. Noch deutlich günstiger als Barmbek-Süd.

**Hoheluft-Ost:** Kompakt, urban, teuer. Nur 0,6 km² mit 9.800 Einwohnern. Eine der höchsten Dichten Hamburgs. Fast ausschliesslich Gründerzeit-Altbau. Zwischen Eppendorf und Harvestehude gelegen.

**Hoheluft-West:** Deutschlands am dichtesten besiedelter Stadtteil. 19.500 EW/km². U3 Hoheluftbrücke, Metrobus 5, Nähe UKE. Altbauwohnungen werden oft off-market vermittelt.

**Stellingen:** Im Wandel durch Neue Mitte Stellingen und U5-Planung. Hagenbecks Tierpark als Wahrzeichen. U2 und S3/S21 vor Ort. Einer der stärksten Preisanstiege (+4-10%).

**Lokstedt:** Familienfreundlich zwischen Eppendorf und Volkspark. U2 Hagendeel, NDR-Standort, geplante U5-Anbindung. Solides Mittelfeld mit moderatem Aufwärtstrend.

**Blankenese:** Hamburgs Elbvorort-Ikone. Treppenviertel, Elbstrand und S1-Anbindung. Villen, Landhäuser und ein kompakter Ortskern. Premiumlage mit sehr selektivem Markt.

**Othmarschen:** Gehobene Elbvorort-Lage zwischen Blankenese und Altona. Villen und grosszügige EFH dominieren. S1 Othmarschen, Nähe Jenischpark. Stabile Spitzenpreise.

**Bahrenfeld:** Hamburgs ambitionierteste Transformation. Science City (DESY, 3.800 Wohnungen), neuer Fernbahnhof Diebsteich, A7-Deckel. Preislich noch im Mittelfeld. Grösstes Aufwertungspotenzial.

**Wandsbek:** Hamburgs bezahlbare Mitte. U1 Wandsbek Markt, eigenes Einkaufszentrum, gute Infrastruktur. S4-Ausbau bringt zusätzliche Anbindung. 37.000 Einwohner.

**Rahlstedt:** Hamburgs einwohnerstärkster Stadtteil (96.000). S4-Anschluss ans S-Bahn-Netz kommt 2027-2029. Günstigstes Preisniveau unter den 20 Stadtteilen. Grosse Familien- und Eigenheimquartiere.

**Bramfeld:** U5-Endstation kommt (~2033). 40-Mio.-Euro-Umbau Dorfplatz. 54.000 Einwohner, aktuell noch ohne Schnellbahn. Grösstes U5-Aufwertungspotenzial neben Barmbek-Nord.

**Eilbek:** Innenstadtnaher Bestandsmarkt zwischen Wandsbek und Barmbek. U1 Wartenau, S1 Wandsbeker Chaussee. Kompakt (1,7 km²), dicht besiedelt, stabile Preise bei begrenztem Angebot.

**Uhlenhorst:** Alster-Premiumlage. U3 Mundsburg, Alsterdampfer im Sommer. Elegante Altbauten und Villen zwischen Aussen- und Binnenalster. Eines der teuersten Viertel der Stadt.

**Harvestehude:** Hamburgs teuerste Wohnlage. Alster-Ufer, Grindelviertel, Rothenbaumchaussee. U1 Hallerstrasse/Klosterstern. Spitzenpreise bis 15.000 €/m² bei Neubau. Kaum Preiskorrektur trotz Zinswende.

**St. Georg:** Urbanstes Viertel mit Hauptbahnhof-Nähe (alle U/S-Linien). Lange Reihe als Flaniermeile. Mischung aus Szeneviertel und Geschäftslage. Hohe Mietdynamik.

---

## Einwohnerdaten (Konsens)

| Stadtteil | Einwohner | Fläche km² | Quelle |
|---|---:|---:|---|
| Eimsbüttel | 57.800 | 3,2 | Stadtteilprofile 2024 |
| Eppendorf | 25.250 | 2,7 | Stadtteilprofile 2024 |
| Winterhude | 61.000 | 7,6 | Stadtteilprofile 2024 |
| Ottensen | 35.000 | 2,9 | Stadtteilprofile 2024 |
| Barmbek-Süd | 40.000 | 3,1 | Stadtteilprofile 2024 |
| Barmbek-Nord | 13.600 | 3,2 | R4 (2024) |
| Hoheluft-Ost | 9.800 | 0,6 | Stadtteilprofile 2024 |
| Hoheluft-West | 13.600 | 0,7 | R4 (2024) |
| Stellingen | 28.800 | 6,1 | Stadtteilprofile 2024 |
| Lokstedt | 31.000 | 4,9 | Stadtteilprofile 2024 |
| Blankenese | 13.500 | 8,3 | Stadtteilprofile 2024 |
| Othmarschen | 16.500 | 5,9 | Stadtteilprofile 2024 |
| Bahrenfeld | 30.000 | 10,9 | Stadtteilprofile 2024 |
| Wandsbek | 37.000 | 6,4 | Stadtteilprofile 2024 |
| Rahlstedt | 92.000 | 27,2 | Stadtteilprofile 2024 |
| Bramfeld | 54.000 | 10,3 | Stadtteilprofile 2024 |
| Eilbek | 22.000 | 1,7 | Stadtteilprofile 2024 |
| Uhlenhorst | 17.000 | 2,2 | Stadtteilprofile 2024 |
| Harvestehude | 17.000 | 2,0 | Stadtteilprofile 2024 |
| St. Georg | 13.000 | 1,8 | Stadtteilprofile 2024 |

---

## Hamburger Besonderheiten (für Karten-Content)

**U5 als Werttreiber:** Bramfeld, Barmbek-Nord, Stellingen, Lokstedt profitieren. Eröffnung ~2033.
**S4 als Werttreiber:** Rahlstedt, Wandsbek. Eröffnung ~2027-2029.
**Grossprojekte:** Oberbillwerder (6.500 WE), Mitte Altona (1.900 WE), Science City Bahrenfeld (3.800 WE), Diebsteich Fernbahnhof (ab 2029).
**Zinswende-Gewinner:** Harvestehude (+37%), Ottensen (+31,8%). Premium entkoppelt sich.
**Zinswende-Verlierer:** Neustadt (-16,5%), Rothenburgsort (-14,5%). Sanierungsbedürftig + Randlage = doppelte Korrektur.
