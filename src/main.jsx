import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import './index.css'
import { CityPage } from './CityPage.jsx'
import { MuensterSVG } from './components/Map/MuensterSVG.jsx'
import { HamburgSVG } from './components/Map/HamburgSVG.jsx'
import muensterData from './data/districts.json'
import hamburgData from './data/districts-hamburg.json'

function Home() {
  return (
    <div className="min-h-svh bg-background text-text font-sans flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Immobilienpreise nach Stadtteil
        </h1>
        <p className="text-sm text-text/75 mb-6">
          Interaktive Stadtteil-Karten mit aktuellen Marktdaten von Teigeler & Partner Immobilien.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/hamburg"
            className="px-6 py-3 rounded-lg font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: '#052E26' }}
          >
            Hamburg
          </Link>
          <Link
            to="/muenster"
            className="px-6 py-3 rounded-lg font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: '#052E26' }}
          >
            Münster
          </Link>
        </div>
      </div>
    </div>
  )
}

function MuensterPage() {
  return <CityPage data={muensterData} MapComponent={MuensterSVG} />
}

function HamburgPage() {
  return <CityPage data={hamburgData} MapComponent={HamburgSVG} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/muenster" element={<MuensterPage />} />
        <Route path="/hamburg" element={<HamburgPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
