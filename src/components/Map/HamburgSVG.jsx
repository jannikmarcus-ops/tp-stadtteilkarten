import { useState, useEffect, useCallback, useRef, memo } from 'react'

function getDistrictColor(districtId, data) {
  const { colorScale } = data.meta
  const district = data.districts.find(d => d.id === districtId)
  if (!district) return '#E8E4E0'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#E8E4E0'
}

/*
 * Interaktive Stadtteil-Karte Hamburg.
 * 22 interaktive (farbig) + 24 graue (Hintergrund) + Gewässer.
 * ViewBox 0 0 1000 800 (Hamburg ist breiter als hoch).
 * Nur Nordseite der Elbe. Elbe als natürlicher Südrand.
 */

function pts2path(points) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'
}

// ═══════════════════════════════════════════
// STADTGRENZE (clockwise von NW)
// ═══════════════════════════════════════════
const BOUNDARY_PTS = [
  [55,85], [92,40], [175,28], [275,20], [350,16], [440,12], [530,8],
  [610,6], [700,6], [800,8], [855,14], [908,38], [950,76],
  [972,138], [980,218], [978,308], [970,388], [955,443],
  [912,476], [858,503], [798,530], [748,556], [708,586],
  [668,620], [618,648], [558,666], [498,676], [438,680],
  [378,676], [318,668], [258,658], [198,650], [138,648], [88,656],
  [48,640], [32,588], [28,518], [30,442], [35,362], [42,280], [50,200], [52,140],
]
const CITY_BOUNDARY = pts2path(BOUNDARY_PTS)

// ═══════════════════════════════════════════
// GEWÄSSER
// ═══════════════════════════════════════════
const AUSSEN_ALSTER = pts2path([
  [462,275], [470,260], [482,252], [498,252], [510,260], [518,275],
  [522,295], [522,320], [518,345], [510,358], [498,365], [482,365],
  [470,358], [462,345], [458,320], [458,295],
])

const BINNEN_ALSTER = pts2path([
  [474,398], [484,392], [496,392], [506,398],
  [508,408], [502,416], [490,420], [478,416], [470,408],
])

// Elbe: Breites blaues Band unterhalb der Stadtgrenze
const ELBE_PATH = 'M0,500 L1000,500 L1000,800 L0,800 Z'

// ═══════════════════════════════════════════
// ALLE 46 STADTTEILE
// ═══════════════════════════════════════════

const INTERACTIVE_IDS = new Set([
  'harvestehude', 'uhlenhorst', 'hoheluft-ost', 'eppendorf', 'winterhude',
  'rotherbaum', 'ottensen', 'othmarschen', 'hoheluft-west', 'blankenese',
  'st-georg', 'eimsbuettel', 'sternschanze', 'barmbek-sued', 'lokstedt',
  'bahrenfeld', 'barmbek-nord', 'eilbek', 'stellingen', 'wandsbek',
  'bramfeld', 'rahlstedt',
])

const ALL_DISTRICTS = [
  // ── GRAU: NORDWEST ──
  { id: 'schnelsen',      pts: [[55,85], [92,40], [175,28], [175,165], [52,165], [52,140]] },
  { id: 'niendorf',       pts: [[175,28], [275,20], [350,16], [350,165], [175,165]] },
  { id: 'lurup',          pts: [[52,165], [195,165], [195,420], [35,420], [35,362], [42,280], [50,200]] },
  { id: 'osdorf',         pts: [[35,420], [195,420], [195,505], [110,505], [30,505], [30,442]] },

  // ── GRAU: NORD ──
  { id: 'gross-borstel',  pts: [[350,16], [440,12], [440,100], [440,165], [350,165]] },
  { id: 'ohlsdorf',       pts: [[440,12], [530,8], [575,8], [575,100], [520,100], [440,100]] },
  { id: 'alsterdorf',     pts: [[440,100], [520,100], [520,165], [440,165]] },

  // ── GRAU: NORDOST ──
  { id: 'wellingbuettel', pts: [[575,8], [700,6], [700,55], [660,55], [660,100], [575,100]] },
  { id: 'poppenbuettel',  pts: [[700,6], [855,14], [855,55], [700,55]] },
  { id: 'sasel',          pts: [[700,55], [855,55], [810,100], [660,100], [660,55]] },
  { id: 'steilshoop',     pts: [[660,100], [720,100], [720,248], [660,248]] },
  { id: 'farmsen-berne',  pts: [[810,55], [855,55], [855,14], [908,38], [950,76], [960,145], [810,145]] },

  // ── GRAU: ELBVORORTE ──
  { id: 'nienstedten',    pts: [[140,505], [195,505], [195,640], [140,640]] },
  { id: 'blankenese',     pts: [[30,505], [140,505], [140,640], [88,656], [48,640], [32,588], [28,518]] },

  // ── GRAU: MITTE-SÜD ──
  { id: 'altona-nord',    pts: [[295,395], [375,395], [375,455], [295,455]] },
  { id: 'altona-altstadt', pts: [[295,455], [375,455], [375,640], [295,640]] },
  { id: 'st-pauli',       pts: [[375,455], [415,455], [415,640], [375,640]] },
  { id: 'neustadt',       pts: [[415,455], [520,455], [520,640], [415,640]] },
  { id: 'hafencity',      pts: [[520,455], [560,455], [560,640], [520,640]] },

  // ── GRAU: OST-SÜD ──
  { id: 'hamm',           pts: [[560,455], [650,455], [650,640], [560,640]] },
  { id: 'horn',           pts: [[650,455], [720,455], [720,640], [650,640]] },
  { id: 'dulsberg',       pts: [[650,248], [680,248], [680,340], [650,340]] },
  { id: 'marienthal',     pts: [[650,395], [720,395], [720,455], [650,455]] },
  { id: 'tonndorf',       pts: [[720,248], [810,248], [810,395], [720,395]] },
  { id: 'jenfeld',        pts: [[720,395], [810,395], [810,530], [720,530]] },

  // ── INTERAKTIV: NORDWEST ──
  { id: 'stellingen',     pts: [[195,165], [295,165], [295,310], [195,310]] },
  { id: 'lokstedt',       pts: [[295,165], [440,165], [430,248], [295,248]] },

  // ── INTERAKTIV: ZENTRUM ──
  { id: 'eimsbuettel',    pts: [[295,248], [375,248], [375,395], [295,395]] },
  { id: 'hoheluft-west',  pts: [[375,248], [430,248], [430,310], [375,310]] },
  { id: 'hoheluft-ost',   pts: [[430,248], [462,248], [462,310], [430,310]] },
  { id: 'eppendorf',      pts: [[440,165], [520,165], [520,248], [430,248]] },
  { id: 'winterhude',     pts: [[520,100], [575,100], [575,310], [520,310]] },
  { id: 'harvestehude',   pts: [[375,310], [520,310], [520,395], [375,395]] },
  { id: 'sternschanze',   pts: [[375,395], [415,395], [415,455], [375,455]] },
  { id: 'rotherbaum',     pts: [[415,395], [462,395], [462,455], [415,455]] },

  // ── INTERAKTIV: ALSTER-OST ──
  { id: 'uhlenhorst',     pts: [[520,310], [575,310], [575,395], [520,395]] },
  { id: 'st-georg',       pts: [[520,395], [575,395], [575,455], [520,455]] },

  // ── INTERAKTIV: BARMBEK / EILBEK ──
  { id: 'barmbek-nord',   pts: [[575,100], [660,100], [660,248], [575,248]] },
  { id: 'barmbek-sued',   pts: [[575,248], [650,248], [650,340], [575,340]] },
  { id: 'eilbek',         pts: [[575,340], [650,340], [650,455], [575,455]] },

  // ── INTERAKTIV: WANDSBEK ──
  { id: 'wandsbek',       pts: [[680,248], [720,248], [720,395], [650,395], [650,340], [680,340]] },

  // ── INTERAKTIV: ALTONA-WEST ──
  { id: 'bahrenfeld',     pts: [[195,310], [295,310], [295,455], [195,455]] },
  { id: 'othmarschen',    pts: [[195,455], [240,455], [240,640], [195,640]] },
  { id: 'ottensen',       pts: [[240,455], [295,455], [295,640], [240,640]] },

  // ── INTERAKTIV: NORDOST ──
  { id: 'bramfeld',       pts: [[720,100], [810,100], [810,248], [720,248]] },
  { id: 'rahlstedt',      pts: [[810,145], [960,145], [972,138], [980,218], [978,308], [970,388], [955,443], [810,443]] },
]

// Pfade generieren
const PATHS = ALL_DISTRICTS.map(d => ({
  id: d.id,
  path: pts2path(d.pts),
  interactive: INTERACTIVE_IDS.has(d.id),
}))

// ═══════════════════════════════════════════
// LABELS
// ═══════════════════════════════════════════

const DARK_DISTRICTS = new Set([
  'harvestehude', 'uhlenhorst', 'hoheluft-ost', 'eppendorf', 'winterhude',
  'rotherbaum', 'ottensen', 'othmarschen', 'hoheluft-west', 'blankenese',
  'st-georg', 'eimsbuettel', 'sternschanze',
  'barmbek-sued', 'lokstedt', 'bahrenfeld', 'barmbek-nord', 'eilbek',
  'stellingen', 'wandsbek',
])

const LABELS = [
  // Interaktive Stadtteile
  { id: 'stellingen',    x: 245, y: 235, lines: ['Stellingen'],        size: 10 },
  { id: 'lokstedt',      x: 368, y: 210, lines: ['Lokstedt'],          size: 10 },
  { id: 'eimsbuettel',   x: 335, y: 318, lines: ['Eims-', 'büttel'],  size: 9 },
  { id: 'hoheluft-west', x: 403, y: 274, lines: ['Hohe-', 'luft-W'],  size: 6 },
  { id: 'hoheluft-ost',  x: 446, y: 282, lines: ['HO'],               size: 7 },
  { id: 'eppendorf',     x: 478, y: 210, lines: ['Eppendorf'],         size: 9 },
  { id: 'winterhude',    x: 548, y: 195, lines: ['Winter-', 'hude'],   size: 10 },
  { id: 'harvestehude',  x: 410, y: 348, lines: ['Harves-', 'tehude'], size: 8 },
  { id: 'uhlenhorst',    x: 548, y: 348, lines: ['Uhlen-', 'horst'],   size: 8 },
  { id: 'barmbek-nord',  x: 618, y: 168, lines: ['Barmbek-', 'Nord'],  size: 9 },
  { id: 'barmbek-sued',  x: 613, y: 290, lines: ['Barmbek-', 'Süd'],   size: 8 },
  { id: 'eilbek',        x: 613, y: 395, lines: ['Eilbek'],            size: 9 },
  { id: 'st-georg',      x: 548, y: 428, lines: ['St. Georg'],         size: 8 },
  { id: 'wandsbek',      x: 692, y: 320, lines: ['Wands-', 'bek'],     size: 8 },
  { id: 'bahrenfeld',    x: 245, y: 382, lines: ['Bahrenfeld'],        size: 10 },
  { id: 'ottensen',      x: 268, y: 545, lines: ['Ottensen'],          size: 9 },
  { id: 'othmarschen',   x: 218, y: 545, lines: ['Oth-', 'marschen'], size: 7 },
  { id: 'blankenese',    x: 85, y: 568, lines: ['Blanke-', 'nese'],    size: 9 },
  { id: 'sternschanze',  x: 395, y: 420, lines: ['Stern-', 'schanze'], size: 6 },
  { id: 'rotherbaum',    x: 439, y: 420, lines: ['Rother-', 'baum'],   size: 6 },
  { id: 'bramfeld',      x: 765, y: 178, lines: ['Bramfeld'],          size: 10 },
  { id: 'rahlstedt',     x: 895, y: 298, lines: ['Rahlstedt'],         size: 12 },
]

// Stagger: Zentrum zuerst, dann Ring für Ring
const STAGGER_ORDER = [
  'harvestehude', 'uhlenhorst', 'rotherbaum', 'sternschanze',
  'hoheluft-west', 'hoheluft-ost', 'eimsbuettel', 'eppendorf',
  'winterhude', 'st-georg',
  'barmbek-sued', 'barmbek-nord', 'eilbek', 'lokstedt',
  'stellingen', 'bahrenfeld', 'ottensen', 'othmarschen',
  'wandsbek', 'bramfeld', 'blankenese', 'rahlstedt',
]

// ═══════════════════════════════════════════
// KOMPONENTEN
// ═══════════════════════════════════════════

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

export function HamburgSVG({
  data,
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
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
      role="img"
      aria-label="Stadtteil-Karte Hamburg mit Immobilienpreisen"
    >
      {/* SCHICHT 0: Elbe (blaues Band, unterste Schicht) */}
      <path d={ELBE_PATH} fill="#B8D4E3" style={{ pointerEvents: 'none' }} />

      {/* SCHICHT 1: Stadtgrenze / Hintergrund (verdeckt Elbe innerhalb der Stadt) */}
      <path d={CITY_BOUNDARY} fill="#E8E4E0" stroke="#B8B4B0" strokeWidth="2" strokeLinejoin="round" />

      {/* SCHICHT 2: Graue Hintergrund-Stadtteile (nicht interaktiv) */}
      <g className="background-districts" style={{ pointerEvents: 'none' }}>
        {PATHS.filter(p => !p.interactive).map(({ id, path: d }) => (
          <path
            key={id}
            d={d}
            fill="#E8E4E0"
            stroke="#D1CDC9"
            strokeWidth="1"
            strokeLinejoin="round"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 400ms ease 200ms',
            }}
          />
        ))}
      </g>

      {/* SCHICHT 3: Interaktive Stadtteile (farbig) */}
      <g className="interactive-districts" role="list">
        {PATHS.filter(p => p.interactive).map(({ id, path: d }) => (
          <DistrictPath
            key={id}
            id={id}
            d={d}
            fill={getDistrictColor(id, data)}
            label={data.districts.find(dd => dd.id === id)?.name || id}
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

      {/* SCHICHT 4: Alster-Gewässer (ÜBER den Stadtteilen, blockt Klicks im Wasser) */}
      <g className="water-bodies" style={{ pointerEvents: 'all' }}>
        <path d={AUSSEN_ALSTER} fill="#B8D4E3" stroke="#9BC4D8" strokeWidth="1" />
        <path d={BINNEN_ALSTER} fill="#B8D4E3" stroke="#9BC4D8" strokeWidth="1" />
      </g>

      {/* SCHICHT 5: Labels */}
      <g
        fontFamily="'DM Sans', system-ui, sans-serif"
        style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}
      >
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
