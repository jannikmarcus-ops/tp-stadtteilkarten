// Konvertiert Gemeinden + Kreis-Geografie in eine React-SVG-Komponente.
// Ausgabe: src/components/Map/KreisDithmarschenSVG.jsx
//
// Layer-Reihenfolge (unten → oben):
//   1. Wasser (Rechteck)
//   2. Nachbarkreise (blassgrau, gestrichelt)
//   3. Kreis Dithmarschen als Canvas
//   4. Gemeinden
//   5. Wasser-Labels (Nordsee, Elbe, Eider)
//
// Usage: node scripts/geojson-to-dithmarschen-svg.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import polylabel from '@mapbox/polylabel'

const GEM_GEOJSON = resolve(process.cwd(), 'src/data/kreis-dithmarschen-gemeinden.geojson')
const GEOGRAPHY = resolve(process.cwd(), 'src/data/kreis-dithmarschen-geography.geojson')
const OUTPUT = resolve(process.cwd(), 'src/components/Map/KreisDithmarschenSVG.jsx')

// Asymmetrisches Padding: mehr Platz dort wo Nachbarkreis-Labels hinsollen.
// Dithmarschen bleibt visuell zentral, Labels sitzen sauber auf Nachbar-Polygonen.
// Rechts wenig Platz nötig, da RE/Steinburg-Labels vertikal gedreht sind.
const PADDING = {
  top: 0.06,    // Platz für Kreis Nordfriesland Label (über dem Lunden-Vorsprung)
  bottom: 0.02, // Platz für Elbe-Label
  left: 0.01,   // Nordsee-Wasser
  right: 0.04,  // Schmaler Streifen für vertikal gedrehte Labels
}
const SIMPLIFY_TOL_GEMEINDEN = 0.0008
const SIMPLIFY_TOL_KREIS = 0.0080  // Kreisgrenzen stark vereinfacht, glättet Eider-Mündung & Watt-Vorsprünge weg
const LABEL_FONT = 11

const COASTAL_IDS = new Set([
  'buesum', 'friedrichskoog', 'buesumer-deichhausen',
  'wesselburenerkoog',
])

const DARK_IDS = new Set([
  'heide', 'meldorf', 'tellingstedt', 'buesum', 'buesumer-deichhausen',
  'friedrichskoog', 'wesselburenerkoog',
])

const LABEL_OVERRIDES = {
  'burg-in-dithmarschen': ['Burg in', 'Dithmarschen'],
  'st-michaelisdonn': ['St. Michaelis-', 'donn'],
  'lohe-rickelshof': ['Lohe-', 'Rickelshof'],
  'buesumer-deichhausen': ['Büsumer', 'Deichhausen'],
  'wesselburenerkoog': ['Wesselburener-', 'koog'],
}

// Manuelle Label-Verschiebungen wegen Polygon-Kollisionen. Ankerpunkt bleibt
// am Original-Polylabel; Label rendert an `pos` mit Leader-Line dazwischen.
const LABEL_LEADERS = {
  // Büsumer Deichhausen liegt direkt neben Büsum, beide Polygone winzig.
  // Label nach Osten ins freie Festland zwischen Reinsbüttel und Hemmingstedt.
  'buesumer-deichhausen': { pos: { x: 220, y: 540 } },
}

// Wasser-Labels in Lon/Lat (werden später projiziert)
const WATER_LABELS = [
  { text: 'Nordsee', lon: 8.82, lat: 54.00, size: 13 },
  { text: 'Elbe', lon: 8.95, lat: 53.84, size: 12 },
  { text: 'Eider', lon: 8.92, lat: 54.34, size: 11 },
  { text: 'Nord-Ostsee-Kanal', lon: 9.34, lat: 53.965, size: 10 },
]

// Nord-Ostsee-Kanal als grobe Polyline. Verläuft von Brunsbüttel (Mündung in
// die Elbe) nach Nordosten Richtung Rendsburg/Kiel. Punkte sind die markanten
// Knickpunkte entlang der Strecke. Wikipedia-Referenz zeigt Kanal als blaue
// Linie zwischen Brunsbüttel und der nordöstlichen Kreisgrenze.
const NORD_OSTSEE_KANAL = [
  [9.139, 53.892], // Brunsbüttel-Schleuse (Elbe)
  [9.165, 53.910],
  [9.200, 53.925],
  [9.260, 53.950],
  [9.330, 53.985],
  [9.380, 54.020], // Austritt aus Kreis Dithmarschen Richtung Steinburg/Rendsburg
]

// Nachbarkreis-Labels in Lon/Lat. Positionen sicher außerhalb der
// Dithmarschen-Kreisgrenze, auf dem jeweiligen Nachbar-Polygon.
// Lat/Lon hier groß genug, damit Polygon-Simplifizierung sie nicht
// verschluckt — siehe PADDING für sichtbaren Rand.
const NEIGHBOR_LABELS = {
  'nordfriesland': { text: 'Kreis Nordfriesland', lon: 9.05, lat: 54.36 },
  'schleswig-flensburg': { text: 'Schleswig-Flensburg', lon: 9.42, lat: 54.36 },
  'rendsburg-eckernfoerde': { text: 'Rendsburg-Eckernförde', lon: 9.42, lat: 54.20 },
  'steinburg': { text: 'Kreis Steinburg', lon: 9.41, lat: 53.92 },
}

// Douglas-Peucker
function simplify(points, tol) {
  if (points.length < 4) return points
  const sqTol = tol * tol
  const keep = new Array(points.length).fill(false)
  keep[0] = true
  keep[points.length - 1] = true
  function visit(i, j) {
    if (j - i < 2) return
    let maxSq = 0, idx = -1
    const [ax, ay] = points[i], [bx, by] = points[j]
    const dx = bx - ax, dy = by - ay
    const len = dx * dx + dy * dy
    for (let k = i + 1; k < j; k++) {
      const [px, py] = points[k]
      let t = ((px - ax) * dx + (py - ay) * dy) / (len || 1)
      t = Math.max(0, Math.min(1, t))
      const cx = ax + t * dx, cy = ay + t * dy
      const d = (px - cx) ** 2 + (py - cy) ** 2
      if (d > maxSq) { maxSq = d; idx = k }
    }
    if (maxSq > sqTol) { keep[idx] = true; visit(i, idx); visit(idx, j) }
  }
  visit(0, points.length - 1)
  return points.filter((_, i) => keep[i])
}

function extractRings(geometry) {
  const rings = []
  if (geometry.type === 'Polygon') rings.push(geometry.coordinates[0])
  else if (geometry.type === 'MultiPolygon') for (const poly of geometry.coordinates) rings.push(poly[0])
  return rings
}

function ringArea(ring) {
  let a = 0
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % ring.length]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

// ─── Daten laden ────────────────────────────────────────────
const gemFC = JSON.parse(readFileSync(GEM_GEOJSON, 'utf8'))
const geoFC = JSON.parse(readFileSync(GEOGRAPHY, 'utf8'))

const dithmarschenFeature = geoFC.features.find(f => f.properties.id === 'dithmarschen')
const neighborFeatures = geoFC.features.filter(f => f.properties.type === 'neighbor')

if (!dithmarschenFeature) throw new Error('Dithmarschen-Kreis fehlt im GeoJSON')

// ─── Bounding-Box aus Dithmarschen-Kreisgrenze + Padding ────
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
for (const ring of extractRings(dithmarschenFeature.geometry)) {
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon
    if (lon > maxLon) maxLon = lon
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }
}

const spanLonRaw = maxLon - minLon
const spanLatRaw = maxLat - minLat
minLon -= spanLonRaw * PADDING.left
maxLon += spanLonRaw * PADDING.right
minLat -= spanLatRaw * PADDING.bottom
maxLat += spanLatRaw * PADDING.top

// ─── Projektion (equirectangular mit cos-Korrektur) ─────────
const midLat = (minLat + maxLat) / 2
const cosLat = Math.cos(midLat * Math.PI / 180)
const spanLon = (maxLon - minLon) * cosLat
const spanLat = maxLat - minLat

// ViewBox: Aspect-Ratio aus echtem Gebiet ableiten
const VIEW_W = 800
const VIEW_H = Math.round(VIEW_W * (spanLat / spanLon))
const scale = Math.min(VIEW_W / spanLon, VIEW_H / spanLat)

const project = ([lon, lat]) => {
  const x = (lon - minLon) * cosLat * scale
  const y = (maxLat - lat) * scale
  return [x, y]
}

// ─── Pfade bauen ────────────────────────────────────────────
function buildPath(geometry, tol) {
  const rings = extractRings(geometry).map(r => simplify(r, tol))
  const areas = rings.map(r => Math.abs(ringArea(r)))
  const maxArea = Math.max(...areas)
  const kept = rings.filter((_, i) => areas[i] >= maxArea * 0.05)
  return kept.map(ring => {
    const pts = ring.map(project)
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z'
  }).join(' ')
}

const dithmarschenPath = buildPath(dithmarschenFeature.geometry, SIMPLIFY_TOL_KREIS)

// Projizierte Bbox des Dithmarschen-Polygons → bestimmt sichere Label-Positionen
// für Nachbarkreise (außerhalb der Canvas, im Padding-Bereich).
const ditProjectedPoints = []
for (const ring of extractRings(dithmarschenFeature.geometry)) {
  const simplified = simplify(ring, SIMPLIFY_TOL_KREIS)
  for (const pt of simplified) ditProjectedPoints.push(project(pt))
}
const ditMinX = Math.min(...ditProjectedPoints.map(p => p[0]))
const ditMaxX = Math.max(...ditProjectedPoints.map(p => p[0]))
const ditMinY = Math.min(...ditProjectedPoints.map(p => p[1]))
const ditMaxY = Math.max(...ditProjectedPoints.map(p => p[1]))

const neighborPaths = neighborFeatures.map(f => ({
  id: f.properties.id,
  path: buildPath(f.geometry, SIMPLIFY_TOL_KREIS),
}))

// Gemeinden
const gemeinden = []
const gemLabels = []

for (const feature of gemFC.features) {
  const id = feature.properties.id
  const name = feature.properties.name
  const rawRings = extractRings(feature.geometry).map(r => simplify(r, SIMPLIFY_TOL_GEMEINDEN))
  const areas = rawRings.map(r => Math.abs(ringArea(r)))
  const maxArea = Math.max(...areas)
  const rings = rawRings.filter((_, i) => areas[i] >= maxArea * 0.05)

  const path = rings.map(ring => {
    const pts = ring.map(project)
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z'
  }).join(' ')

  // Label auf größtem Ring
  let biggest = rings[0]
  let big = 0
  for (const r of rings) {
    const a = Math.abs(ringArea(r))
    if (a > big) { big = a; biggest = r }
  }
  const projRing = biggest.map(project)
  const [lx, ly] = polylabel([projRing], 1.0)

  gemeinden.push({ id, path })

  const leader = LABEL_LEADERS[id]
  if (leader) {
    gemLabels.push({
      id,
      x: leader.pos.x,
      y: leader.pos.y,
      lines: LABEL_OVERRIDES[id] || [name],
      size: leader.size || LABEL_FONT,
      leaderFrom: { x: +lx.toFixed(1), y: +ly.toFixed(1) },
    })
  } else {
    gemLabels.push({ id, x: +lx.toFixed(1), y: +ly.toFixed(1), lines: LABEL_OVERRIDES[id] || [name], size: LABEL_FONT })
  }
}

// Wasser-Labels projizieren
const waterLabels = WATER_LABELS.map(l => {
  const [x, y] = project([l.lon, l.lat])
  return { text: l.text, x: +x.toFixed(1), y: +y.toFixed(1), size: l.size }
})

// Nord-Ostsee-Kanal-Polyline projizieren
const kanalPoints = NORD_OSTSEE_KANAL.map(project)
const kanalPath = kanalPoints.map(([x, y], i) =>
  `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`
).join(' ')

// Nachbarkreis-Labels in viewBox-Koordinaten platzieren, garantiert außerhalb
// der Dithmarschen-Canvas (basierend auf projizierter Polygon-Bbox).
// Rechte Labels (RE, Steinburg) werden 90° gedreht, lesen von oben nach unten.
const ditMidX = (ditMinX + ditMaxX) / 2
const rightX = Math.min(VIEW_W - 6, ditMaxX + 14)
const neighborLabelPositions = {
  'nordfriesland': { x: ditMinX + (ditMaxX - ditMinX) * 0.32, y: Math.max(14, ditMinY - 14), rotate: 0 },
  'schleswig-flensburg': { x: ditMinX + (ditMaxX - ditMinX) * 0.78, y: Math.max(14, ditMinY - 14), rotate: 0 },
  'rendsburg-eckernfoerde': { x: rightX, y: ditMinY + (ditMaxY - ditMinY) * 0.32, rotate: 90 },
  'steinburg': { x: rightX, y: ditMinY + (ditMaxY - ditMinY) * 0.92, rotate: 90 },
}
const neighborLabels = neighborPaths.map(n => {
  const cfg = NEIGHBOR_LABELS[n.id]
  const pos = neighborLabelPositions[n.id]
  if (!cfg || !pos) return null
  return {
    id: n.id,
    text: cfg.text,
    x: +pos.x.toFixed(1),
    y: +pos.y.toFixed(1),
    rotate: pos.rotate,
  }
}).filter(Boolean)

// Stagger-Order für Gemeinden (von Kreisstadt Heide nach außen)
const staggerOrder = [...gemeinden].sort((a, b) => {
  const la = gemLabels.find(l => l.id === a.id)
  const lb = gemLabels.find(l => l.id === b.id)
  return (la.x + la.y) - (lb.x + lb.y)
}).map(d => `'${d.id}'`).join(', ')

const sortedDark = gemeinden.filter(d => DARK_IDS.has(d.id)).map(d => `'${d.id}'`).join(', ')
const sortedCoastal = gemeinden.filter(d => COASTAL_IDS.has(d.id)).map(d => `'${d.id}'`).join(', ')

// ─── SVG-Komponente rendern ─────────────────────────────────
const code = `import { useState, useEffect, useCallback, useRef, memo } from 'react'

function getDistrictColor(districtId, data) {
  const { colorScale } = data.meta
  const district = data.districts.find(d => d.id === districtId)
  if (!district) return '#EDEAE5'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#EDEAE5'
}

// ═══════════════════════════════════════════
// Kreis Dithmarschen SVG Karte (23 Gemeinden)
// Layer: Wasser → Nachbarkreise → Kreis-Canvas → Gemeinden → Labels
// ═══════════════════════════════════════════

const VIEW_W = ${VIEW_W}
const VIEW_H = ${VIEW_H}

const KREIS_PATH = '${dithmarschenPath}'

const KANAL_PATH = '${kanalPath}'

const NEIGHBORS = [
${neighborPaths.map(n => `  { id: '${n.id}', path: '${n.path}' },`).join('\n')}
]

const NEIGHBOR_LABELS = [
${neighborLabels.map(l => `  { id: '${l.id}', x: ${l.x}, y: ${l.y}, text: ${JSON.stringify(l.text)}, rotate: ${l.rotate} },`).join('\n')}
]

const WATER_LABELS = [
${waterLabels.map(l => `  { x: ${l.x}, y: ${l.y}, text: ${JSON.stringify(l.text)}, size: ${l.size} },`).join('\n')}
]

const ALL_DISTRICTS = [
${gemeinden.map(d => `  { id: '${d.id}', path: '${d.path}' },`).join('\n')}
]

const DARK_DISTRICTS = new Set([${sortedDark}])
const COASTAL_DISTRICTS = new Set([${sortedCoastal}])

const LABELS = [
${gemLabels.map(l => {
  const leader = l.leaderFrom ? `, leaderFrom: { x: ${l.leaderFrom.x}, y: ${l.leaderFrom.y} }` : ''
  return `  { id: '${l.id}', x: ${l.x}, y: ${l.y}, lines: ${JSON.stringify(l.lines)}, size: ${l.size}${leader} },`
}).join('\n')}
]

const STAGGER_ORDER = [${staggerOrder}]

/** Einzelner klickbarer Gemeinde-Pfad. React.memo verhindert Re-Renders bei Hover anderer Gemeinden. */
const DistrictPath = memo(function DistrictPath({
  id, d, fill, label, isSelected, isHovered, isDimmed, isCoastal, loaded, staggerDelay,
  onClick, onMouseEnter, onMouseLeave,
}) {
  const stroke = isCoastal ? '#2E6A8A' : '#B8B4AC'
  const strokeWidth = isCoastal ? 1.5 : 0.8
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

  return (
    <svg
      ref={svgRef}
      viewBox={\`0 0 \${VIEW_W} \${VIEW_H}\`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="block mx-auto w-auto h-auto"
      style={{ maxHeight: '600px', maxWidth: '100%' }}
      role="img"
      aria-label="Gemeinde-Karte Kreis Dithmarschen mit Immobilienpreisen"
    >
      <defs>
        {/* Clip auf viewBox, damit Nachbarkreise sauber an der Kante enden */}
        <clipPath id="viewBoxClip">
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} />
        </clipPath>
      </defs>

      {/* LAYER 1: Wasser als Hintergrund */}
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#DCE9F0" />

      <g clipPath="url(#viewBoxClip)">
        {/* LAYER 1.5: Land-Filler mit dickem gleichfarbigen Stroke — schließt
            Gaps zwischen den unabhängig simplifizierten Polygonen (besonders
            an der Eider-Mündung), sodass kein Wasser zwischen den Kreisen
            durchscheint. Stroke wird später vom Detail-Layer überdeckt. */}
        <g>
          {NEIGHBORS.map(({ id, path: d }) => (
            <path key={\`fill-\${id}\`} d={d} fill="#EDEAE5" stroke="#EDEAE5" strokeWidth="40" strokeLinejoin="round" />
          ))}
          <path d={KREIS_PATH} fill="#EDEAE5" stroke="#EDEAE5" strokeWidth="40" strokeLinejoin="round" />
        </g>

        {/* LAYER 2: Nachbarkreise (dezentes Land-Grau, gestrichelte Grenze) */}
        <g>
          {NEIGHBORS.map(({ id, path: d }) => (
            <path
              key={id}
              d={d}
              fill="#F5F2F0"
              stroke="#CFC9BD"
              strokeWidth="1"
              strokeDasharray="4 3"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* LAYER 3: Kreis Dithmarschen als Canvas */}
        <path
          d={KREIS_PATH}
          fill="#EDEAE5"
          stroke="#A8A498"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />

        {/* LAYER 4: Nachbarkreis-Labels (dezent, außerhalb Dithmarschen-Canvas;
            rechte Labels vertikal gedreht für schmalen Padding-Streifen). */}
        <g fontFamily="'DM Sans', system-ui, sans-serif" fill="#8A857A" fontSize="10" style={{ pointerEvents: 'none' }}>
          {NEIGHBOR_LABELS.map(l => (
            <text
              key={l.id}
              x={l.x}
              y={l.y}
              textAnchor="middle"
              fontStyle="italic"
              transform={l.rotate ? \`rotate(\${l.rotate} \${l.x} \${l.y})\` : undefined}
            >{l.text}</text>
          ))}
        </g>

        {/* LAYER 4.5: Nord-Ostsee-Kanal als blaue Linie über Land */}
        <path
          d={KANAL_PATH}
          fill="none"
          stroke="#7AA8C0"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* LAYER 5: Gemeinden */}
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

        {/* LAYER 6a: Leader-Lines für versetzte Labels (z.B. Büsumer Deichhausen) */}
        <g style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
          {LABELS.filter(l => l.leaderFrom).map(({ id, x, y, leaderFrom }) => (
            <line
              key={\`leader-\${id}\`}
              x1={leaderFrom.x}
              y1={leaderFrom.y}
              x2={x}
              y2={y - 4}
              stroke="#8A857A"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* LAYER 6b: Gemeinde-Labels */}
        <g fontFamily="'DM Sans', system-ui, sans-serif" style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
          {LABELS.map(({ id, x, y, lines, size }) => (
            <text key={id} textAnchor="middle" fontSize={size} fontWeight="500" fill={DARK_DISTRICTS.has(id) ? '#F5F2F0' : '#333'}>
              {lines.map((line, i) => (
                <tspan key={i} x={x} y={y + i * (size * 1.2)}>{line}</tspan>
              ))}
            </text>
          ))}
        </g>

        {/* LAYER 7: Wasser-Labels (kursiv, dezent blau) */}
        <g fontFamily="'DM Sans', system-ui, sans-serif" fill="#6A8A98" fontStyle="italic" style={{ pointerEvents: 'none' }}>
          {WATER_LABELS.map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize={l.size}>{l.text}</text>
          ))}
        </g>
      </g>
    </svg>
  )
}
`

writeFileSync(OUTPUT, code)
console.log('Geschrieben: ' + OUTPUT)
console.log('  Gemeinden: ' + gemeinden.length)
console.log('  Nachbarkreise: ' + neighborPaths.length)
console.log('  ViewBox: ' + VIEW_W + ' × ' + VIEW_H)
