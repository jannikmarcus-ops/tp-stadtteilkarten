# Münster-Karte Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Münster-Stadtteilkarte mit detailgetreuen Bezier-Kurven-Grenzen neu zeichnen und den Hafen an die korrekte Position verschieben.

**Architecture:** Einzige betroffene Datei ist `src/components/Map/MuensterSVG.jsx`. Die bisherigen Koordinaten-Arrays (`pts2path()`) werden durch fertige SVG-Pfad-Strings mit Cubic-Bezier-Kurven ersetzt. Die Komponenten-Logik (DistrictPath, Hover, Stagger) bleibt unverändert.

**Tech Stack:** React, SVG (Cubic Bezier Paths), Vite

---

## Kontext für den Entwickler

### Datei-Übersicht
- **Modify:** `src/components/Map/MuensterSVG.jsx` (einzige Datei)

### Aktuelle Struktur (wird ersetzt)
Die Karte nutzt aktuell Koordinaten-Arrays und eine `pts2path()`-Funktion die gerade Linien (`L`-Commands) erzeugt. Das ergibt eckige, unrealistische Grenzen. Die neue Version nutzt vordefinierte SVG-Pfad-Strings mit Bezier-Kurven.

### Geographische Referenz (aus den 3 Referenzbildern)

**Stadtform:** Münster ist NICHT kreisförmig. Die Form ist ein unregelmäßiges Polygon:
- Norden: relativ flache Kante, leicht nach oben gewölbt bei Sprakel
- Nordosten: Gelmer ragt nach rechts oben
- Osten: Handorf hat eine ausgeprägte "Nase" nach Osten (ca. 30% breiter als die Westseite)
- Südosten: Wolbeck ragt nach unten rechts
- Süden: Hiltrup und Amelsbüren erstrecken sich weit nach Süden
- Südwesten: Amelsbüren hat eine breite Süd-Ausdehnung
- Westen: Roxel ist kantig, nicht rund
- Nordwesten: Nienberge/Häger relativ gerade Kante

**Hafen-Position (KRITISCH):**
Laut Referenzbild 2 (Nr. 18 "Hafen") liegt der Hafen:
- Nördlich der Altstadt (Nr. 3 "Dom")
- Östlich von Pluggendorf (Nr. 6)
- Südlich von Kinderhaus (Nr. 22 "Uppenberg" Bereich)
- Am Dortmund-Ems-Kanal
- NICHT nordöstlich wie aktuell, sondern direkt NÖRDLICH

**Mitte-Bereich (Referenzbild 2, Nummern 1-18):**
Das Zentrum besteht aus vielen kleinen Vierteln. Von West nach Ost, Nord nach Süd:
- Reihe N: Pluggendorf (6), Hafen (18), Mauritz-Mitte (20)
- Reihe M: Aaseestadt (15/Schloss), Kreuzviertel (14), Altstadt/Dom (3), Mauritz (9/Buddenturm)
- Reihe S: Sentrup (12), Geist (16), Schützenhof (17)

### ViewBox
Aktuell: `0 0 800 780`. Bleibt bei `0 0 800 780`.

---

## Task 1: Stadtgrenze und Außenviertel (Norden + Osten)

**Files:**
- Modify: `src/components/Map/MuensterSVG.jsx:1-178`

### Geographische Analyse der nördlichen/östlichen Außenviertel

Aus den Referenzbildern:
- **Häger** (NW): Großer Stadtteil, flache Nordkante, grenzt an Nienberge (S), Sprakel (E), Stadtgrenze (N/W)
- **Sprakel** (N): Mittelgroß, leichte Wölbung nach oben, grenzt an Häger (W), Gelmer (E), Kinderhaus (S)
- **Gelmer** (NE): Ragt nach rechts oben, grenzt an Sprakel (W), Handorf (S), Stadtgrenze (N/E)
- **Handorf** (E): Sehr groß, ausgeprägte Ost-Nase, grenzt an Gelmer (N), Coerde (NW), Mauritz (W), Gremmendorf (SW), Wolbeck (S)
- **Coerde** (N-mitte): Mittelgroß, grenzt an Kinderhaus (W), Handorf (E), Mauritz/Hafen (S)

- [ ] **Step 1: Backup der aktuellen Datei erstellen**

```bash
cp src/components/Map/MuensterSVG.jsx src/components/Map/MuensterSVG.jsx.bak
```

- [ ] **Step 2: Imports und Hilfsfunktionen anpassen**

Ersetze den gesamten Bereich von Zeile 1 bis zum Ende der PATHS-Generierung (Zeile 168) mit der neuen Struktur. Die `pts2path()`-Funktion entfällt. Stattdessen werden alle Pfade direkt als `d`-Strings definiert.

Ersetze Zeile 18-21 (`pts2path` Funktion) durch: nichts (entfernen).

Ersetze Zeile 23-167 (alle Koordinaten-Definitionen, ALL_DISTRICTS, PATHS) durch die neue Pfad-Definition.

Die neue Datenstruktur sieht so aus:

```jsx
// Alle 26 Stadtteile als SVG-Pfade mit Bezier-Kurven
// Gezeichnet nach Referenzbildern reference-1.png, reference-2.png, reference-3.png
// ViewBox: 0 0 800 780

const ALL_DISTRICTS = [
  // ... (Pfade werden in den folgenden Steps definiert)
]

const INTERACTIVE_IDS = new Set([
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
  'nienberge', 'kinderhaus', 'coerde', 'handorf',
  'gremmendorf', 'wolbeck', 'angelmodde', 'hiltrup', 'amelsbueren', 'roxel',
  'sprakel', 'gelmer', 'haeger', 'geist', 'schuetzenhof', 'berg-fidel', 'mecklenbeck', 'albachten',
])

const PATHS = ALL_DISTRICTS.map(d => ({
  id: d.id,
  path: d.path,
  interactive: INTERACTIVE_IDS.has(d.id),
}))
```

- [ ] **Step 3: Zeichne die Stadtgrenze**

Die Stadtgrenze (`CITY_BOUNDARY`) muss als Bezier-Pfad neu gezeichnet werden. Orientierung an reference-1.png (zeigt die Außengrenze am detailliertesten).

Wichtige Formmerkmale:
- NW (Häger): Relativ gerade, leicht eingebuchtet
- N (Sprakel): Leichte Wölbung nach oben
- NE (Gelmer): Ausbuchtung nach rechts oben
- E (Handorf): Starke Ausbuchtung nach rechts ("Nase")
- SE (Wolbeck): Ausbuchtung nach rechts unten
- S (Hiltrup): Erstreckt sich weit nach Süden
- SW (Amelsbüren): Breite Ausdehnung nach Südwesten
- W (Roxel): Kantige Westseite
- NW (Nienberge): Relativ gerade

```jsx
const CITY_BOUNDARY = 'M130,130 C125,110 135,85 148,72 C158,62 140,52 128,42 C138,32 168,25 192,22 C220,18 248,16 262,15 C290,14 320,14 338,12 C360,11 382,14 400,16 C420,18 440,22 455,22 C478,24 500,30 518,36 C540,44 558,52 572,60 C588,70 600,80 608,88 C618,98 632,108 645,120 C660,135 675,152 682,158 C695,172 708,198 712,208 C720,228 726,252 725,264 C724,280 724,300 722,314 C720,330 714,348 708,354 C700,365 692,378 688,384 C682,392 674,404 668,408 C660,416 658,432 658,442 C658,458 662,475 662,484 C662,498 662,515 660,524 C658,538 652,555 648,564 C644,578 636,600 632,614 C626,630 616,648 608,652 C598,660 582,675 572,678 C560,684 540,695 528,698 C515,702 495,712 478,714 C462,716 445,720 432,722 C418,724 400,726 388,724 C375,722 358,728 348,728 C335,728 318,732 308,732 C295,730 280,728 272,724 C262,720 248,712 238,708 C225,702 212,690 205,684 C195,675 182,660 175,652 C165,640 155,625 148,614 C140,600 132,582 125,572 C118,558 110,538 105,524 C98,508 88,485 82,474 C74,458 68,438 65,424 C60,408 56,388 55,374 C52,358 50,340 50,324 C50,308 50,288 52,274 C54,258 56,242 58,234 C62,220 68,205 72,194 C78,180 86,168 92,158 C100,148 115,135 130,130 Z'
```

- [ ] **Step 4: Zeichne Häger, Sprakel, Gelmer (Nordviertel)**

Anhand Referenz-1 und Referenz-2:
- Häger ist links oben, große Fläche
- Sprakel mittig oben
- Gelmer rechts oben

```jsx
{ id: 'haeger', path: 'M130,130 C125,110 135,85 148,72 C158,62 140,52 128,42 C138,32 168,25 192,22 C220,18 248,16 262,15 C280,16 300,18 320,25 L325,108 C310,112 285,118 260,128 C240,135 210,140 190,142 C170,143 150,140 130,130 Z' },
{ id: 'sprakel', path: 'M320,25 C335,18 355,14 370,12 C385,11 400,14 415,16 C430,18 445,22 455,22 L440,105 C425,100 405,98 385,100 C365,102 345,105 325,108 L320,25 Z' },
{ id: 'gelmer', path: 'M455,22 C478,24 500,30 518,36 C540,44 558,52 572,60 C588,70 600,80 608,88 L558,115 C545,108 525,102 505,100 C485,98 465,100 440,105 L455,22 Z' },
```

- [ ] **Step 5: Zeichne Coerde und Handorf (Nordost/Ost)**

Handorf ist der größte Stadtteil im Osten mit der charakteristischen "Nase".

```jsx
{ id: 'coerde', path: 'M440,105 C455,108 475,112 490,118 C510,125 535,128 558,115 L548,232 C530,228 505,230 478,235 C460,238 445,238 435,235 L420,175 C425,155 432,135 440,105 Z' },
{ id: 'handorf', path: 'M558,115 C570,108 590,98 608,88 C618,98 632,108 645,120 C660,135 675,152 682,158 C695,172 708,198 712,208 C720,228 726,252 725,264 C724,280 724,300 722,314 C720,330 714,348 708,354 C700,365 692,378 688,384 C682,392 674,404 668,408 C660,416 658,432 658,442 L548,420 C552,405 555,390 555,375 C555,355 553,335 550,318 C548,298 548,268 548,232 L558,115 Z' },
```

- [ ] **Step 6: App starten und visuell prüfen**

```bash
cd ~/Projects/tp-stadtteilkarten && npm run dev
```

Erwartung: Die Nordviertel (Häger, Sprakel, Gelmer, Coerde, Handorf) und die Stadtgrenze sind sichtbar. Grenzen sind geschwungen, nicht eckig. Die Ost-Nase von Handorf ist erkennbar.

- [ ] **Step 7: Commit**

```bash
git add src/components/Map/MuensterSVG.jsx
git commit -m "refactor: Stadtgrenze und Nordviertel mit Bezier-Kurven neu gezeichnet"
```

---

## Task 2: Außenviertel Süden und Westen

**Files:**
- Modify: `src/components/Map/MuensterSVG.jsx`

### Geographische Analyse

- **Nienberge** (NW): Groß, grenzt an Häger (N), Kinderhaus (E), Gievenbeck (S), Roxel (SW)
- **Roxel** (W): Sehr groß, kantige Westseite, grenzt an Nienberge (N), Gievenbeck (E), Mecklenbeck (SE), Albachten (S)
- **Albachten** (SW): Mittelgroß, grenzt an Roxel (N), Mecklenbeck (E), Amelsbüren (S)
- **Amelsbüren** (S): Groß, breite Südausdehnung, grenzt an Albachten (NW), Mecklenbeck (N), Hiltrup (E)
- **Hiltrup** (S): Sehr groß, grenzt an Amelsbüren (W), Berg Fidel (N), Angelmodde (NE), Wolbeck (E)
- **Wolbeck** (SE): Groß, grenzt an Gremmendorf (N), Angelmodde (W), Hiltrup (SW), Handorf (N)
- **Gremmendorf** (SE): Mittelgroß, grenzt an Handorf (NE), Schützenhof (W), Angelmodde (S), Wolbeck (S)
- **Angelmodde** (S): Klein, grenzt an Gremmendorf (N), Wolbeck (E), Hiltrup (S), Berg Fidel (W)

- [ ] **Step 1: Zeichne Nienberge und Roxel (Westviertel)**

```jsx
{ id: 'nienberge', path: 'M130,130 C150,140 170,143 190,142 C210,140 240,135 260,128 L252,192 C248,208 240,218 230,228 C218,240 205,248 195,255 C182,262 172,268 168,278 L72,194 C78,180 86,168 92,158 C100,148 115,135 130,130 Z' },
{ id: 'roxel', path: 'M72,194 L168,278 C165,292 162,308 162,322 C162,338 165,355 170,370 C175,385 182,398 188,408 L178,542 C168,538 155,530 142,520 L125,572 C118,558 110,538 105,524 C98,508 88,485 82,474 C74,458 68,438 65,424 C60,408 56,388 55,374 C52,358 50,340 50,324 C50,308 50,288 52,274 C54,258 56,242 58,234 C62,220 68,205 72,194 Z' },
```

- [ ] **Step 2: Zeichne Albachten und Amelsbüren (Südwesten)**

```jsx
{ id: 'albachten', path: 'M178,542 C172,548 162,558 155,568 L125,572 C132,582 140,600 148,614 C155,625 165,640 175,652 C182,660 195,675 205,684 L215,630 C218,618 220,605 225,595 C230,582 240,570 252,558 C262,548 275,540 290,535 L178,542 Z' },
{ id: 'amelsbueren', path: 'M205,684 C212,690 225,702 238,708 C248,712 262,720 272,724 C280,728 295,730 308,732 C318,732 335,728 348,728 C358,728 375,722 388,724 L360,615 C350,618 338,620 325,618 C310,615 298,610 290,605 L290,535 C278,538 265,545 252,558 C240,570 230,582 225,595 C220,605 218,618 215,630 L205,684 Z' },
```

- [ ] **Step 3: Zeichne Hiltrup (Süden)**

```jsx
{ id: 'hiltrup', path: 'M388,724 C400,726 418,724 432,722 C445,720 462,716 478,714 C495,712 515,702 528,698 C540,695 560,684 572,678 L538,622 C525,628 510,632 498,630 C485,628 470,620 458,612 C448,604 438,598 428,595 C418,592 405,590 395,590 C382,590 370,595 360,615 L388,724 Z' },
```

- [ ] **Step 4: Zeichne Wolbeck, Gremmendorf, Angelmodde (Südosten)**

```jsx
{ id: 'wolbeck', path: 'M538,622 C548,618 558,612 565,605 C572,596 578,585 582,575 C588,562 594,548 598,538 L660,524 C658,538 652,555 648,564 C644,578 636,600 632,614 C626,630 616,648 608,652 C598,660 582,675 572,678 L538,622 Z' },
{ id: 'gremmendorf', path: 'M548,420 L658,442 C658,458 662,475 662,484 C662,498 662,515 660,524 L598,538 C592,530 582,522 572,518 C560,512 545,508 535,505 L535,475 C538,458 542,440 548,420 Z' },
{ id: 'angelmodde', path: 'M535,505 C525,508 512,515 498,525 C488,532 478,540 470,548 L458,612 C448,604 438,598 428,595 L445,542 C448,528 455,515 462,505 C470,495 480,488 492,482 C505,475 520,472 535,475 L535,505 Z' },
```

- [ ] **Step 5: App starten und visuell prüfen**

```bash
cd ~/Projects/tp-stadtteilkarten && npm run dev
```

Erwartung: Alle Außenviertel sind sichtbar, geschwungene Grenzen, keine Lücken am Rand. Die Gesamtform entspricht den Referenzbildern.

- [ ] **Step 6: Commit**

```bash
git add src/components/Map/MuensterSVG.jsx
git commit -m "refactor: Außenviertel Süd/West mit Bezier-Kurven gezeichnet"
```

---

## Task 3: Innenviertel und Hafen-Korrektur

**Files:**
- Modify: `src/components/Map/MuensterSVG.jsx`

### Geographische Analyse Innenstadt

Laut Referenzbild 2 (nummerierte Karte) und Referenzbild 3:
- **Kinderhaus** (22): Groß, nördlich der Innenstadt, grenzt an Häger (NW), Sprakel (N), Coerde (E), Hafen (S), Pluggendorf (SW), Gievenbeck (SW)
- **Gievenbeck** (24): Groß, westlich, grenzt an Nienberge (N), Kinderhaus (NE), Aaseestadt (E), Sentrup (SE), Mecklenbeck (S), Roxel (W)
- **Pluggendorf** (6): Klein, nördlich der Altstadt, westlich vom Hafen
- **Hafen** (18): Klein, NÖRDLICH der Altstadt (NICHT nordöstlich!), am Dortmund-Ems-Kanal, östlich von Pluggendorf
- **Altstadt/Dom** (3): Zentrum, sehr klein
- **Kreuzviertel** (14): Klein, westlich der Altstadt
- **Aaseestadt** (15): Klein, westlich, am Aasee
- **Sentrup** (12): Mittelgroß, südwestlich
- **Mauritz** (9/20): Groß, östlich der Altstadt
- **Geist** (16): Klein, südlich der Altstadt
- **Schützenhof** (17): Klein, südöstlich
- **Berg Fidel** (19/23): Mittelgroß, südlich
- **Mecklenbeck** (26): Mittelgroß, südwestlich

- [ ] **Step 1: Zeichne Kinderhaus und Gievenbeck**

```jsx
{ id: 'kinderhaus', path: 'M325,108 C345,105 365,102 385,100 C405,98 425,100 440,105 L420,175 C415,185 412,195 410,205 C408,215 405,225 400,232 L395,248 C388,252 378,255 370,255 C360,255 348,252 338,248 C325,242 312,238 300,235 L252,192 C260,175 270,160 280,148 C290,138 305,125 325,108 Z' },
{ id: 'gievenbeck', path: 'M252,192 L300,235 C295,248 292,262 290,275 C288,290 286,305 286,318 C286,332 288,348 290,358 C292,368 295,378 298,388 L268,412 C255,405 238,400 225,398 C210,395 198,395 188,408 L168,278 C172,268 182,262 195,255 C205,248 218,240 230,228 C240,218 248,208 252,192 Z' },
```

- [ ] **Step 2: Zeichne Zentrumsviertel mit korrekter Hafen-Position**

Der Hafen liegt NÖRDLICH der Altstadt, ÖSTLICH von Pluggendorf:

```jsx
{ id: 'pluggendorf', path: 'M338,248 C345,252 355,255 362,255 L362,278 C358,282 355,288 352,295 C350,302 348,310 348,318 L328,318 C325,308 322,298 320,288 C318,278 320,268 325,258 C328,252 332,248 338,248 Z' },
{ id: 'hafen-zentrum', path: 'M362,255 C370,255 378,255 385,252 L395,248 C398,255 400,265 400,275 C400,285 398,295 395,305 L392,318 L348,318 C350,310 352,302 355,295 C358,288 360,280 362,278 L362,255 Z' },
{ id: 'altstadt-dom', path: 'M348,318 L392,318 C394,328 395,340 394,350 C393,360 390,368 386,375 L365,385 C358,382 350,378 345,372 C340,365 336,355 334,345 C332,335 332,328 335,322 C337,320 342,318 348,318 Z' },
{ id: 'kreuzviertel', path: 'M328,318 C326,325 325,332 326,340 C327,348 330,358 334,365 L334,345 Z M328,318 C325,325 322,335 322,345 C322,355 324,365 328,375 C332,382 338,388 345,392 L365,385 C358,382 350,378 345,372 C340,365 336,355 334,345 C332,335 332,328 335,322 Z' },
```

Hinweis: Kreuzviertel muss korrigiert werden. Sauberer Pfad:

```jsx
{ id: 'kreuzviertel', path: 'M328,318 C325,325 322,335 322,345 C322,355 324,365 328,375 C332,382 338,388 345,392 L365,385 C358,382 350,378 345,372 C340,365 336,355 334,345 C332,335 332,328 335,322 L328,318 Z' },
```

- [ ] **Step 3: Zeichne Aaseestadt, Sentrup, Mauritz**

```jsx
{ id: 'aaseestadt', path: 'M300,235 C305,238 312,242 320,248 L325,258 C320,268 318,278 320,288 C322,298 325,308 328,318 L322,345 C322,335 320,325 316,318 C312,310 305,305 298,300 C292,295 288,290 286,318 Z' },
```

Hinweis: Aaseestadt ist sehr klein und liegt direkt westlich des Zentrums. Korrekter Pfad:

```jsx
{ id: 'aaseestadt', path: 'M290,275 C292,268 295,260 300,255 L320,265 C318,275 316,285 316,295 C316,305 318,315 318,325 L298,358 C292,348 288,335 286,318 C286,305 288,290 290,275 Z' },
{ id: 'sentrup', path: 'M298,358 C295,368 292,378 290,388 L268,412 C272,425 278,438 285,448 C292,458 302,465 312,470 L345,445 C340,435 335,425 332,415 C330,405 330,395 332,388 C335,380 340,375 345,392 Z' },
```

Mauritz ist groß und liegt östlich:

```jsx
{ id: 'mauritz', path: 'M395,248 L435,235 C445,238 460,240 478,235 L548,232 C548,268 548,298 550,318 C553,335 555,355 555,375 C555,390 552,405 548,420 L492,415 C485,410 475,405 465,402 C455,400 442,400 432,402 L395,395 C398,385 400,375 400,365 C400,355 398,342 395,330 L392,318 C398,315 400,305 400,295 C400,285 400,275 398,265 L395,248 Z' },
```

- [ ] **Step 4: Zeichne Geist, Schützenhof, Berg Fidel, Mecklenbeck**

```jsx
{ id: 'geist', path: 'M345,392 C350,395 358,398 365,400 C372,402 380,402 386,400 L395,395 C400,402 405,410 408,418 C412,428 414,438 415,448 L388,445 C378,442 368,440 358,440 C348,440 340,442 332,445 L345,445 C340,435 335,425 332,415 C330,405 335,398 345,392 Z' },
```

Korrektur Geist (sauber):

```jsx
{ id: 'geist', path: 'M345,392 C355,398 365,400 375,400 C382,400 390,398 395,395 L432,402 C435,412 436,422 435,432 L388,445 C375,442 360,440 345,445 C340,435 335,425 332,415 C330,405 335,398 345,392 Z' },
{ id: 'schuetzenhof', path: 'M432,402 C442,400 455,400 465,402 C475,405 485,410 492,415 L535,475 C520,472 505,475 492,482 C480,488 470,495 462,505 L435,432 C436,422 435,412 432,402 Z' },
{ id: 'berg-fidel', path: 'M345,445 C360,440 375,442 388,445 L435,432 L462,505 C455,515 448,528 445,542 L428,595 C418,592 405,590 395,590 C382,590 370,595 360,615 L325,618 C318,608 312,595 308,582 C305,568 305,555 308,542 C310,528 315,515 320,502 C325,488 332,475 338,465 C342,458 345,452 345,445 Z' },
{ id: 'mecklenbeck', path: 'M188,408 C198,395 210,395 225,398 C238,400 255,405 268,412 L290,388 C292,378 295,368 298,358 L318,325 C316,335 314,348 314,360 Z M188,408 L268,412 C272,425 278,438 285,448 C292,458 305,468 312,470 L345,445 C342,458 338,470 332,482 C325,495 318,510 310,525 C305,535 300,538 290,535 L178,542 C182,530 185,515 188,500 C190,485 192,468 192,452 C192,438 190,425 188,408 Z' },
```

- [ ] **Step 5: App starten und visuell prüfen**

```bash
cd ~/Projects/tp-stadtteilkarten && npm run dev
```

Erwartung: Alle 26 Stadtteile sichtbar, Hafen liegt NÖRDLICH der Altstadt, keine Lücken, natürlich wirkende Grenzen.

- [ ] **Step 6: Commit**

```bash
git add src/components/Map/MuensterSVG.jsx
git commit -m "refactor: Innenviertel mit Bezier-Kurven, Hafen-Position korrigiert"
```

---

## Task 4: Labels anpassen und Feinschliff

**Files:**
- Modify: `src/components/Map/MuensterSVG.jsx`

- [ ] **Step 1: Label-Positionen an neue Grenzen anpassen**

Die Labels müssen in die Zentroide der neuen Pfade verschoben werden. Die `INTERACTIVE_LABELS` Array muss aktualisiert werden.

```jsx
const INTERACTIVE_LABELS = [
  { id: 'pluggendorf',    x: 355, y: 285, lines: ['Pluggen-', 'dorf'],    size: 7 },
  { id: 'hafen-zentrum',  x: 378, y: 285, lines: ['Hafen'],              size: 7 },
  { id: 'altstadt-dom',   x: 370, y: 348, lines: ['Altstadt'],           size: 8 },
  { id: 'kreuzviertel',   x: 335, y: 355, lines: ['Kreuz-', 'viertel'], size: 7 },
  { id: 'aaseestadt',     x: 242, y: 298, lines: ['Aasee-', 'stadt'],   size: 8, leader: [290, 310] },
  { id: 'sentrup',        x: 310, y: 418, lines: ['Sentrup'],            size: 10 },
  { id: 'mauritz',        x: 490, y: 328, lines: ['Mauritz'],            size: 12 },
  { id: 'gievenbeck',     x: 228, y: 328, lines: ['Gieven-', 'beck'],   size: 10 },
  { id: 'nienberge',      x: 168, y: 208, lines: ['Nienberge'],          size: 10 },
  { id: 'kinderhaus',     x: 365, y: 178, lines: ['Kinderhaus'],         size: 10 },
  { id: 'coerde',         x: 498, y: 168, lines: ['Coerde'],             size: 10 },
  { id: 'handorf',        x: 645, y: 278, lines: ['Handorf'],            size: 14 },
  { id: 'gremmendorf',    x: 600, y: 488, lines: ['Gremmen-', 'dorf'],  size: 10 },
  { id: 'wolbeck',        x: 608, y: 598, lines: ['Wolbeck'],            size: 11 },
  { id: 'angelmodde',     x: 490, y: 542, lines: ['Angel-', 'modde'],   size: 8 },
  { id: 'hiltrup',        x: 462, y: 658, lines: ['Hiltrup'],            size: 13 },
  { id: 'amelsbueren',    x: 320, y: 678, lines: ['Amels-', 'büren'],   size: 10 },
  { id: 'roxel',          x: 118, y: 405, lines: ['Roxel'],              size: 11 },
  { id: 'haeger',         x: 225, y: 78,  lines: ['Häger'],              size: 10 },
  { id: 'sprakel',        x: 388, y: 58,  lines: ['Sprakel'],            size: 10 },
  { id: 'gelmer',         x: 525, y: 68,  lines: ['Gelmer'],             size: 10 },
  { id: 'geist',          x: 388, y: 418, lines: ['Geist'],              size: 8 },
  { id: 'schuetzenhof',   x: 478, y: 445, lines: ['Schützen-', 'hof'],  size: 7 },
  { id: 'berg-fidel',     x: 398, y: 508, lines: ['Berg', 'Fidel'],     size: 8 },
  { id: 'mecklenbeck',    x: 248, y: 478, lines: ['Mecklen-', 'beck'],  size: 9 },
  { id: 'albachten',      x: 195, y: 598, lines: ['Albachten'],          size: 10 },
]
```

- [ ] **Step 2: DARK_DISTRICTS aktualisieren falls nötig**

Prüfen ob die gleichen Viertel noch dunkel gefärbt sind. Hängt von den Preisdaten ab, DARK_DISTRICTS bleibt vermutlich gleich.

- [ ] **Step 3: Visuell prüfen und Grenzen feinjustieren**

```bash
cd ~/Projects/tp-stadtteilkarten && npm run dev
```

Checkliste:
- [ ] Hafen liegt nördlich der Altstadt
- [ ] Keine Lücken zwischen Stadtteilen
- [ ] Alle 26 IDs klickbar
- [ ] Labels lesbar und innerhalb der Flächen
- [ ] Gesamtform entspricht Referenzbildern
- [ ] Handorf hat Ost-Nase
- [ ] Roxel/Albachten haben kantigere Westseite
- [ ] Hover-Effekte funktionieren
- [ ] Stagger-Animation funktioniert
- [ ] Detail-Panel öffnet sich korrekt

- [ ] **Step 4: Lücken und Überlappungen korrigieren**

Falls bei der visuellen Prüfung Lücken oder Überlappungen auffallen:
Angrenzende Pfade müssen an den Berührungspunkten exakt die gleichen Koordinaten teilen. Gemeinsame Grenzpunkte identifizieren und angleichen.

- [ ] **Step 5: Finaler Commit**

```bash
git add src/components/Map/MuensterSVG.jsx
git commit -m "feat: Münster-Karte mit detailgetreuen Bezier-Grenzen und korrekter Hafen-Position"
```

---

## Wichtige Hinweise für den Entwickler

### Gemeinsame Grenzen
Wenn zwei Stadtteile eine Grenze teilen, MÜSSEN die Bezier-Kontrollpunkte dieser Grenze in beiden Pfaden identisch sein (nur die Richtung ist umgekehrt). Sonst entstehen Lücken.

Beispiel: Die Grenze zwischen Häger und Sprakel verläuft ungefähr bei x=320, y=25 bis x=325, y=108. Beide Pfade müssen exakt diese Punkte und Kurven verwenden.

### Referenzbilder
- `reference-1.png`: Beste Quelle für Stadtgrenze und Außenviertel-Grenzen
- `reference-2.png`: Beste Quelle für Innenstadt-Viertel und Hafen-Position (Nr. 18)
- `reference-3.png`: Beste Quelle für Proportionen und Flächenverhältnisse

### Prioritäten bei Konflikten
1. Keine Lücken zwischen Vierteln (höchste Priorität)
2. Hafen an korrekter Position (nördlich der Altstadt)
3. Realistische Gesamtform
4. Detailgetreue Einzelgrenzen
