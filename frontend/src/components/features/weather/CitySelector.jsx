/**
 * Componente: CitySelector
 * Propósito: Selector desplegable de ciudades con filtro por comunidad autónoma.
 * Usa: Primero mostrar comunidades, luego ciudades filtradas por comunidad.
 * Uso:
 *  - WeatherInfo.jsx (usado internamente para cambiar de ciudad)
 * Dependencias:
 *  - weather.css (.city-*, .search-icon)
 *  - lucide-react (icono Search)
 */

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import './weather.css'

function CitySelector({ onCitySelect }) {
  const [cities, setCities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedCommunidad, setSelectedCommunidad] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/weather/cities/')
        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }
        const data = await response.json()
        // La API devuelve un array de todas las ciudades
        setCities(Array.isArray(data) ? data : (data.results || []))
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

  /**
   * Obtiene comunidades autónomas únicas ordenadas alfabéticamente
   */
  const getComunidades = () => {
    const comunidades = new Set()
    cities.forEach(city => {
      if (city.comunidad_autonoma) {
        comunidades.add(city.comunidad_autonoma)
      }
    })
    return Array.from(comunidades).sort()
  }

  /**
   * Filtra ciudades por comunidad autónoma y término de búsqueda
   */
  const getFilteredCities = () => {
    let filtered = cities

    // Filtrar por comunidad autónoma si está seleccionada
    if (selectedCommunidad) {
      filtered = filtered.filter(city => city.comunidad_autonoma === selectedCommunidad)
    }

    // Filtrar por término de búsqueda
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (normalizedSearch) {
      filtered = filtered.filter(city =>
        ((city && city.name) || '').toLowerCase().includes(normalizedSearch)
      )
    }

    return filtered
  }

  /**
   * Maneja la selección de una comunidad autónoma
   */
  const handleSelectCommunidad = (comunidad) => {
    setSelectedCommunidad(comunidad)
    setSearchTerm('')
  }

  /**
   * Maneja la selección de una ciudad
   */
  const handleSelectCity = (city) => {
    if (selectedCity) {
      setSelectedCity(null)
      setSearchTerm('')
    }
    
    setTimeout(() => {
      setSelectedCity(city)
      setSearchTerm('')
      setSelectedCommunidad(null)
      setIsOpen(false)
      onCitySelect(city.id)
    }, 0)
  }

  const comunidades = getComunidades()
  const filteredCities = getFilteredCities()

  return (
    <div className="city-selector-wrapper">
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
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown: Comunidades o Ciudades filtradas */}
        {isOpen && (
          <div className="city-dropdown">
            {loading ? (
              <div className="city-loading">Cargando ciudades…</div>
            ) : error ? (
              <div className="city-error">{error}</div>
            ) : !selectedCommunidad ? (
              // Mostrar comunidades autónomas
              comunidades.length > 0 ? (
                <>
                  <div className="city-section-title">Comunidades Autónomas</div>
                  <ul className="city-list">
                    {comunidades.map(comunidad => (
                      <li key={comunidad} className="city-item">
                        <button
                          className="city-button"
                          onClick={() => handleSelectCommunidad(comunidad)}
                        >
                          {comunidad}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="city-no-results">No hay comunidades disponibles</div>
              )
            ) : (
              // Mostrar ciudades de la comunidad seleccionada
              <>
                <div className="city-section-header">
                  <button
                    className="city-back-button"
                    onClick={() => {
                      setSelectedCommunidad(null)
                      setSearchTerm('')
                    }}
                  >
                    ← Volver
                  </button>
                  <span className="city-section-title">{selectedCommunidad}</span>
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
                  <div className="city-no-results">No se encontraron ciudades</div>
                )}
              </>
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
