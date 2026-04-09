#!/usr/bin/env python3
"""
Konvertiert die OSM-Rohdaten (raw-boundaries.json) in SVG-Pfade.
Gibt district-paths.json aus mit allen 26 Muensteraner Stadtteilen.

Schritte:
1. Relations und Ways aus den Rohdaten parsen
2. Polygone aus den Ways zusammenbauen
3. Lat/Lon in SVG-Koordinaten projizieren (viewBox 0 0 800 780)
4. Douglas-Peucker-Vereinfachung
5. SVG-Pfad-Strings generieren
"""

import json
import math
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIR, 'raw-boundaries.json')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'district-paths.json')

# Ziel-ViewBox
TARGET_WIDTH = 800
TARGET_HEIGHT = 780
PADDING = 20

# Vereinfachungstoleranzen (in SVG-Pixeln)
SIMPLIFY_TOLERANCE = 1.2

# Mapping: OSM-Name -> App-ID
# Manche OSM-Namen weichen von unseren IDs ab
NAME_TO_ID = {
    # admin_level=10 Stadtteile
    'Wolbeck': 'wolbeck',
    'Angelmodde': 'angelmodde',
    'Gremmendorf': 'gremmendorf',
    'Gelmer-Dyckburg': 'gelmer',
    'Handorf': 'handorf',
    'Coerde': 'coerde',
    'Kinderhaus': 'kinderhaus',
    'Sprakel': 'sprakel',
    'Amelsbüren': 'amelsbueren',
    'Berg Fidel': 'berg-fidel',
    'Hiltrup': 'hiltrup',
    'Albachten': 'albachten',
    'Mecklenbeck': 'mecklenbeck',
    'Nienberge': 'nienberge',
    'Roxel': 'roxel',
    'Gievenbeck': 'gievenbeck',
    'Sentruper Höhe': 'sentrup',

    # admin_level=11 Unter-Stadtteile (feinere Aufteilung der Innenstadt)
    'Kreuzviertel': 'kreuzviertel',
    'Pluggendorf': 'pluggendorf',
    'Hafen': 'hafen-zentrum',
    'Aaseestadt': 'aaseestadt',
    'Geist': 'geist',
    'Schützenhof': 'schuetzenhof',

    # Altstadt = Innenstadtring (level=10) ODER Altstadt (level=10)
    # In OSM gibt es "Altstadt" (level=10) UND "Innenstadtring" (level=10)
    # Wir nehmen Innenstadtring als altstadt-dom
    'Innenstadtring': 'altstadt-dom',

    # Mauritz: Kombination aus Mauritz-Ost (level=10) + Mauritz-West (level=11) + Mauritz-Mitte (level=11)
    'Mauritz-Ost': 'mauritz',
    'Mauritz-West': 'mauritz',
    'Mauritz-Mitte': 'mauritz',
}

# OSM-Namen die wir bewusst IGNORIEREN (Sammel-Bezirke, Duplikate, nicht relevant)
SKIP_NAMES = {
    'Münster-Ost', 'Münster-Südost', 'Münster-Mitte', 'Münster-Hiltrup',
    'Münster-Nord', 'Münster-West',  # admin_level=9 Sammel-Bezirke
    'Altstadt',  # Duplikat, wir nutzen Innenstadtring stattdessen
    'Mitte-Nordost', 'Mitte-Süd',  # Enthalten Unter-Viertel die wir einzeln holen
    # level=11 Unter-Viertel die wir nicht als eigene Bezirke brauchen:
    'Buddenturm', 'Aegidii', 'Dom', 'Überwasser', 'Martini',  # Teile von Innenstadtring
    'Neutor', 'Schloss', 'Bahnhof',  # Teile der Innenstadt
    'Hansaplatz', 'Josef', 'Schlachthof',  # Teile von Mitte-Nordost/Süd
    'Düesberg', 'Herz-Jesu',  # Teile von Sentrup/Mitte-Süd
    'Rumphorst', 'Uppenberg',  # Teile von Mitte-Nordost
    'Gremmendorf-Ost', 'Gremmendorf-West',  # Wir nutzen Gremmendorf (level=10)
    'Hiltrup-Mitte', 'Hiltrup-Ost', 'Hiltrup-West',  # Wir nutzen Hiltrup (level=10)
    'Kinderhaus-Ost', 'Kinderhaus-West',  # Wir nutzen Kinderhaus (level=10)
}


def douglas_peucker(points, tolerance):
    """Douglas-Peucker Linienvereinfachung."""
    if len(points) <= 2:
        return points

    # Finde den Punkt mit dem groessten Abstand zur Linie start-end
    start = points[0]
    end = points[-1]
    max_dist = 0
    max_idx = 0

    dx = end[0] - start[0]
    dy = end[1] - start[1]
    line_len_sq = dx * dx + dy * dy

    for i in range(1, len(points) - 1):
        px, py = points[i]
        if line_len_sq == 0:
            dist = math.sqrt((px - start[0]) ** 2 + (py - start[1]) ** 2)
        else:
            t = max(0, min(1, ((px - start[0]) * dx + (py - start[1]) * dy) / line_len_sq))
            proj_x = start[0] + t * dx
            proj_y = start[1] + t * dy
            dist = math.sqrt((px - proj_x) ** 2 + (py - proj_y) ** 2)

        if dist > max_dist:
            max_dist = dist
            max_idx = i

    if max_dist > tolerance:
        left = douglas_peucker(points[:max_idx + 1], tolerance)
        right = douglas_peucker(points[max_idx:], tolerance)
        return left[:-1] + right
    else:
        return [start, end]


def parse_osm_data(data):
    """Parst die OSM-Rohdaten in Strukturen."""
    elements = data.get('elements', [])

    nodes = {}
    ways = {}
    relations = []

    for e in elements:
        if e['type'] == 'node':
            nodes[e['id']] = (e['lon'], e['lat'])
        elif e['type'] == 'way':
            ways[e['id']] = e.get('nodes', [])
        elif e['type'] == 'relation':
            relations.append(e)

    return nodes, ways, relations


def build_polygon_from_ways(way_refs, ways, nodes):
    """
    Baut ein Polygon aus einer Liste von Way-Referenzen.
    Ways werden in der richtigen Reihenfolge verbunden.
    """
    # Sammle alle Way-Segmente
    segments = []
    for ref in way_refs:
        way_id = ref['ref']
        role = ref.get('role', '')
        if ref['type'] != 'way':
            continue
        if way_id not in ways:
            continue
        node_ids = ways[way_id]
        coords = []
        for nid in node_ids:
            if nid in nodes:
                coords.append(nodes[nid])
        if coords:
            segments.append((coords, role))

    if not segments:
        return [], []

    # Trenne outer und inner Ringe
    outer_segments = [s[0] for s in segments if s[1] in ('outer', '')]
    inner_segments = [s[0] for s in segments if s[1] == 'inner']

    outer_ring = connect_segments(outer_segments)
    inner_rings = []
    if inner_segments:
        # Inner-Segmente auch verbinden
        inner_ring = connect_segments(inner_segments)
        if inner_ring:
            inner_rings.append(inner_ring)

    return outer_ring, inner_rings


def connect_segments(segments):
    """Verbindet einzelne Segmente zu einem geschlossenen Ring."""
    if not segments:
        return []

    # Kopiere Segmente
    remaining = [list(s) for s in segments]
    result = remaining.pop(0)

    max_iterations = len(remaining) * len(remaining) + 10
    iteration = 0

    while remaining and iteration < max_iterations:
        iteration += 1
        found = False
        end = result[-1]

        for i, seg in enumerate(remaining):
            # Passt der Anfang des Segments an das Ende?
            if close_enough(seg[0], end):
                result.extend(seg[1:])
                remaining.pop(i)
                found = True
                break
            # Oder umgekehrt (Segment reversed)?
            elif close_enough(seg[-1], end):
                result.extend(reversed(seg[:-1]))
                remaining.pop(i)
                found = True
                break

        if not found:
            # Versuche Anfang von result
            start = result[0]
            for i, seg in enumerate(remaining):
                if close_enough(seg[-1], start):
                    result = seg[:-1] + result
                    remaining.pop(i)
                    found = True
                    break
                elif close_enough(seg[0], start):
                    result = list(reversed(seg[1:])) + result
                    remaining.pop(i)
                    found = True
                    break

            if not found:
                break

    return result


def close_enough(p1, p2, tolerance=0.00001):
    """Prueft ob zwei Punkte nah genug beieinander liegen."""
    return abs(p1[0] - p2[0]) < tolerance and abs(p1[1] - p2[1]) < tolerance


def merge_polygons(polygons):
    """
    Vereinigt mehrere Polygone zu einem.
    Einfache Methode: ConvexHull oder einfach alle Punkte verbinden.
    Bessere Methode: Aeussere Huelle berechnen.
    Fuer unseren Fall (benachbarte Stadtteile zusammenlegen) nehmen wir die
    Punkte und sortieren sie im Uhrzeigersinn.
    """
    if len(polygons) == 1:
        return polygons[0]

    # Alle Punkte sammeln
    all_points = []
    for poly in polygons:
        all_points.extend(poly)

    if not all_points:
        return []

    # Zentroid berechnen
    cx = sum(p[0] for p in all_points) / len(all_points)
    cy = sum(p[1] for p in all_points) / len(all_points)

    # Konvexe Huelle (Graham Scan)
    return convex_hull(all_points)


def convex_hull(points):
    """Berechnet die konvexe Huelle via Graham Scan."""
    points = list(set(points))
    if len(points) <= 3:
        return points

    # Finde den untersten Punkt (kleinste y, bei Gleichstand kleinstes x)
    start = min(points, key=lambda p: (p[1], p[0]))

    def polar_angle(p):
        return math.atan2(p[1] - start[1], p[0] - start[0])

    sorted_points = sorted(points, key=polar_angle)

    hull = [sorted_points[0], sorted_points[1]]
    for p in sorted_points[2:]:
        while len(hull) > 1 and cross(hull[-2], hull[-1], p) <= 0:
            hull.pop()
        hull.append(p)

    return hull


def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def polygon_union_adjacent(polygons):
    """
    Vereinigung benachbarter Polygone.
    Entfernt gemeinsame Innengrenzen und behaelt nur die Aussenkante.
    """
    if len(polygons) == 1:
        return polygons[0]

    # Sammle alle Kanten und zaehle wie oft jede vorkommt.
    # Kanten die 2x vorkommen sind Innengrenzen und werden entfernt.
    edge_count = {}
    edge_to_poly = {}

    for poly_idx, poly in enumerate(polygons):
        for i in range(len(poly)):
            p1 = poly[i]
            p2 = poly[(i + 1) % len(poly)]
            # Normalisiere Kante (kleinerer Punkt zuerst)
            edge = tuple(sorted([p1, p2]))
            edge_count[edge] = edge_count.get(edge, 0) + 1

    # Behalte nur Kanten die genau 1x vorkommen (Aussenkanten)
    outer_edges = []
    for poly in polygons:
        for i in range(len(poly)):
            p1 = poly[i]
            p2 = poly[(i + 1) % len(poly)]
            edge = tuple(sorted([p1, p2]))
            if edge_count[edge] == 1:
                outer_edges.append((p1, p2))

    if not outer_edges:
        # Fallback: Konvexe Huelle
        all_points = []
        for poly in polygons:
            all_points.extend(poly)
        return convex_hull(all_points)

    # Verbinde Aussenkanten zu einem Ring
    segments = [list(e) for e in outer_edges]
    result = connect_segments([[e[0], e[1]] for e in outer_edges])

    if not result:
        all_points = []
        for poly in polygons:
            all_points.extend(poly)
        return convex_hull(all_points)

    return result


def project_coords(lon, lat, bounds, target_w, target_h, padding):
    """Projiziert lon/lat in SVG-Koordinaten (Mercator-aehnlich)."""
    min_lon, min_lat, max_lon, max_lat = bounds

    # Einfache Mercator-Projektion
    # x = lon, y = -lat (Norden oben in SVG = kleine y-Werte)
    x_range = max_lon - min_lon
    y_range = max_lat - min_lat

    # Skalierung berechnen (Aspect Ratio beibehalten)
    usable_w = target_w - 2 * padding
    usable_h = target_h - 2 * padding

    # Korrektur fuer Breitengrad (Mercator-Verzerrung bei ~52 Grad N)
    lat_correction = math.cos(math.radians((min_lat + max_lat) / 2))
    corrected_x_range = x_range * lat_correction

    scale_x = usable_w / corrected_x_range if corrected_x_range > 0 else 1
    scale_y = usable_h / y_range if y_range > 0 else 1
    scale = min(scale_x, scale_y)

    # Zentrierung
    actual_w = corrected_x_range * scale
    actual_h = y_range * scale
    offset_x = padding + (usable_w - actual_w) / 2
    offset_y = padding + (usable_h - actual_h) / 2

    x = offset_x + (lon - min_lon) * lat_correction * scale
    y = offset_y + (max_lat - lat) * scale  # Y invertiert (Nord oben)

    return (x, y)


def polygon_to_svg_path(points):
    """Konvertiert eine Liste von (x,y)-Punkten in einen SVG-Pfad-String."""
    if not points:
        return ''

    parts = [f"M{points[0][0]:.2f},{points[0][1]:.2f}"]
    for p in points[1:]:
        parts.append(f"L{p[0]:.2f},{p[1]:.2f}")
    parts.append('Z')

    return ''.join(parts)


def fmt(v):
    """Formatiert Zahl: entfernt trailing zeros."""
    r = f"{v:.2f}"
    if '.' in r:
        r = r.rstrip('0').rstrip('.')
    return r


def polygon_to_svg_path_clean(points):
    """Konvertiert Punkte in einen kompakten SVG-Pfad."""
    if not points:
        return ''

    parts = [f"M{fmt(points[0][0])},{fmt(points[0][1])}"]
    for p in points[1:]:
        parts.append(f"L{fmt(p[0])},{fmt(p[1])}")
    parts.append('Z')

    return ''.join(parts)


def parse_svg_path_points(d_str):
    """Parst M/L-Punkte aus einem SVG-Pfad-String."""
    points = []
    parts = d_str.replace('M', '').replace('Z', '').split('L')
    for p in parts:
        coords = p.strip().split(',')
        if len(coords) == 2:
            try:
                points.append((float(coords[0]), float(coords[1])))
            except ValueError:
                pass
    return points


def line_intersection_y(p1, p2, y):
    """Berechnet den x-Wert an dem die Linie p1-p2 die Horizontale y schneidet."""
    if abs(p2[1] - p1[1]) < 0.001:
        return None  # Horizontal, kein eindeutiger Schnittpunkt
    t = (y - p1[1]) / (p2[1] - p1[1])
    if t < 0 or t > 1:
        return None
    x = p1[0] + t * (p2[0] - p1[0])
    return x


def split_polygon_horizontal(points, split_y):
    """
    Teilt ein Polygon horizontal bei split_y.
    Gibt (obere_punkte, untere_punkte) zurueck.
    Obere = y < split_y, Untere = y >= split_y.
    """
    upper = []  # Haeger (Norden, kleine y-Werte)
    lower = []  # Nienberge (Sueden, grosse y-Werte)
    intersections = []

    n = len(points)
    for i in range(n):
        p1 = points[i]
        p2 = points[(i + 1) % n]

        # Punkt zum richtigen Polygon
        if p1[1] < split_y:
            upper.append(p1)
        else:
            lower.append(p1)

        # Pruefen ob die Kante die Split-Linie kreuzt
        if (p1[1] < split_y) != (p2[1] < split_y):
            x = line_intersection_y(p1, p2, split_y)
            if x is not None:
                intersection = (x, split_y)
                intersections.append(intersection)
                upper.append(intersection)
                lower.append(intersection)

    # Sortiere die Schnittpunkte nach x um die Split-Linie korrekt zu schliessen
    intersections.sort(key=lambda p: p[0])

    return upper, lower


def main():
    # Lade beide Boundary-Dateien und fuege sie zusammen
    print("Lade raw-boundaries.json (Level 9+10)...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    level11_file = os.path.join(SCRIPT_DIR, 'raw-boundaries-level11.json')
    if os.path.exists(level11_file):
        print("Lade raw-boundaries-level11.json (Level 11)...")
        with open(level11_file, 'r', encoding='utf-8') as f:
            data11 = json.load(f)
        # Fuege Level-11-Elemente hinzu
        data['elements'] = data.get('elements', []) + data11.get('elements', [])

    nodes, ways, relations = parse_osm_data(data)
    print(f"Geparst: {len(nodes)} Nodes, {len(ways)} Ways, {len(relations)} Relations")

    # Sammle Polygone pro Stadtteil-ID
    district_polygons = {}  # id -> [(lon, lat), ...]
    osm_name_to_app_id = {}

    for rel in relations:
        osm_name = rel.get('tags', {}).get('name', '')
        admin_level = rel.get('tags', {}).get('admin_level', '')

        if osm_name in SKIP_NAMES:
            print(f"  UEBERSPRUNGEN (SKIP): '{osm_name}' (admin_level={admin_level})")
            continue

        app_id = NAME_TO_ID.get(osm_name)
        if not app_id:
            print(f"  UEBERSPRUNGEN: '{osm_name}' (admin_level={admin_level}) - kein Mapping")
            continue

        print(f"  Verarbeite: '{osm_name}' -> {app_id} (admin_level={admin_level})")

        members = [m for m in rel.get('members', []) if m['type'] == 'way']
        outer_ring, inner_rings = build_polygon_from_ways(members, ways, nodes)

        if not outer_ring:
            print(f"    WARNUNG: Kein Polygon fuer '{osm_name}'")
            continue

        if app_id in district_polygons:
            # Mehrere Teile zum selben Stadtteil (z.B. Mauritz-Ost + Mauritz-West)
            district_polygons[app_id].append(outer_ring)
        else:
            district_polygons[app_id] = [outer_ring]

    print(f"\nGefundene Stadtteile: {len(district_polygons)}")

    # Berechne Bounding Box ueber alle Polygone
    all_lons = []
    all_lats = []
    for polygons in district_polygons.values():
        for poly in polygons:
            for lon, lat in poly:
                all_lons.append(lon)
                all_lats.append(lat)

    if not all_lons:
        print("FEHLER: Keine Koordinaten gefunden!")
        return

    bounds = (min(all_lons), min(all_lats), max(all_lons), max(all_lats))
    print(f"Bounding Box: lon=[{bounds[0]:.4f}, {bounds[2]:.4f}], lat=[{bounds[1]:.4f}, {bounds[3]:.4f}]")

    # Projiziere und vereinfache
    result = {'districts': {}}

    for dist_id, polygons in sorted(district_polygons.items()):
        # Projiziere alle Polygonpunkte
        projected_polygons = []
        for poly in polygons:
            projected = [
                project_coords(lon, lat, bounds, TARGET_WIDTH, TARGET_HEIGHT, PADDING)
                for lon, lat in poly
            ]
            projected_polygons.append(projected)

        # Wenn mehrere Polygone: Vereinige sie
        if len(projected_polygons) > 1:
            combined = polygon_union_adjacent(projected_polygons)
            simplified = douglas_peucker(combined, SIMPLIFY_TOLERANCE)
        else:
            simplified = douglas_peucker(projected_polygons[0], SIMPLIFY_TOLERANCE)

        path_d = polygon_to_svg_path_clean(simplified)
        result['districts'][dist_id] = {'d': path_d}
        print(f"  {dist_id}: {len(simplified)} Punkte, {len(path_d)} Zeichen")

    # Haeger: Nicht in OSM als eigener Bezirk. Liegt im NW von Nienberge.
    # Wir splitten Nienberge entlang einer Linie.
    # Haeger ist der noerdliche Teil (y < split_y), Nienberge der suedliche.
    if 'nienberge' in result['districts'] and 'haeger' not in result['districts']:
        print("\n  Splitte Nienberge in Nienberge + Haeger...")
        nienberge_d = result['districts']['nienberge']['d']
        nb_points = parse_svg_path_points(nienberge_d)

        if nb_points:
            # Split-Linie: ungefaehr bei y=180 (horizontal)
            # Haeger = Punkte mit y < 180, Nienberge = Punkte mit y >= 180
            # Aber wir muessen saubere Polygone erzeugen.
            split_y = 185
            haeger_pts, nienberge_pts = split_polygon_horizontal(nb_points, split_y)

            if haeger_pts and nienberge_pts:
                result['districts']['haeger'] = {'d': polygon_to_svg_path_clean(haeger_pts)}
                result['districts']['nienberge'] = {'d': polygon_to_svg_path_clean(nienberge_pts)}
                print(f"    Haeger: {len(haeger_pts)} Punkte")
                print(f"    Nienberge (neu): {len(nienberge_pts)} Punkte")
            else:
                print("    WARNUNG: Split fehlgeschlagen!")

    # Fehlende Stadtteile identifizieren
    expected = {
        'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
        'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
        'nienberge', 'kinderhaus', 'coerde', 'handorf',
        'gremmendorf', 'wolbeck', 'angelmodde', 'hiltrup', 'amelsbueren', 'roxel',
        'sprakel', 'gelmer', 'haeger', 'geist', 'schuetzenhof', 'berg-fidel',
        'mecklenbeck', 'albachten',
    }
    found = set(result['districts'].keys())
    missing = expected - found
    extra = found - expected

    if missing:
        print(f"\nFEHLENDE Stadtteile ({len(missing)}): {sorted(missing)}")
    if extra:
        print(f"\nEXTRA Stadtteile ({len(extra)}): {sorted(extra)}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nGespeichert: {OUTPUT_FILE}")
    print(f"Gefunden: {len(found)}/{len(expected)} Stadtteile")


if __name__ == '__main__':
    main()
