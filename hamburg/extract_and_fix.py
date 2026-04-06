#!/usr/bin/env python3
"""
Extrahiert 4 fehlende Bezirke aus hamburg-referenzbild5.svg und aktualisiert HamburgSVG.jsx.
"""

import re
import json
import math
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SVG_PATH = os.path.join(BASE_DIR, 'hamburg-referenzbild5.svg')
JSX_PATH = os.path.join(BASE_DIR, '..', 'src', 'components', 'Map', 'HamburgSVG.jsx')
OUTPUT_JSON = os.path.join(BASE_DIR, 'missing-districts-2.json')

# Label-Positionen der 4 fehlenden Bezirke (aus dem SVG extrahiert)
TARGETS = {
    'hammerbrook':     {'labelX': 267.6, 'labelY': 295.2},   # Mittelwert y von 292.7 und 297.7
    'rothenburgsort':  {'labelX': 288.7, 'labelY': 309.7},   # Mittelwert y von 307.2 und 312.2
    'billbrook':       {'labelX': 323.9, 'labelY': 324.1},
    'billstedt':       {'labelX': 355.3, 'labelY': 296.3},
}

# ══════════════════════════════════════════════
# TASK 1: Pfade aus Referenz-SVG extrahieren
# ══════════════════════════════════════════════

def parse_path_numbers(d_attr):
    """Extrahiert alle Koordinaten aus einem SVG-Pfad und berechnet den Centroid."""
    # Finde alle absoluten Koordinaten (nach M, L, C, S, Q, T, A, H, V)
    # Vereinfacht: Alle Zahlenpaare extrahieren
    numbers = re.findall(r'[-+]?\d*\.?\d+', d_attr)
    if len(numbers) < 2:
        return None, None

    # Sammle x,y Paare aus dem Pfad
    # Einfacher Ansatz: Parse die Pfad-Kommandos
    xs = []
    ys = []

    # Tokenize the path
    tokens = re.findall(r'[MmLlCcSsQqTtAaHhVvZz]|[-+]?\d*\.?\d+', d_attr)

    cmd = None
    coords = []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t.isalpha():
            cmd = t
            coords = []
            i += 1
            continue

        val = float(t)
        coords.append(val)

        if cmd in ('M', 'L', 'T'):
            if len(coords) == 2:
                xs.append(coords[0])
                ys.append(coords[1])
                coords = []
        elif cmd in ('m', 'l', 't'):
            if len(coords) == 2:
                # Relative. Fuer Centroid ignorieren wir relative Kommandos.
                coords = []
        elif cmd in ('C',):
            if len(coords) == 6:
                xs.extend([coords[0], coords[2], coords[4]])
                ys.extend([coords[1], coords[3], coords[5]])
                coords = []
        elif cmd in ('c',):
            if len(coords) == 6:
                coords = []
        elif cmd in ('S', 'Q'):
            if len(coords) == 4:
                xs.extend([coords[0], coords[2]])
                ys.extend([coords[1], coords[3]])
                coords = []
        elif cmd in ('s', 'q'):
            if len(coords) == 4:
                coords = []
        elif cmd in ('H',):
            xs.append(val)
            coords = []
        elif cmd in ('V',):
            ys.append(val)
            coords = []
        elif cmd in ('h', 'v'):
            coords = []
        elif cmd in ('A',):
            if len(coords) == 7:
                xs.append(coords[5])
                ys.append(coords[6])
                coords = []
        elif cmd in ('a',):
            if len(coords) == 7:
                coords = []
        elif cmd in ('Z', 'z'):
            coords = []

        i += 1

    if not xs or not ys:
        return None, None

    return sum(xs) / len(xs), sum(ys) / len(ys)


def extract_district_paths():
    """Liest das SVG und extrahiert alle Pfade im Districts-Bereich."""
    with open(SVG_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Finde den Districts-Bereich
    districts_start = content.find('<g id="Districts">')
    if districts_start == -1:
        raise ValueError("Districts-Gruppe nicht gefunden")

    # Finde das Ende der Districts-Gruppe (naechstes </g> auf gleicher Ebene)
    # Zaehle verschachtelte <g> Tags
    pos = districts_start + len('<g id="Districts">')
    depth = 1
    districts_end = None
    while pos < len(content) and depth > 0:
        next_open = content.find('<g', pos)
        next_close = content.find('</g>', pos)

        if next_close == -1:
            break

        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 2
        else:
            depth -= 1
            if depth == 0:
                districts_end = next_close + 4
            pos = next_close + 4

    districts_section = content[districts_start:districts_end]

    # Extrahiere alle path d-Attribute
    paths = re.findall(r'<path[^>]*\sd="([^"]*)"', districts_section, re.DOTALL)

    print(f"Gefunden: {len(paths)} Pfade im Districts-Bereich")

    # Berechne Centroids
    path_data = []
    for d in paths:
        # Bereinige Zeilenumbrueche und Tabs
        d_clean = re.sub(r'\s+', ' ', d).strip()
        cx, cy = parse_path_numbers(d_clean)
        if cx is not None:
            path_data.append({'d': d_clean, 'cx': cx, 'cy': cy})

    print(f"Davon mit gueltigem Centroid: {len(path_data)}")
    return path_data


def match_districts(path_data):
    """Ordnet jedem Ziel-Bezirk den naechstgelegenen Pfad zu."""
    result = {}
    used_indices = set()

    for name, info in TARGETS.items():
        lx, ly = info['labelX'], info['labelY']
        best_dist = float('inf')
        best_idx = -1

        for i, pd in enumerate(path_data):
            if i in used_indices:
                continue
            dist = math.sqrt((pd['cx'] - lx)**2 + (pd['cy'] - ly)**2)
            if dist < best_dist:
                best_dist = dist
                best_idx = i

        if best_idx >= 0:
            used_indices.add(best_idx)
            pd = path_data[best_idx]
            result[name] = {
                'd': pd['d'],
                'labelX': info['labelX'],
                'labelY': info['labelY'],
                'centroidX': round(pd['cx'], 1),
                'centroidY': round(pd['cy'], 1),
                'distance': round(best_dist, 1),
            }
            print(f"  {name}: Centroid ({pd['cx']:.1f}, {pd['cy']:.1f}), Label ({lx}, {ly}), Dist={best_dist:.1f}")

    return result


# ══════════════════════════════════════════════
# TASK 2: Pfad-Transformation
# ══════════════════════════════════════════════

SCALE = 2.4349
OFFSET_X = 43.6
OFFSET_Y = 89.6
SHIFT_Y = 58.7


def transform_path(d_attr):
    """Transformiert einen SVG-Pfad mit den gegebenen Parametern."""
    tokens = re.findall(r'[MmLlCcSsQqTtAaHhVvZz]|[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', d_attr)

    result = []
    cmd = None
    coords = []
    i = 0

    def fmt(val):
        """Formatiert Zahl: maximal 2 Dezimalstellen, keine trailing zeros."""
        r = round(val, 2)
        if r == int(r):
            return str(int(r))
        return f"{r:.2f}".rstrip('0').rstrip('.')

    def transform_abs_x(v):
        return (v - OFFSET_X) * SCALE

    def transform_abs_y(v):
        return (v - OFFSET_Y) * SCALE + SHIFT_Y

    def transform_rel(v):
        return v * SCALE

    while i < len(tokens):
        t = tokens[i]
        if re.match(r'[A-Za-z]', t):
            # Flush previous command coords
            if cmd and coords:
                flush_coords(result, cmd, coords)
            cmd = t
            coords = []
            result.append(t)
            i += 1
            continue

        coords.append(float(t))

        # Bestimme wie viele Parameter pro Kommando
        params_needed = {
            'M': 2, 'm': 2, 'L': 2, 'l': 2, 'T': 2, 't': 2,
            'H': 1, 'h': 1, 'V': 1, 'v': 1,
            'C': 6, 'c': 6, 'S': 4, 's': 4, 'Q': 4, 'q': 4,
            'A': 7, 'a': 7,
            'Z': 0, 'z': 0,
        }.get(cmd, 0)

        if params_needed > 0 and len(coords) == params_needed:
            if cmd in ('M', 'L', 'T'):
                result.append(fmt(transform_abs_x(coords[0])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[1])))
            elif cmd in ('m', 'l', 't'):
                result.append(fmt(transform_rel(coords[0])))
                result.append(',')
                result.append(fmt(transform_rel(coords[1])))
            elif cmd == 'H':
                result.append(fmt(transform_abs_x(coords[0])))
            elif cmd == 'h':
                result.append(fmt(transform_rel(coords[0])))
            elif cmd == 'V':
                result.append(fmt(transform_abs_y(coords[0])))
            elif cmd == 'v':
                result.append(fmt(transform_rel(coords[0])))
            elif cmd == 'C':
                result.append(fmt(transform_abs_x(coords[0])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[1])))
                result.append(' ')
                result.append(fmt(transform_abs_x(coords[2])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[3])))
                result.append(' ')
                result.append(fmt(transform_abs_x(coords[4])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[5])))
            elif cmd == 'c':
                result.append(fmt(transform_rel(coords[0])))
                result.append(',')
                result.append(fmt(transform_rel(coords[1])))
                result.append(' ')
                result.append(fmt(transform_rel(coords[2])))
                result.append(',')
                result.append(fmt(transform_rel(coords[3])))
                result.append(' ')
                result.append(fmt(transform_rel(coords[4])))
                result.append(',')
                result.append(fmt(transform_rel(coords[5])))
            elif cmd == 'S':
                result.append(fmt(transform_abs_x(coords[0])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[1])))
                result.append(' ')
                result.append(fmt(transform_abs_x(coords[2])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[3])))
            elif cmd == 's':
                result.append(fmt(transform_rel(coords[0])))
                result.append(',')
                result.append(fmt(transform_rel(coords[1])))
                result.append(' ')
                result.append(fmt(transform_rel(coords[2])))
                result.append(',')
                result.append(fmt(transform_rel(coords[3])))
            elif cmd == 'Q':
                result.append(fmt(transform_abs_x(coords[0])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[1])))
                result.append(' ')
                result.append(fmt(transform_abs_x(coords[2])))
                result.append(',')
                result.append(fmt(transform_abs_y(coords[3])))
            elif cmd == 'q':
                result.append(fmt(transform_rel(coords[0])))
                result.append(',')
                result.append(fmt(transform_rel(coords[1])))
                result.append(' ')
                result.append(fmt(transform_rel(coords[2])))
                result.append(',')
                result.append(fmt(transform_rel(coords[3])))
            elif cmd in ('A', 'a'):
                # rx, ry, rotation, large-arc, sweep, x, y
                if cmd == 'A':
                    result.append(fmt(transform_rel(coords[0])))
                    result.append(',')
                    result.append(fmt(transform_rel(coords[1])))
                    result.append(' ')
                    result.append(fmt(coords[2]))
                    result.append(' ')
                    result.append(str(int(coords[3])))
                    result.append(' ')
                    result.append(str(int(coords[4])))
                    result.append(' ')
                    result.append(fmt(transform_abs_x(coords[5])))
                    result.append(',')
                    result.append(fmt(transform_abs_y(coords[6])))
                else:
                    result.append(fmt(transform_rel(coords[0])))
                    result.append(',')
                    result.append(fmt(transform_rel(coords[1])))
                    result.append(' ')
                    result.append(fmt(coords[2]))
                    result.append(' ')
                    result.append(str(int(coords[3])))
                    result.append(' ')
                    result.append(str(int(coords[4])))
                    result.append(' ')
                    result.append(fmt(transform_rel(coords[5])))
                    result.append(',')
                    result.append(fmt(transform_rel(coords[6])))
            coords = []

        i += 1

    # Join mit intelligenten Leerzeichen
    out = []
    for j, part in enumerate(result):
        if part in (',', ' '):
            out.append(part)
        elif j > 0 and result[j-1] not in (',', ' ') and not re.match(r'[A-Za-z]', part):
            # Zahl nach Zahl: Leerzeichen
            if not re.match(r'[A-Za-z]', result[j-1]):
                out.append(' ')
            out.append(part)
        else:
            out.append(part)

    return ''.join(out)


def flush_coords(result, cmd, coords):
    """Nicht benutzt, alle Koordinaten werden inline verarbeitet."""
    pass


# ══════════════════════════════════════════════
# TASK 2: JSX-Datei aktualisieren
# ══════════════════════════════════════════════

NEW_LABELS = """const LABELS = [
  // Große Stadtteile: size 10
  { id: 'rahlstedt',     x: 875, y: 336, lines: ['Rahlstedt'],           size: 10 },
  { id: 'bramfeld',      x: 703, y: 320, lines: ['Bramfeld'],            size: 10 },
  { id: 'bahrenfeld',    x: 313, y: 452, lines: ['Bahrenfeld'],          size: 10 },
  { id: 'winterhude',    x: 548, y: 390, lines: ['Winterhude'],          size: 10 },
  // Normale Stadtteile: size 9
  { id: 'blankenese',    x: 92,  y: 496, lines: ['Blankenese'],          size: 9 },
  { id: 'stellingen',    x: 367, y: 403, lines: ['Stellingen'],          size: 9 },
  { id: 'lokstedt',      x: 425, y: 384, lines: ['Lokstedt'],            size: 9 },
  { id: 'eimsbuettel',   x: 429, y: 459, lines: ['Eimsbüttel'],          size: 9 },
  { id: 'eppendorf',     x: 478, y: 393, lines: ['Eppendorf'],           size: 9 },
  { id: 'harvestehude',  x: 480, y: 445, lines: ['Harveste-', 'hude'],   size: 9 },
  { id: 'uhlenhorst',    x: 563, y: 455, lines: ['Uhlenhorst'],          size: 9 },
  { id: 'barmbek-nord',  x: 625, y: 372, lines: ['Barmbek-', 'Nord'],    size: 9 },
  { id: 'barmbek-sued',  x: 599, y: 434, lines: ['Barmbek-', 'Süd'],     size: 9 },
  { id: 'wandsbek',      x: 687, y: 416, lines: ['Wandsbek'],            size: 9 },
  { id: 'othmarschen',   x: 293, y: 538, lines: ['Othmarschen'],         size: 9 },
  { id: 'ottensen',      x: 358, y: 541, lines: ['Ottensen'],            size: 9 },
  { id: 'eilbek',        x: 618, y: 472, lines: ['Eilbek'],              size: 9 },
  { id: 'st-georg',      x: 545, y: 515, lines: ['St. Georg'],           size: 9 },
  // Kleinere Stadtteile
  { id: 'rotherbaum',    x: 498, y: 487, lines: ['Rother-', 'baum'],     size: 7 },
  { id: 'hoheluft-west', x: 450, y: 430, lines: ['Hoheluft-W'],          size: 6 },
  { id: 'hoheluft-ost',  x: 470, y: 421, lines: ['Hoheluft-O'],          size: 6 },
  { id: 'sternschanze',  x: 449, y: 498, lines: ['Stern-', 'schanze'],   size: 6 },
]"""

NEW_GREY_LABELS = """const GREY_LABELS = [
  // Norden
  { id: 'langenhorn',      x: 505, y: 151, lines: ['Langenhorn'],           size: 9 },
  { id: 'fuhlsbuettel',    x: 490, y: 267, lines: ['Fuhlsbüttel'],          size: 8 },
  { id: 'ohlsdorf',        x: 617, y: 287, lines: ['Ohlsdorf'],             size: 9 },
  { id: 'alsterdorf',      x: 536, y: 325, lines: ['Alsterdorf'],           size: 8 },
  { id: 'gross-borstel',   x: 492, y: 323, lines: ['Groß', 'Borstel'],     size: 8 },
  // Nordwesten
  { id: 'schnelsen',       x: 347, y: 237, lines: ['Schnelsen'],            size: 8 },
  { id: 'niendorf',        x: 426, y: 270, lines: ['Niendorf'],             size: 9 },
  { id: 'eidelstedt',      x: 275, y: 333, lines: ['Eidelstedt'],           size: 8 },
  // Westen
  { id: 'lurup',           x: 254, y: 380, lines: ['Lurup'],                size: 8 },
  { id: 'osdorf',          x: 201, y: 453, lines: ['Osdorf'],               size: 8 },
  { id: 'gross-flottbek',  x: 248, y: 489, lines: ['Groß', 'Flottbek'],    size: 8 },
  { id: 'nienstedten',     x: 193, y: 528, lines: ['Nienstedten'],          size: 8 },
  // Zentrum-Sued (Altona-Altstadt + Altona-Nord zusammengelegt)
  { id: 'altona',          x: 404, y: 517, lines: ['Altona'],               size: 9 },
  { id: 'st-pauli',        x: 463, y: 526, lines: ['St. Pauli'],            size: 8 },
  { id: 'neustadt',        x: 486, y: 536, lines: ['Neustadt'],             size: 8 },
  { id: 'hamburg-altstadt', x: 520, y: 545, lines: ['Altstadt'],            size: 7 },
  { id: 'hafencity',       x: 533, y: 570, lines: ['HafenCity'],            size: 7 },
  // Zentrum-Ost
  { id: 'hohenfelde',      x: 565, y: 497, lines: ['Hohenfelde'],           size: 6 },
  { id: 'borgfelde',       x: 584, y: 523, lines: ['Borgfelde'],            size: 6 },
  { id: 'hammerbrook',     x: 546, y: 559, lines: ['Hammerbrook'],          size: 8 },
  { id: 'rothenburgsort',  x: 598, y: 595, lines: ['Rothenbursort'],        size: 7 },
  { id: 'billbrook',       x: 683, y: 629, lines: ['Billbrook'],            size: 7 },
  { id: 'billstedt',       x: 758, y: 561, lines: ['Billstedt'],            size: 8 },
  // Osten
  { id: 'dulsberg',        x: 652, y: 422, lines: ['Dulsberg'],             size: 8 },
  { id: 'marienthal',      x: 693, y: 476, lines: ['Marienthal'],           size: 8 },
  { id: 'hamm',            x: 633, y: 532, lines: ['Hamm'],                 size: 8 },
  { id: 'horn',            x: 702, y: 534, lines: ['Horn'],                 size: 8 },
  // Nordosten
  { id: 'steilshoop',      x: 639, y: 323, lines: ['Steilshoop'],           size: 8 },
  { id: 'wellingbuettel',  x: 690, y: 225, lines: ['Wellings-', 'büttel'], size: 8 },
  { id: 'sasel',           x: 758, y: 184, lines: ['Sasel'],                size: 8 },
  { id: 'poppenbuettel',   x: 674, y: 155, lines: ['Poppenbüttel'],         size: 8 },
  { id: 'farmsen-berne',   x: 772, y: 305, lines: ['Farmsen-', 'Berne'],   size: 8 },
  { id: 'tonndorf',        x: 769, y: 408, lines: ['Tonndorf'],             size: 8 },
  { id: 'jenfeld',         x: 784, y: 445, lines: ['Jenfeld'],              size: 8 },
]"""


def update_jsx(matched_districts):
    """Aktualisiert die HamburgSVG.jsx-Datei."""
    with open(JSX_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Neue Bezirke zum ALL_DISTRICTS-Array hinzufuegen
    # Finde das Ende des ALL_DISTRICTS-Arrays (erste ] nach der Definition)
    all_dist_start = content.find('const ALL_DISTRICTS = [')
    if all_dist_start == -1:
        raise ValueError("ALL_DISTRICTS nicht gefunden")

    # Finde das schliessende ]
    bracket_depth = 0
    pos = all_dist_start
    all_dist_end = None
    while pos < len(content):
        if content[pos] == '[':
            bracket_depth += 1
        elif content[pos] == ']':
            bracket_depth -= 1
            if bracket_depth == 0:
                all_dist_end = pos
                break
        pos += 1

    if all_dist_end is None:
        raise ValueError("Ende von ALL_DISTRICTS nicht gefunden")

    # Erstelle neue Bezirk-Eintraege
    new_entries = []
    for name in ['hammerbrook', 'rothenburgsort', 'billbrook', 'billstedt']:
        d = matched_districts[name]['d']
        transformed = transform_path(d)
        new_entries.append(f"  {{ id: '{name}', path: '{transformed}' }},")

    # Fuege vor dem ] ein
    insert_text = '\n'.join(new_entries) + '\n'
    content = content[:all_dist_end] + insert_text + content[all_dist_end:]

    # 2. LABELS ersetzen
    labels_start = content.find('const LABELS = [')
    labels_end_bracket = content.find(']', labels_start)
    # Finde das richtige ] (nicht innerhalb eines Strings)
    bracket_depth = 0
    pos = labels_start
    while pos < len(content):
        if content[pos] == '[':
            bracket_depth += 1
        elif content[pos] == ']':
            bracket_depth -= 1
            if bracket_depth == 0:
                labels_end = pos + 1
                break
        pos += 1

    content = content[:labels_start] + NEW_LABELS + content[labels_end:]

    # 3. GREY_LABELS ersetzen
    grey_start = content.find('const GREY_LABELS = [')
    bracket_depth = 0
    pos = grey_start
    while pos < len(content):
        if content[pos] == '[':
            bracket_depth += 1
        elif content[pos] == ']':
            bracket_depth -= 1
            if bracket_depth == 0:
                grey_end = pos + 1
                break
        pos += 1

    content = content[:grey_start] + NEW_GREY_LABELS + content[grey_end:]

    # Schreibe die aktualisierte Datei
    with open(JSX_PATH, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\nJSX aktualisiert: {JSX_PATH}")


def main():
    print("=== TASK 1: Pfade aus Referenz-SVG extrahieren ===\n")
    path_data = extract_district_paths()
    matched = match_districts(path_data)

    # JSON speichern
    json_output = {}
    for name in ['hammerbrook', 'rothenburgsort', 'billbrook', 'billstedt']:
        m = matched[name]
        json_output[name] = {
            'd': m['d'],
            'labelX': m['labelX'],
            'labelY': m['labelY'],
        }

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(json_output, f, indent=2, ensure_ascii=False)

    print(f"\nJSON gespeichert: {OUTPUT_JSON}")

    print("\n=== TASK 2: JSX aktualisieren ===\n")
    update_jsx(matched)

    print("\nFertig.")


if __name__ == '__main__':
    main()
