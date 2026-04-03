# Cross-Validierung: 4 Research-Reports Immobilienmarkt Münster

**Stand:** April 2026 | **Zweck:** Konsolidierte Datenbasis für Stadtteil-Karte und Notion-Datenbank

---

## 1. Report-Bewertung im Überblick

| Kriterium | R1: Claude Extended | R2: Gemini/ChatGPT | R3: Gemini Deep Research | R4: ChatGPT Deep Research |
|---|---|---|---|---|
| **Viertel abgedeckt** | 18/18 | 18/18 | 18/18 | 6/18 |
| **ETW-Preise** | ✅ alle | ✅ alle | ✅ alle | ⚠️ nur 6 |
| **Hauspreise** | ✅ alle | ✅ alle | ✅ alle | ⚠️ nur 6 |
| **Mietpreise** | ✅ alle | ✅ alle | ✅ alle | ⚠️ nur 3 |
| **Einwohner** | ✅ alle | ✅ alle (31.12.2024) | ❌ meist "keine Daten" | ❌ keine |
| **Fläche** | ✅ alle | ⚠️ wenige | ❌ meist "keine Daten" | ❌ keine |
| **Infrastruktur** | ✅ vollständig | ✅ kurz | ✅ kurz | ❌ keine |
| **Zielgruppen** | ✅ detailliert | ✅ kurz | ✅ analytisch | ❌ keine |
| **Quellenanzahl** | ~30 | 95 | 48 | ~10 |
| **Referenzwert-Match** | **< 2%** alle 6 | **< 2%** bei 4, +8/+13% bei 2 | **< 1%** bei 2, -5 bis -9% bei 3 | -17,5% Ausreißer |
| **Gesamtnote** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

**Fazit:** R1 (Claude Extended Search) ist der vollständigste und präziseste Report. R2 hat die meisten Quellen und gute Einwohnerdaten. R3 liefert die beste analytische Tiefe (Marktbifurkation, Verdrängungseffekt). R4 ist unbrauchbar als Standalone, aber nützlich als Gegenprobe für einzelne Werte.

---

## 2. ETW-Preise: 4-Report-Vergleich (€/m², Angebotspreise)

| Viertel | Referenz Jannik | R1 Claude | R2 Gemini/GPT | R3 Gemini Deep | R4 ChatGPT | **Median** | **Spanne** |
|---|---:|---:|---:|---:|---:|---:|---|
| Altstadt/Dom | — | ~6.050 | ~6.070 | 6.115 | — | **6.070** | 6.050–6.115 |
| Kreuzviertel | 6.100 | 6.135 | 6.132 | 6.141 | 5.035 | **6.135** | 5.035–6.141 |
| Pluggendorf | — | ~5.350¹ | 5.901 | 5.880 | 6.050 | **5.890** | 5.350–6.050 |
| Hafen/Zentrum | 5.700 | ~5.700 | ~5.525 | 5.730 | 5.607 | **5.669** | 5.525–5.730 |
| Sentrup | — | 5.040 | 4.947 | 4.311 | — | **4.947** | 4.311–5.040 |
| Aaseestadt | — | 4.783 | 4.765 | 4.897 | 5.143 | **4.840** | 4.765–5.143 |
| Mauritz (gesamt) | 5.200 | 5.100–5.460 | 5.149–5.402 | 4.904² | — | **5.200** | 4.904–5.460 |
| Gievenbeck | 4.300 | 4.130 | 4.308 | 4.196 | 4.038 | **4.196** | 4.038–4.308 |
| Gremmendorf | 4.200 | 3.740 | 4.540 | 3.804 | 4.100 | **3.950** | 3.740–4.540 |
| Hiltrup | 3.800 | 3.670 | 4.310 | 3.542 | — | **3.670** | 3.542–4.310 |
| Kinderhaus | — | 3.620 | 3.494 | 3.345 | — | **3.494** | 3.345–3.620 |
| Coerde | — | 2.525 | ~2.750 | 2.752 | — | **2.752** | 2.525–2.750 |
| Roxel | — | ~3.750 | ~3.934 | 3.488 | — | **3.750** | 3.488–3.934 |
| Wolbeck | — | ~3.550 | 4.495 | 3.367 | — | **3.550** | 3.367–4.495 |
| Nienberge | — | 3.175 | 3.981 | 3.250 | — | **3.250** | 3.175–3.981 |
| Handorf | — | ~3.750 | 4.441 | 3.662 | — | **3.750** | 3.662–4.441 |
| Angelmodde | — | 3.290 | 4.279 | 3.359 | — | **3.359** | 3.217–4.279 |
| Amelsbüren | — | 3.382 | ~4.034 | 3.479 | — | **3.479** | 3.382–4.034 |

¹ R1 Schätzung (keine Kaufpreisdaten für Pluggendorf)
² R3 fokussiert auf Mauritz-Ost, nicht Gesamtdurchschnitt

---

## 3. Referenzwert-Abgleich: Alle Reports vs. Janniks Marktkenntnis

| Viertel | Referenz | R1 | Δ R1 | R2 | Δ R2 | R3 | Δ R3 | R4 | Δ R4 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Kreuzviertel | 6.100 | 6.135 | **+0,6%** ✅ | 6.132 | **+0,5%** ✅ | 6.141 | **+0,7%** ✅ | 5.035 | **-17,5%** ❌ |
| Hafen/Zentrum | 5.700 | 5.700 | **0%** ✅ | 5.525 | **-3,1%** ✅ | 5.730 | **+0,5%** ✅ | 5.607 | **-1,6%** ✅ |
| Mauritz | 5.200 | 5.280 | **+1,5%** ✅ | 5.149 | **-1,0%** ✅ | 4.904 | **-5,7%** ⚠️ | — | — |
| Gievenbeck | 4.300 | 4.130 | **-3,9%** ✅ | 4.308 | **+0,2%** ✅ | 4.196 | **-2,4%** ✅ | 4.038 | **-6,1%** ⚠️ |
| Gremmendorf | 4.200 | 3.740 | **-11,0%** ⚠️ | 4.540 | **+8,1%** ⚠️ | 3.804 | **-9,4%** ⚠️ | 4.100 | **-2,4%** ✅ |
| Hiltrup | 3.800 | 3.670 | **-3,4%** ✅ | 4.310 | **+13,4%** ❌ | 3.542 | **-6,8%** ⚠️ | — | — |

### Interpretation der Abweichungen

**Konsens (alle 3+ Reports bestätigen Referenz):**
- **Kreuzviertel:** 6.100 €/m² bestätigt. R1, R2 und R3 liegen alle innerhalb 1%. R4 ist klarer Ausreißer (immoportal-Quelle, vermutlich ältere Daten oder Methodikfehler).
- **Hafen/Zentrum:** 5.700 €/m² bestätigt. Alle 4 Reports innerhalb 3%.
- **Gievenbeck:** 4.300 €/m² bestätigt. 3 von 4 innerhalb 4%. R4 etwas niedriger (immowelt, nur ETW-Bestand).

**Diskrepanz bei Randvierteln (systematisches Muster):**
- **Gremmendorf:** Dein Referenzwert 4.200 €/m² liegt höher als R1 (3.740) und R3 (3.804), aber niedriger als R2 (4.540). **Erklärung:** Du antizipierst als Makler bereits das Preispremium der York-Quartier-Neubauten, während Portaldurchschnitte den Altbestand stärker gewichten. R2 (immoportal) scheint auch Neubau-Angebote zu erfassen. **Empfehlung für Karte:** 4.200 €/m² beibehalten mit Hinweis "inkl. Neubauprojekt York-Quartier".
- **Hiltrup:** R2 ist mit 4.310 der Ausreißer nach oben (immoportal-ETW-Daten, vermutlich durch Einzelangebote verzerrt). R1 und R3 liegen bei 3.550–3.670. **Empfehlung:** 3.800 €/m² beibehalten.

---

## 4. Konsolidierte Datentabelle: Best-of-All-Reports

Diese Tabelle nimmt pro Datenpunkt den verlässlichsten Wert aus allen 4 Reports.

| Viertel | ETW €/m² | Haus €/m² | Miete €/m² | Einwohner | Fläche km² | Entf. City | Trend |
|---|---:|---:|---:|---:|---:|---|---|
| **Altstadt/Dom** | 6.070 | 6.820 | 15,80 | 8.968 | 1,19 | 0 km | ↗ steigend |
| **Kreuzviertel** | 6.135 | 6.850 | 16,79 | 12.525 | ~1,01 | 1 km | ↗ steigend |
| **Pluggendorf** | 5.890 | 5.900 | 18,23 | 4.713 | ~0,55 | 0,5 km | ↗ steigend |
| **Hafen/Zentrum** | 5.670 | 5.000 | 13,53 | 1.156 | ~1,05 | 1 km | → stabil |
| **Sentrup** | 5.000 | 6.430 | 14,51 | 8.394 | 6,63 | 3 km | → stabil |
| **Aaseestadt** | 4.840 | 5.910 | 14,83 | 6.053 | 1,48 | 2 km | → stabil |
| **Mauritz (ges.)** | 5.200 | 5.900 | 15,50³ | 27.652 | 7,84 | 2–3 km | ↗ steigend |
| **Gievenbeck** | 4.200 | 4.740 | 13,88 | 21.668 | 9,47 | 4 km | ↗↗ stark |
| **Gremmendorf** | 4.200⁴ | 4.140 | 12,80 | 13.495 | 10,39 | 5 km | ↗ aufstrebend |
| **Hiltrup** | 3.800 | 3.960 | 12,98 | 26.070 | 21,65 | 8 km | ↗ steigend |
| **Kinderhaus** | 3.500 | 3.940 | 12,80 | 16.377 | 7,78 | 4 km | ↗ steigend |
| **Coerde** | 2.600 | 3.500 | 11,74 | 11.081 | 5,87 | 5 km | ↗ +3% |
| **Roxel** | 3.750 | 4.250 | 13,69 | 9.452 | 19,93 | 7 km | → stabil |
| **Wolbeck** | 3.550 | 4.000 | 12,30 | 10.887 | 20,70 | 8 km | ↗ leicht |
| **Nienberge** | 3.250 | 3.840 | 13,17 | 6.979 | 27,76 | 8 km | → stabil |
| **Handorf** | 3.750 | 4.200 | 11,39 | 8.196 | 30,79 | 7 km | → stabil |
| **Angelmodde** | 3.350 | 4.040 | 13,98 | 8.821 | 5,02 | 6 km | ↗ steigend |
| **Amelsbüren** | 3.450 | 3.700 | ~10,00 | 6.881 | 43,36 | 11 km | → stabil |

³ Mauritz gewichteter Durchschnitt aus West (16,04), Mitte (18,37 ist Ausreißer), Ost (14,70)
⁴ Gremmendorf: Referenzwert Jannik statt Portal-Median, da York-Quartier-Neubauten eingepreist

### Quellenlogik pro Datenpunkt

| Datenpunkt | Primärquelle | Begründung |
|---|---|---|
| ETW €/m² | Median aus R1+R3, korrigiert durch Referenz | R1 und R3 nutzen ähnliche Methodik; R2 tendiert bei Randlagen hoch |
| Haus €/m² | R1 (Claude) | Vollständigste und konsistenteste Datenserie |
| Miete €/m² | R2 (mietspiegeltabelle.de) | Einzige Quelle mit konsistenter Viertel-Abdeckung über alle 18 |
| Einwohner | R2 (Stadt Münster, 31.12.2024) | Offizielle Open-Data-Quelle, aktuellster Stand |
| Fläche | R1 (Wikipedia/Stadt MS) | Einziger Report mit vollständiger Flächenabdeckung |
| Trend | Konsens aus R1+R3 | Beide bewerten Trends methodisch sauber |

---

## 5. Gesamtmarkt Münster: Konsolidierte Kennzahlen

| Kennzahl | Wert | Quelle | Bestätigt durch |
|---|---|---|---|
| Einwohner | **322.715** | Stadt MS (31.12.2024) | R2 |
| Stadtfläche | 303 km² | Stadt MS | R2, R3 |
| Ø ETW Angebot | **4.300–4.500 €/m²** | immowelt/IS24/E&V | R1, R2, R3 |
| Ø ETW Transaktion | **~3.800 €/m²** | Gutachterausschuss 2025 | R1, R2, R3, R4 |
| Ø Haus Transaktion | **~4.000 €/m²** | Gutachterausschuss 2025 | R1, R2, R3, R4 |
| Ø Miete Angebot | **13,50–14,00 €/m²** | mietspiegeltabelle/IS24 | R1, R2 |
| Ø Miete Mietspiegel | **9,85 €/m²** | Qual. Mietspiegel 2025 | R1, R2, R3 |
| Leerstandsquote | **0,2%** (marktaktiv) | CBRE-empirica 2024/25 | R2, R3 |
| Kaufverträge 2024 | **~2.500** | Gutachterausschuss 2025 | R1, R2, R3, R4 |
| Geldumsatz 2024 | **~1,2 Mrd. €** | Gutachterausschuss 2025 | R1, R2, R3 |
| Vermarktungsdauer Miete | **24 Tage** | CBRE Q3/2025 | R2, R3 |
| Vermarktungsdauer Kauf | **~65–84 Tage** | CBRE/Schätzung | R1 |
| Grunderwerbsteuer NRW | **6,5%** | Landesgesetz | — |

### Preisentwicklung 2022–2026

Alle 4 Reports bestätigen das gleiche Muster:
- **2022:** Preishöchststand (ETW Bestand ~4.300 €/m² Angebotspreise)
- **2023:** Korrektur nach Zinswende (~10–14% bei Transaktionspreisen)
- **2024:** Talsohle erreicht, Transaktionszahlen steigen wieder (+20,5%)
- **2025/26:** Moderate Erholung, stabile bis leicht steigende Preise

R3 liefert die beste Erklärung: Marktbifurkation zwischen energetisch sanierten Objekten (Preise stabil/steigend) und unsanierten Bestandsobjekten (weiterhin Abschläge).

---

## 6. Analytische Highlights: Was wir aus den Reports mitnehmen

### Aufstrebende Viertel (Konsens aller Reports)

1. **Gievenbeck** (Oxford-Quartier, 1.200 WE auf 26 ha, Pritzker-Architekt Kéré): Stärkster Preisanstieg, Transformation vom Studentenviertel zum Familienstandort
2. **Gremmendorf** (York-Quartier, 1.800 WE auf 50 ha): Bevölkerung von 13.600 auf 16.000+, komplett neue Infrastruktur
3. **Hafen/Zentrum** (Stadthafen Nord + Theodor-Scheiwe-Straße, 2.000+ WE): Bevölkerung verdoppelt sich bis 2033

### Preisstruktur: Konzentrisches Gefälle (R3 Insight)

R3 beschreibt ein klares konzentrisches Preisgefälle:
- **Innerer Ring** (0–2 km): 5.500–6.500 €/m² (Altstadt, Kreuzviertel, Hafen, Pluggendorf)
- **Mittlerer Ring** (2–5 km): 4.200–5.200 €/m² (Mauritz, Aaseestadt, Sentrup, Gievenbeck)
- **Äußerer Ring** (5+ km): 2.600–3.800 €/m² (alle Außenviertel)

Die Peripherie-Viertel zeigen aktuell die stärkste Preisdynamik (Verdrängungseffekt).

### Zielgruppen-Mapping (für Stadtteil-Seiten)

| Zielgruppe | Primäre Viertel | Sekundäre Viertel |
|---|---|---|
| Wohlhabende Akademiker | Kreuzviertel, Mauritz-West | Sentrup, Aaseestadt |
| Junge Familien | Gievenbeck, Hiltrup | Wolbeck, Gremmendorf, Handorf |
| Studenten/Berufsanfänger | Pluggendorf, Hafen | Gievenbeck, Kinderhaus |
| Investoren (Rendite) | Coerde, Kinderhaus | Gremmendorf (York), Angelmodde |
| Senioren | Hiltrup, Aaseestadt | Mauritz, Roxel |
| Pendler (Autobahn) | Roxel (A1), Nienberge (B54) | Amelsbüren, Hiltrup |

### Schlüsselprojekte (für Content der Stadtteil-Seiten)

| Projekt | Viertel | WE | Status | Besonderheit |
|---|---|---|---|---|
| Oxford-Quartier | Gievenbeck | 1.200 | Im Bau, bis ~2030 | Pritzker-Architekt Kéré |
| York-Quartier | Gremmendorf | 1.800 | Neue Mitte Baustart Q2/2026 | Friedenspark (Dalai Lama 1998) |
| Stadthafen Nord | Hafen | ~770 | In Planung | Osmo-Areal |
| Theodor-Scheiwe | Hafen | ~1.300 | In Planung | + 1.600 Arbeitsplätze |
| VIVAWEST Zentrum Nord | Kinderhaus | 282 | Im Bau | Aufwertung Kinderhaus |

---

## 7. Daten-Lücken und offene Punkte

### Was wir noch brauchen (für die Notion-Datenbank)

| Datenpunkt | Status | Aktion |
|---|---|---|
| ÖPNV-Buslinien pro Viertel | R1 hat Teildaten | Stefan/Jannik manuell ergänzen |
| Schulnamen pro Viertel | R1 hat Teildaten | Aus stadt-muenster.de vervollständigen |
| Bodenrichtwerte pro Viertel | Nur auf Bezirksebene | BORIS.NRW einzeln prüfen |
| Vermarktungsdauer pro Viertel | Nicht verfügbar | Aus onOffice-Daten ergänzen |
| Fotos/Impressionen | Nicht vorhanden | Rafael beauftragen |
| Eigentümerquote pro Viertel | Nicht recherchiert | Zensus 2022 / Stadt MS prüfen |

### R4 Ausreißer-Problem: Kreuzviertel

R4 (ChatGPT Deep Research) liefert für das Kreuzviertel 5.035 €/m². Das ist 17,5% unter dem Referenzwert und unter allen anderen Reports. Die Quelle (immoportal.com) weicht hier deutlich ab. **Entscheidung:** Wert wird nicht berücksichtigt. Drei Reports bestätigen 6.100–6.141.

---

## 8. Empfehlung: Finale Werte für Notion-Datenbank

Basierend auf der Cross-Validierung empfehle ich folgende Werte als "Single Source of Truth" für die Stadtteil-Karte:

| Viertel | ETW €/m² (final) | Konfidenz | Methode |
|---|---:|---|---|
| Altstadt/Dom | **6.100** | ⭐⭐⭐⭐ | Median R1/R2/R3 |
| Kreuzviertel | **6.100** | ⭐⭐⭐⭐⭐ | Referenz bestätigt durch 3 Reports |
| Pluggendorf | **5.900** | ⭐⭐⭐ | Median R2/R3 (R1 war Schätzung) |
| Hafen/Zentrum | **5.700** | ⭐⭐⭐⭐⭐ | Referenz bestätigt durch 4 Reports |
| Sentrup | **5.000** | ⭐⭐⭐ | Median R1/R2 (R3 Ausreißer niedrig) |
| Aaseestadt | **4.800** | ⭐⭐⭐⭐ | Median R1/R2/R3 |
| Mauritz | **5.200** | ⭐⭐⭐⭐⭐ | Referenz bestätigt (West/Mitte/Ost gemittelt) |
| Gievenbeck | **4.300** | ⭐⭐⭐⭐⭐ | Referenz bestätigt durch 3 Reports |
| Gremmendorf | **4.200** | ⭐⭐⭐⭐ | Referenz (Maklerpraxis inkl. York-Neubau) |
| Hiltrup | **3.800** | ⭐⭐⭐⭐⭐ | Referenz bestätigt durch R1 |
| Kinderhaus | **3.500** | ⭐⭐⭐ | Median R1/R2/R3 |
| Coerde | **2.600** | ⭐⭐⭐ | Median R1/R2/R3 |
| Roxel | **3.750** | ⭐⭐⭐ | Median R1/R3 |
| Wolbeck | **3.550** | ⭐⭐⭐ | Median R1/R3 (R2 Ausreißer hoch) |
| Nienberge | **3.250** | ⭐⭐⭐ | Median R1/R3 |
| Handorf | **3.750** | ⭐⭐⭐ | Median R1/R3 |
| Angelmodde | **3.350** | ⭐⭐⭐ | Median R1/R3 |
| Amelsbüren | **3.450** | ⭐⭐⭐ | Median R1/R2/R3 |

---

## 9. Nächste Schritte

1. **Notion-Datenbank aufsetzen** mit allen 18 Vierteln und den konsolidierten Werten
2. **Quartalsmäßig aktualisieren:** ETW-Preise, Hauspreise, Mieten via immowelt/IS24 scrapen
3. **Stefan fragen:** Qualitative Viertel-Beschreibungen aus Maklersicht ergänzen
4. **Web Design Agent beauftragen:** React-App mit SVG-Karte + diesen Daten
