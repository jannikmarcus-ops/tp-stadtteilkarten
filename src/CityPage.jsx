import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useDistrict } from './hooks/useDistrict'
import { useMediaQuery } from './hooks/useMediaQuery'
import { MapTooltip } from './components/Map/MapTooltip'
import { DetailPanel } from './components/Map/DetailPanel'
import { MapLegend } from './components/Map/MapLegend'
import { PriceTable } from './components/Map/PriceTable'
import { ViewToggle } from './components/Mobile/ViewToggle'
import { CardView } from './components/Mobile/CardView'
import { SearchBar } from './components/shared/SearchBar'
import { Footer } from './components/shared/Footer'

/**
 * Generische Stadt-Seite. Wird für Münster, Hamburg und Kreis Steinfurt
 * mit verschiedenen Daten und SVG-Komponenten verwendet.
 *
 * @param {object} data - Komplettes JSON (meta + districts)
 * @param {React.ComponentType} MapComponent - MuensterSVG, HamburgSVG oder KreisSteinfurtSVG
 */
// eslint-disable-next-line no-unused-vars -- MapComponent wird in JSX verwendet
export function CityPage({ data, MapComponent }) {
  const { selectedId, hoveredId, select, clearSelection, setHoveredId } = useDistrict()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isWide = useMediaQuery('(min-width: 1024px)')

  const [mobileView, setMobileView] = useState('liste')
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)
  const rootRef = useRef(null)
  const [anchorRect, setAnchorRect] = useState(null)

  // Suche: IDs die zum Query passen
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.trim().toLowerCase()
    return new Set(data.districts.filter(d => d.name.toLowerCase().includes(q)).map(d => d.id))
  }, [searchQuery, data.districts])

  // Gefilterte Districts für Mobile Cards und Tabelle
  const filteredDistricts = useMemo(() => {
    if (!searchMatchIds) return data.districts
    return data.districts.filter(d => searchMatchIds.has(d.id))
  }, [searchMatchIds, data.districts])

  // Escape schließt Panel
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') clearSelection() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [clearSelection])

  // postMessage für Iframe-Höhenanpassung (ResizeObserver)
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight
      window.parent?.postMessage({ type: 'resize', height }, '*')
    }

    const observer = new ResizeObserver(sendHeight)
    observer.observe(document.body)

    setTimeout(sendHeight, 100)

    return () => observer.disconnect()
  }, [mobileView])

  const hoveredDistrict = hoveredId
    ? data.districts.find(d => d.id === hoveredId)
    : null

  const selectedDistrict = selectedId
    ? data.districts.find(d => d.id === selectedId)
    : null

  const handleDistrictRect = useCallback((rect) => {
    setAnchorRect(rect)
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredId(null)
    setAnchorRect(null)
  }, [setHoveredId])

  // ─── DESKTOP ───
  if (isDesktop) {
    return (
      <div ref={rootRef} className="bg-background text-text font-sans">
        <header className="px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-primary">
            Immobilienpreise {data.meta.cityLabel}
          </h1>
          <p className="text-sm mt-1 text-text/75">
            Datenstand: {data.meta.quarter}
          </p>
        </header>

        <main className="px-4 pb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className={`max-w-5xl mx-auto ${isWide && selectedDistrict ? 'flex gap-6 items-start' : ''}`}>
            <div
              ref={containerRef}
              className={`relative ${isWide && selectedDistrict ? 'flex-1' : 'max-w-2xl mx-auto'}`}
            >
              <MapComponent
                data={data}
                selectedId={selectedId}
                hoveredId={hoveredId}
                searchDimmedIds={searchMatchIds}
                onDistrictClick={select}
                onDistrictHover={setHoveredId}
                onDistrictLeave={handleLeave}
                onDistrictRect={handleDistrictRect}
              />

              {hoveredDistrict && !selectedId && (
                <MapTooltip
                  district={hoveredDistrict}
                  anchorRect={anchorRect}
                  // eslint-disable-next-line react-hooks/refs -- Ref-Zugriff für Tooltip-Positionierung ist beabsichtigt
                  containerRect={containerRef.current?.getBoundingClientRect()}
                />
              )}
            </div>

            {isWide && selectedDistrict && (
              <div className="w-80 flex-shrink-0">
                <DetailPanel district={selectedDistrict} onClose={clearSelection} />
              </div>
            )}
          </div>

          <MapLegend colorScale={data.meta.colorScale} />
          <PriceTable districts={filteredDistricts} />
        </main>

        {!isWide && selectedDistrict && (
          <DetailPanel district={selectedDistrict} onClose={clearSelection} />
        )}

        <Footer meta={data.meta} />
      </div>
    )
  }

  // ─── MOBILE (< 768px) ───
  return (
    <div ref={rootRef} className="bg-background text-text font-sans">
      <header className="px-4 pt-4 pb-2 text-center">
        <h1 className="text-xl font-bold text-primary">
          Immobilienpreise {data.meta.cityLabel}
        </h1>
        <p className="text-xs mt-0.5 text-text/75">
          Datenstand: {data.meta.quarter}
        </p>
      </header>

      <div className="px-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <ViewToggle view={mobileView} onChange={setMobileView} />
      </div>

      <main className="px-4 pb-6">
        {mobileView === 'liste' ? (
          <CardView districts={filteredDistricts} colorScale={data.meta.colorScale} />
        ) : (
          <div className="relative">
            <MapComponent
              data={data}
              selectedId={selectedId}
              hoveredId={null}
              searchDimmedIds={searchMatchIds}
              onDistrictClick={select}
              onDistrictHover={() => {}}
              onDistrictLeave={() => {}}
            />

            {selectedDistrict && (
              <DetailPanel district={selectedDistrict} onClose={clearSelection} />
            )}
          </div>
        )}

        {mobileView === 'liste' && <MapLegend colorScale={data.meta.colorScale} />}
      </main>

      <Footer meta={data.meta} />
    </div>
  )
}
