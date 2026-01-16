/** SunriseSunset.jsx para calculo de amaneracer y atardecer */

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Sun, AlertCircle, Loader } from 'lucide-react'
import './SunriseSunset.css'

function SunriseSunset({ city }) {
  const [sunTimes, setSunTimes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!city || !city.id) {
      setSunTimes(null)
      setError(null)
      return
    }

    const fetchSunTimes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:8000/api/weather/sunrise-sunset/?city_id=${city.id}`)
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }
        
        const data = await response.json()

        if (data && data.sunrise_formatted && data.sunset_formatted) {
          setSunTimes({
            sunrise: data.sunrise_formatted,
            sunset: data.sunset_formatted,
            daylight_duration: data.daylight_duration_formatted || null
          })
        } else {
          setError('No hay datos de amanecer/atardecer disponibles')
        }
      } catch (err) {
        console.error('Error fetching sun times:', err)
        setError('Error al obtener datos de amanecer/atardecer')
      } finally {
        setLoading(false)
      }
    }

    fetchSunTimes()
  }, [city])

  const formatTime = (timeString) => {
    if (!timeString) return '--:--'
    // Ya viene formateado desde el backend
    return timeString
  }

  const formatDuration = (durationString) => {
    if (!durationString) return '--:--'
    // Ya viene formateado desde el backend
    return durationString
  }

  return (
    <div className="sunrise-sunset-container">
      <h2 className="sunrise-sunset-title">Amanecer y Atardecer</h2>

      {loading && (
        <div className="sunrise-sunset-loading">
          <Loader className="spinner" />
          <p>Se está cargando los datos. Por favor, espere.</p>
        </div>
      )}

      {error && (
        <div className="sunrise-sunset-error">
          <AlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      {sunTimes && !loading && (
        <div className="sunrise-sunset-grid">

          {/* Amanecer */}

          <div className="sun-time-card sunrise-card">
            <div className="sun-time-header">
              <Sun className="sun-icon sunrise-icon" />
              <h3>Amanecer</h3>
            </div>
            <div className="sun-time-content">
              <span className="sun-time-value">{formatTime(sunTimes.sunrise)}</span>
              <span className="sun-time-label">Hora local</span>
            </div>
          </div>

          {/* Atardecer */}

          <div className="sun-time-card sunset-card">
            <div className="sun-time-header">
              <Sun className="sun-icon sunset-icon" />
              <h3>Atardecer</h3>
            </div>
            <div className="sun-time-content">
              <span className="sun-time-value">{formatTime(sunTimes.sunset)}</span>
              <span className="sun-time-label">Hora local</span>
            </div>
          </div>

          {/* Duración del día */}

          {sunTimes.daylight_duration && (
            <div className="sun-time-card daylight-card">
              <div className="sun-time-header">
                <Sun className="sun-icon daylight-icon" />
                <h3>Duración del día</h3>
              </div>
              <div className="sun-time-content">
                <span className="sun-time-value">{formatDuration(sunTimes.daylight_duration)}</span>
                <span className="sun-time-label">Horas totales de luz</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !sunTimes && city && (
        <div className="sunrise-sunset-empty">
          <p>Selecciona una ciudad para ver los datos de amanecer, atardecer y horas de luz totales</p>
        </div>
      )}
    </div>
  )
}

SunriseSunset.propTypes = {
  city: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string
  })
}

SunriseSunset.defaultProps = {
  city: null
}

export default SunriseSunset
