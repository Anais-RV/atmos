/**
 * Componente: CitySelector
 * Propósito: Selector desplegable de ciudades con campo de búsqueda y lista filtrable.
 * Uso:
 *  - WeatherInfo.jsx (usado internamente para cambiar de ciudad)
 * Dependencias:
 *  - weather.css (.city-*, .search-icon)
 *  - lucide-react (icono Search)
 */

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import PropTypes from 'prop-types'
import apiClient from '../../../services/apiClient'
import { useLanguage } from '../../../context/useLanguage'
import './weather.css'

function CitySelector({ onCitySelect }) {
  const { t } = useLanguage()
  const [cities, setCities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await apiClient('/api/weather/cities/')
        // La API devuelve un array de todas las ciudades
        setCities(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error al cargar ciudades:', err)
        setCities([])
      }
    }
    
    fetchCities()
  }, [t])

  // Cerrar el dropdown cuando se hace click fuera del componente
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  /**
   * Filtra las ciudades según el término de búsqueda
   */
  const filteredCities = (() => {
    const q = searchTerm.trim().toLowerCase()
    // Si hay filtro por región activo, devolver ciudades solo de esa región
    if (selectedRegion) {
      return cities
        .filter(c => (c.comunidad_autonoma || '').toLowerCase() === selectedRegion.toLowerCase())
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    if (!q) return cities.sort((a, b) => a.name.localeCompare(b.name))

    // 1) Si el término coincide con alguna comunidad (parcial), mostrar todas las ciudades de esas comunidades
    const matchedRegions = Array.from(new Set(
      cities
        .map(c => c.comunidad_autonoma)
        .filter(Boolean)
        .filter(r => r.toLowerCase().includes(q))
    ))

    if (matchedRegions.length > 0) {
      return cities
        .filter(c => matchedRegions.includes(c.comunidad_autonoma))
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    // 2) si no hay regiones coincidentes, buscar por nombre o por comunidad en modo libre
    return cities.filter(city => {
      const matchesName = city.name.toLowerCase().includes(q)
      const matchesRegion = (city.comunidad_autonoma || '').toLowerCase().includes(q)
      return matchesName || matchesRegion
    }).sort((a, b) => a.name.localeCompare(b.name))
  })()

  /**
   * Maneja la selección de una ciudad
   */
  const handleSelectCity = (city) => {
    // Si ya hay una ciudad seleccionada, primero la limpiamos
    if (selectedCity) {
      setSelectedCity(null)
      setSearchTerm('')
    }
    
    // Luego seleccionamos la nueva ciudad
    setTimeout(() => {
      setSelectedCity(city)
      // Mantener el texto de la comunidad si hay un filtro por región activo
      if (selectedRegion) {
        setSearchTerm(selectedRegion)
      } else {
        setSearchTerm('')
      }
      setIsOpen(false)
      onCitySelect(city.id)
    }, 0)
  }

  return (
    <div className="city-selector-wrapper" ref={wrapperRef}>
      <div className="city-selector-container">
        {/* Input de búsqueda */}
        <div className="city-search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="city-search-input"
            placeholder={t('weather.searchCity')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            readOnly={!!selectedRegion}
            title={selectedRegion ? t('weather.citySelector') + ': ' + selectedRegion + ' — ' + t('weather.selectYourCity') : t('weather.searchCity')}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown de ciudades */}
        {isOpen && (
          <div className="city-dropdown">
            {/* Chips de regiones (filtrado) */}
            <div className="region-chips">
              <button
                className={`region-chip ${selectedRegion === '' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRegion('')
                  setSearchTerm('')
                  setIsOpen(true)
                }}
                type="button"
              >
                {t('weather.allRegions')}
              </button>
              {/* Si hay región seleccionada, mostrar solo ese chip. Si no, mostrar todos */}
              {selectedRegion ? (
                <button
                  key={selectedRegion}
                  type="button"
                  className="region-chip active"
                  onClick={() => {
                    setSelectedRegion('')
                    setSearchTerm('')
                    setIsOpen(true)
                  }}
                >
                  {selectedRegion} ✕
                </button>
              ) : (
                Array.from(new Set(cities.map(c => c.comunidad_autonoma).filter(Boolean))).map(r => (
                  <button
                    key={r}
                    type="button"
                    className="region-chip"
                    onClick={() => {
                      setSelectedRegion(r)
                      setSearchTerm(r)
                      setIsOpen(true)
                    }}
                  >
                    {r}
                  </button>
                ))
              )}
            </div>
            {filteredCities.length > 0 ? (
              <ul className="city-list">
                {filteredCities.map(city => (
                  <li key={city.id} className="city-item">
                    <button
                      className={`city-button ${selectedCity?.id === city.id ? 'active' : ''}`}
                      onClick={() => handleSelectCity(city)}
                    >
                      {city.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="city-no-results">
                {t('weather.noResults')}
              </div>
            )}
          </div>
        )}
      </div>
      

      {/* Ciudad seleccionada mostrada como tag */}
      {selectedCity && (
        <div className="selected-city-tag">
          {selectedCity.name}
          <button
            className="city-tag-close"
            onClick={() => {
              setSelectedCity(null)
              setSearchTerm('')
              setIsOpen(false)
              if (typeof onCitySelect === 'function') onCitySelect(null)
            }}
            title={t('common.close')}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

CitySelector.propTypes = {
  onCitySelect: PropTypes.func.isRequired,
}

export default CitySelector
