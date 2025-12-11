/** SunriseSunset.jsx para calculo de amaneracer y atardecer */

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Sun, AlertCircle, Loader } from 'lucide-react'
import { apiClient } from '../../../services/apiClient'
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

        const response = await apiClient.get(`/weather/current/${city.id}/`)

        if (response.data && response.data.sunrise && response.data.sunset) {
          setSunTimes({
            sunrise: response.data.sunrise,
            sunset: response.data.sunset,
            daylight_duration: response.data.daylight_duration || null
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
    try {
      if (timeString.includes(':')) {
        return timeString.substring(0, 5)
      }
      return timeString
    } catch {
      return '--:--'
    }
  }

  const formatDuration = (durationString) => {
    if (!durationString) return '--:--'
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
                <span className="sun-time-label">Horas  totalesde luz</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !sunTimes && city && (
        <div className="sunrise-sunset-empty">
          <p>Selecciona una ciudad para ver los datos de amanecer, atardecer y horasdee luz totales</p>
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
