import { useState, useRef, useCallback, useEffect } from 'react'
import { useDistrict } from './hooks/useDistrict'
import { useMediaQuery } from './hooks/useMediaQuery'
import { MuensterSVG } from './components/Map/MuensterSVG'
import { MapTooltip } from './components/Map/MapTooltip'
import { DetailPanel } from './components/Map/DetailPanel'
import { MapLegend } from './components/Map/MapLegend'
import { ViewToggle } from './components/Mobile/ViewToggle'
import { CardView } from './components/Mobile/CardView'
import { Footer } from './components/shared/Footer'
import districts from './data/districts.json'

function App() {
  const { selectedId, hoveredId, select, clearSelection, setHoveredId } = useDistrict()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isWide = useMediaQuery('(min-width: 1024px)')

  const [mobileView, setMobileView] = useState('liste')
  const containerRef = useRef(null)
  const rootRef = useRef(null)
  const [anchorRect, setAnchorRect] = useState(null)

  // Escape schließt Panel
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') clearSelection() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [clearSelection])

  // postMessage für Iframe-Höhenanpassung (ResizeObserver)
  useEffect(() => {
    if (!rootRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        window.parent?.postMessage(
          { type: 'resize', height: entry.contentRect.height },
          '*'
        )
      }
    })
    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  const hoveredDistrict = hoveredId
    ? districts.districts.find(d => d.id === hoveredId)
    : null

  const selectedDistrict = selectedId
    ? districts.districts.find(d => d.id === selectedId)
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
      <div ref={rootRef} className="min-h-svh bg-background text-text font-sans">
        <header className="px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-primary">
            Immobilienpreise {districts.meta.cityLabel}
          </h1>
          <p className="text-sm mt-1 text-text/75">
            Datenstand: {districts.meta.quarter}
          </p>
        </header>

        <main className="px-4 pb-6">
          <div className={`max-w-5xl mx-auto ${isWide && selectedDistrict ? 'flex gap-6 items-start' : ''}`}>
            <div
              ref={containerRef}
              className={`relative ${isWide && selectedDistrict ? 'flex-1' : 'max-w-2xl mx-auto'}`}
            >
              <MuensterSVG
                selectedId={selectedId}
                hoveredId={hoveredId}
                onDistrictClick={select}
                onDistrictHover={setHoveredId}
                onDistrictLeave={handleLeave}
                onDistrictRect={handleDistrictRect}
              />

              {hoveredDistrict && !selectedId && (
                <MapTooltip
                  district={hoveredDistrict}
                  anchorRect={anchorRect}
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

          <MapLegend />
        </main>

        {!isWide && selectedDistrict && (
          <DetailPanel district={selectedDistrict} onClose={clearSelection} />
        )}

        <Footer />
      </div>
    )
  }

  // ─── MOBILE (< 768px) ───
  return (
    <div ref={rootRef} className="min-h-svh bg-background text-text font-sans">
      <header className="px-4 pt-4 pb-2 text-center">
        <h1 className="text-xl font-bold text-primary">
          Immobilienpreise {districts.meta.cityLabel}
        </h1>
        <p className="text-xs mt-0.5 text-text/75">
          Datenstand: {districts.meta.quarter}
        </p>
      </header>

      <div className="px-4">
        <ViewToggle view={mobileView} onChange={setMobileView} />
      </div>

      <main className="px-4 pb-6">
        {mobileView === 'liste' ? (
          <CardView />
        ) : (
          <div className="relative">
            <MuensterSVG
              selectedId={selectedId}
              hoveredId={null}
              onDistrictClick={select}
              onDistrictHover={() => {}}
              onDistrictLeave={() => {}}
            />

            {selectedDistrict && (
              <DetailPanel district={selectedDistrict} onClose={clearSelection} />
            )}
          </div>
        )}

        {mobileView === 'liste' && <MapLegend />}
      </main>

      <Footer />
    </div>
  )
}

export default App
