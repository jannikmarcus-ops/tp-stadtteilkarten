# Cross-Validierung Hamburg Batch 1: 24 Stadtteile (West + Nordwest)

## Reports

- **R1:** Claude Extended Search. Primärquelle: ImmoScout24 Preisatlas Q1/2026. Vollständigste Daten.
- **R2:** ChatGPT Deep Research. Primärquelle: immoportal.com. Tendiert systematisch höher (+10-20%).
- **R3:** Gemini. Primärquelle: ImmoScout24/immowelt. Beste Bodenrichtwert-Daten. Sehr detailliert für Hauptmärkte.
- **R4:** ChatGPT. Breite Quellenabdeckung. Viele Schätzungen bei Randstadtteilen, aber sauber gekennzeichnet.

## Methodische Beobachtung

R2 (immoportal) liegt bei fast allen Stadtteilen 10-25% über R1/R3/R4. Das passt zum bekannten Muster: immoportal tendiert zu höheren Werten. Für die Karte verwenden wir den Median aus R1/R3/R4 als Hauptwert. R2 dient als Plausibilitäts-Obergrenze.

---

## Finale konsolidierte ETW-Preise (Angebotspreise)

| Nr | Stadtteil | R1 | R2 | R3 | R4 | **Final** | Begründung |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | Altona (ges.) | 6.000 | 7.090 | 7.569 | 7.100 | **6.800** | R1 nutzt Bezirkswert. R3/R4 innerstädtischer Fokus. Kompromiss. |
| 2 | Nienstedten | 7.135 | 8.261 | 7.138 | 7.135 | **7.150** | R1/R3/R4 fast identisch (IS24). R2 Ausreisser (immoportal). |
| 3 | Groß Flottbek | 6.432 | 7.952 | 6.432 | 6.433 | **6.450** | R1/R3/R4 exakt gleich. R2 deutlich höher. |
| 4 | Osdorf | 5.223 | 5.861 | 5.223 | 5.223 | **5.200** | 3x identisch (IS24). |
| 5 | Lurup | 4.150 | 5.344 | 4.150 | 4.150 | **4.200** | 3x identisch. R2 Ausreisser. Günstigster Stadtteil im Batch. |
| 6 | Iserbrook | 4.979 | 5.976 | 4.979 | 4.979 | **5.000** | 3x identisch. |
| 7 | Sülldorf | 5.024 | 5.958 | 5.024 | 6.100 | **5.200** | R1/R3 identisch. R4 nutzt immoportal (höher). Konservativ. |
| 8 | Rissen | 4.682 | 5.695 | 4.682 | 5.600 | **5.000** | R1/R3 identisch. R4 im Mix. Mittelwert. |
| 9 | **Eidelstedt** ★ | 4.400 | 4.966 | 4.284 | 4.284 | **4.350** | R3/R4 identisch (IS24). R1 Median. R2 höher. Konservativ. |
| 10 | **Schnelsen** ★ | 4.400 | 5.073 | 4.259 | 4.259 | **4.300** | R3/R4 identisch (IS24). R1 leicht höher. |
| 11 | **Niendorf** ★ | 4.900 | 4.933 | 4.756 | 4.755 | **4.800** | R3/R4 fast identisch. R1/R2 leicht höher. Mittelwert. |
| 12 | Groß Borstel | 5.421 | 6.755 | 5.112 | ~6.000 | **5.500** | R1/R3 näher. R2/R4 höher. Mittelwert. |
| 13 | Fuhlsbüttel | 4.852 | 5.576 | 4.936 | ~5.000 | **5.000** | R1/R3/R4 eng beieinander. |
| 14 | Langenhorn | 4.503 | 4.961 | 4.434 | 4.650 | **4.500** | R1/R3 fast identisch. Günstig, U1-Anbindung. |
| 15 | Ohlsdorf | 5.557 | 5.486 | 5.321 | ~5.500 | **5.500** | Alle 4 eng beieinander. Seltene Übereinstimmung. |
| 16 | Alsterdorf | ~6.500 | 6.551 | 6.238 | 6.250 | **6.300** | R1/R2 eng, R3/R4 eng. Mittelwert. |
| 17 | Hummelsbüttel | 4.846 | 4.951 | 4.758 | 4.650 | **4.800** | Alle 4 zwischen 4.650-4.950. |
| 18 | Poppenbüttel | 5.140 | 5.461 | 5.278 | 5.279 | **5.250** | R3/R4 fast identisch. |
| 19 | Wellingsbüttel | 5.340 | 6.002 | 5.177 | 6.250 | **5.500** | Grosse Spreizung. R1/R3 tiefer, R2/R4 höher. Mittelwert. |
| 20 | Sasel | 5.000 | 5.942 | 4.741 | 5.650 | **5.200** | Grosse Spreizung (wenig ETW, EFH-dominiert). Konservativ. |
| 21 | Volksdorf | 5.040 | 5.851 | 4.885 | ~5.500 | **5.200** | R1/R3 nah. R2/R4 höher (Premium-Walddorf). Kompromiss. |
| 22 | Bergstedt | 4.760 | 5.922 | 4.579 | 5.150 | **4.800** | R2 Ausreisser. R1/R3 nah. |
| 23 | Lemsahl-Mell. | 4.640 | n/v | 4.226 | 5.000 | **4.600** | Dünne Datenlage (EFH-dominiert). |
| 24 | Duvenstedt | 4.785 | n/v | 4.448 | 4.650 | **4.600** | Dünne Datenlage. Mittelwert. |

---

## Finale Hauspreise + Mieten + Einwohner

| Stadtteil | Haus €/m² | Miete €/m² | Einwohner | Fläche km² | Bezirk | ÖPNV | Trend |
|---|---:|---:|---:|---:|---|---|---|
| Altona (ges.) | 7.000 | 15,00 | 50.000¹ | 2,8¹ | Altona | S1/S3 | steigend |
| Nienstedten | 8.900 | 17,00 | 7.062 | 4,3 | Altona | S1 (Hochkamp) | stabil |
| Groß Flottbek | 8.200 | 17,00 | 11.319 | 2,8 | Altona | S1 (Kl. Flottbek) | stabil |
| Osdorf | 5.750 | 13,50 | 26.601 | 7,2 | Altona | Bus | seitwärts |
| Lurup | 4.500 | 12,00 | 37.755 | 6,4 | Altona | Bus (S3 nah) | stabil |
| Iserbrook | 5.500 | 14,00 | 11.523 | 2,7 | Altona | S1 | stabil |
| Sülldorf | 5.500 | 14,50 | 9.330 | 5,7 | Altona | S1 | stabil |
| Rissen | 5.700 | 14,00 | 16.429 | 16,6 | Altona | S1 | stabil |
| **Eidelstedt** ★ | 4.500 | 14,00 | 36.705 | 8,7 | Eimsbüttel | S3/S21, AKN | stabil |
| **Schnelsen** ★ | 4.700 | 14,00 | 31.323 | 9,0 | Eimsbüttel | AKN, M5 | stabil |
| **Niendorf** ★ | 5.300 | 15,00 | 42.496 | 12,4 | Eimsbüttel | U2, M5 | stabil |
| Groß Borstel | 6.000 | 15,00 | 10.939 | 4,0 | Hamburg-Nord | Bus | stabil |
| Fuhlsbüttel | 5.500 | 14,00 | 13.984 | 6,6 | Hamburg-Nord | U1, S1 | stabil |
| Langenhorn | 4.300 | 13,00 | 48.901 | 13,8 | Hamburg-Nord | U1 (4 Stat.) | stabil |
| Ohlsdorf | 6.000 | 14,50 | 17.813 | 7,2 | Hamburg-Nord | U1+S1 | stabil |
| Alsterdorf | 7.000 | 15,50 | 15.644 | 3,1 | Hamburg-Nord | U1 (3 Stat.) | stabil |
| Hummelsbüttel | 5.300 | 14,00 | 18.731 | 9,1 | Wandsbek | Bus | stabil |
| Poppenbüttel | 5.100 | 14,00 | 24.598 | 8,1 | Wandsbek | S1 | seitwärts |
| Wellingsbüttel | 6.500 | 15,00 | 11.168 | 4,0 | Wandsbek | S1 | stabil |
| Sasel | 5.500 | 14,00 | 24.287 | 8,4 | Wandsbek | Bus | stabil |
| Volksdorf | 5.800 | 14,00 | 20.608 | 11,6 | Wandsbek | U1 | stabil |
| Bergstedt | 5.100 | 13,00 | 10.822 | 7,0 | Wandsbek | Bus | stabil |
| Lemsahl-Mell. | 5.100 | 13,50 | 7.031 | 7,8 | Wandsbek | Bus | seitwärts |
| Duvenstedt | 5.000 | 13,50 | 5.940 | 6,8 | Wandsbek | Bus | stabil |

¹ Altona-Altstadt + Altona-Nord zusammen (nicht gesamter Bezirk)

---

## Plausibilitätsprüfung gegen validierte Nachbarn

Alle ✅ plausibel:
- Eidelstedt (4.350) < Stellingen (5.500) < Lokstedt (6.000) ✅ Korrekte Abstufung
- Schnelsen (4.300) < Eidelstedt (4.350) ✅ Peripherer = günstiger
- Niendorf (4.800) < Lokstedt (6.000) ✅ U2-Vorteil hebt Niendorf über Eidelstedt/Schnelsen
- Nienstedten (7.150) ≈ Blankenese (7.200) ✅ Elbvorort-Cluster passt
- Groß Flottbek (6.450) < Othmarschen (7.500) ✅ Leicht günstiger
- Lurup (4.200) < Osdorf (5.200) < Bahrenfeld (5.900) ✅ West-Gefälle
- Alsterdorf (6.300) < Eppendorf (8.000) ✅ Nahe aber günstiger
- Poppenbüttel (5.250) < Wellingsbüttel (5.500) ✅ Wellingsbüttel exklusiver
- Volksdorf (5.200) > Bergstedt (4.800) ✅ U1-Aufschlag

---

## Heatmap-Zuordnung

| Stufe | Farbe | Stadtteile (Batch 1) |
|---|---|---|
| 9.000+ | #052E26 | (keiner) |
| 7.000-8.999 | #1A5C4A | Nienstedten (7.150), Altona (6.800²) |
| 5.000-6.999 | #3D8B6E | Groß Flottbek (6.450), Alsterdorf (6.300), Groß Borstel (5.500), Wellingsbüttel (5.500), Ohlsdorf (5.500), Poppenbüttel (5.250), Osdorf (5.200), Sülldorf (5.200), Sasel (5.200), Volksdorf (5.200), Fuhlsbüttel (5.000), Iserbrook (5.000), Rissen (5.000) |
| 3.000-4.999 | #7CB89E | Niendorf (4.800), Hummelsbüttel (4.800), Bergstedt (4.800), Lemsahl-M. (4.600), Duvenstedt (4.600), Langenhorn (4.500), Eidelstedt (4.350), Schnelsen (4.300), Lurup (4.200) |

² Altona liegt auf der Grenze 6.800. Eher Mittelgrün.

---

## Tooltip-Texte (Best of All Worlds)

**Altona (gesamt):** Urbaner Innenstadtbezirk mit lebendiger Szene rund um Ottensen und Altona-Altstadt. S-Bahn-Knoten Altona plus künftiger Fernbahnhof Diebsteich. Vielfältige Altbaustruktur von Hinterhofbebauung bis Gründerzeit.

**Nienstedten:** Exklusiver Elbvorort mit villenartiger Bebauung, großen Grundstücken und direkter Elblage. Hirschpark und Elbstrand vor der Haustür. S1 am Rand (Hochkamp). Eines der höchsten Preisniveaus westlich der Alster.

**Groß Flottbek:** Beschaulicher Elbvorort mit hanseatischem Understatement und hohem Durchschnittseinkommen. Waitzstraße als gehobene Einkaufsadresse, Loki-Schmidt-Garten für Naturerlebnis. S1 Klein Flottbek.

**Osdorf:** Stadtteil der Kontraste. Villenviertel Hochkamp im Süden, Großwohnsiedlung Osdorfer Born im Norden. Botanischer Garten und grüne Feldmark dazwischen. Busanbindung, S1 am Südrand.

**Lurup:** Günstigster Stadtteil im Bezirk Altona. Lebendige, bunte Nachbarschaft mit starkem Gemeinschaftssinn. Grüne Oasen wie der Böverstpark. Busanbindung Richtung S3 Elbgaustraße. Für preisbewusste Familien.

**Iserbrook:** Ruhiger, grüner Familienstadtteil mit S1-Anbindung und Osdorfer Feldmark nebenan. Moderates Preisniveau zwischen Elbvororten und Randlagen. Ideal für Familien und Senioren.

**Sülldorf:** Das Dorf in der Großstadt. Fachwerkscheunen, aktive Bauernhöfe und Reiterhöfe geben ländlichen Charme. Freibad Marienhöhe im Sommer. S1 Sülldorf. Für Naturmenschen und Pferdeliebhaber.

**Rissen:** Hamburgs westlichster Stadtteil mit vier Naturschutzgebieten, Klövensteener Forst und Elbstrand Wittenbergen. Großzügige Grundstücke, gehobenes Wohnen im Grünen. S1 Rissen.

**Eidelstedt ★:** Grüner Stadtteil am Nordwestrand mit sehr guter Verkehrsanbindung (S3/S21, AKN). Eidelstedter Feldmark und Niendorfer Gehege bieten Naturerlebnis. Geplante S5 bringt zusätzliche Aufwertung. Bezahlbares Mittelsegment.

**Schnelsen ★:** Familienfreundlicher Stadtteil an der Landesgrenze mit A7-Deckel-Parks und guter Autobahnanbindung. Vergleichsweise günstige Eigenheime auf großen Grundstücken. AKN/Metrobus M5.

**Niendorf ★:** Grüne Lunge Eimsbüttels mit dem Stadtwald Niendorfer Gehege und der Fußgängerzone Tibarg. U2 direkt in die City. Ausgewogene Sozialstruktur und vielfältiges Wohnungsangebot. Etablierter Familienstandort.

**Groß Borstel:** Grüner, familiärer Stadtteil südlich des Flughafens mit dörflichem Charakter und Eppendorfer Moor. Attraktives Preis-Leistungs-Verhältnis als Alternative zu Eppendorf. Busanbindung.

**Fuhlsbüttel:** Stadtteil am Hamburger Flughafen mit geschlossenen Wohnsiedlungen und dörflichem Flair an der Alster. U1 Fuhlsbüttel plus S1 Airport. Für Familien, Pendler und Vielflieger.

**Langenhorn:** Hamburgs nördlichster Großstadtteil. Grün, familienfreundlich und erschwinglich. Historische Fritz-Schumacher-Siedlungen neben moderner Bebauung. U1 (4 Stationen). 49.000 Einwohner.

**Ohlsdorf:** ÖPNV-Knotenpunkt (U1+S1) und Heimat des weltberühmten Ohlsdorfer Friedhofs. Ortsteil Klein Borstel bietet gehobenes Villenwohnen. Für Pendler und Familien.

**Alsterdorf:** Urbanes Wohnen an der Alster mit grünem Umfeld. Evangelische Stiftung Alsterdorf als inklusives Quartier. Nähe City Nord, Eppendorf und Winterhude. U1 (3 Stationen).

**Hummelsbüttel:** Bezahlbarer Wohnraum in ruhiger, grüner Umgebung zwischen Langenhorn und Poppenbüttel. Ideal für Familien die Platz suchen. Busanbindung zu U1/S1.

**Poppenbüttel:** Bevölkerungsreichster Stadtteil im Alstertal mit Alstertal-Einkaufszentrum (AEZ) und viel Grün an der Oberalster. S1 Endstation. Für Familien und Senioren.

**Wellingsbüttel:** Einer der exklusivsten Wohnstadtteile mit großzügigen Villen und Landhäusern entlang der Alster. Ruhige, wohlhabende Atmosphäre. S1 Wellingsbüttel/Hoheneichen.

**Sasel:** Grüner, familienfreundlicher Stadtteil zwischen Alstertal und Walddörfern. Einfamilienhäuser und ruhige Wohnstraßen. Busanbindung zur S1 Poppenbüttel.

**Volksdorf:** Herz der Walddörfer mit dörflichem Ortskern, Museumsdorf und Bauernmarkt. U1 Volksdorf (~35 Min. in die City). Wald und Naturschutzgebiete vor der Tür.

**Bergstedt:** Beschaulicher Walddörfer-Stadtteil mit einer der ältesten Kirchen Hamburgs. Rodenbeker Quellental als Naturschutzgebiet. Deutlich günstiger als Volksdorf bei vergleichbarer Wohnqualität. Busanbindung.

**Lemsahl-Mellingstedt:** Fast ländliches Wohnen am Oberlauf der Alster. Naturschutzgebiete, Reiterhöfe und ausgedehnte Wanderwege. Großzügige Grundstücke. Bus 276 Richtung S Poppenbüttel.

**Duvenstedt:** Nördlichster Walddörfer-Stadtteil am Duvenstedter Brook (785 ha, Hamburgs größtes Naturschutzgebiet). Wöchentlicher Bauernmarkt, Reetdachhäuser, Dorfatmosphäre. Bus 276.
