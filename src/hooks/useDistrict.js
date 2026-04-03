import { useState, useCallback } from 'react'

/**
 * State-Management für ausgewähltes Viertel.
 * Verwaltet Hover- und Auswahl-Zustand.
 */
export function useDistrict() {
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const select = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    selectedId,
    hoveredId,
    select,
    clearSelection,
    setHoveredId,
  }
}
