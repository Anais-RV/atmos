import { useState } from 'react'
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  AlertCircle,
  Loader
} from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import CitySelector from './CitySelector'
import '../styles/weather.css'

/**
 * Mapeo de condiciones climáticas a iconos
 * Esta función interpreta los datos disponibles y selecciona el icono apropiado
 */
function getWeatherIcon(condition, temperature) {
  const lowerCondition = condition?.toLowerCase() || ''
  
  // Mapeo básico de condiciones
  if (lowerCondition.includes('rain') || lowerCondition.includes('lluvia')) {
    return <CloudRain className="weather-icon weather-icon-rain" />
  }
  if (lowerCondition.includes('snow') || lowerCondition.includes('nieve')) {
    return <CloudSnow className="weather-icon weather-icon-snow" />
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('nube')) {
    return <Cloud className="weather-icon weather-icon-cloud" />
  }
  if (lowerCondition.includes('sun') || lowerCondition.includes('sol') || lowerCondition.includes('clear')) {
    return <Sun className="weather-icon weather-icon-sun" />
  }
  
  // Fallback: inferir del rango de temperatura
  if (temperature > 25) {
    return <Sun className="weather-icon weather-icon-sun" />
  }
  if (temperature < 0) {
    return <CloudSnow className="weather-icon weather-icon-snow" />
  }
  
  return <Cloud className="weather-icon weather-icon-cloud" />
}

/**
 * Calcula la sensación térmica basada en temperatura, viento y humedad
 * Usando una fórmula simplificada de wind chill / heat index
 */
function calculateFeelsLike(temp, windSpeed = 0, humidity = 50) {
  // Si no tenemos viento, usamos una aproximación simple basada en humedad
  if (windSpeed === 0) {
    const humidityEffect = (humidity - 50) * 0.1
    return Math.round((temp + humidityEffect) * 10) / 10
  }
  
  // Wind chill para temperaturas bajas (< 10°C)
  if (temp < 10) {
    const windChill = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16)
    return Math.round(windChill * 10) / 10
  }
  
  // Heat index para temperaturas altas (> 26°C)
  if (temp > 26) {
    const heatIndex = -42.379 + 2.04901523 * temp + 10.14333127 * humidity - 0.22475541 * temp * humidity
    return Math.round(heatIndex * 10) / 10
  }
  
  return temp
}

function WeatherInfo() {
  const [cityName, setCityName] = useState('')
  const [temperature, setTemperature] = useState(null)
  const [feelsLike, setFeelsLike] = useState(null)
  const [condition, setCondition] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCelsius, setIsCelsius] = useState(true)

  /**
   * Obtiene los datos del clima actual de la API
   */
  const fetchWeatherData = async (id) => {
    if (!id) {
      setError('Por favor selecciona una ciudad')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient(`/api/weather/current/?city_id=${id}`)
      
      setCityName(response.city_name)
      setTemperature(response.temperature)
      setCondition(response.condition || 'Parcialmente nublado')
      
      // Calcular sensación térmica
      const feelsLikeTemp = calculateFeelsLike(
        response.temperature,
        0,
        50
      )
      setFeelsLike(feelsLikeTemp)
    } catch (err) {
      setError(`Error al obtener datos: ${err.message}`)
      console.error('Weather API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Convierte temperatura entre Celsius y Fahrenheit
   */
  const convertTemperature = (celsius) => {
    if (celsius === null) return null
    return isCelsius ? celsius : Math.round((celsius * 9/5 + 32) * 10) / 10
  }

  const displayTemp = convertTemperature(temperature)
  const displayFeelsLike = convertTemperature(feelsLike)
  const tempUnit = isCelsius ? '°C' : '°F'

  return (
    <div className="weather-info-container">
      {/* Selector de ciudad */}
      <div className="weather-header">
        <h2 className="weather-title">Buscar Ciudades</h2>
        <CitySelector onCitySelect={fetchWeatherData} />
      </div>

      {/* Estado de carga o error */}
      {loading && (
        <div className="weather-loading">
          <Loader className="spinner" />
          <p>Cargando datos del clima...</p>
        </div>
      )}

      {error && (
        <div className="weather-error">
          <AlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      {/* Información del clima */}
      {!loading && temperature !== null && (
        <div className="weather-display">
          {/* Encabezado con nombre de ciudad */}
          <div className="weather-city-header">
            <h3 className="weather-city-name">{cityName}</h3>
            <button 
              className="temp-toggle"
              onClick={() => setIsCelsius(!isCelsius)}
              title="Cambiar entre Celsius y Fahrenheit"
            >
              {isCelsius ? '°C / °F' : '°F / °C'}
            </button>
          </div>

          {/* Icono y temperatura principal */}
          <div className="weather-main">
            <div className="weather-icon-wrapper">
              {getWeatherIcon(condition, temperature)}
            </div>
            <div className="temperature-display">
              <div className="current-temperature">
                <span className="temp-value">{displayTemp}</span>
                <span className="temp-unit">{tempUnit}</span>
              </div>
              <div className="condition-text">{condition}</div>
            </div>
          </div>

          {/* Sensación térmica */}
          <div className="feels-like-section">
            <p className="feels-like-label">Sensación térmica</p>
            <p className="feels-like-value">
              <span>{displayFeelsLike}</span>
              <span className="feels-like-unit">{tempUnit}</span>
            </p>
          </div>
        </div>
      )}

      {/* Placeholder inicial */}
      {!loading && temperature === null && !error && (
        <div className="weather-placeholder">
          <Cloud className="placeholder-icon" size={40} />
          <p className="placeholder-text">Selecciona una ciudad para ver el clima actual</p>
        </div>
      )}
    </div>
  )
}

export default WeatherInfo
