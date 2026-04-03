import { useState, useEffect, useCallback, useRef, memo } from 'react'
import districts from '../../data/districts.json'

const { colorScale } = districts.meta

function getDistrictColor(districtId) {
  const district = districts.districts.find(d => d.id === districtId)
  if (!district) return '#E8E4E0'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#E8E4E0'
}

/*
 * V6: Lückenloses Mosaik aller 26 Münsteraner Stadtteile.
 * 18 interaktive (farbig) + 8 graue (nicht-klickbar).
 * Kante an Kante, keine Lücken.
 */

// Hilfsfunktion: Punkt-Array → SVG-Pfad
function pts2path(points) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'
}

// ═══════════════════════════════════════════
// GEMEINSAME KNOTENPUNKTE
// Jeder Punkt wird von 2-4 Vierteln geteilt.
// ═══════════════════════════════════════════

// Stadtgrenze (clockwise von NW)
const B = {
  // NW → N (Häger)
  a1: [130,128], a2: [148,78], a3: [128,48], a4: [192,28], a5: [262,22],
  // N (Sprakel)
  b1: [338,18], b2: [400,22], b3: [455,28],
  // NE (Gelmer)
  c1: [518,42], c2: [572,65], c3: [608,92],
  // E (Handorf Protrusion)
  d1: [645,125], d2: [682,162], d3: [712,212], d4: [725,268], d5: [722,318],
  d6: [708,358], d7: [688,388], d8: [668,412],
  // SE (Gremmendorf)
  e1: [658,445], e2: [662,488], e3: [660,528],
  // S-SE (Wolbeck)
  f1: [648,568], f2: [632,618], f3: [608,655],
  // S (Hiltrup)
  g1: [572,682], g2: [528,702], g3: [478,718], g4: [432,725],
  // S-SW (Amelsbüren)
  h1: [388,728], h2: [348,732], h3: [308,735], h4: [272,728],
  // SW (Albachten)
  i1: [238,712], i2: [205,688], i3: [175,655], i4: [148,618], i5: [125,575],
  // W (Roxel)
  j1: [105,528], j2: [82,478], j3: [65,428], j4: [55,378], j5: [50,328],
  // NW (Nienberge/Roxel)
  k1: [52,278], k2: [58,238], k3: [72,198], k4: [92,162],
}

// Interne Knoten (wo 3+ Viertel aufeinandertreffen)
// N-Zone: Trennung Häger/Sprakel/Gelmer von Nienberge/Kinderhaus/Coerde
const N1 = [110, 145]   // Häger-Nienberge-Roxel (auf Stadtgrenze zwischen B.a1 und B.k4)
const N2 = [248, 135]   // Häger-Nienberge-Kinderhaus
const N3 = [325, 112]   // Häger-Sprakel-Kinderhaus
const N4 = [438, 108]   // Sprakel-Gelmer-Kinderhaus-Coerde
const N5 = [558, 118]   // Gelmer-Coerde-Handorf

// Innerer Ring
const K1 = [255, 195]   // Nienberge-Gievenbeck-Kinderhaus
const K2 = [292, 238]   // Gievenbeck-Kinderhaus-Aaseestadt
const K3 = [468, 238]   // Kinderhaus-Coerde-Mauritz
const K4 = [548, 238]   // Coerde-Mauritz-Handorf

// Zentrum-Block
const C1 = [328, 275]   // Pluggendorf NW
const C2 = [382, 262]   // Pluggendorf-Hafen
const C3 = [430, 272]   // Hafen NE
const C4 = [440, 325]   // Hafen-Altstadt E
const C5 = [425, 378]   // Altstadt SE
const C6 = [370, 390]   // Altstadt-Kreuzviertel S
const C7 = [322, 372]   // Kreuzviertel SW
const C8 = [312, 325]   // Pluggendorf-Kreuzviertel W
const CX = [375, 325]   // Zentrum-Kreuz (4-way)
const SG = [348, 382]   // Sentrup-Geist Grenze auf Kreuzviertel-S-Kante

// Aaseestadt
const AA1 = [292, 278]  // Aaseestadt NW
const AA2 = [288, 322]  // Aaseestadt W
const AA3 = [298, 362]  // Aaseestadt SW

// Süd-Zone: Geist, Schützenhof, Berg Fidel, Mecklenbeck
const S1 = [395, 395]   // Sentrup-Geist auf Zentrum-S-Kante
const S2 = [268, 415]   // Gievenbeck-Sentrup-Mecklenbeck
const S3 = [345, 448]   // Sentrup-Mecklenbeck-Berg Fidel
const S4 = [388, 448]   // Sentrup-Geist-Berg Fidel
const S5 = [435, 408]   // Geist-Schützenhof auf Mauritz-S-Kante
const S6 = [432, 455]   // Geist-Schützenhof-Berg Fidel
const S7 = [488, 418]   // Mauritz-Schützenhof-Handorf
const S8 = [548, 425]   // Handorf-Schützenhof-Gremmendorf
const S9 = [498, 462]   // Schützenhof-Berg Fidel-Gremmendorf-Angelmodde
const S10 = [348, 535]  // Mecklenbeck-Berg Fidel-Hiltrup
const S11 = [445, 545]  // Berg Fidel-Angelmodde-Hiltrup
const S12 = [542, 535]  // Gremmendorf-Angelmodde-Wolbeck
const S13 = [538, 625]  // Wolbeck-Angelmodde-Hiltrup
const S14 = [295, 538]  // Mecklenbeck-Albachten-Amelsbüren
const S15 = [362, 618]  // Mecklenbeck-Hiltrup-Amelsbüren
const S16 = [228, 475]  // Mecklenbeck-Roxel-Gievenbeck
const S17 = [178, 545]  // Roxel-Albachten-Mecklenbeck
const S18 = [215, 632]  // Albachten-Amelsbüren

// ═══════════════════════════════════════════
// ALLE 26 STADTTEILE
// ═══════════════════════════════════════════

const INTERACTIVE_IDS = new Set([
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
  'nienberge', 'kinderhaus', 'coerde', 'handorf',
  'gremmendorf', 'wolbeck', 'angelmodde', 'hiltrup', 'amelsbueren', 'roxel',
  'sprakel', 'gelmer', 'haeger', 'geist', 'schuetzenhof', 'berg-fidel', 'mecklenbeck', 'albachten',
])

const ALL_DISTRICTS = [
  // ── ZENTRUM ──
  { id: 'pluggendorf',  pts: [C1, C2, CX, C8] },
  { id: 'hafen-zentrum', pts: [C2, C3, C4, CX] },
  { id: 'altstadt-dom',  pts: [CX, C4, C5, C6] },
  { id: 'kreuzviertel',  pts: [C8, CX, C6, SG, C7] },

  // ── INNERER RING ──
  { id: 'aaseestadt', pts: [AA1, C1, C8, C7, AA3, AA2] },
  { id: 'sentrup',    pts: [AA3, C7, SG, S3, [308,438], S2, [268,398]] },
  { id: 'mauritz',    pts: [C3, K3, K4, [555,322], [555,388], S7, S5, C5, C4] },
  { id: 'gievenbeck', pts: [K1, K2, AA1, AA2, AA3, [268,398], S2, S16, [188,388], [175,348], [168,298], [172,248]] },

  // ── GRAUE VIERTEL (füllen Lücken) ──
  { id: 'geist',        pts: [SG, C6, C5, S5, S6, S4, S3] },
  { id: 'schuetzenhof', pts: [S5, S7, S8, S9, S6] },
  { id: 'berg-fidel',   pts: [S3, S4, S6, S9, S11, S10] },
  { id: 'mecklenbeck',  pts: [S16, S2, [308,438], S3, S10, S15, S14, S17] },
  { id: 'haeger',       pts: [B.a1, B.a2, B.a3, B.a4, B.a5, N3, N2, N1] },
  { id: 'sprakel',      pts: [N3, B.a5, B.b1, B.b2, B.b3, N4] },
  { id: 'gelmer',       pts: [N4, B.b3, B.c1, B.c2, B.c3, N5] },
  { id: 'albachten',    pts: [S17, S14, S18, B.i1, B.i2, B.i3, B.i4, B.i5, [112,542]] },

  // ── ÄUSSERER RING ──
  { id: 'nienberge',  pts: [N1, N2, K1, [172,248], [172,218], B.k3, B.k2, B.k4] },

  { id: 'kinderhaus', pts: [N2, N3, N4, K3, C3, C2, C1, AA1, K2, K1] },

  { id: 'coerde', pts: [N4, N5, K4, K3] },

  { id: 'handorf', pts: [N5, B.c3, B.d1, B.d2, B.d3, B.d4, B.d5, B.d6, B.d7, B.d8, B.e1, S8, S7, [555,388], [555,322], K4] },

  { id: 'gremmendorf', pts: [S8, B.e1, B.e2, B.e3, S12, S9] },

  { id: 'wolbeck', pts: [S12, B.e3, B.f1, B.f2, B.f3, B.g1, S13] },

  { id: 'angelmodde', pts: [S9, S12, S13, S11] },

  { id: 'hiltrup', pts: [S10, S11, S13, B.g1, B.g2, B.g3, B.g4, B.h1, S15] },

  { id: 'amelsbueren', pts: [S15, B.h1, B.h2, B.h3, B.h4, B.i1, S18, S14] },

  { id: 'roxel', pts: [B.k3, [172,218], [172,248], [168,298], [175,348], [188,388], S16, S17, [112,542], B.j1, B.j2, B.j3, B.j4, B.j5, B.k1] },
]

// Pfade generieren
const PATHS = ALL_DISTRICTS.map(d => ({
  id: d.id,
  path: pts2path(d.pts),
  interactive: INTERACTIVE_IDS.has(d.id),
}))

// Stadtgrenze = äußere Kante aller Rand-Viertel
const BOUNDARY_PTS = [
  B.a1, B.a2, B.a3, B.a4, B.a5, B.b1, B.b2, B.b3,
  B.c1, B.c2, B.c3, B.d1, B.d2, B.d3, B.d4, B.d5, B.d6, B.d7, B.d8,
  B.e1, B.e2, B.e3, B.f1, B.f2, B.f3, B.g1, B.g2, B.g3, B.g4,
  B.h1, B.h2, B.h3, B.h4, B.i1, B.i2, B.i3, B.i4, B.i5,
  B.j1, B.j2, B.j3, B.j4, B.j5, B.k1, B.k2, B.k3, B.k4,
]
const CITY_BOUNDARY = pts2path(BOUNDARY_PTS)

const DARK_DISTRICTS = new Set([
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'sentrup', 'mauritz', 'geist', 'schuetzenhof',
])

// Labels für interaktive Viertel
const INTERACTIVE_LABELS = [
  { id: 'pluggendorf',   x: 350, y: 298, lines: ['Pluggen-', 'dorf'],   size: 8 },
  { id: 'hafen-zentrum',  x: 405, y: 296, lines: ['Hafen'],             size: 8 },
  { id: 'altstadt-dom',   x: 402, y: 355, lines: ['Altstadt'],          size: 9 },
  { id: 'kreuzviertel',   x: 345, y: 352, lines: ['Kreuz-', 'viertel'],size: 7 },
  { id: 'aaseestadt',     x: 232, y: 295, lines: ['Aaseestadt'],        size: 9, leader: [292, 322] },
  { id: 'sentrup',        x: 312, y: 412, lines: ['Sentrup'],           size: 10 },
  { id: 'mauritz',        x: 498, y: 328, lines: ['Mauritz'],           size: 11 },
  { id: 'gievenbeck',     x: 222, y: 328, lines: ['Gieven-', 'beck'],  size: 10 },
  { id: 'nienberge',      x: 165, y: 198, lines: ['Nienberge'],        size: 11 },
  { id: 'kinderhaus',     x: 370, y: 185, lines: ['Kinderhaus'],        size: 10 },
  { id: 'coerde',         x: 498, y: 172, lines: ['Coerde'],            size: 10 },
  { id: 'handorf',        x: 658, y: 278, lines: ['Handorf'],           size: 14 },
  { id: 'gremmendorf',    x: 595, y: 488, lines: ['Gremmen-', 'dorf'], size: 10 },
  { id: 'wolbeck',        x: 600, y: 608, lines: ['Wolbeck'],           size: 11 },
  { id: 'angelmodde',     x: 505, y: 568, lines: ['Angel-', 'modde'],  size: 8 },
  { id: 'hiltrup',        x: 462, y: 668, lines: ['Hiltrup'],           size: 13 },
  { id: 'amelsbueren',    x: 332, y: 688, lines: ['Amels-', 'büren'],  size: 10 },
  { id: 'roxel',          x: 118, y: 418, lines: ['Roxel'],             size: 11 },
  // Ehemals graue Viertel (jetzt interaktiv)
  { id: 'haeger',         x: 198, y: 88,  lines: ['Häger'],             size: 10 },
  { id: 'sprakel',        x: 382, y: 68,  lines: ['Sprakel'],           size: 10 },
  { id: 'gelmer',         x: 528, y: 78,  lines: ['Gelmer'],            size: 10 },
  { id: 'geist',          x: 392, y: 422, lines: ['Geist'],             size: 9 },
  { id: 'schuetzenhof',   x: 492, y: 438, lines: ['Schützen-', 'hof'], size: 8 },
  { id: 'berg-fidel',     x: 415, y: 498, lines: ['Berg', 'Fidel'],    size: 8 },
  { id: 'mecklenbeck',    x: 282, y: 498, lines: ['Mecklen-', 'beck'], size: 9 },
  { id: 'albachten',      x: 185, y: 608, lines: ['Albachten'],         size: 10 },
]

/** Einzelner klickbarer Bezirk-Pfad. React.memo verhindert Re-Renders bei Hover anderer Viertel. */
const DistrictPath = memo(function DistrictPath({
  id, d, fill, label, isSelected, isHovered, isDimmed, loaded, staggerDelay,
  onClick, onMouseEnter, onMouseLeave,
}) {
  return (
    <path
      id={id}
      role="listitem"
      tabIndex={0}
      aria-label={`Stadtteil ${label}`}
      d={d}
      fill={fill}
      stroke="#D1CDC9"
      strokeWidth="1.5"
      strokeLinejoin="round"
      style={{
        cursor: 'pointer',
        outline: 'none',
        opacity: loaded ? (isDimmed ? 0.6 : (isHovered ? 0.85 : 1)) : 0,
        transition: loaded
          ? 'opacity 150ms ease, filter 150ms ease'
          : `opacity 400ms ease ${staggerDelay}ms`,
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

// Stagger: Zentrum zuerst, dann Ring für Ring
const STAGGER_ORDER = [
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
  'geist', 'schuetzenhof',
  'kinderhaus', 'coerde', 'nienberge',
  'berg-fidel', 'mecklenbeck',
  'handorf', 'gremmendorf', 'angelmodde', 'wolbeck',
  'hiltrup', 'amelsbueren', 'roxel',
  'haeger', 'sprakel', 'gelmer', 'albachten',
]

export function MuensterSVG({
  selectedId = null,
  hoveredId = null,
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
      const el = svgRef.current.querySelector(`#${CSS.escape(id)}`)
      if (el) onDistrictRect(el.getBoundingClientRect())
    }
  }, [onDistrictHover, onDistrictRect])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 780"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
      role="img"
      aria-label="Stadtteil-Karte Münster mit Immobilienpreisen"
    >
      {/* SCHICHT 1: Stadtgrenze als Hintergrund-Fang */}
      <path d={CITY_BOUNDARY} fill="#E8E4E0" stroke="#B8B4B0" strokeWidth="2" strokeLinejoin="round" />

      {/* SCHICHT 2: Alle 26 interaktive Viertel */}
      <g className="interactive-districts" role="list">
        {PATHS.map(({ id, path: d }) => (
          <DistrictPath
            key={id}
            id={id}
            d={d}
            fill={getDistrictColor(id)}
            label={districts.districts.find(dd => dd.id === id)?.name || id}
            isSelected={selectedId === id}
            isHovered={hoveredId === id}
            isDimmed={!!(selectedId && selectedId !== id)}
            loaded={loaded}
            staggerDelay={STAGGER_ORDER.indexOf(id) * 30}
            onClick={onDistrictClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onDistrictLeave}
          />
        ))}
      </g>

      {/* SCHICHT 3: Führungslinien */}
      <g style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
        {INTERACTIVE_LABELS.filter(l => l.leader).map(({ id, x, y, leader }) => (
          <line key={`l-${id}`} x1={x + 38} y1={y} x2={leader[0]} y2={leader[1]} stroke="#999" strokeWidth="1" />
        ))}
      </g>

      {/* SCHICHT 4: Labels */}
      <g fontFamily="'DM Sans', system-ui, sans-serif" style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
        {INTERACTIVE_LABELS.map(({ id, x, y, lines, size }) => (
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

export { PATHS as DISTRICT_PATHS, INTERACTIVE_LABELS as DISTRICT_LABELS, CITY_BOUNDARY, getDistrictColor }
