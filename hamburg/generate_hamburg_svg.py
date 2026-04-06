#!/usr/bin/env python3
"""
Generiert die HamburgSVG.jsx aus district-paths.json und missing-districts.json.
Transformiert alle Pfade von Original-SVG-Koordinaten in Zielkoordinaten.
53 Stadtteile total (46 bestehend + 7 neu), 22 interaktiv.
"""

import json
import re
import math
import os

# ═══════════════════════════════════════════
# Konfiguration
# ═══════════════════════════════════════════

CROP_MIN_X = 43.6
CROP_MIN_Y = 89.6
SCALE = 2.4349
OFFSET_X = 0.0
OFFSET_Y = 58.7

INTERACTIVE_IDS = [
    'harvestehude', 'uhlenhorst', 'hoheluft-ost', 'eppendorf', 'winterhude',
    'rotherbaum', 'ottensen', 'othmarschen', 'hoheluft-west', 'blankenese',
    'st-georg', 'eimsbuettel', 'sternschanze', 'barmbek-sued', 'lokstedt',
    'bahrenfeld', 'barmbek-nord', 'eilbek', 'stellingen', 'wandsbek',
    'bramfeld', 'rahlstedt',
]

DARK_DISTRICTS = [
    'harvestehude', 'uhlenhorst', 'hoheluft-ost', 'eppendorf', 'winterhude',
    'rotherbaum', 'ottensen', 'othmarschen', 'hoheluft-west', 'blankenese',
    'st-georg', 'eimsbuettel', 'sternschanze', 'barmbek-sued', 'lokstedt',
    'bahrenfeld', 'barmbek-nord', 'eilbek', 'stellingen', 'wandsbek',
]

STAGGER_ORDER = [
    'harvestehude', 'uhlenhorst', 'rotherbaum', 'sternschanze',
    'hoheluft-west', 'hoheluft-ost', 'eimsbuettel', 'eppendorf',
    'winterhude', 'st-georg', 'barmbek-sued', 'barmbek-nord',
    'eilbek', 'lokstedt', 'stellingen', 'bahrenfeld',
    'ottensen', 'othmarschen', 'wandsbek', 'bramfeld',
    'blankenese', 'rahlstedt',
]

# Labels mit Abkuerzungen/Leader fuer kleine Stadtteile
LABEL_OVERRIDES = {
    'hoheluft-west': {'lines': ['HO-W'], 'offset': (-20, -30)},
    'hoheluft-ost': {'lines': ['HO-O'], 'offset': (10, -30)},
    'sternschanze': {'lines': ['Stern-', 'schanze'], 'offset': (-15, 15)},
    'rotherbaum': {'lines': ['Rother-', 'baum'], 'offset': (0, 25)},
}

# Display-Namen
DISPLAY_NAMES = {
    'harvestehude': ['Harveste-', 'hude'],
    'uhlenhorst': ['Uhlen-', 'horst'],
    'hoheluft-ost': ['HO-O'],
    'eppendorf': ['Eppendorf'],
    'winterhude': ['Winter-', 'hude'],
    'rotherbaum': ['Rother-', 'baum'],
    'ottensen': ['Ottensen'],
    'othmarschen': ['Oth-', 'marschen'],
    'hoheluft-west': ['HO-W'],
    'blankenese': ['Blanke-', 'nese'],
    'st-georg': ['St. Georg'],
    'eimsbuettel': ['Eims-', 'büttel'],
    'sternschanze': ['Stern-', 'schanze'],
    'barmbek-sued': ['Barmbek-', 'Süd'],
    'lokstedt': ['Lokstedt'],
    'bahrenfeld': ['Bahrenfeld'],
    'barmbek-nord': ['Barmbek-', 'Nord'],
    'eilbek': ['Eilbek'],
    'stellingen': ['Stellingen'],
    'wandsbek': ['Wandsbek'],
    'bramfeld': ['Bramfeld'],
    'rahlstedt': ['Rahlstedt'],
}


def transform_x(x):
    return (x - CROP_MIN_X) * SCALE + OFFSET_X


def transform_y(y):
    return (y - CROP_MIN_Y) * SCALE + OFFSET_Y


def scale_val(v):
    return v * SCALE


def fmt(v):
    """Format number: remove trailing zeros after decimal."""
    r = f"{v:.2f}"
    if '.' in r:
        r = r.rstrip('0').rstrip('.')
    return r


# ═══════════════════════════════════════════
# SVG Path Parser & Transformer
# ═══════════════════════════════════════════

def tokenize_path(d):
    """Split SVG path string into tokens (commands and numbers)."""
    d = d.strip()
    tokens = []
    i = 0
    while i < len(d):
        c = d[i]
        if c.isalpha():
            tokens.append(c)
            i += 1
        elif c in '0123456789.-+':
            j = i
            if c in '-+':
                # Check if this is a negative sign after a number (no separator)
                # Only treat as start of number if previous token was not a number ending in digit
                j += 1
            has_dot = (c == '.')
            while j < len(d) and (d[j].isdigit() or (d[j] == '.' and not has_dot)):
                if d[j] == '.':
                    has_dot = True
                j += 1
            if j < len(d) and d[j] in 'eE':
                j += 1
                if j < len(d) and d[j] in '-+':
                    j += 1
                while j < len(d) and d[j].isdigit():
                    j += 1
            num_str = d[i:j]
            try:
                tokens.append(float(num_str))
            except ValueError:
                pass
            i = j
        elif c in ' ,\t\n\r':
            i += 1
        else:
            i += 1
    return tokens


CMD_PARAMS = {
    'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0,
    'm': 2, 'l': 2, 'h': 1, 'v': 1, 'c': 6, 's': 4, 'q': 4, 't': 2, 'a': 7, 'z': 0,
}

IMPLICIT_REPEAT = {
    'M': 'L', 'm': 'l',
}


def transform_path_clean(d_str):
    """Transform path and produce clean output."""
    tokens = tokenize_path(d_str)
    segments = []
    i = 0
    current_cmd = None
    first_after_cmd = True

    while i < len(tokens):
        token = tokens[i]

        if isinstance(token, str):
            current_cmd = token
            first_after_cmd = True
            i += 1
            if current_cmd in ('Z', 'z'):
                segments.append((current_cmd, []))
                current_cmd = None
                continue
        else:
            first_after_cmd = False

        if current_cmd is None:
            i += 1
            continue

        active_cmd = current_cmd
        if not first_after_cmd and current_cmd in IMPLICIT_REPEAT:
            active_cmd = IMPLICIT_REPEAT[current_cmd]

        n_params = CMD_PARAMS.get(active_cmd.upper(), 0)
        if n_params == 0:
            i += 1
            continue

        params = []
        j = i
        while len(params) < n_params and j < len(tokens):
            if isinstance(tokens[j], (int, float)):
                params.append(tokens[j])
                j += 1
            elif isinstance(tokens[j], str):
                break
            else:
                j += 1

        if len(params) < n_params:
            i = j
            continue

        upper_cmd = active_cmd.upper()
        is_relative = active_cmd.islower()

        transformed = []
        if upper_cmd in ('M', 'L', 'T'):
            if is_relative:
                transformed = [scale_val(params[0]), scale_val(params[1])]
            else:
                transformed = [transform_x(params[0]), transform_y(params[1])]
        elif upper_cmd == 'H':
            if is_relative:
                transformed = [scale_val(params[0])]
            else:
                transformed = [transform_x(params[0])]
        elif upper_cmd == 'V':
            if is_relative:
                transformed = [scale_val(params[0])]
            else:
                transformed = [transform_y(params[0])]
        elif upper_cmd == 'C':
            if is_relative:
                transformed = [scale_val(p) for p in params]
            else:
                transformed = [
                    transform_x(params[0]), transform_y(params[1]),
                    transform_x(params[2]), transform_y(params[3]),
                    transform_x(params[4]), transform_y(params[5]),
                ]
        elif upper_cmd in ('S', 'Q'):
            if is_relative:
                transformed = [scale_val(p) for p in params]
            else:
                transformed = [
                    transform_x(params[0]), transform_y(params[1]),
                    transform_x(params[2]), transform_y(params[3]),
                ]
        elif upper_cmd == 'A':
            rx = params[0] * SCALE
            ry = params[1] * SCALE
            x_rot = params[2]
            large_arc = params[3]
            sweep = params[4]
            if is_relative:
                x = scale_val(params[5])
                y = scale_val(params[6])
            else:
                x = transform_x(params[5])
                y = transform_y(params[6])
            transformed = [rx, ry, x_rot, large_arc, sweep, x, y]

        segments.append((active_cmd, transformed))
        first_after_cmd = False
        i = j

    # Build output
    parts = []
    prev_cmd = None
    for cmd, params in segments:
        param_str = ','.join(fmt(v) for v in params)
        if cmd != prev_cmd:
            parts.append(cmd + param_str)
        else:
            parts.append(' ' + param_str)
        prev_cmd = cmd

    return ''.join(parts)


def extract_endpoints_from_path(d_str):
    """Extract all endpoint coordinates from a path for centroid calculation."""
    tokens = tokenize_path(d_str)
    points = []
    cx, cy = 0, 0
    i = 0
    current_cmd = None
    first_after_cmd = True

    while i < len(tokens):
        token = tokens[i]

        if isinstance(token, str):
            current_cmd = token
            first_after_cmd = True
            i += 1
            if current_cmd in ('Z', 'z'):
                current_cmd = None
                continue
        else:
            first_after_cmd = False

        if current_cmd is None:
            i += 1
            continue

        active_cmd = current_cmd
        if not first_after_cmd and current_cmd in IMPLICIT_REPEAT:
            active_cmd = IMPLICIT_REPEAT[current_cmd]

        n_params = CMD_PARAMS.get(active_cmd.upper(), 0)
        if n_params == 0:
            i += 1
            continue

        params = []
        j = i
        while len(params) < n_params and j < len(tokens):
            if isinstance(tokens[j], (int, float)):
                params.append(tokens[j])
                j += 1
            elif isinstance(tokens[j], str):
                break
            else:
                j += 1

        if len(params) < n_params:
            i = j
            continue

        upper = active_cmd.upper()
        is_rel = active_cmd.islower()

        if upper in ('M', 'L', 'T'):
            if is_rel:
                cx += params[0]; cy += params[1]
            else:
                cx = params[0]; cy = params[1]
            points.append((cx, cy))
        elif upper == 'H':
            if is_rel:
                cx += params[0]
            else:
                cx = params[0]
            points.append((cx, cy))
        elif upper == 'V':
            if is_rel:
                cy += params[0]
            else:
                cy = params[0]
            points.append((cx, cy))
        elif upper == 'C':
            if is_rel:
                cx += params[4]; cy += params[5]
            else:
                cx = params[4]; cy = params[5]
            points.append((cx, cy))
        elif upper in ('S', 'Q'):
            if is_rel:
                cx += params[2]; cy += params[3]
            else:
                cx = params[2]; cy = params[3]
            points.append((cx, cy))
        elif upper == 'A':
            if is_rel:
                cx += params[5]; cy += params[6]
            else:
                cx = params[5]; cy = params[6]
            points.append((cx, cy))

        first_after_cmd = False
        i = j

    return points


def compute_centroid(points):
    if not points:
        return (0, 0)
    avg_x = sum(p[0] for p in points) / len(points)
    avg_y = sum(p[1] for p in points) / len(points)
    return (avg_x, avg_y)


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
    elif area < 4000:
        return 7
    elif area < 8000:
        return 8
    elif area < 15000:
        return 9
    else:
        return 10


# ═══════════════════════════════════════════
# Laden und Zusammenführen
# ═══════════════════════════════════════════

script_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(script_dir, 'district-paths.json'), 'r') as f:
    dp_data = json.load(f)

with open(os.path.join(script_dir, 'missing-districts.json'), 'r') as f:
    missing_data = json.load(f)

# Merge all districts
all_districts_raw = {}
for dist_id, info in dp_data['districts'].items():
    all_districts_raw[dist_id] = info['d']

for key, info in missing_data.items():
    dist_id = key.replace('_', '-')
    all_districts_raw[dist_id] = info['d']

print(f"Total districts: {len(all_districts_raw)}")

# Transform all district paths
all_districts_transformed = {}
for dist_id, d_str in all_districts_raw.items():
    all_districts_transformed[dist_id] = transform_path_clean(d_str)

# Transform Aussenalster from water.lakes[0]
aussen_alster_orig = dp_data['water']['lakes'][0]['d']
aussen_alster_transformed = transform_path_clean(aussen_alster_orig)

# Read the current ELBE_PATH from HamburgSVG.jsx
jsx_path = os.path.join(script_dir, '..', 'src', 'components', 'Map', 'HamburgSVG.jsx')
with open(jsx_path, 'r') as f:
    jsx_content = f.read()

# Extract ELBE_PATH
elbe_match = re.search(r"const ELBE_PATH = '([^']+)'", jsx_content)
ELBE_PATH = elbe_match.group(1) if elbe_match else ''
print(f"ELBE_PATH length: {len(ELBE_PATH)}")

# Extract OTHER_WATER_PATHS
water_match = re.search(r'const OTHER_WATER_PATHS = \[(.*?)\]', jsx_content, re.DOTALL)
OTHER_WATER_PATHS_RAW = water_match.group(0) if water_match else 'const OTHER_WATER_PATHS = []'

# Compute labels for interactive districts
labels = []
for dist_id in INTERACTIVE_IDS:
    if dist_id not in all_districts_transformed:
        print(f"WARNING: {dist_id} not in transformed districts!")
        continue

    transformed_path = all_districts_transformed[dist_id]
    points = extract_endpoints_from_path(transformed_path)
    centroid = compute_centroid(points)
    bbox = compute_bbox(points)
    area = compute_area_from_bbox(bbox)
    size = font_size_for_area(area)

    cx, cy = centroid

    if dist_id in DISPLAY_NAMES:
        lines = DISPLAY_NAMES[dist_id]
    else:
        lines = [dist_id.replace('-', ' ').title()]

    leader = None

    if dist_id in LABEL_OVERRIDES:
        override = LABEL_OVERRIDES[dist_id]
        lines = override['lines']
        ox, oy = override['offset']
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

# ═══════════════════════════════════════════
# Generiere JSX
# ═══════════════════════════════════════════

# Build ALL_DISTRICTS array
district_entries = []
for dist_id in sorted(all_districts_transformed.keys()):
    path = all_districts_transformed[dist_id]
    district_entries.append(f"  {{ id: '{dist_id}', path: '{path}' }}")

# Build LABELS array
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

# Binnenalster ellipse (transformed)
binnen_cx = transform_x(261)
binnen_cy = transform_y(279)
binnen_rx = 8 * SCALE
binnen_ry = 5 * SCALE
print(f"Binnenalster center: ({fmt(binnen_cx)}, {fmt(binnen_cy)}), rx={fmt(binnen_rx)}, ry={fmt(binnen_ry)}")

# Escape single quotes in ELBE_PATH for JSX string
ELBE_PATH_ESCAPED = ELBE_PATH.replace("'", "\\'")

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
// Hamburg SVG Karte (53 Stadtteile, 22 interaktiv)
// Generiert aus district-paths.json + missing-districts.json
// Transformation: newX = (origX - {CROP_MIN_X}) * {SCALE}, newY = (origY - {CROP_MIN_Y}) * {SCALE} + {OFFSET_Y}
// ═══════════════════════════════════════════

const INTERACTIVE_IDS = new Set([
  {", ".join(f"'{d}'" for d in INTERACTIVE_IDS)},
])

const ALL_DISTRICTS = [
{chr(10).join(d + "," for d in district_entries)}
]

// Elbe: Blaues Band am Suedrand (bereits transformiert, beibehalten)
const ELBE_PATH = '{ELBE_PATH_ESCAPED}'

// Aussenalster (transformiert aus district-paths.json water.lakes[0])
const AUSSEN_ALSTER_PATH = '{aussen_alster_transformed}'

// Binnenalster (Ellipse, manuell positioniert)
const BINNEN_ALSTER_CX = {fmt(binnen_cx)}
const BINNEN_ALSTER_CY = {fmt(binnen_cy)}
const BINNEN_ALSTER_RX = {fmt(binnen_rx)}
const BINNEN_ALSTER_RY = {fmt(binnen_ry)}

// Weitere Wasserflaechen (Kanaele, Bassins)
{OTHER_WATER_PATHS_RAW}

// Stadtgrenze (Kombination aller Bezirkspfade als Hintergrund)
const CITY_BOUNDARY = ALL_DISTRICTS.map(d => d.path).join(' ')

const DARK_DISTRICTS = new Set([
  {", ".join(f"'{d}'" for d in DARK_DISTRICTS)},
])

const LABELS = [
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

export function HamburgSVG({{
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
      viewBox="-30 55 1060 600"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
      role="img"
      aria-label="Stadtteil-Karte Hamburg mit Immobilienpreisen"
    >

      {{/* Clip-Bereich fuer Elbe (begrenzt auf sichtbares Gebiet) */}}
      <defs>
        <clipPath id="elbe-clip">
          <rect x="-30" y="55" width="1060" height="600" />
        </clipPath>
      </defs>

      {{/* SCHICHT 0: Elbe (blaues Band, unterste Schicht) */}}
      <g clipPath="url(#elbe-clip)" style={{{{ pointerEvents: 'none' }}}}>
        <path d={{ELBE_PATH}} fill="#B8D4E3" />
      </g>

      {{/* SCHICHT 1: Stadtgrenze / Hintergrund */}}
      <path d={{CITY_BOUNDARY}} fill="#E8E4E0" stroke="#B8B4B0" strokeWidth="2" strokeLinejoin="round" />

      {{/* SCHICHT 2: Graue Hintergrund-Stadtteile (nicht interaktiv) */}}
      <g className="background-districts" style={{{{ pointerEvents: 'none' }}}}>
        {{ALL_DISTRICTS.filter(d => !INTERACTIVE_IDS.has(d.id)).map(({{ id, path: d }}) => (
          <path
            key={{id}}
            d={{d}}
            fill="#E8E4E0"
            stroke="#D1CDC9"
            strokeWidth="1"
            strokeLinejoin="round"
            style={{{{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 400ms ease 200ms',
            }}}}
          />
        ))}}
      </g>

      {{/* SCHICHT 3: Interaktive Stadtteile (farbig) */}}
      <g className="interactive-districts" role="list">
        {{ALL_DISTRICTS.filter(d => INTERACTIVE_IDS.has(d.id)).map(({{ id, path: d }}) => (
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

      {{/* SCHICHT 4: Alster-Gewaesser (UEBER den Stadtteilen, blockt Klicks im Wasser) */}}
      <g className="water-bodies" style={{{{ pointerEvents: 'all' }}}}>
        <path d={{AUSSEN_ALSTER_PATH}} fill="#B8D4E3" stroke="#9BC4D8" strokeWidth="1" />
        <ellipse cx={{BINNEN_ALSTER_CX}} cy={{BINNEN_ALSTER_CY}} rx={{BINNEN_ALSTER_RX}} ry={{BINNEN_ALSTER_RY}} fill="#B8D4E3" stroke="#9BC4D8" strokeWidth="0.8" />
        {{OTHER_WATER_PATHS.map((d, i) => (
          <path key={{i}} d={{d}} fill="#B8D4E3" stroke="#9BC4D8" strokeWidth="0.5" clipPath="url(#elbe-clip)" />
        ))}}
      </g>

      {{/* SCHICHT 5: Labels mit Leader Lines */}}
      <g
        fontFamily="'DM Sans', system-ui, sans-serif"
        style={{{{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}}}
      >
        {{/* Leader Lines fuer externe Labels */}}
        {{LABELS.filter(l => l.leader).map(({{ id, x, y, leader }}) => (
          <line
            key={{`leader-${{id}}`}}
            x1={{x}}
            y1={{y + 2}}
            x2={{leader[0]}}
            y2={{leader[1]}}
            stroke="#999"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}}
        {{/* Label-Texte */}}
        {{LABELS.map(({{ id, x, y, lines, size }}) => (
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

export {{ LABELS as DISTRICT_LABELS, CITY_BOUNDARY }}
'''

# Write the JSX file
output_path = os.path.join(script_dir, '..', 'src', 'components', 'Map', 'HamburgSVG.jsx')
with open(output_path, 'w') as f:
    f.write(jsx)

print(f"Written to {output_path}")
print(f"Districts: {len(all_districts_transformed)}")
print(f"Interactive: {len(INTERACTIVE_IDS)}")
print(f"Grey: {len(all_districts_transformed) - len(INTERACTIVE_IDS)}")
print(f"Labels: {len(labels)}")
