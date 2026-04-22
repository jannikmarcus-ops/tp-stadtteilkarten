// Transformiert Dithmarschen/dithmarschen_orte_daten_final.json in das App-Schema.
// Ausgabe: src/data/kreis-dithmarschen-gemeinden.json
//
// Usage: node scripts/build-dithmarschen-data.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SOURCE = resolve(process.cwd(), 'Dithmarschen/dithmarschen_orte_daten_final.json')
const TARGET = resolve(process.cwd(), 'src/data/kreis-dithmarschen-gemeinden.json')

const COASTAL_IDS = new Set([
  'buesum', 'friedrichskoog', 'buesumer-deichhausen',
  'wesselburenerkoog', 'reinsbuettel',
])

// 6-stufige Heatmap-Skala (ETW €/m²)
// Stufe 1 (< 1800): hellster. Stufe 6 (>= 4000): dunkelster.
const COLOR_SCALE = [
  { min: 4000, max: 999999, color: '#052E26', label: 'ab 4.000 €/m²' },
  { min: 2900, max: 3999, color: '#1A5C4A', label: '2.900 bis 3.999 €/m²' },
  { min: 2400, max: 2899, color: '#3D8B6E', label: '2.400 bis 2.899 €/m²' },
  { min: 2100, max: 2399, color: '#7CB89E', label: '2.100 bis 2.399 €/m²' },
  { min: 1800, max: 2099, color: '#B5D1C2', label: '1.800 bis 2.099 €/m²' },
  { min: 0, max: 1799, color: '#DCEBE2', label: 'unter 1.800 €/m²' },
]

// Trend aus "+2,8%" → 'steigend' / 'fallend' / 'stabil'
function parseTrend(raw) {
  if (!raw) return { label: 'stabil', direction: 'stabil' }
  const num = Number(String(raw).replace(/[+%\s]/g, '').replace(',', '.'))
  if (Number.isNaN(num)) return { label: raw, direction: 'stabil' }
  if (num > 0.5) return { label: raw, direction: 'steigend' }
  if (num < -0.5) return { label: raw, direction: 'fallend' }
  return { label: raw, direction: 'stabil' }
}

const source = JSON.parse(readFileSync(SOURCE, 'utf8'))

const districts = source.orte.map(ort => {
  const trend = parseTrend(ort.trend_12m)
  return {
    id: ort.id,
    name: ort.name,
    slug: ort.id,
    isCoastal: COASTAL_IDS.has(ort.id),
    prices: {
      etwPerSqm: ort.etw_qm_preis,
      housePerSqm: ort.efh_qm_preis,
      landPerSqm: ort.grundstueck_qm_preis,
      trend: trend.direction,
      trend12m: trend.label,
    },
    demographics: {
      population: ort.einwohner,
    },
    character: {
      shortProfile: ort.besonderheiten,
      marktsegment: ort.marktsegment,
      kaeufergruppen: ort.kaeufergruppen,
      tooltip: ort.tooltip,
    },
    cta: {
      text: `Was ist Ihre Immobilie in ${ort.name} wert?`,
      url: 'https://teigelerundpartner.de/immobilienbewertung-dithmarschen/',
    },
  }
})

const output = {
  meta: {
    region: 'kreis-dithmarschen',
    regionLabel: 'Kreis Dithmarschen',
    cityLabel: 'im Kreis Dithmarschen',
    city: 'kreis-dithmarschen',
    lastUpdated: '2026-04-01',
    quarter: source.datenstand,
    source: `Angebotspreise im Mehrquellen-Konsens (${source.quellen.join(', ')}), Stand ${source.datenstand}.`,
    methodik: source.methodik,
    priceUnit: '€/m²',
    priceColumns: ['etw', 'haus', 'grund'],
    colorScale: COLOR_SCALE,
    infoBox: {
      heading: 'Zwei Märkte in einem Kreis',
      paragraphs: [
        'Der Kreis Dithmarschen ist immobilienwirtschaftlich kein homogener Raum, sondern vereint zwei unterschiedliche Märkte. Im Binnenland dominieren Wohnimmobilien für Familien, Pendler und Eigennutzer mit moderaten Preisen zwischen 1.500 und 2.500 Euro pro Quadratmeter. Die Kreisstadt Heide und Industriestandorte wie Brunsbüttel sind hier die Zentren.',
        'An der Nordseeküste entsteht durch Tourismus und Zweitwohnsitz-Nachfrage ein deutlich höheres Preisniveau. Büsum erreicht über 5.000 Euro pro Quadratmeter für Eigentumswohnungen, Friedrichskoog und Büsumer Deichhausen folgen mit Werten über 3.700 Euro. Diese Spaltung prägt Bewertung, Vermarktung und Zielgruppe jeder Immobilie im Kreis.',
      ],
    },
  },
  districts,
}

writeFileSync(TARGET, JSON.stringify(output, null, 2))
console.log('Geschrieben: ' + TARGET)
console.log('  Gemeinden: ' + districts.length)
