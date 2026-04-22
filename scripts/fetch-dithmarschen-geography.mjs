// Fetch-Skript: Kreis Dithmarschen + angrenzende Kreise als Hintergrund-Layer.
// Ausgabe: src/data/kreis-dithmarschen-geography.geojson
//
// Usage: node scripts/fetch-dithmarschen-geography.mjs

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TARGET = resolve(process.cwd(), 'src/data/kreis-dithmarschen-geography.geojson')

const KREISE = [
  { name: 'Kreis Dithmarschen', id: 'dithmarschen', type: 'focus' },
  { name: 'Kreis Nordfriesland', id: 'nordfriesland', type: 'neighbor' },
  { name: 'Kreis Rendsburg-Eckernförde', id: 'rendsburg-eckernfoerde', type: 'neighbor' },
  { name: 'Kreis Steinburg', id: 'steinburg', type: 'neighbor' },
]

const QUERY = `
[out:json][timeout:240];
(
${KREISE.map(k => `  relation["admin_level"="6"]["boundary"="administrative"]["name"="${k.name}"];`).join('\n')}
);
out body;
>;
out skel qt;
`.trim()

async function fetchFromOverpass() {
  console.log('Query Overpass für Kreis-Grenzen...')
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'tp-stadtteilkarten/1.0 (kontakt@teigelerundpartner.de)',
      'Accept': 'application/json',
    },
    body: 'data=' + encodeURIComponent(QUERY),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return res.json()
}

function buildGeoJSON(osm) {
  const nodes = new Map()
  const ways = new Map()
  const relations = []

  for (const el of osm.elements) {
    if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat])
    else if (el.type === 'way') ways.set(el.id, el.nodes)
    else if (el.type === 'relation') relations.push(el)
  }

  const byName = Object.fromEntries(KREISE.map(k => [k.name, k]))
  const features = []

  for (const rel of relations) {
    const match = byName[rel.tags?.name]
    if (!match) continue

    const outerWayIds = rel.members
      .filter(m => m.type === 'way' && m.role === 'outer')
      .map(m => m.ref)

    const segments = outerWayIds
      .map(wid => ways.get(wid))
      .filter(Boolean)
      .map(nodeIds => nodeIds.map(nid => nodes.get(nid)).filter(Boolean))

    const rings = mergeRings(segments)
    if (!rings.length) { console.warn(`  Keine Rings für ${match.name}`); continue }

    // Größter Ring + alle Rings mit > 5% Fläche
    const areas = rings.map(r => Math.abs(ringArea(r)))
    const maxArea = Math.max(...areas)
    const keptRings = rings.filter((_, i) => areas[i] >= maxArea * 0.05)

    const coordinates = keptRings.length === 1
      ? [keptRings[0]]
      : keptRings.map(r => [r])
    const geomType = keptRings.length === 1 ? 'Polygon' : 'MultiPolygon'

    features.push({
      type: 'Feature',
      properties: { id: match.id, name: match.name, type: match.type },
      geometry: { type: geomType, coordinates },
    })
    console.log(`  ✓ ${match.name} (${match.type}, ${keptRings.length} Ring${keptRings.length > 1 ? 's' : ''})`)
  }

  return { type: 'FeatureCollection', features }
}

function mergeRings(segments) {
  const remaining = segments.map(s => [...s])
  const rings = []
  while (remaining.length > 0) {
    const current = remaining.shift()
    let changed = true
    while (changed && !isClosed(current)) {
      changed = false
      const last = current[current.length - 1]
      const first = current[0]
      for (let i = 0; i < remaining.length; i++) {
        const seg = remaining[i]
        const segFirst = seg[0]
        const segLast = seg[seg.length - 1]
        if (equal(last, segFirst)) { current.push(...seg.slice(1)); remaining.splice(i, 1); changed = true; break }
        if (equal(last, segLast)) { current.push(...[...seg].reverse().slice(1)); remaining.splice(i, 1); changed = true; break }
        if (equal(first, segLast)) { current.unshift(...seg.slice(0, -1)); remaining.splice(i, 1); changed = true; break }
        if (equal(first, segFirst)) { current.unshift(...[...seg].reverse().slice(0, -1)); remaining.splice(i, 1); changed = true; break }
      }
    }
    if (isClosed(current)) rings.push(current)
  }
  return rings
}

const isClosed = (r) => r.length >= 4 && equal(r[0], r[r.length - 1])
const equal = (a, b) => a[0] === b[0] && a[1] === b[1]
function ringArea(ring) {
  let a = 0
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % ring.length]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

const osm = await fetchFromOverpass()
console.log(`OSM Elemente: ${osm.elements.length}`)
const fc = buildGeoJSON(osm)
writeFileSync(TARGET, JSON.stringify(fc))
console.log('Geschrieben: ' + TARGET)
