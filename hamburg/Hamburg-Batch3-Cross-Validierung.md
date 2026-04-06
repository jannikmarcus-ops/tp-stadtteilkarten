# Cross-Validierung Hamburg Batch 3: 23 Stadtteile (Süd + Harburg)

## Reports

- **R1:** Claude Extended Search. Detailliertester Report. Beste Quellenarbeit für Harburg-Stadtteile. Ausreisser bei Veddel (5.750, Neubau-verzerrt).
- **R2:** ChatGPT Deep Research. Konkrete Werte für viele Stadtteile, aber viele als Schätzung markiert.
- **R3:** Gemini. Extrapoliert stark aus Harburger Referenzwerten (3.700 €/m²). Wenig eigene Primärdaten.
- **R4:** ChatGPT/Gemini detailliert. Gute Primärdaten für Harburg (ImmoPortal), viele Schätzungen für Rand-Stadtteile. Francop/Cranz deutlich zu hoch.

## Methodische Beobachtung

R1 liefert für Veddel einen extrem hohen Wert (5.750-5.940), warnt aber selbst vor Neubau-Verzerrung. R3 setzt Veddel realistischer bei 3.400 an. R4 schätzt 4.000. Die anderen Harburg-Werte sind über alle Reports relativ konsistent (3.500-4.200 €/m² für den Bezirk).

Für die ländlichen Randstadtteile (Francop, Neuenfelde, Cranz) divergieren die Reports stark. R4 schätzt Francop bei 4.500 und Cranz bei 4.000-4.200. Das ist für Marschland-Dörfer mit unter 1.000 Einwohnern nicht plausibel. R1 (3.200-3.740 Häuser, keine ETW) und R2 (3.200/3.400) sind realistischer.

5 Stadtteile haben keinen Wohnimmobilienmarkt: Kleiner Grasbrook, Steinwerder, Waltershof, Moorburg, Altenwerder. Alle 4 Reports bestätigen das.

---

## Finale konsolidierte ETW-Preise (Angebotspreise)

| Nr | Stadtteil | R1 | R2 | R3 | R4 | **Final** | Begründung |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | Veddel | 5.750¹ | 6.004 | 3.400 | 4.000 | **4.000** | R1/R2 Neubau-verzerrt. R3/R4 realistischer für den Stadtteil. |
| 2 | Kleiner Grasbrook | Gewerbe | Gewerbe | Gewerbe | Gewerbe | **Gewerbe** | Hafengebiet, kein Wohnmarkt. |
| 3 | Steinwerder | Gewerbe | Gewerbe | Gewerbe | Gewerbe | **Gewerbe** | Hafengebiet, kein Wohnmarkt. |
| 4 | Waltershof | Gewerbe | Gewerbe | Gewerbe | Gewerbe | **Gewerbe** | Hafengebiet, kein Wohnmarkt. |
| 5 | Wilhelmsburg | 4.400 | 4.848 | 4.200 | 4.359 | **4.400** | R1/R4 eng. R2 zu hoch (immoportal). R3 leicht tief. |
| 6 | Finkenwerder | 3.810 | 4.299 | 3.900 | 3.900 | **3.900** | R1/R3/R4 eng. R2 deutlich höher. |
| 7 | Harburg | 3.890 | 5.032 | 3.700 | 4.754 | **4.000** | R2/R4 nutzen immoportal (höher). R1/R3 konservativer. Kompromiss. |
| 8 | Eissendorf | 3.830 | 4.778 | 3.850 | 3.950 | **3.900** | R1/R3/R4 eng. R2 Ausreisser. |
| 9 | Heimfeld | 3.840 | 4.554 | 3.900 | 4.480 | **4.000** | R1/R3 nah. R2/R4 höher. TU Hamburg stützt Preise. |
| 10 | Moorburg | Gewerbe | Gewerbe | Gewerbe | Gewerbe | **Gewerbe** | Hafenerweiterungsgebiet, abgesiedelt. |
| 11 | Altenwerder | Gewerbe | Gewerbe | Gewerbe | Gewerbe | **Gewerbe** | Containerterminal, 2-3 Einwohner. |
| 12 | Neuland | 3.435 | 3.923 | 3.500 | 3.450 | **3.500** | R1/R3/R4 eng. R2 etwas höher. |
| 13 | Wilstorf | 3.685 | 4.100 | 3.650 | 3.771 | **3.700** | Alle relativ nah. Konsens. |
| 14 | Marmstorf | 3.660 | 4.350 | 4.000 | 3.900 | **3.900** | R3/R4 eng. R1 konservativ. R2 hoch. Gehobene Lage in Harburg. |
| 15 | Langenbek | 3.570 | 3.800 | 3.950 | 3.600 | **3.600** | R1/R4 nah. R3 zu hoch (Schätzung). |
| 16 | Rönneburg | 3.370 | 3.650 | 3.800 | 3.570 | **3.500** | R1 am tiefsten, R3 am höchsten. Mittelwert. |
| 17 | Sinstorf | 3.605 | 4.000 | 3.800 | 3.679 | **3.700** | R1/R4 nah. R2/R3 etwas höher. |
| 18 | Hausbruch | 3.705 | 4.600 | 3.600 | 3.718 | **3.700** | R1/R3/R4 eng. R2 Ausreisser. |
| 19 | Neugraben-Fischbek | 3.515 | 4.200 | 4.100 | 3.513 | **3.800** | R1/R4 identisch (IS24). R2/R3 höher (Neubau-Mix). Kompromiss. |
| 20 | Francop | k.D. | 3.200 | 3.500 | 4.500² | **3.300** | R4 deutlich zu hoch. R2 am realistischsten. Minimale Datenbasis. |
| 21 | Neuenfelde | 3.575 | 2.954 | 3.500 | 3.750 | **3.400** | R2 am tiefsten. R1/R3/R4 höher. Kompromiss. Ländlich. |
| 22 | Cranz | k.D. | 3.400 | 3.400 | 4.100² | **3.400** | R2/R3 identisch. R4 zu hoch. |

¹ R1 warnt selbst: "Der hohe ETW-Durchschnitt erklärt sich durch sehr geringe Angebotsanzahl und vereinzelte Neubauprojekte. Nicht marktrepräsentativ."
² R4 Francop/Cranz: Schätzungen basierend auf "Umlandwerten" und "Elbufer-Marschdorf". Unplausibel hoch für Dörfer unter 1.000 Einwohner.

---

## Finale Hauspreise + Mieten + Einwohner

| Stadtteil | Haus €/m² | Miete €/m² | Einwohner | Fläche km² | Bezirk | ÖPNV | Trend |
|---|---:|---:|---:|---:|---|---|---|
| Veddel | 4.200 | 11,00 | 4.328 | 4,4 | Hamburg-Mitte | S3/S31 | steigend |
| Kleiner Grasbrook | Gewerbe | Gewerbe | ~1.100 | 4,5 | Hamburg-Mitte | Bus | Gewerbe |
| Steinwerder | Gewerbe | Gewerbe | ~39 | 7,0 | Hamburg-Mitte | Fähre | Gewerbe |
| Waltershof | Gewerbe | Gewerbe | ~3 | 9,3 | Hamburg-Mitte | Fähre | Gewerbe |
| Wilhelmsburg | 4.000 | 12,00 | 54.073 | 35,3 | Hamburg-Mitte | S3/S31 | steigend |
| Finkenwerder | 3.800 | 12,00 | 11.702 | 19,3 | Hamburg-Mitte | Fähre, Bus | stabil |
| Harburg | 4.000 | 12,50 | 29.237 | 3,9 | Harburg | S3/S31, Fernbahn | steigend |
| Eissendorf | 4.000 | 12,00 | 25.557 | 5,9 | Harburg | Bus (S Harburg) | stabil |
| Heimfeld | 4.100 | 12,00 | 22.995 | 11,7 | Harburg | S3/S31 | steigend |
| Moorburg | Gewerbe | Gewerbe | ~500 | 10,3 | Harburg | Bus | Gewerbe |
| Altenwerder | Gewerbe | Gewerbe | ~3 | 9,0 | Harburg | — | Gewerbe |
| Neuland | 3.600 | 11,50 | 1.821 | 12,0 | Harburg | Bus (S Harburg) | stabil |
| Wilstorf | 3.700 | 11,50 | 17.930 | 3,2 | Harburg | Bus (S Harburg) | stabil |
| Marmstorf | 3.800 | 11,50 | 9.290 | 4,3 | Harburg | Bus, A7 | stabil |
| Langenbek | 3.700 | 11,00 | 4.075 | 2,0 | Harburg | Bus | stabil |
| Rönneburg | 3.600 | 11,00 | 3.243 | 4,0 | Harburg | Bus | stabil |
| Sinstorf | 3.600 | 11,50 | 4.329 | 4,9 | Harburg | Bus | stabil |
| Hausbruch | 3.800 | 10,50 | 16.919 | 11,2 | Harburg | S3/S31 (Neuwiedenthal) | stabil |
| Neugraben-Fischbek | 3.800 | 11,50 | 35.295 | 22,5 | Harburg | S3/S31 | steigend |
| Francop | 3.400 | 10,00 | 749 | 9,0 | Harburg | Bus | seitwärts |
| Neuenfelde | 3.500 | 10,50 | 5.314 | 15,6 | Harburg | Bus | seitwärts |
| Cranz | 3.400 | 10,50 | 858 | 1,3 | Harburg | Fähre, Bus | seitwärts |

---

## Plausibilitätsprüfung

Alle ✅ plausibel:
- Wilhelmsburg (4.400) > Harburg (4.000) ✅ IBA-Aufwertung
- Heimfeld (4.000) > Eissendorf (3.900) ✅ TU-Nähe + S-Bahn
- Marmstorf (3.900) > Wilstorf (3.700) ✅ Gehobene vs. einfache Lage
- Neugraben-Fischbek (3.800) > Hausbruch (3.700) ✅ Neubau-Effekt
- Francop (3.300) / Neuenfelde (3.400) / Cranz (3.400) am tiefsten ✅ Marschdörfer
- Neuland (3.500) günstigster urbaner Harburg-Stadtteil ✅ Gewerbe-Mix
- Harburg-Cluster (3.500-4.000) liegt 30-35% unter Hamburg-Durchschnitt (6.000) ✅

---

## Heatmap-Zuordnung Batch 3

| Stufe | Farbe | Stadtteile |
|---|---|---|
| 9.000+ | #052E26 | (keiner) |
| 7.000-8.999 | #1A5C4A | (keiner) |
| 5.000-6.999 | #3D8B6E | (keiner) |
| 3.000-4.999 | #7CB89E | Wilhelmsburg (4.400), Veddel (4.000), Harburg (4.000), Heimfeld (4.000), Finkenwerder (3.900), Eissendorf (3.900), Marmstorf (3.900), Neugraben-Fischbek (3.800), Hausbruch (3.700), Wilstorf (3.700), Sinstorf (3.700), Langenbek (3.600), Neuland (3.500), Rönneburg (3.500), Neuenfelde (3.400), Cranz (3.400), Francop (3.300) |
| unter 3.000 | #C5DDD1 | (keiner) |
| Grau (Gewerbe) | #D1D5DB | Kleiner Grasbrook, Steinwerder, Waltershof, Moorburg, Altenwerder |

Der gesamte Süden liegt in einer Heatmap-Stufe (3.000-4.999). Visuell wird das ein gleichmässiges Mintgrün. Für die Karte ist das korrekt: Der Süden ist der günstigste Grossteil Hamburgs.

---

## Tooltip-Texte

**Veddel:** Multikultureller Stadtteil auf der Elbinsel mit markanten Fritz-Schumacher-Backsteinbauten der 1920er. S3/S31 in 7 Minuten zum Hauptbahnhof. Hoher SAGA-Bestand. Einer der günstigsten zentrumsnahen Standorte.

**Kleiner Grasbrook:** Gewerbe- und Hafengebiet mit minimaler Wohnbevölkerung. Zukunftsprojekt "Grasbrook" mit ca. 3.000 geplanten Wohnungen (Realisierung über 20 Jahre). Aktuell kein Wohnimmobilienmarkt.

**Steinwerder:** Reines Hafen- und Industriegebiet (Blohm+Voss, Cruise Center, Alter Elbtunnel). Keine Wohnbebauung. Faktisch keine Wohnbevölkerung.

**Waltershof:** Reines Hafengebiet mit Container-Terminals (Burchardkai, Eurogate) und Köhlbrandbrücke. Mit 2-3 Einwohnern kleinster Stadtteil Hamburgs.

**Wilhelmsburg:** Hamburgs grösste Elbinsel und dynamischstes Stadterneuerungsgebiet. IBA 2013 hat starke Preisspreizung erzeugt: Altbestand ab 2.500 €/m², Neubauten bis 6.500+ €/m². S3/S31 (~10 Min. zum Hbf). 54.000 Einwohner.

**Finkenwerder:** Dörflich-maritimer Stadtteil am Südufer mit Backsteinbauten, EFH und Airbus-Werk. HADAG-Fähren 62/64 zu den Landungsbrücken. Beliebt bei Familien und Airbus-Mitarbeitern.

**Harburg:** Bezirkszentrum mit urbanem Charakter, historischem Binnenhafen und TU-Hamburg-Nähe. S3/S31 plus IC/ICE-Fernbahnhof. Geeignet für Studenten, Berufstätige und Investoren.

**Eissendorf:** Hügeliges Wohngebiet an den Harburger Bergen. Im Norden städtisch, im Süden grün mit Villen in Hanglage. Familienfreundlich mit moderaten Preisen.

**Heimfeld:** Beliebter Stadtteil nahe TU Hamburg mit eigener S-Bahn-Station (S3/S31). Stärkster Bodenrichtwert-Anstieg im Bezirk Harburg (+9,1% in 2025). Attraktiv für Studenten und Familien.

**Moorburg:** Ehemaliges Dorf im Hafenerweiterungsgebiet. Ca. 80% der Bewohner haben verkauft. Kohlekraftwerk 2021 stillgelegt. Kein regulärer Wohnimmobilienmarkt.

**Altenwerder:** Für den Container Terminal Altenwerder fast vollständig abgesiedelter Stadtteil. Nur noch 2-3 Einwohner. Kein Wohnimmobilienmarkt.

**Neuland:** Mischgebiet aus Wohnen und Gewerbe südlich von Harburg. Einer der günstigsten Einstiegspreise im Bezirk. Überwiegend Ein- und Zweifamilienhäuser. Busanbindung nach Harburg.

**Wilstorf:** Vielfältiger Stadtteil südlich des Harburger Zentrums mit dem lebendigen Phönix-Viertel. Breites Wohnungsspektrum. Busanbindung nach Harburg (S3/S31).

**Marmstorf:** Gehobene Wohnlage in Harburg mit historischem Dorfkern, Jugendstilvillen und Einfamilienhäusern in Hanglage. Eigene A7-Auffahrt. Ideal für Familien.

**Langenbek:** Kleiner, ruhiger Stadtteil mit überwiegend Reihenhäusern aus den 1950ern und Neubaugebiet "Langenbeker Feld". Busanbindung nach Harburg/Neuwiedenthal.

**Rönneburg:** Einer der günstigsten Stadtteile Hamburgs. Ländlicher Charakter mit überwiegend Einfamilien- und Siedlungshäusern. Sehr kleiner Markt. Busanbindung.

**Sinstorf:** Hamburgs südlichster Stadtteil mit historischem Dorfkern und Hamburgs ältester Kirche (11. Jh.). S-Bahn Neuwiedenthal in Reichweite.

**Hausbruch:** Vielfältiger Stadtteil mit Grosswohnsiedlung Neuwiedenthal und grünen EFH-Lagen in Falkenberg. Günstige Mieten. S3/S31 Neuwiedenthal.

**Neugraben-Fischbek:** Hamburgs grösstes Neubaugebiet mit über 5.200 neuen Wohneinheiten (Vogelkamp, Fischbeker Heidbrook, Fischbeker Reethen). Zwei S-Bahn-Stationen, A26-Anschluss im Bau.

**Francop:** Winziges Marschland-Dorf im Alten Land mit nur 750 Einwohnern. Teil des grössten Obstanbaugebiets Mitteleuropas. Minimale Datenbasis. Für Naturliebhaber und Selbstversorger.

**Neuenfelde:** Grösstes Hamburger Dorf im Alten Land mit denkmalgeschützten Fachwerkhöfen und Obstplantagen. Berühmte Arp-Schnitger-Orgel. Nähe Airbus-Werk.

**Cranz:** Kleines historisches Deichhufendorf und "Tor zum Alten Land". Beliebtes Ausflugsziel mit Fähranleger nach Blankenese. Nur 860 Einwohner und 4 Strassen.
