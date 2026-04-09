#!/usr/bin/env python3
"""
Generiert die MuensterSVG.jsx aus district-paths.json.
26 Stadtteile, alle interaktiv.
Analog zu hamburg/generate_hamburg_svg.py.
"""

import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

INTERACTIVE_IDS = [
    'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
    'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
    'nienberge', 'kinderhaus', 'coerde', 'handorf',
    'gremmendorf', 'wolbeck', 'angelmodde', 'hiltrup', 'amelsbueren', 'roxel',
    'sprakel', 'gelmer', 'haeger', 'geist', 'schuetzenhof', 'berg-fidel',
    'mecklenbeck', 'albachten',
]

DARK_DISTRICTS = [
    'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
    'sentrup', 'mauritz', 'geist', 'schuetzenhof',
]

STAGGER_ORDER = [
    'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
    'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
    'geist', 'schuetzenhof',
    'kinderhaus', 'coerde', 'nienberge',
    'berg-fidel', 'mecklenbeck',
    'handorf', 'gremmendorf', 'angelmodde', 'wolbeck',
    'hiltrup', 'amelsbueren', 'roxel',
    'haeger', 'sprakel', 'gelmer', 'albachten',
]

DISPLAY_NAMES = {
    'altstadt-dom': ['Altstadt'],
    'kreuzviertel': ['Kreuz-', 'viertel'],
    'pluggendorf': ['Pluggen-', 'dorf'],
    'hafen-zentrum': ['Hafen'],
    'aaseestadt': ['Aasee-', 'stadt'],
    'sentrup': ['Sentrup'],
    'mauritz': ['Mauritz'],
    'gievenbeck': ['Gieven-', 'beck'],
    'nienberge': ['Nienberge'],
    'kinderhaus': ['Kinderhaus'],
    'coerde': ['Coerde'],
    'handorf': ['Handorf'],
    'gremmendorf': ['Gremmen-', 'dorf'],
    'wolbeck': ['Wolbeck'],
    'angelmodde': ['Angel-', 'modde'],
    'hiltrup': ['Hiltrup'],
    'amelsbueren': ['Amels-', 'büren'],
    'roxel': ['Roxel'],
    'sprakel': ['Sprakel'],
    'gelmer': ['Gelmer'],
    'haeger': ['Häger'],
    'geist': ['Geist'],
    'schuetzenhof': ['Schützen-', 'hof'],
    'berg-fidel': ['Berg', 'Fidel'],
    'mecklenbeck': ['Mecklen-', 'beck'],
    'albachten': ['Albachten'],
}

# Hintergrund-Fuellbezirke: Schliessen Luecken zwischen Level-10 und Level-11 Grenzen.
# Mapping: bg-ID -> interaktiver Eltern-Bezirk (uebernimmt dessen Farbe)
BACKGROUND_FILLS = {
    'kinderhaus-bg': 'kinderhaus',
    'sentrup-bg': 'sentrup',
}

# Label-Offset-Overrides fuer kleine oder ungluecklich geformte Bezirke
# Format: { 'id': { 'offset': (dx, dy) } }
# Wenn leer, wird der Zentroid verwendet
LABEL_OVERRIDES = {}


def extract_points_from_path(d_str):
    """Extrahiert alle Endpunkte aus einem SVG-Pfad (M/L-Kommandos)."""
    points = []
    i = 0
    while i < len(d_str):
        c = d_str[i]
        if c in ('M', 'L'):
            i += 1
            # Parse x,y
            num_str = ''
            while i < len(d_str) and d_str[i] not in ('M', 'L', 'Z', 'C', 'S', 'Q'):
                num_str += d_str[i]
                i += 1
            parts = num_str.strip().split(',')
            if len(parts) == 2:
                try:
                    points.append((float(parts[0]), float(parts[1])))
                except ValueError:
                    pass
        else:
            i += 1
    return points


def compute_centroid(points):
    """Berechnet den Schwerpunkt eines Polygons (gewichteter Flaechenschwerpunkt)."""
    if not points:
        return (0, 0)

    n = len(points)
    if n < 3:
        avg_x = sum(p[0] for p in points) / n
        avg_y = sum(p[1] for p in points) / n
        return (avg_x, avg_y)

    # Schwerpunkt-Formel fuer Polygone
    area = 0
    cx = 0
    cy = 0
    for i in range(n):
        j = (i + 1) % n
        cross = points[i][0] * points[j][1] - points[j][0] * points[i][1]
        area += cross
        cx += (points[i][0] + points[j][0]) * cross
        cy += (points[i][1] + points[j][1]) * cross

    area /= 2
    if abs(area) < 0.001:
        avg_x = sum(p[0] for p in points) / n
        avg_y = sum(p[1] for p in points) / n
        return (avg_x, avg_y)

    cx /= (6 * area)
    cy /= (6 * area)
    return (cx, cy)


def compute_bbox(points):
    if not points:
        return (0, 0, 0, 0)
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return (min(xs), min(ys), max(xs), max(ys))


def compute_area_from_bbox(bbox):
    return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])


def font_size_for_area(area):
    if area < 1500:
        return 6
    elif area < 3000:
        return 7
    elif area < 5000:
        return 8
    elif area < 8000:
        return 9
    elif area < 12000:
        return 10
    elif area < 20000:
        return 11
    elif area < 35000:
        return 12
    else:
        return 14


def fmt(v):
    r = f"{v:.1f}"
    if '.' in r:
        r = r.rstrip('0').rstrip('.')
    return r


def main():
    input_file = os.path.join(SCRIPT_DIR, 'district-paths.json')
    print(f"Lade {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    districts = data['districts']
    print(f"Gefundene Stadtteile: {len(districts)}")

    # Labels berechnen
    labels = []
    for dist_id in INTERACTIVE_IDS:
        if dist_id not in districts:
            print(f"WARNUNG: {dist_id} fehlt in district-paths.json!")
            continue

        path_d = districts[dist_id]['d']
        points = extract_points_from_path(path_d)
        centroid = compute_centroid(points)
        bbox = compute_bbox(points)
        area = compute_area_from_bbox(bbox)
        size = font_size_for_area(area)

        cx, cy = centroid
        lines = DISPLAY_NAMES.get(dist_id, [dist_id.replace('-', ' ').title()])

        leader = None
        if dist_id in LABEL_OVERRIDES:
            override = LABEL_OVERRIDES[dist_id]
            ox, oy = override.get('offset', (0, 0))
            label_x = cx + ox
            label_y = cy + oy
            leader = [round(cx, 1), round(cy, 1)]
        else:
            label_x = cx
            label_y = cy

        label_entry = {
            'id': dist_id,
            'x': round(label_x, 1),
            'y': round(label_y, 1),
            'lines': lines,
            'size': size,
        }
        if leader:
            label_entry['leader'] = leader

        labels.append(label_entry)

    # Background-Fill-Eintraege fuer JSX
    bg_fill_entries = []
    for bg_id, parent_id in BACKGROUND_FILLS.items():
        if bg_id in districts:
            path = districts[bg_id]['d']
            bg_fill_entries.append(f"  {{ id: '{bg_id}', parentId: '{parent_id}', path: '{path}' }}")
        else:
            print(f"WARNUNG: Hintergrund-Fuellbezirk {bg_id} fehlt in district-paths.json!")

    # District-Eintraege fuer JSX (nur interaktive, keine bg-Fills)
    district_entries = []
    for dist_id in sorted(districts.keys()):
        if dist_id in BACKGROUND_FILLS:
            continue  # Hintergrund-Fills separat
        path = districts[dist_id]['d']
        district_entries.append(f"  {{ id: '{dist_id}', path: '{path}' }}")

    # Label-Eintraege fuer JSX
    label_entries = []
    for l in labels:
        lines_str = '[' + ', '.join(f"'{line}'" for line in l['lines']) + ']'
        if 'leader' in l:
            leader_str = f", leader: [{l['leader'][0]}, {l['leader'][1]}]"
        else:
            leader_str = ''
        label_entries.append(
            f"  {{ id: '{l['id']}', x: {l['x']}, y: {l['y']}, lines: {lines_str}, size: {l['size']}{leader_str} }}"
        )

    # JSX generieren
    jsx = f'''import {{ useState, useEffect, useCallback, useRef, memo }} from 'react'

function getDistrictColor(districtId, data) {{
  const {{ colorScale }} = data.meta
  const district = data.districts.find(d => d.id === districtId)
  if (!district) return '#E8E4E0'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#E8E4E0'
}}

// ═══════════════════════════════════════════
// Muenster SVG Karte (26 Stadtteile, alle interaktiv)
// Generiert aus district-paths.json (OSM-Geodaten)
// ═══════════════════════════════════════════

const BACKGROUND_FILLS = [
{chr(10).join(b + "," for b in bg_fill_entries)}
]

const INTERACTIVE_IDS = new Set([
  {", ".join(f"'{d}'" for d in INTERACTIVE_IDS)},
])

const ALL_DISTRICTS = [
{chr(10).join(d + "," for d in district_entries)}
]

const PATHS = ALL_DISTRICTS.map(d => ({{
  id: d.id,
  path: d.path,
  interactive: INTERACTIVE_IDS.has(d.id),
}}))

// Stadtgrenze (Kombination aller Bezirkspfade als Hintergrund)
const CITY_BOUNDARY = ALL_DISTRICTS.map(d => d.path).join(' ')

const DARK_DISTRICTS = new Set([
  {", ".join(f"'{d}'" for d in DARK_DISTRICTS)},
])

const INTERACTIVE_LABELS = [
{chr(10).join(l + "," for l in label_entries)}
]

const STAGGER_ORDER = [
  {", ".join(f"'{d}'" for d in STAGGER_ORDER)},
]

/** Einzelner klickbarer Bezirk-Pfad. React.memo verhindert Re-Renders bei Hover anderer Viertel. */
const DistrictPath = memo(function DistrictPath({{
  id, d, fill, label, isSelected, isHovered, isDimmed, loaded, staggerDelay,
  onClick, onMouseEnter, onMouseLeave,
}}) {{
  return (
    <path
      id={{id}}
      role="listitem"
      tabIndex={{0}}
      aria-label={{`Stadtteil ${{label}}`}}
      d={{d}}
      fill={{fill}}
      stroke="#D1CDC9"
      strokeWidth="1.5"
      strokeLinejoin="round"
      style={{{{
        cursor: 'pointer',
        outline: 'none',
        opacity: loaded ? (isDimmed ? 0.6 : (isHovered ? 0.85 : 1)) : 0,
        transition: loaded
          ? 'opacity 150ms ease, filter 150ms ease'
          : `opacity 400ms ease ${{staggerDelay}}ms`,
        filter: isHovered && !isSelected ? 'brightness(1.15)' : undefined,
      }}}}
      onClick={{() => onClick?.(id)}}
      onKeyDown={{(e) => {{ if (e.key === 'Enter' || e.key === ' ') {{ e.preventDefault(); onClick?.(id) }} }}}}
      onMouseEnter={{() => onMouseEnter?.(id)}}
      onMouseLeave={{() => onMouseLeave?.()}}
      onFocus={{() => onMouseEnter?.(id)}}
      onBlur={{() => onMouseLeave?.()}}
    />
  )
}})

export function MuensterSVG({{
  data,
  selectedId = null,
  hoveredId = null,
  onDistrictClick,
  onDistrictHover,
  onDistrictLeave,
  onDistrictRect,
}}) {{
  const [loaded, setLoaded] = useState(false)
  const svgRef = useRef(null)

  useEffect(() => {{
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }}, [])

  const handleMouseEnter = useCallback((id) => {{
    onDistrictHover?.(id)
    if (onDistrictRect && svgRef.current) {{
      const el = svgRef.current.querySelector(`#${{CSS.escape(id)}}`)
      if (el) onDistrictRect(el.getBoundingClientRect())
    }}
  }}, [onDistrictHover, onDistrictRect])

  return (
    <svg
      ref={{svgRef}}
      viewBox="0 0 800 780"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
      role="img"
      aria-label="Stadtteil-Karte Münster mit Immobilienpreisen"
    >
      {{/* SCHICHT 1: Stadtgrenze als Hintergrund-Fang */}}
      <path d={{CITY_BOUNDARY}} fill="#E8E4E0" stroke="#B8B4B0" strokeWidth="2" strokeLinejoin="round" />

      {{/* SCHICHT 1b: Hintergrund-Fuellbezirke (nicht interaktiv, Farbe vom Eltern-Bezirk) */}}
      <g className="background-fills" style={{{{ pointerEvents: 'none' }}}}>
        {{BACKGROUND_FILLS.map(({{ id, parentId, path: d }}) => (
          <path
            key={{id}}
            d={{d}}
            fill={{getDistrictColor(parentId, data)}}
            stroke="#D1CDC9"
            strokeWidth="1"
            strokeLinejoin="round"
            style={{{{ opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 200ms' }}}}
          />
        ))}}
      </g>

      {{/* SCHICHT 2: Alle 26 interaktive Viertel */}}
      <g className="interactive-districts" role="list">
        {{PATHS.map(({{ id, path: d }}) => (
          <DistrictPath
            key={{id}}
            id={{id}}
            d={{d}}
            fill={{getDistrictColor(id, data)}}
            label={{data.districts.find(dd => dd.id === id)?.name || id}}
            isSelected={{selectedId === id}}
            isHovered={{hoveredId === id}}
            isDimmed={{!!(selectedId && selectedId !== id)}}
            loaded={{loaded}}
            staggerDelay={{STAGGER_ORDER.indexOf(id) * 30}}
            onClick={{onDistrictClick}}
            onMouseEnter={{handleMouseEnter}}
            onMouseLeave={{onDistrictLeave}}
          />
        ))}}
      </g>

      {{/* SCHICHT 3: Fuehrungslinien */}}
      <g style={{{{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}}}>
        {{INTERACTIVE_LABELS.filter(l => l.leader).map(({{ id, x, y, leader }}) => (
          <line key={{`l-${{id}}`}} x1={{x + 38}} y1={{y}} x2={{leader[0]}} y2={{leader[1]}} stroke="#999" strokeWidth="1" />
        ))}}
      </g>

      {{/* SCHICHT 4: Labels */}}
      <g fontFamily="'DM Sans', system-ui, sans-serif" style={{{{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}}}>
        {{INTERACTIVE_LABELS.map(({{ id, x, y, lines, size }}) => (
          <text key={{id}} textAnchor="middle" fontSize={{size}} fontWeight="500" fill={{DARK_DISTRICTS.has(id) ? '#F5F2F0' : '#333'}}>
            {{lines.map((line, i) => (
              <tspan key={{i}} x={{x}} y={{y + i * (size * 1.2)}}>{{line}}</tspan>
            ))}}
          </text>
        ))}}
      </g>
    </svg>
  )
}}

export {{ PATHS as DISTRICT_PATHS, INTERACTIVE_LABELS as DISTRICT_LABELS, CITY_BOUNDARY }}
'''

    output_path = os.path.join(SCRIPT_DIR, '..', 'src', 'components', 'Map', 'MuensterSVG.jsx')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(jsx)

    print(f"\nGeschrieben: {output_path}")
    print(f"Stadtteile: {len(districts)}")
    print(f"Interaktiv: {len([d for d in INTERACTIVE_IDS if d in districts])}")
    print(f"Labels: {len(labels)}")


if __name__ == '__main__':
    main()
