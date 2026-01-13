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
import apiClient from '../../../services/apiClient'
import './weather.css'

function CitySelector({ onCitySelect }) {
  const [cities, setCities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiClient('/api/weather/cities/')
        // La API devuelve un array de todas las ciudades
        setCities(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error al cargar ciudades:', err)
        setError('Error al cargar ciudades')
        setCities([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchCities()
  }, [])

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
            placeholder="Buscar ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            readOnly={!!selectedRegion}
            title={selectedRegion ? 'Filtrado por comunidad: ' + selectedRegion + ' — pulsa "Todas" para editar' : 'Buscar ciudad'}
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
                Todas
              </button>
              {Array.from(new Set(cities.map(c => c.comunidad_autonoma).filter(Boolean))).map(r => (
                <button
                  key={r}
                  type="button"
                  className={`region-chip ${selectedRegion === r ? 'active' : ''}`}
                  onClick={() => {
                    // toggle region filter and mirror it in the input
                    setSelectedRegion(prev => {
                      const next = prev === r ? '' : r
                      setSearchTerm(next ? r : '')
                      return next
                    })
                    setIsOpen(true)
                  }}
                >
                  {r}
                </button>
              ))}
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
                No se encontraron ciudades
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
            title="Limpiar selección"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default CitySelector
