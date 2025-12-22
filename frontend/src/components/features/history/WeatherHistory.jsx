/**
 * FEATURE: History
 * Componentes incluidos:
 *  - WeatherHistory: componente placeholder para historial meteorológico.
 *
 * Páginas que usan este feature:
 *  - WeatherHistoryPage.jsx (usa WeatherHistory)
 *
 * Estilos:
 *  - history.css (estilos para componente WeatherHistory y layout de historial)
 */

/**
 * Componente: WeatherHistory
 * Propósito: Placeholder para historial meteorológico y gráficas del día anterior.
 * Uso:
 *  - WeatherHistoryPage.jsx (único lugar donde se renderiza)
 * Dependencias:
 *  - history.css (.history-placeholder, .history-placeholder-text)
 */

// frontend/src/components/features/history/WeatherHistory.jsx

import { useEffect, useState } from 'react'

function WeatherHistory() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    let cancelled = false

    async function fetchAlerts() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/alerts/')
        if (!res.ok) {
          // If endpoint missing or not implemented, show friendly message
          throw new Error(`${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        if (!cancelled) setAlerts(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAlerts()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <div className="history-placeholder"><p className="history-placeholder-text">Cargando historial de alertas…</p></div>
  }

  if (error) {
    return (
      <div className="history-placeholder">
        <p className="history-placeholder-text">No se pudo cargar el historial de alertas.</p>
        <p className="history-placeholder-text">{error}. Si deseas, prueba con una API que exponga <code>/api/alerts/</code>.</p>
      </div>
    )
  }

  if (!alerts || alerts.length === 0) {
    return <div className="history-placeholder"><p className="history-placeholder-text">No hay alertas registradas.</p></div>
  }

  return (
    <div className="history-list">
      <ul>
        {alerts.map((a, i) => (
          <li key={a.id || i} className="history-alert-item">
            <strong>{a.title || a.type || 'Alerta'}</strong>
            <div className="history-alert-meta">{a.city_name || a.location || ''} — {a.created_at || a.timestamp || ''}</div>
            {a.message && <div className="history-alert-message">{a.message}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WeatherHistory;
