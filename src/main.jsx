import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

function ComingSoon() {
  return (
    <div className="min-h-svh bg-background text-text font-sans flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Hamburg</h1>
        <p className="text-sm text-text/75">Die Stadtteil-Karte für Hamburg wird gerade erstellt.</p>
        <a
          href="/muenster"
          className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: '#B8860B' }}
        >
          Zur Münster-Karte
        </a>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/muenster" replace />} />
        <Route path="/muenster" element={<App />} />
        <Route path="/hamburg" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/muenster" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
