// Konvertiert kreis-dithmarschen-gemeinden.geojson in eine React-SVG-Komponente.
// Ausgabe: src/components/Map/KreisDithmarschenSVG.jsx
//
// Usage: node scripts/geojson-to-dithmarschen-svg.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import polylabel from '@mapbox/polylabel'

const GEOJSON = resolve(process.cwd(), 'src/data/kreis-dithmarschen-gemeinden.geojson')
const OUTPUT = resolve(process.cwd(), 'src/components/Map/KreisDithmarschenSVG.jsx')

// ViewBox-Zielgröße (Dithmarschen ist breit/hoch ähnlich)
const VIEW_W = 800
const VIEW_H = 700
const PADDING = 20
const SIMPLIFY_TOL = 0.0008  // Grad (etwa 80 m bei 54°N)
const LABEL_FONT = 11

// Küstenorte aus Briefing (subtiler blauer Akzent)
const COASTAL_IDS = new Set([
  'buesum', 'friedrichskoog', 'buesumer-deichhausen',
  'wesselburenerkoog', 'reinsbuettel',
])

// Gemeinden mit dunkler Heatmap-Farbe (für helle Schrift)
const DARK_IDS = new Set([
  'heide', 'meldorf', 'tellingstedt', 'buesum', 'buesumer-deichhausen',
  'friedrichskoog', 'wesselburenerkoog',
])

const LABEL_OVERRIDES = {
  'burg-in-dithmarschen': ['Burg'],
  'st-michaelisdonn': ['St. Michaelis-', 'donn'],
  'lohe-rickelshof': ['Lohe-', 'Rickelshof'],
  'buesumer-deichhausen': ['Büsumer', 'Deichhausen'],
  'wesselburenerkoog': ['Wesselburener-', 'koog'],
}

// Douglas-Peucker-Simplifizierung
function simplify(points, tol) {
  if (points.length < 4) return points
  const sqTol = tol * tol
  const keep = new Array(points.length).fill(false)
  keep[0] = true
  keep[points.length - 1] = true

  function visit(i, j) {
    if (j - i < 2) return
    let maxSq = 0
    let index = -1
    const [ax, ay] = points[i]
    const [bx, by] = points[j]
    const dx = bx - ax
    const dy = by - ay
    const len = dx * dx + dy * dy
    for (let k = i + 1; k < j; k++) {
      const [px, py] = points[k]
      let t = ((px - ax) * dx + (py - ay) * dy) / (len || 1)
      t = Math.max(0, Math.min(1, t))
      const cx = ax + t * dx
      const cy = ay + t * dy
      const d = (px - cx) ** 2 + (py - cy) ** 2
      if (d > maxSq) { maxSq = d; index = k }
    }
    if (maxSq > sqTol) {
      keep[index] = true
      visit(i, index)
      visit(index, j)
    }
  }

  visit(0, points.length - 1)
  return points.filter((_, i) => keep[i])
}

// Koordinaten aus Geometry extrahieren. Gibt Array von Rings (Arrays von [lon, lat]).
function extractRings(geometry) {
  const rings = []
  if (geometry.type === 'Polygon') {
    rings.push(geometry.coordinates[0])  // Outer Ring
  } else if (geometry.type === 'MultiPolygon') {
    for (const poly of geometry.coordinates) {
      rings.push(poly[0])  // Outer Rings aller Sub-Polygone
    }
  }
  return rings
}

function main() {
  const fc = JSON.parse(readFileSync(GEOJSON, 'utf8'))

  // Globale Bounding-Box
  let minLon = Infinity, maxLon = -Infinity
  let minLat = Infinity, maxLat = -Infinity
  for (const f of fc.features) {
    for (const ring of extractRings(f.geometry)) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }

  // Projektion: einfache equirectangular mit Cosinus-Korrektur auf Mittel-Breite
  const midLat = (minLat + maxLat) / 2
  const cosLat = Math.cos(midLat * Math.PI / 180)
  const lonScale = 1 / cosLat  // ein Lon-Grad ist schmaler als ein Lat-Grad

  const spanLon = (maxLon - minLon) * cosLat
  const spanLat = maxLat - minLat

  const availW = VIEW_W - 2 * PADDING
  const availH = VIEW_H - 2 * PADDING
  const scale = Math.min(availW / spanLon, availH / spanLat)

  const renderW = spanLon * scale
  const renderH = spanLat * scale
  const offsetX = PADDING + (availW - renderW) / 2
  const offsetY = PADDING + (availH - renderH) / 2

  const project = ([lon, lat]) => {
    const x = offsetX + (lon - minLon) * cosLat * scale
    const y = offsetY + (maxLat - lat) * scale  // Y umdrehen
    return [x, y]
  }

  const districts = []
  const labels = []

  for (const feature of fc.features) {
    const id = feature.properties.id
    const name = feature.properties.name
    const rings = extractRings(feature.geometry)

    // Simplify in Lon/Lat (Grad), dann kleine Exklaven (< 5% vom größten Ring) verwerfen.
    const simplifiedAll = rings.map(r => simplify(r, SIMPLIFY_TOL))
    const ringAreas = simplifiedAll.map(r => Math.abs(ringArea(r)))
    const maxRingArea = Math.max(...ringAreas)
    const simplifiedRings = simplifiedAll.filter((_, i) => ringAreas[i] >= maxRingArea * 0.05)

    // Zum Pfad-Konvertieren: projiziere + baue M/L-Kommandos
    const pathParts = simplifiedRings.map(ring => {
      const projected = ring.map(project)
      const cmds = projected.map(([x, y], i) =>
        `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`
      )
      return cmds.join(' ') + ' Z'
    })
    const path = pathParts.join(' ')

    // Label-Position: pole of inaccessibility auf größtem Ring (projiziert)
    let largestRing = simplifiedRings[0]
    let largestArea = 0
    for (const ring of simplifiedRings) {
      const area = Math.abs(ringArea(ring))
      if (area > largestArea) { largestArea = area; largestRing = ring }
    }
    const projRing = largestRing.map(project)
    const [lx, ly] = polylabel([projRing], 1.0)

    districts.push({ id, path })
    labels.push({
      id,
      x: +lx.toFixed(1),
      y: +ly.toFixed(1),
      lines: LABEL_OVERRIDES[id] || [name],
      size: LABEL_FONT,
    })
  }

  const sortedDark = districts.filter(d => DARK_IDS.has(d.id)).map(d => `'${d.id}'`).join(', ')
  const sortedCoastal = districts.filter(d => COASTAL_IDS.has(d.id)).map(d => `'${d.id}'`).join(', ')
  const staggerOrder = [...districts].sort((a, b) => {
    const la = labels.find(l => l.id === a.id)
    const lb = labels.find(l => l.id === b.id)
    return (la.x + la.y) - (lb.x + lb.y)
  }).map(d => `'${d.id}'`).join(', ')

  const code = `import { useState, useEffect, useCallback, useRef, memo } from 'react'

function getDistrictColor(districtId, data) {
  const { colorScale } = data.meta
  const district = data.districts.find(d => d.id === districtId)
  if (!district) return '#E8E4E0'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#E8E4E0'
}

// ═══════════════════════════════════════════
// Kreis Dithmarschen SVG Karte (23 Gemeinden)
// Generiert aus OpenStreetMap (Overpass API, admin_level=8)
// ═══════════════════════════════════════════

const ALL_DISTRICTS = [
${districts.map(d => `  { id: '${d.id}', path: '${d.path}' },`).join('\n')}
]

const DARK_DISTRICTS = new Set([${sortedDark}])
const COASTAL_DISTRICTS = new Set([${sortedCoastal}])

const LABELS = [
${labels.map(l => `  { id: '${l.id}', x: ${l.x}, y: ${l.y}, lines: ${JSON.stringify(l.lines)}, size: ${l.size} },`).join('\n')}
]

const STAGGER_ORDER = [${staggerOrder}]

/** Einzelner klickbarer Gemeinde-Pfad. React.memo verhindert Re-Renders bei Hover anderer Gemeinden. */
const DistrictPath = memo(function DistrictPath({
  id, d, fill, label, isSelected, isHovered, isDimmed, isCoastal, loaded, staggerDelay,
  onClick, onMouseEnter, onMouseLeave,
}) {
  const stroke = isCoastal ? '#2E6A8A' : '#D1CDC9'
  const strokeWidth = isCoastal ? 2 : 1.5
  return (
    <path
      id={id}
      role="listitem"
      tabIndex={0}
      aria-label={\`Gemeinde \${label}\`}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      style={{
        cursor: 'pointer',
        outline: 'none',
        opacity: loaded ? (isDimmed ? 0.6 : (isHovered ? 0.85 : 1)) : 0,
        transition: loaded
          ? 'opacity 150ms ease, filter 150ms ease'
          : \`opacity 400ms ease \${staggerDelay}ms\`,
        filter: isHovered && !isSelected ? 'brightness(1.15)' : undefined,
      }}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(id) } }}
      onMouseEnter={() => onMouseEnter?.(id)}
      onMouseLeave={() => onMouseLeave?.()}
      onFocus={() => onMouseEnter?.(id)}
      onBlur={() => onMouseLeave?.()}
    />
  )
})

export function KreisDithmarschenSVG({
  data,
  selectedId = null,
  hoveredId = null,
  searchDimmedIds = null,
  onDistrictClick,
  onDistrictHover,
  onDistrictLeave,
  onDistrictRect,
}) {
  const [loaded, setLoaded] = useState(false)
  const svgRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleMouseEnter = useCallback((id) => {
    onDistrictHover?.(id)
    if (onDistrictRect && svgRef.current) {
      const el = svgRef.current.querySelector(\`#\${CSS.escape(id)}\`)
      if (el) onDistrictRect(el.getBoundingClientRect())
    }
  }, [onDistrictHover, onDistrictRect])

  const REGION_BOUNDARY = ALL_DISTRICTS.map(d => d.path).join(' ')

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 ${VIEW_W} ${VIEW_H}"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
      role="img"
      aria-label="Gemeinde-Karte Kreis Dithmarschen mit Immobilienpreisen"
    >
      {/* SCHICHT 1: Kreisgrenze als Hintergrund */}
      <path d={REGION_BOUNDARY} fill="#E8E4E0" stroke="#B8B4B0" strokeWidth="2" strokeLinejoin="round" />

      {/* SCHICHT 2: Alle 23 Gemeinden */}
      <g className="interactive-districts" role="list">
        {ALL_DISTRICTS.map(({ id, path: d }) => (
          <DistrictPath
            key={id}
            id={id}
            d={d}
            fill={getDistrictColor(id, data)}
            label={data.districts.find(dd => dd.id === id)?.name || id}
            isSelected={selectedId === id}
            isHovered={hoveredId === id}
            isDimmed={!!(selectedId && selectedId !== id) || !!(searchDimmedIds && !searchDimmedIds.has(id))}
            isCoastal={COASTAL_DISTRICTS.has(id)}
            loaded={loaded}
            staggerDelay={STAGGER_ORDER.indexOf(id) * 30}
            onClick={onDistrictClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onDistrictLeave}
          />
        ))}
      </g>

      {/* SCHICHT 3: Labels */}
      <g fontFamily="'DM Sans', system-ui, sans-serif" style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
        {LABELS.map(({ id, x, y, lines, size }) => (
          <text key={id} textAnchor="middle" fontSize={size} fontWeight="500" fill={DARK_DISTRICTS.has(id) ? '#F5F2F0' : '#333'}>
            {lines.map((line, i) => (
              <tspan key={i} x={x} y={y + i * (size * 1.2)}>{line}</tspan>
            ))}
          </text>
        ))}
      </g>
    </svg>
  )
}
`

  writeFileSync(OUTPUT, code)
  console.log('Geschrieben: ' + OUTPUT)
  console.log('  Gemeinden: ' + districts.length)
  console.log('  ViewBox: ' + VIEW_W + ' × ' + VIEW_H)
}

function ringArea(ring) {
  let area = 0
  for (let i = 0, len = ring.length; i < len; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % len]
    area += x1 * y2 - x2 * y1
  }
  return area / 2
}

main()
