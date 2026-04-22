// Fetch-Skript: 23 Gemeinden im Kreis Dithmarschen via Overpass API
// Ergebnis: src/data/kreis-dithmarschen-gemeinden.geojson
//
// Usage: node scripts/fetch-dithmarschen.mjs

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TARGET = resolve(process.cwd(), 'src/data/kreis-dithmarschen-gemeinden.geojson')

const ID_MAP = {
  'Heide': 'heide',
  'Brunsbüttel': 'brunsbuettel',
  'Meldorf': 'meldorf',
  'Marne': 'marne',
  'Burg (Dithmarschen)': 'burg-in-dithmarschen',
  'Burg in Dithmarschen': 'burg-in-dithmarschen',
  'Sankt Michaelisdonn': 'st-michaelisdonn',
  'St. Michaelisdonn': 'st-michaelisdonn',
  'Albersdorf': 'albersdorf',
  'Hemmingstedt': 'hemmingstedt',
  'Wesselburen': 'wesselburen',
  'Hennstedt': 'hennstedt',
  'Tellingstedt': 'tellingstedt',
  'Lohe-Rickelshof': 'lohe-rickelshof',
  'Eddelak': 'eddelak',
  'Lunden': 'lunden',
  'Süderhastedt': 'suederhastedt',
  'Büsum': 'buesum',
  'Friedrichskoog': 'friedrichskoog',
  'Büsumer Deichhausen': 'buesumer-deichhausen',
  'Wesselburenerkoog': 'wesselburenerkoog',
  'Reinsbüttel': 'reinsbuettel',
  'Schafstedt': 'schafstedt',
  'Volsemenhusen': 'volsemenhusen',
  'Weddingstedt': 'weddingstedt',
}

const GEMEINDEN_NAMEN = [
  'Heide', 'Brunsbüttel', 'Meldorf', 'Marne', 'Burg (Dithmarschen)',
  'Sankt Michaelisdonn', 'Albersdorf', 'Hemmingstedt', 'Wesselburen',
  'Hennstedt', 'Tellingstedt', 'Lohe-Rickelshof', 'Eddelak', 'Lunden',
  'Süderhastedt', 'Büsum', 'Friedrichskoog', 'Büsumer Deichhausen',
  'Wesselburenerkoog', 'Reinsbüttel', 'Schafstedt', 'Volsemenhusen',
  'Weddingstedt',
]

// Overpass Query: alle Gemeinden im Kreis Dithmarschen (admin_level=8), die in unserer Liste stehen
const QUERY = `
[out:json][timeout:180];
area["name"="Kreis Dithmarschen"]["boundary"="administrative"]->.k;
(
${GEMEINDEN_NAMEN.map(n => `  relation(area.k)["admin_level"="8"]["boundary"="administrative"]["name"="${n}"];`).join('\n')}
);
out body;
>;
out skel qt;
`.trim()

async function fetchFromOverpass() {
  const url = 'https://overpass-api.de/api/interpreter'
  console.log('Query Overpass...')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'tp-stadtteilkarten/1.0 (kontakt@teigelerundpartner.de)',
      'Accept': 'application/json',
    },
    body: 'data=' + encodeURIComponent(QUERY),
  })
  if (!res.ok) {
    throw new Error(`Overpass HTTP ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

// Rebuild Polygons aus Overpass "skel" Daten (nodes + ways + relations)
function buildGeoJSON(osm) {
  const nodes = new Map()
  const ways = new Map()
  const relations = []

  for (const el of osm.elements) {
    if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat])
    else if (el.type === 'way') ways.set(el.id, el.nodes)
    else if (el.type === 'relation') relations.push(el)
  }

  const features = []
  for (const rel of relations) {
    const name = rel.tags?.name
    const id = ID_MAP[name]
    if (!id) {
      console.warn(`  Skip Relation ohne ID-Map: ${name}`)
      continue
    }

    // Outer-Ways mergen
    const outerWayIds = rel.members
      .filter(m => m.type === 'way' && m.role === 'outer')
      .map(m => m.ref)

    const segments = outerWayIds
      .map(wid => ways.get(wid))
      .filter(Boolean)
      .map(nodeIds => nodeIds.map(nid => nodes.get(nid)).filter(Boolean))

    const rings = mergeRings(segments)
    if (!rings.length) {
      console.warn(`  Keine Rings für ${name}`)
      continue
    }

    const coordinates = rings.length === 1 ? [rings[0]] : rings
    const geomType = rings.length === 1 ? 'Polygon' : 'MultiPolygon'
    const finalCoords = geomType === 'Polygon' ? coordinates : coordinates.map(r => [r])

    features.push({
      type: 'Feature',
      properties: { id, name },
      geometry: { type: geomType, coordinates: finalCoords },
    })
    console.log(`  ✓ ${name} (${rings[0].length} Punkte${rings.length > 1 ? `, ${rings.length} Rings` : ''})`)
  }

  return { type: 'FeatureCollection', features }
}

// Verbindet Teilsegmente zu geschlossenen Rings (Outer-Ways von OSM-Relations sind oft in Bruchstücken)
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

function isClosed(ring) {
  if (ring.length < 4) return false
  return equal(ring[0], ring[ring.length - 1])
}

function equal(a, b) {
  return a[0] === b[0] && a[1] === b[1]
}

async function main() {
  const osm = await fetchFromOverpass()
  console.log(`OSM Elemente: ${osm.elements.length}`)
  const fc = buildGeoJSON(osm)
  console.log(`Features: ${fc.features.length} / 23 erwartet`)
  writeFileSync(TARGET, JSON.stringify(fc))
  console.log(`Geschrieben: ${TARGET}`)
}

main().catch(e => { console.error(e); process.exit(1) })
